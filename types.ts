export type SiteAreaUnit = 'acres' | 'ha' | 'sqm'
export type ContextType = 'suburban' | 'urban-residential' | 'town-centre' | 'growth-area'
export type PtalType = 'low' | 'medium' | 'high' | 'very-high'
export type ExistingUse = 'residential' | 'commercial' | 'community' | 'industrial' | 'vacant'

export interface ComparableScheme {
  ref: string
  summary: string
  homes: number
  height: string
  decision: 'Approved' | 'Refused'
  committee: string
  vote: string
  councillorsFor: string[]
  councillorsAgainst: string[]
  minutesSource: string
  videoSource: string
}

export interface ConsultantFirm {
  name: string
  reason: string
  localWork: string
  reputation: string
}

export type ConsultantGroups = Record<string, ConsultantFirm[]>

export interface SiteLookupResult {
  ptal: PtalType
  context: ContextType
  conservation: boolean
  communityUse: boolean
  tallBuildingZone: boolean
  floodRisk: boolean
  protectedEmployment: boolean
  comparableApprovals: ComparableScheme[]
  policyFlags: string[]
  consultants: ConsultantGroups
}

export interface SiteFormValues {
  siteAddress: string
  siteAreaValue: string
  siteAreaUnit: SiteAreaUnit
  borough: string
  context: ContextType
  ptal: PtalType
  existingUse: ExistingUse
  heritage: boolean
  communityUse: boolean
  tallBuildingZone: boolean
  floodRisk: boolean
  protectedEmployment: boolean
  notes: string
}

export interface AssessmentResult {
  areaHa: number
  areaSqm: number
  recommendedLowDensity: number
  recommendedHighDensity: number
  sweetSpotDensity: number
  lowUnits: number
  highUnits: number
  targetUnits: number
  headlineHeight: string
  minHeight: number
  maxHeight: number
  lowCoverage: number
  highCoverage: number
  riskScore: number
  viabilityScore: number
  affordableNote: string
  useRecommendation: string
  designMoves: string[]
  policySummary: string[]
  nextSteps: string[]
  assumptions: {
    siteAddress: string
    contextLabel: string
    notes: string
  }
  parking: {
    recommendedCarSpaces: number
    maxCarSpaces: number
    disabledSpaces: number
    visitorSpaces: number
    note: string
  }
  amenity: {
    privateAmenitySqm: number
    communalAmenitySqm: number
    childPlaySqm: number
    note: string
  }
  appraisal: {
    avgUnitSizeSqm: number
    saleableAreaSqm: number
    grossInternalAreaSqm: number
    buildCostPerSqm: number
    gdvPerSqm: number
    buildCost: number
    externalWorks: number
    professionalFees: number
    contingency: number
    finance: number
    marketing: number
    communityCostAllowance: number
    totalCostBeforeLand: number
    grossDevelopmentValue: number
    targetProfit: number
    residualLandValue: number
    note: string
  }
}
