export const sanctionTypes = [
  "All",
  "Financial Sanctions",
  "Trade Sanctions",
  "Travel Sanctions",
  "Arms Sanctions",
  "Military Sanctions",
] as const;

export type SanctionType = (typeof sanctionTypes)[number];

const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const gdpData: Record<string, number[]> = {
  All:                  [7.5, 8.0, 6.6, 6.5, 4.0, -6.6, 8.7, 6.8, 7.2, 6.5, 6.3],
  "Financial Sanctions": [7.5, 7.8, 6.2, 5.9, 3.5, -7.0, 8.0, 6.2, 6.8, 6.0, 5.8],
  "Trade Sanctions":     [7.5, 7.6, 6.0, 5.5, 3.2, -7.5, 7.5, 5.8, 6.5, 5.7, 5.5],
  "Travel Sanctions":    [7.5, 8.0, 6.5, 6.4, 3.8, -7.2, 8.5, 6.6, 7.0, 6.3, 6.1],
  "Arms Sanctions":      [7.5, 7.9, 6.4, 6.2, 3.6, -6.8, 8.2, 6.4, 6.9, 6.1, 5.9],
  "Military Sanctions":  [7.5, 7.7, 6.3, 6.0, 3.4, -7.0, 8.0, 6.3, 6.7, 5.9, 5.7],
};

const tradeBeforeData: Record<string, number[]> = {
  All:                  [640, 660, 690, 740, 780, 670, 820, 900, 950, 980, 1010],
  "Financial Sanctions": [640, 650, 670, 710, 740, 630, 780, 850, 900, 930, 960],
  "Trade Sanctions":     [640, 640, 650, 680, 700, 590, 740, 800, 840, 870, 900],
  "Travel Sanctions":    [640, 658, 685, 735, 770, 660, 810, 890, 940, 970, 1000],
  "Arms Sanctions":      [640, 655, 680, 730, 765, 655, 805, 885, 935, 965, 995],
  "Military Sanctions":  [640, 648, 670, 720, 750, 640, 790, 870, 920, 950, 980],
};

const tradeAfterData: Record<string, number[]> = {
  All:                  [600, 620, 650, 700, 690, 520, 750, 830, 880, 920, 960],
  "Financial Sanctions": [590, 600, 620, 660, 650, 480, 700, 780, 830, 870, 910],
  "Trade Sanctions":     [570, 580, 590, 620, 610, 440, 660, 730, 770, 800, 840],
  "Travel Sanctions":    [600, 618, 645, 695, 680, 510, 740, 820, 870, 910, 950],
  "Arms Sanctions":      [595, 610, 640, 690, 675, 505, 735, 815, 865, 905, 945],
  "Military Sanctions":  [585, 600, 630, 680, 660, 490, 720, 800, 850, 890, 930],
};

const fdiData: Record<string, number[]> = {
  All:                  [44, 46, 40, 42, 51, 64, 85, 71, 72, 68, 70],
  "Financial Sanctions": [44, 44, 38, 39, 47, 58, 78, 65, 66, 62, 64],
  "Trade Sanctions":     [44, 42, 36, 37, 44, 54, 72, 60, 62, 58, 60],
  "Travel Sanctions":    [44, 45, 39, 41, 50, 62, 83, 69, 70, 66, 68],
  "Arms Sanctions":      [44, 45, 39, 40, 49, 60, 80, 67, 68, 64, 66],
  "Military Sanctions":  [44, 43, 38, 39, 48, 58, 76, 64, 65, 61, 63],
};

export function getGdpData(type: SanctionType) {
  return years.map((y, i) => ({ year: y.toString(), value: gdpData[type][i] }));
}

export function getTradeData(type: SanctionType) {
  return years.map((y, i) => ({
    year: y.toString(),
    before: tradeBeforeData[type][i],
    after: tradeAfterData[type][i],
  }));
}

export function getFdiData(type: SanctionType) {
  return years.map((y, i) => ({ year: y.toString(), value: fdiData[type][i] }));
}

