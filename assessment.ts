import type { AssessmentResult, ContextType, PtalType, SiteFormValues } from './types'
import { acresToHa, clamp, round, sqmToHa } from './utils'

function getContextProfile(context: ContextType) {
  switch (context) {
    case 'town-centre':
      return { label: 'Town centre / high street', densityRange: [220, 450], heightRange: [4, 8], basePlotCoverage: [55, 70] }
    case 'urban-residential':
      return { label: 'Urban residential', densityRange: [160, 320], heightRange: [3, 5], basePlotCoverage: [45, 60] }
    case 'suburban':
      return { label: 'Suburban / low-rise', densityRange: [70, 170], heightRange: [2, 4], basePlotCoverage: [35, 50] }
    case 'growth-area':
      return { label: 'Growth area / opportunity area', densityRange: [300, 650], heightRange: [6, 15], basePlotCoverage: [55, 75] }
  }
}

function getTransportAdjustment(ptal: PtalType) {
  switch (ptal) {
    case 'very-high': return 1.18
    case 'high': return 1.1
    case 'low': return 0.9
    default: return 1.0
  }
}

function getPolicyRisk({ heritage, communityUse, tallBuildingZone, majorScheme, floodRisk, protectedEmployment }: { heritage: boolean; communityUse: boolean; tallBuildingZone: boolean; majorScheme: boolean; floodRisk: boolean; protectedEmployment: boolean }) {
  let risk = 0
  if (heritage) risk += 18
  if (communityUse) risk += 16
  if (floodRisk) risk += 8
  if (protectedEmployment) risk += 14
  if (!tallBuildingZone && majorScheme) risk += 8
  if (!tallBuildingZone) risk += 6
  return clamp(risk, 0, 75)
}

