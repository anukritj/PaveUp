// Comprehensive Telangana government portals by issue type
// Based on official portal analysis: GHMC, T-RACSHA, HMWSSB, TSSPDCL/TSNPDCL, Swachhata, etc.

// Portal metadata with SLA and coverage info
const PORTAL_DATA = {
  ghmc: {
    name: 'GHMC (MyGHMC/IGS)',
    department: 'Greater Hyderabad Municipal Corporation',
    website: 'https://ghmc.gov.in',
    helpline: '040-21111111',
    onlineComplaint: 'https://grievance.ghmc.gov.in',
    app: 'MyGHMC',
    coverage: 'Hyderabad city limits',
    sla: 'Varies by category (1-15 days per GHMC Charter)'
  },
  tracsha: {
    name: 'T-RACSHA',
    department: 'Roads & Buildings Department',
    website: 'https://tracsha.telangana.gov.in',
    helpline: '040-23450123',
    onlineComplaint: 'https://tracsha.telangana.gov.in',
    coverage: 'State R&B roads (~30,000 km, excludes GHMC)',
    sla: 'Not specified publicly'
  },
  hmwssb: {
    name: 'HMWSSB',
    department: 'Hyderabad Metro Water Supply & Sewerage Board',
    website: 'https://www.hyderabadwater.gov.in',
    helpline: '155313',
    onlineComplaint: 'https://www.hyderabadwater.gov.in/grievance',
    coverage: 'Hyderabad metropolitan water & sewerage areas',
    sla: '24x7 helpline, SLA varies by issue type'
  },
  tsspdcl: {
    name: 'TSSPDCL',
    department: 'Telangana Southern Power Distribution Company',
    website: 'https://www.tssouthernpower.com',
    helpline: '1912',
    onlineComplaint: 'https://www.tssouthernpower.com/complaints',
    coverage: 'Southern Telangana (includes Hyderabad)',
    sla: 'Standards of Performance: 4h urban/8h rural for fuse-off'
  },
  tsnpdcl: {
    name: 'TSNPDCL',
    department: 'Telangana Northern Power Distribution Company',
    website: 'https://www.tsnpdcl.in',
    helpline: '1912',
    onlineComplaint: 'https://www.tsnpdcl.in/complaints',
    coverage: 'Northern Telangana',
    sla: 'Standards of Performance: 4h urban/8h rural for fuse-off'
  },
  swachhata: {
    name: 'Swachhata App',
    department: 'Ministry of Housing & Urban Affairs',
    website: 'https://swachhbharaturban.gov.in',
    helpline: '1969',
    onlineComplaint: 'Swachhata Mobile App',
    coverage: 'All ULBs across Telangana',
    sla: '12-48 hours per category'
  },
  hawkeye: {
    name: 'Hawk Eye',
    department: 'Telangana Police',
    website: 'https://tspolice.gov.in',
    helpline: '100',
    onlineComplaint: 'Hawk Eye Mobile App',
    coverage: 'Statewide',
    sla: 'Immediate response for emergencies'
  },
  nhai: {
    name: 'NHAI (RajmargYatra)',
    department: 'National Highways Authority of India',
    website: 'https://www.nhai.gov.in',
    helpline: '1033',
    onlineComplaint: 'RajmargYatra App / Call 1033',
    coverage: 'National Highways in Telangana',
    sla: '24x7 assistance'
  },
  citizenbuddy: {
    name: 'Citizen Buddy 2.0',
    department: 'CDMA/MA&UD',
    website: 'https://emunicipal.telangana.gov.in',
    helpline: 'Varies by ULB',
    onlineComplaint: 'Citizen Buddy Mobile App',
    coverage: 'All Telangana ULBs outside GHMC',
    sla: 'Varies by ULB'
  }
}

/**
 * Get appropriate Telangana government portal by issue type
 * @param {string} issueType - The type of civic issue
 * @returns {Object} Portal information with routing logic
 */
export function getTelanganaPortal(issueType) {
  // Issue type to portal mapping with priority routing
  const issueMapping = {
    // Roads & Infrastructure (GHMC within city, T-RACSHA for state roads)
    'pothole': 'ghmc',
    'road-damage': 'ghmc',
    'footpath-repair': 'ghmc', 
    'bridge-damage': 'tracsha', // Bridges typically R&B
    'road-obstruction': 'ghmc',
    'traffic-island-repair': 'ghmc',
    'flyover-repair': 'tracsha',
    
    // Water & Sewerage (HMWSSB)
    'stagnant-water': 'hmwssb',
    'sewerage-overflow': 'hmwssb',
    'water-leakage': 'hmwssb',
    'manhole-cover': 'hmwssb',
    'water-contamination': 'hmwssb',
    'ugd-overflow': 'hmwssb',
    
    // Electricity (TSSPDCL/TSNPDCL)
    'electrical': 'tsspdcl', // Default to southern, can be refined by location
    'power-outage': 'tsspdcl',
    'transformer-failure': 'tsspdcl',
    'street-light': 'ghmc', // Street lights are GHMC responsibility
    'electric-shock': 'tsspdcl',
    'hanging-wires': 'tsspdcl',
    
    // Sanitation & Waste (GHMC/Swachhata)
    'garbage': 'ghmc',
    'garbage-bin': 'ghmc',
    'debris': 'ghmc',
    'burning-waste': 'ghmc',
    'dead-animal': 'swachhata',
    'public-toilet': 'swachhata',
    'sweeping': 'ghmc',
    
    // Animals & Health (GHMC Veterinary)
    'stray-cattle': 'ghmc',
    'stray-dogs': 'ghmc',
    'stray-pigs': 'ghmc',
    'mosquito-menace': 'ghmc',
    'illegal-slaughter': 'ghmc',
    
    // Encroachment & Planning (GHMC)
    'illegal-construction': 'ghmc',
    'encroachment': 'ghmc',
    'unauthorized-ads': 'ghmc',
    'tree-cutting': 'ghmc',
    'parking-issue': 'ghmc',
    
    // Safety & Emergency (Police)
    'women-safety': 'hawkeye',
    'traffic-violation': 'hawkeye',
    'emergency': 'hawkeye',
    
    // Highways (NHAI)
    'highway-pothole': 'nhai',
    'toll-issue': 'nhai',
    'highway-obstruction': 'nhai',
    
    // Property & Revenue (GHMC)
    'property-tax': 'ghmc',
    'trade-license': 'ghmc',
    'voter-list': 'ghmc'
  }

  const portalKey = issueMapping[issueType] || 'ghmc' // Default to GHMC
  return PORTAL_DATA[portalKey]
}

/**
 * Get all available portals for reference
 * @returns {Object} All portal data
 */
export function getAllPortals() {
  return PORTAL_DATA
}

/**
 * Get portal by location (for geographic routing)
 * @param {string} issueType - Issue type
 * @param {Object} location - {lat, lng} coordinates
 * @returns {Object} Portal information
 */
export function getPortalByLocation(issueType, location) {
  // For now, use basic routing. Can be enhanced with actual boundary checks
  const portal = getTelanganaPortal(issueType)
  
  // Special case: Power distribution companies by region
  if (issueType.includes('electrical') || issueType.includes('power')) {
    // Rough boundary: TSSPDCL covers southern districts including Hyderabad
    // TSNPDCL covers northern districts
    // For simplicity, default to TSSPDCL unless specifically northern coordinates
    if (location && location.lat > 18.5) { // Rough northern boundary
      return PORTAL_DATA.tsnpdcl
    }
    return PORTAL_DATA.tsspdcl
  }
  
  return portal
}