export function getStats(type: SanctionType) {
  const gdp = gdpData[type];
  const tradeBefore = tradeBeforeData[type];
  const tradeAfter = tradeAfterData[type];
  const fdi = fdiData[type];

  const gdpChange = gdp[gdp.length - 1] - gdp[0];
  const tradeChange = (((tradeAfter[tradeAfter.length - 1] - tradeBefore[0]) / tradeBefore[0]) * 100);
  const fdiChange = (((fdi[fdi.length - 1] - fdi[0]) / fdi[0]) * 100);

  return {
    gdpChange: gdpChange.toFixed(1),
    tradeChange: tradeChange.toFixed(1),
    fdiChange: fdiChange.toFixed(1),
  };
}

// Country risk data for Risk Assessment
export interface CountryRisk {
  country: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  complianceScore: number;
  sanctionCount: number;
  impactOnIndia: string;
}

export const countryRiskData: CountryRisk[] = [
  { country: "Russia", riskLevel: "critical", complianceScore: 32, sanctionCount: 1450, impactOnIndia: "Defence imports worth $12B affected; S-400 missile deal delayed; SWIFT payment disruptions for oil purchases" },
  { country: "Iran", riskLevel: "critical", complianceScore: 28, sanctionCount: 890, impactOnIndia: "Chabahar Port development slowed; crude oil imports dropped from 27MT to 3MT; ₹16,000 Cr trade loss" },
  { country: "China", riskLevel: "high", complianceScore: 45, sanctionCount: 320, impactOnIndia: "Tech transfer restrictions; telecom equipment bans impacted 5G rollout; $8B annual electronics trade disrupted" },
  { country: "North Korea", riskLevel: "critical", complianceScore: 15, sanctionCount: 720, impactOnIndia: "Minimal direct impact; compliance requirements on shipping & banking sectors" },
  { country: "Myanmar", riskLevel: "high", complianceScore: 52, sanctionCount: 180, impactOnIndia: "Border trade affected; Kaladan project delays; humanitarian corridor disruptions" },
  { country: "USA", riskLevel: "medium", complianceScore: 85, sanctionCount: 45, impactOnIndia: "CAATSA secondary sanctions risk from Russia deals; tech export controls on semiconductor equipment" },
  { country: "UAE", riskLevel: "low", complianceScore: 91, sanctionCount: 12, impactOnIndia: "Key trade partner; ₹3.5L Cr bilateral trade largely unaffected; gold import route" },
  { country: "Turkey", riskLevel: "medium", complianceScore: 68, sanctionCount: 85, impactOnIndia: "Limited direct impact; S-400 precedent affects India's own procurement decisions" },
];

// Sanction search entities
export interface SanctionImpactData {
  year: string;
  gdpBefore: number;
  gdpAfter: number;
  tradeBefore: number;
  tradeAfter: number;
  fdiBefore: number;
  fdiAfter: number;
}

export interface SanctionEntity {
  name: string;
  type: "Individual" | "Organisation" | "Vessel" | "Bank";
  list: string;
  country: string;
  status: "Active" | "Delisted";
  addedDate: string;
  reason: string;
  sanctionYear: number;
  detailSummary: string;
  impactData: SanctionImpactData[];
}