export function buildAssessment(input: SiteFormValues): AssessmentResult {
  const areaHa = input.siteAreaUnit === 'ha' ? Number(input.siteAreaValue || 0) : input.siteAreaUnit === 'acres' ? acresToHa(Number(input.siteAreaValue || 0)) : sqmToHa(Number(input.siteAreaValue || 0))
  const areaSqm = areaHa * 10000
  const profile = getContextProfile(input.context)
  const transportFactor = getTransportAdjustment(input.ptal)
  const baseLow = profile.densityRange[0] * transportFactor
  const baseHigh = profile.densityRange[1] * transportFactor

  const recommendedLowDensity = round(baseLow * (input.existingUse === 'community' ? 0.92 : input.existingUse === 'industrial' ? 0.9 : 1) * (input.heritage ? 0.88 : 1) * (input.communityUse ? 0.91 : 1) * (input.protectedEmployment ? 0.86 : 1) * (input.floodRisk ? 0.95 : 1), 0)
  const recommendedHighDensity = round(baseHigh * (input.existingUse === 'community' ? 0.92 : input.existingUse === 'industrial' ? 0.9 : 1) * (input.heritage ? 0.88 : 1) * (input.communityUse ? 0.91 : 1) * (input.protectedEmployment ? 0.86 : 1) * (input.floodRisk ? 0.95 : 1) * (input.tallBuildingZone ? 1.15 : 1), 0)
  const sweetSpotDensity = round((recommendedLowDensity + recommendedHighDensity) / 2, 0)

  const lowUnits = Math.max(1, Math.floor(areaHa * recommendedLowDensity))
  const highUnits = Math.max(lowUnits, Math.floor(areaHa * recommendedHighDensity))
  const targetUnits = Math.max(lowUnits, Math.round(areaHa * sweetSpotDensity))

  let minHeight = profile.heightRange[0]
  let maxHeight = profile.heightRange[1]
  if (input.heritage) maxHeight -= 1
  if (input.protectedEmployment) maxHeight -= 1
  if (input.ptal === 'very-high' || input.ptal === 'high') maxHeight += 1
  if (input.tallBuildingZone) maxHeight += 3
  if (input.context === 'suburban') minHeight = Math.max(2, minHeight - 1)
  minHeight = clamp(minHeight, 2, 20)
  maxHeight = clamp(maxHeight, minHeight, 24)

  const majorScheme = targetUnits >= 10
  const riskScore = getPolicyRisk({ heritage: input.heritage, communityUse: input.communityUse, tallBuildingZone: input.tallBuildingZone, majorScheme, floodRisk: input.floodRisk, protectedEmployment: input.protectedEmployment })
  const viabilityScore = clamp(78 + (input.ptal === 'very-high' ? 8 : input.ptal === 'high' ? 5 : input.ptal === 'low' ? -6 : 0) + (input.context === 'growth-area' ? 10 : input.context === 'town-centre' ? 6 : input.context === 'suburban' ? -8 : 0) - (input.heritage ? 18 : 0) - (input.communityUse ? 12 : 0) - (input.protectedEmployment ? 12 : 0) - (input.floodRisk ? 6 : 0) - (!input.tallBuildingZone && maxHeight >= 6 ? 10 : 0), 20, 95)

  const carParkingRatio = input.ptal === 'very-high' ? 0 : input.ptal === 'high' ? 0.1 : input.ptal === 'medium' ? 0.35 : 0.75
  const maxCarSpaces = Math.max(0, Math.round(targetUnits * carParkingRatio))
  const visitorSpaces = input.ptal === 'low' ? Math.max(0, Math.round(targetUnits * 0.05)) : 0
  const recommendedCarSpaces = Math.max(0, maxCarSpaces - visitorSpaces)
  const disabledSpaces = targetUnits >= 10 ? Math.max(1, Math.ceil(maxCarSpaces * 0.1)) : maxCarSpaces > 0 ? 1 : 0

  const avgUnitSizeSqm = input.existingUse === 'community' ? 68 : input.context === 'town-centre' ? 62 : 70
  const saleableAreaSqm = Math.round(targetUnits * avgUnitSizeSqm)
  const grossInternalAreaSqm = Math.round(saleableAreaSqm / (input.context === 'town-centre' ? 0.82 : 0.8))
  const buildCostPerSqm = input.context === 'town-centre' ? 3200 : 3000
  const buildCost = grossInternalAreaSqm * buildCostPerSqm
  const externalWorks = Math.round(buildCost * 0.08)
  const professionalFees = Math.round(buildCost * 0.12)
  const contingency = Math.round(buildCost * 0.05)
  const finance = Math.round((buildCost + externalWorks + professionalFees) * 0.07)
  const gdvPerSqm = input.borough.toLowerCase().includes('southwark') ? 8500 : 7000
  const marketing = Math.round(saleableAreaSqm * gdvPerSqm * 0.03)
  const communityCostAllowance = input.communityUse ? 1250000 : 0
  const grossDevelopmentValue = Math.round(saleableAreaSqm * gdvPerSqm)
  const totalCostBeforeLand = buildCost + externalWorks + professionalFees + contingency + finance + marketing + communityCostAllowance
  const targetProfit = Math.round(grossDevelopmentValue * 0.18)
  const residualLandValue = grossDevelopmentValue - totalCostBeforeLand - targetProfit

  return {
    areaHa,
    areaSqm,
    recommendedLowDensity,
    recommendedHighDensity,
    sweetSpotDensity,
    lowUnits,
    highUnits,
    targetUnits,
    headlineHeight: input.tallBuildingZone ? `${minHeight}-${maxHeight} storeys` : maxHeight <= 5 ? `${Math.max(3, minHeight)}-${maxHeight} storeys` : `${Math.max(4, minHeight)}-${maxHeight} storeys`,
    minHeight,
    maxHeight,
    lowCoverage: round(profile.basePlotCoverage[0] - (input.heritage ? 5 : 0) - (input.context === 'suburban' ? 5 : 0), 0),
    highCoverage: round(profile.basePlotCoverage[1] - (input.communityUse ? 5 : 0) - (input.floodRisk ? 5 : 0), 0),
    riskScore,
    viabilityScore,
    affordableNote: majorScheme ? 'Likely major-scheme policy obligations apply, including affordable housing, technical reports, and more detailed design scrutiny.' : 'Below 10 homes, the scheme may avoid some major-scheme thresholds, though local policy and other obligations still apply.',
    useRecommendation: input.communityUse || input.existingUse === 'community' ? 'Mixed-use with reprovided community floorspace at ground or lower floors, with residential above.' : input.existingUse === 'commercial' ? 'Residential-led mixed-use scheme, retaining active frontage or workspace where the street context supports it.' : input.existingUse === 'industrial' ? 'Residential or mixed-use redevelopment, subject to employment land policy checks and access/servicing strategy.' : 'Residential-led scheme with strong street frontage, amenity provision, and contextual massing.',
    designMoves: [
      ...(input.communityUse ? ['Retain or reprovision community floorspace to reduce policy risk.'] : []),
      ...(input.heritage ? ['Prepare a heritage/townscape statement and reduce frontage impact.'] : []),
      ...(input.floodRisk ? ['Integrate sustainable drainage and flood-resilient ground-floor design.'] : []),
      ...(!input.tallBuildingZone && maxHeight >= 6 ? ['Avoid a tall-building expression unless the site is in an identified tall-building location.'] : []),
      'Step upper floors back from the street to reduce perceived bulk.',
      'Match the prevailing cornice / eaves line on immediate neighbours where possible.',
      'Prioritise dual-aspect units, daylight, and defensible private amenity space.',
      'Use brick-led materials and a strong base-middle-top composition.',
    ],
    policySummary: [
      'NPPF supports efficient use of land, especially on brownfield and accessible urban sites, but requires development to respond to local character and create well-designed places.',
      'London Plan-style optimisation principles generally support higher densities where access, design quality, and context justify them.',
      `${input.borough || 'Local'} policy should be checked for tall-building locations, affordable housing thresholds, housing mix, protected employment land, community-use protection, parking standards, and amenity standards.`,
    ],
    nextSteps: [
      'Confirm site designation, constraints, PTAL, conservation/heritage status, and any Article 4 directions.',
      'Review nearby planning approvals and refusals within 250–500m for height and massing comparables.',
      'Test 2–3 massing options before pre-application submission.',
      'Prepare an affordable housing / tenure strategy if 10+ homes are proposed.',
      ...(input.communityUse ? ['Document community use replacement or surplus justification before a formal application.'] : []),
      ...(input.existingUse === 'industrial' || input.protectedEmployment ? ['Check employment land release and reprovision requirements early.'] : []),
    ],
    assumptions: {
      siteAddress: input.siteAddress,
      contextLabel: profile.label,
      notes: input.notes,
    },
    parking: {
      recommendedCarSpaces,
      maxCarSpaces,
      disabledSpaces,
      visitorSpaces,
      note: input.ptal === 'very-high' ? 'Car-free or near car-free approach likely to be preferred, with disabled bays only where required.' : input.ptal === 'high' ? 'Low-car approach likely to be expected, with disabled provision and strong cycle storage.' : 'Moderate car parking may be supportable if justified by local accessibility and site conditions.',
    },
    amenity: {
      privateAmenitySqm: targetUnits * 5,
      communalAmenitySqm: targetUnits * 7,
      childPlaySqm: targetUnits >= 10 ? Math.round(targetUnits) : 0,
      note: 'Amenity figures are broad planning heuristics for early feasibility and should be tested against the local plan, housing design standards, child play requirements, and the final unit mix.',
    },
    appraisal: {
      avgUnitSizeSqm,
      saleableAreaSqm,
      grossInternalAreaSqm,
      buildCostPerSqm,
      gdvPerSqm,
      buildCost,
      externalWorks,
      professionalFees,
      contingency,
      finance,
      marketing,
      communityCostAllowance,
      totalCostBeforeLand,
      grossDevelopmentValue,
      targetProfit,
      residualLandValue,
      note: 'This is a high-level appraisal only. It excludes CIL, S106, abnormal costs, affordable housing transfer values, acquisition costs, finance structuring, and tax. Use it for early screening, not investment sign-off.',
    },
  }
}
