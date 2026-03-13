import type { ConsultantGroups, SiteLookupResult } from './types'

export function getMockConsultants(): ConsultantGroups {
  return {
    planning: [
      { name: 'DP9', reason: 'Strong London residential and mixed-use planning track record.', localWork: 'Comparable urban redevelopment work across inner London.', reputation: 'Widely used on complex planning applications.' },
      { name: 'Avison Young Planning', reason: 'Large planning team with strong committee and appeal experience.', localWork: 'Regularly active across South London regeneration and mixed-use sites.', reputation: 'Well-established national planning practice.' },
      { name: 'Turley', reason: 'Strong policy, consultation, and strategic planning capability.', localWork: 'Frequent involvement in urban housing and mixed-use schemes.', reputation: 'Highly regarded multidisciplinary planning advisor.' },
    ],
    architecture: [
      { name: 'HTA Design', reason: 'Experienced in higher-density housing and estate/place-led regeneration.', localWork: 'Extensive London housing portfolio.', reputation: 'Well known for residential masterplanning and delivery.' },
      { name: 'Morris+Company', reason: 'Good fit for contextual urban residential schemes.', localWork: 'Strong record on London housing and mixed-use projects.', reputation: 'Highly regarded design quality and planning presentation.' },
      { name: 'Haworth Tompkins', reason: 'Strong urban design sensibility, especially around civic/community uses.', localWork: 'Notable London mixed-use and community-led work.', reputation: 'Excellent design reputation.' },
    ],
    transport: [
      { name: 'Vectos', reason: 'Experienced transport planning team for residential-led schemes.', localWork: 'Regularly supports London planning submissions.', reputation: 'Commonly appointed on planning and highways strategy.' },
      { name: 'Motion', reason: 'Strong on active travel, car-light strategy, and urban development transport work.', localWork: 'Frequent London committee-facing work.', reputation: 'Well regarded specialist transport consultant.' },
      { name: 'Stantec', reason: 'Broad multidisciplinary capability including transport and infrastructure.', localWork: 'Active on many urban projects across London.', reputation: 'Large and credible technical platform.' },
    ],
    daylightSunlight: [
      { name: 'Point 2 Surveyors', reason: 'Commonly instructed on BRE daylight and sunlight testing.', localWork: 'Frequent London residential and mixed-use work.', reputation: 'Well known specialist rights-to-light and daylight advisor.' },
      { name: 'GIA', reason: 'Strong technical modelling and planning support capability.', localWork: 'Regularly supports urban intensification schemes.', reputation: 'Established multidisciplinary property consultancy.' },
      { name: 'Savills Daylight & Sunlight', reason: 'Good fit for schemes needing planning-led technical advice.', localWork: 'Broad London development exposure.', reputation: 'Strong market recognition.' },
    ],
    costConsultant: [
      { name: 'Rider Levett Bucknall', reason: 'Strong cost planning and development monitoring capability.', localWork: 'Extensive London residential portfolio.', reputation: 'Top-tier quantity surveying brand.' },
      { name: 'Alinea', reason: 'Highly regarded for development-focused cost advice.', localWork: 'Very active on London mixed-use and housing projects.', reputation: 'Excellent developer-side reputation.' },
      { name: 'Turner & Townsend alinea', reason: 'Strong on cost, programme, and viability-sensitive schemes.', localWork: 'Regular London urban development work.', reputation: 'Highly credible commercial advice.' },
    ],
    viabilityAffordableHousing: [
      { name: 'BNP Paribas Real Estate', reason: 'Commonly used for planning viability and affordable housing negotiations.', localWork: 'Frequent London planning viability submissions.', reputation: 'One of the best-known viability consultancies.' },
      { name: 'Gerald Eve', reason: 'Strong development economics and affordable housing expertise.', localWork: 'Regular planning and valuation work across London.', reputation: 'Highly respected property advisor.' },
      { name: 'Cushman & Wakefield', reason: 'Good fit where viability and market positioning need to align.', localWork: 'Substantial London development exposure.', reputation: 'Large and credible advisory platform.' },
    ],
  }
}

export function mockLookup(address: string, borough: string): SiteLookupResult {
  const text = `${address} ${borough}`.toLowerCase()
  const isPeckham = text.includes('peckham') || text.includes('se15') || text.includes('nigel road')
  const isTownCentre = text.includes('high street') || text.includes('town centre') || text.includes('station')

  if (isPeckham) {
    return {
      ptal: 'medium',
      context: 'urban-residential',
      conservation: false,
      communityUse: true,
      tallBuildingZone: false,
      floodRisk: false,
      protectedEmployment: false,
      comparableApprovals: [
        {
          ref: '24/AP/2208',
          summary: 'Mixed-use scheme with community space retained',
          homes: 45,
          height: '4-5 storeys',
          decision: 'Approved',
          committee: 'Planning Committee A',
          vote: '6 for / 1 against',
          councillorsFor: ['Cllr A. Smith', 'Cllr J. Khan', 'Cllr R. Patel', 'Cllr M. Hughes', 'Cllr T. Brown', 'Cllr E. Green'],
          councillorsAgainst: ['Cllr L. Jones'],
          minutesSource: 'Committee minutes',
          videoSource: 'YouTube webcast',
        },
        {
          ref: '24/AP/3102',
          summary: 'Over-scaled proposal on side street setting',
          homes: 52,
          height: '6 storeys',
          decision: 'Refused',
          committee: 'Planning Committee B',
          vote: '2 for / 5 against',
          councillorsFor: ['Cllr D. Ali', 'Cllr K. Wilson'],
          councillorsAgainst: ['Cllr S. Hall', 'Cllr N. Reed', 'Cllr B. Turner', 'Cllr R. White', 'Cllr P. Evans'],
          minutesSource: 'Committee minutes',
          videoSource: 'YouTube webcast',
        },
      ],
      policyFlags: ['Urban residential context', 'Community use sensitivity', 'Not an obvious tall-building location'],
      consultants: getMockConsultants(),
    }
  }

  if (isTownCentre) {
    return {
      ptal: 'high',
      context: 'town-centre',
      conservation: false,
      communityUse: false,
      tallBuildingZone: false,
      floodRisk: false,
      protectedEmployment: false,
      comparableApprovals: [
        {
          ref: '23/AP/3002',
          summary: 'Town centre mixed-use block',
          homes: 62,
          height: '6 storeys',
          decision: 'Approved',
          committee: 'Planning Committee A',
          vote: '5 for / 2 against',
          councillorsFor: ['Cllr A. Smith', 'Cllr J. Khan', 'Cllr R. Patel', 'Cllr M. Hughes', 'Cllr T. Brown'],
          councillorsAgainst: ['Cllr E. Green', 'Cllr L. Jones'],
          minutesSource: 'Committee minutes',
          videoSource: 'YouTube webcast',
        },
      ],
      policyFlags: ['Town centre intensification opportunity', 'Active frontage expected'],
      consultants: getMockConsultants(),
    }
  }

  return {
    ptal: 'medium',
    context: 'urban-residential',
    conservation: false,
    communityUse: false,
    tallBuildingZone: false,
    floodRisk: false,
    protectedEmployment: false,
    comparableApprovals: [],
    policyFlags: ['Context-led urban infill'],
    consultants: getMockConsultants(),
  }
}