export const sanctionEntities: SanctionEntity[] = [
  {
    name: "Rosoboronexport", type: "Organisation", list: "OFAC SDN", country: "Russia", status: "Active", addedDate: "2022-02-24",
    reason: "Russian state arms exporter – India's primary defence supplier for MiG-29, Su-30MKI spare parts",
    sanctionYear: 2022,
    detailSummary: "US sanctions on Rosoboronexport threatened India's $12B defence procurement pipeline from Russia. India risked CAATSA secondary sanctions on the S-400 deal. Defence spare-part supply chains were disrupted, forcing India to accelerate indigenous defence manufacturing under Atmanirbhar Bharat.",
    impactData: [
      { year: "2019", gdpBefore: 4.0, gdpAfter: 4.0, tradeBefore: 780, tradeAfter: 780, fdiBefore: 51, fdiAfter: 51 },
      { year: "2020", gdpBefore: 4.2, gdpAfter: -6.6, tradeBefore: 820, tradeAfter: 670, fdiBefore: 55, fdiAfter: 64 },
      { year: "2021", gdpBefore: 7.5, gdpAfter: 8.7, tradeBefore: 870, tradeAfter: 820, fdiBefore: 70, fdiAfter: 85 },
      { year: "2022", gdpBefore: 7.8, gdpAfter: 6.8, tradeBefore: 920, tradeAfter: 900, fdiBefore: 76, fdiAfter: 71 },
      { year: "2023", gdpBefore: 7.5, gdpAfter: 7.2, tradeBefore: 970, tradeAfter: 950, fdiBefore: 78, fdiAfter: 72 },
      { year: "2024", gdpBefore: 7.2, gdpAfter: 6.5, tradeBefore: 1010, tradeAfter: 980, fdiBefore: 75, fdiAfter: 68 },
      { year: "2025", gdpBefore: 7.0, gdpAfter: 6.3, tradeBefore: 1050, tradeAfter: 1010, fdiBefore: 74, fdiAfter: 70 },
    ],
  },
  {
    name: "National Iranian Oil Company", type: "Organisation", list: "OFAC SDN", country: "Iran", status: "Active", addedDate: "2018-11-05",
    reason: "Iran oil sanctions forced India to cut imports from 500K to 0 barrels/day by 2019",
    sanctionYear: 2018,
    detailSummary: "US reimposed sanctions on NIOC after withdrawing from JCPOA. India was importing 27 million tonnes of Iranian crude. The forced switch to costlier Saudi and Iraqi crude raised India's oil import bill by ₹1.6 lakh crore and collapsed ₹16,000 Cr in bilateral trade.",
    impactData: [
      { year: "2016", gdpBefore: 8.0, gdpAfter: 8.0, tradeBefore: 660, tradeAfter: 660, fdiBefore: 46, fdiAfter: 46 },
      { year: "2017", gdpBefore: 6.6, gdpAfter: 6.6, tradeBefore: 690, tradeAfter: 690, fdiBefore: 40, fdiAfter: 40 },
      { year: "2018", gdpBefore: 7.0, gdpAfter: 6.5, tradeBefore: 740, tradeAfter: 700, fdiBefore: 44, fdiAfter: 42 },
      { year: "2019", gdpBefore: 6.8, gdpAfter: 4.0, tradeBefore: 780, tradeAfter: 690, fdiBefore: 48, fdiAfter: 51 },
      { year: "2020", gdpBefore: 5.0, gdpAfter: -6.6, tradeBefore: 800, tradeAfter: 520, fdiBefore: 52, fdiAfter: 64 },
      { year: "2021", gdpBefore: 7.5, gdpAfter: 8.7, tradeBefore: 850, tradeAfter: 750, fdiBefore: 65, fdiAfter: 85 },
      { year: "2022", gdpBefore: 7.2, gdpAfter: 6.8, tradeBefore: 900, tradeAfter: 830, fdiBefore: 72, fdiAfter: 71 },
    ],
  },
  {
    name: "Huawei Technologies", type: "Organisation", list: "Entity List (BIS)", country: "China", status: "Active", addedDate: "2019-05-16",
    reason: "India excluded Huawei from 5G trials; affected ₹4,000 Cr telecom equipment market",
    sanctionYear: 2019,
    detailSummary: "US Entity List restrictions on Huawei cascaded into India excluding the company from 5G trials. This delayed India's 5G rollout by 18 months and disrupted the ₹4,000 Cr telecom equipment market. India pivoted to Ericsson, Nokia, and domestic alternatives like Jio's indigenous 5G stack.",
    impactData: [
      { year: "2017", gdpBefore: 6.6, gdpAfter: 6.6, tradeBefore: 690, tradeAfter: 690, fdiBefore: 40, fdiAfter: 40 },
      { year: "2018", gdpBefore: 6.5, gdpAfter: 6.5, tradeBefore: 740, tradeAfter: 740, fdiBefore: 42, fdiAfter: 42 },
      { year: "2019", gdpBefore: 6.2, gdpAfter: 4.0, tradeBefore: 780, tradeAfter: 710, fdiBefore: 50, fdiAfter: 51 },
      { year: "2020", gdpBefore: 5.5, gdpAfter: -6.6, tradeBefore: 820, tradeAfter: 580, fdiBefore: 55, fdiAfter: 64 },
      { year: "2021", gdpBefore: 7.8, gdpAfter: 8.7, tradeBefore: 860, tradeAfter: 790, fdiBefore: 68, fdiAfter: 85 },
      { year: "2022", gdpBefore: 7.5, gdpAfter: 6.8, tradeBefore: 910, tradeAfter: 870, fdiBefore: 74, fdiAfter: 71 },
      { year: "2023", gdpBefore: 7.2, gdpAfter: 7.2, tradeBefore: 960, tradeAfter: 940, fdiBefore: 76, fdiAfter: 72 },
    ],
  },
  {
    name: "Bank Rossiya", type: "Bank", list: "EU Sanctions", country: "Russia", status: "Active", addedDate: "2014-03-20",
    reason: "Payment processing disruptions for India-Russia bilateral trade settlements",
    sanctionYear: 2014,
    detailSummary: "EU sanctions on Bank Rossiya disrupted payment channels for India-Russia trade. Indian exporters faced delayed settlements and increased transaction costs. This eventually led India to explore alternative payment mechanisms including the Rupee-Rouble bilateral trade system.",
    impactData: [
      { year: "2015", gdpBefore: 7.5, gdpAfter: 7.5, tradeBefore: 640, tradeAfter: 640, fdiBefore: 44, fdiAfter: 44 },
      { year: "2016", gdpBefore: 8.2, gdpAfter: 8.0, tradeBefore: 670, tradeAfter: 660, fdiBefore: 47, fdiAfter: 46 },
      { year: "2017", gdpBefore: 7.0, gdpAfter: 6.6, tradeBefore: 710, tradeAfter: 690, fdiBefore: 42, fdiAfter: 40 },
      { year: "2018", gdpBefore: 6.8, gdpAfter: 6.5, tradeBefore: 750, tradeAfter: 740, fdiBefore: 44, fdiAfter: 42 },
      { year: "2019", gdpBefore: 5.5, gdpAfter: 4.0, tradeBefore: 790, tradeAfter: 780, fdiBefore: 52, fdiAfter: 51 },
      { year: "2020", gdpBefore: 4.0, gdpAfter: -6.6, tradeBefore: 810, tradeAfter: 670, fdiBefore: 56, fdiAfter: 64 },
      { year: "2021", gdpBefore: 7.8, gdpAfter: 8.7, tradeBefore: 860, tradeAfter: 820, fdiBefore: 72, fdiAfter: 85 },
    ],
  },
  {
    name: "Sberbank", type: "Bank", list: "OFAC SDN", country: "Russia", status: "Active", addedDate: "2022-02-24",
    reason: "Rupee-Rouble trade mechanism initiated by India as workaround",
    sanctionYear: 2022,
    detailSummary: "Sberbank's SWIFT exclusion forced India to create the Rupee-Rouble payment mechanism through RBI-facilitated Vostro accounts. India saved $7-10B on discounted Russian crude but accumulated ₹60,000 Cr in non-repatriable Rouble surplus, widening the trade imbalance.",
    impactData: [
      { year: "2019", gdpBefore: 4.0, gdpAfter: 4.0, tradeBefore: 780, tradeAfter: 780, fdiBefore: 51, fdiAfter: 51 },
      { year: "2020", gdpBefore: 4.5, gdpAfter: -6.6, tradeBefore: 820, tradeAfter: 670, fdiBefore: 55, fdiAfter: 64 },
      { year: "2021", gdpBefore: 8.0, gdpAfter: 8.7, tradeBefore: 870, tradeAfter: 820, fdiBefore: 72, fdiAfter: 85 },
      { year: "2022", gdpBefore: 7.5, gdpAfter: 6.8, tradeBefore: 920, tradeAfter: 900, fdiBefore: 75, fdiAfter: 71 },
      { year: "2023", gdpBefore: 7.3, gdpAfter: 7.2, tradeBefore: 970, tradeAfter: 950, fdiBefore: 76, fdiAfter: 72 },
      { year: "2024", gdpBefore: 7.0, gdpAfter: 6.5, tradeBefore: 1010, tradeAfter: 980, fdiBefore: 73, fdiAfter: 68 },
      { year: "2025", gdpBefore: 6.8, gdpAfter: 6.3, tradeBefore: 1040, tradeAfter: 1010, fdiBefore: 72, fdiAfter: 70 },
    ],
  },
  {
    name: "ZTE Corporation", type: "Organisation", list: "Entity List (BIS)", country: "China", status: "Active", addedDate: "2018-04-16",
    reason: "Indian telecom operators forced to replace ZTE 4G infrastructure",
    sanctionYear: 2018,
    detailSummary: "US sanctions on ZTE forced Indian telecom operators to replace existing 4G infrastructure at significant cost. BSNL and other operators had to rip and replace ZTE equipment, delaying network upgrades and increasing capital expenditure across the sector.",
    impactData: [
      { year: "2016", gdpBefore: 8.0, gdpAfter: 8.0, tradeBefore: 660, tradeAfter: 660, fdiBefore: 46, fdiAfter: 46 },
      { year: "2017", gdpBefore: 6.6, gdpAfter: 6.6, tradeBefore: 690, tradeAfter: 690, fdiBefore: 40, fdiAfter: 40 },
      { year: "2018", gdpBefore: 7.0, gdpAfter: 6.5, tradeBefore: 740, tradeAfter: 710, fdiBefore: 44, fdiAfter: 42 },
      { year: "2019", gdpBefore: 6.5, gdpAfter: 4.0, tradeBefore: 780, tradeAfter: 700, fdiBefore: 50, fdiAfter: 51 },
      { year: "2020", gdpBefore: 5.0, gdpAfter: -6.6, tradeBefore: 810, tradeAfter: 590, fdiBefore: 54, fdiAfter: 64 },
      { year: "2021", gdpBefore: 7.5, gdpAfter: 8.7, tradeBefore: 860, tradeAfter: 780, fdiBefore: 66, fdiAfter: 85 },
      { year: "2022", gdpBefore: 7.2, gdpAfter: 6.8, tradeBefore: 910, tradeAfter: 860, fdiBefore: 73, fdiAfter: 71 },
    ],
  },
  {
    name: "Petronet LNG (Iran partner)", type: "Organisation", list: "OFAC Secondary", country: "Iran", status: "Delisted", addedDate: "2020-01-15",
    reason: "India's Petronet had to abandon $20B LNG deal with Iran",
    sanctionYear: 2020,
    detailSummary: "US secondary sanctions forced India's Petronet LNG to abandon a $20B long-term LNG import deal with Iran. This deprived India of a stable, competitively priced gas source and forced reliance on costlier spot-market LNG from Qatar and Australia.",
    impactData: [
      { year: "2017", gdpBefore: 6.6, gdpAfter: 6.6, tradeBefore: 690, tradeAfter: 690, fdiBefore: 40, fdiAfter: 40 },
      { year: "2018", gdpBefore: 6.5, gdpAfter: 6.5, tradeBefore: 740, tradeAfter: 740, fdiBefore: 42, fdiAfter: 42 },
      { year: "2019", gdpBefore: 4.0, gdpAfter: 4.0, tradeBefore: 780, tradeAfter: 760, fdiBefore: 51, fdiAfter: 51 },
      { year: "2020", gdpBefore: 5.0, gdpAfter: -6.6, tradeBefore: 820, tradeAfter: 580, fdiBefore: 56, fdiAfter: 64 },
      { year: "2021", gdpBefore: 8.0, gdpAfter: 8.7, tradeBefore: 870, tradeAfter: 790, fdiBefore: 70, fdiAfter: 85 },
      { year: "2022", gdpBefore: 7.5, gdpAfter: 6.8, tradeBefore: 920, tradeAfter: 870, fdiBefore: 74, fdiAfter: 71 },
      { year: "2023", gdpBefore: 7.2, gdpAfter: 7.2, tradeBefore: 960, tradeAfter: 940, fdiBefore: 76, fdiAfter: 72 },
    ],
  },
  {
    name: "Islamic Republic of Iran Shipping Lines", type: "Vessel", list: "OFAC SDN", country: "Iran", status: "Active", addedDate: "2008-09-10",
    reason: "Indian ports stopped servicing IRISL vessels; trade route disruption",
    sanctionYear: 2008,
    detailSummary: "Sanctions on IRISL forced Indian ports to refuse docking and servicing of Iranian vessels. This disrupted a major trade route for Indian exports of rice, tea, and pharmaceuticals to Iran, and complicated India's Chabahar Port connectivity strategy.",
    impactData: [
      { year: "2015", gdpBefore: 7.5, gdpAfter: 7.5, tradeBefore: 640, tradeAfter: 620, fdiBefore: 44, fdiAfter: 44 },
      { year: "2016", gdpBefore: 8.2, gdpAfter: 8.0, tradeBefore: 670, tradeAfter: 640, fdiBefore: 47, fdiAfter: 46 },
      { year: "2017", gdpBefore: 7.0, gdpAfter: 6.6, tradeBefore: 700, tradeAfter: 670, fdiBefore: 42, fdiAfter: 40 },
      { year: "2018", gdpBefore: 6.8, gdpAfter: 6.5, tradeBefore: 750, tradeAfter: 710, fdiBefore: 44, fdiAfter: 42 },
      { year: "2019", gdpBefore: 5.5, gdpAfter: 4.0, tradeBefore: 790, tradeAfter: 700, fdiBefore: 52, fdiAfter: 51 },
      { year: "2020", gdpBefore: 4.0, gdpAfter: -6.6, tradeBefore: 810, tradeAfter: 560, fdiBefore: 56, fdiAfter: 64 },
      { year: "2021", gdpBefore: 7.8, gdpAfter: 8.7, tradeBefore: 860, tradeAfter: 770, fdiBefore: 72, fdiAfter: 85 },
    ],
  },
];

// Real-world case studies
export interface CaseStudy {
  title: string;
  year: string;
  sector: string;
  summary: string;
  impact: string;
  outcome: string;
}

export const caseStudies: CaseStudy[] = [
  {
    title: "S-400 Triumf Missile Deal & CAATSA Risk",
    year: "2018–2023",
    sector: "Defence",
    summary: "India signed a $5.43 billion deal with Russia for S-400 air defence systems despite US CAATSA (Countering America's Adversaries Through Sanctions Act) threats.",
    impact: "Risk of US secondary sanctions on Indian defence entities; potential loss of access to US military technology; diplomatic strain in Quad alliance.",
    outcome: "India received deliveries starting 2021. US granted an informal waiver citing strategic partnership. India diversified defence procurement to reduce Russia dependency from 70% to 55%."
  },
  {
    title: "Iran Oil Import Shutdown",
    year: "2018–2019",
    sector: "Energy",
    summary: "US reimposed sanctions on Iran after withdrawing from JCPOA. India was importing 27 million tonnes of Iranian crude, its 3rd largest supplier.",
    impact: "India's oil import bill rose by ₹1.6 lakh crore as it shifted to costlier Saudi & Iraqi crude. Chabahar Port Phase-2 delayed by 3+ years. ₹16,000 Cr bilateral trade collapsed.",
    outcome: "India zeroed Iranian oil imports by May 2019. Negotiated Chabahar exemption from US. Accelerated domestic renewable energy targets from 175GW to 500GW by 2030."
  },
  {
    title: "Rupee-Rouble Trade Mechanism",
    year: "2022–Present",
    sector: "Finance",
    summary: "After Russia's SWIFT exclusion, India established a Rupee-Rouble payment system to maintain $45B annual bilateral trade, especially for discounted Russian oil.",
    impact: "India became Russia's largest oil customer. RBI facilitated Vostro accounts for 9 Russian banks. Rupee gained partial internationalisation experience.",
    outcome: "India saved an estimated $7-10B on discounted Russian crude. However, accumulated ₹60,000 Cr in non-repatriable Rouble surplus. Trade imbalance widened."
  },
  {
    title: "Chinese Tech & App Bans",
    year: "2020–Present",
    sector: "Technology",
    summary: "Following Galwan clash, India banned 300+ Chinese apps including TikTok, WeChat, and restricted Chinese FDI. Combined with US Entity List sanctions on Huawei/ZTE.",
    impact: "₹4,000 Cr telecom equipment market disrupted. India's 5G rollout delayed by 18 months. $26B Chinese FDI pipeline frozen. Indian tech startups lost Chinese VC funding.",
    outcome: "India accelerated domestic alternatives (Jio, BSNL for 5G). PLI scheme attracted $15B in electronics manufacturing commitments from Apple, Samsung."
  },
  {
    title: "Semiconductor Export Controls Impact",
    year: "2022–Present",
    sector: "Technology",
    summary: "US-led semiconductor export controls targeting China created cascading effects on India's chip-dependent industries – automotive, electronics, defence systems.",
    impact: "Indian auto sector lost ₹50,000 Cr in production due to global chip shortage. Defence electronics procurement timelines extended by 2-3 years.",
    outcome: "India launched ₹76,000 Cr semiconductor mission. Attracted Micron ($2.75B fab in Gujarat), Tata-PSMC partnership. Long-term self-reliance push initiated."
  },
];
