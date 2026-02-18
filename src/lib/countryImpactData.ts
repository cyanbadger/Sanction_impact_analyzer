export const impactCountries = [
  "USA",
  "Russia",
  "China",
  "Iran",
  "EU",
  "Japan",
  "UK",
] as const;

export type ImpactCountry = (typeof impactCountries)[number];

const years = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

interface CountryImpact {
  gdpBefore: number[];
  gdpAfter: number[];
  tradeBefore: number[];
  tradeAfter: number[];
  fdiBefore: number[];
  fdiAfter: number[];
  description: string;
}

const countryData: Record<ImpactCountry, CountryImpact> = {
  USA: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.8, 6.2, 5.8, 4.0, -6.6, 8.7, 6.8, 7.2, 6.5, 6.3],
    tradeBefore:[92, 98, 105, 110, 115, 120, 125, 130, 135, 140, 145],
    tradeAfter: [92, 96, 100, 102, 88, 72, 105, 115, 120, 128, 132],
    fdiBefore:  [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    fdiAfter:   [12, 13, 13, 14, 13, 10, 16, 18, 19, 20, 21],
    description: "US CAATSA sanctions and tech export controls affected India's defence procurement (S-400 deal) and semiconductor supply chains. Trade compliance costs increased across financial and tech sectors.",
  },
  Russia: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.9, 6.4, 6.2, 5.5, -5.8, 8.2, 5.8, 6.5, 6.0, 5.8],
    tradeBefore:[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    tradeAfter: [10, 11, 11, 10, 9, 7, 13, 45, 50, 48, 46],
    fdiBefore:  [1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0],
    fdiAfter:   [1.2, 1.3, 1.4, 1.3, 1.1, 0.8, 1.5, 3.2, 3.5, 3.0, 2.8],
    description: "Russia sanctions disrupted India's $12B defence supply chain (MiG, Su-30 spares) and SWIFT-based payments. India pivoted to Rupee-Rouble trade, becoming Russia's largest oil buyer post-2022.",
  },
  China: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.8, 6.5, 6.3, 5.2, -6.0, 7.8, 6.2, 6.8, 6.2, 6.0],
    tradeBefore:[72, 78, 84, 90, 96, 100, 105, 110, 115, 120, 125],
    tradeAfter: [72, 77, 82, 85, 75, 62, 88, 95, 100, 105, 108],
    fdiBefore:  [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5],
    fdiAfter:   [5.5, 5.8, 6.0, 5.2, 3.0, 1.5, 2.0, 2.2, 2.5, 2.8, 3.0],
    description: "Post-Galwan restrictions froze $26B Chinese FDI pipeline. 300+ app bans and telecom equipment restrictions delayed India's 5G rollout by 18 months. PLI schemes attracted alternative investments.",
  },
  Iran: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.9, 6.5, 5.5, 4.8, -5.0, 7.5, 6.5, 6.8, 6.4, 6.2],
    tradeBefore:[17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    tradeAfter: [17, 17, 16, 8, 2, 1.5, 2, 2.5, 3, 3.5, 4],
    fdiBefore:  [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8],
    fdiAfter:   [0.8, 0.8, 0.7, 0.3, 0.1, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35],
    description: "US reimposed Iran sanctions in 2018 crashed India-Iran trade from $17B to under $2B. Oil imports dropped from 27MT to zero. Chabahar Port Phase-2 delayed 3+ years. India's oil bill rose ₹1.6 lakh crore.",
  },
  EU: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.9, 6.5, 6.4, 5.8, -6.2, 8.5, 6.9, 7.1, 6.6, 6.5],
    tradeBefore:[105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155],
    tradeAfter: [105, 108, 112, 115, 108, 90, 120, 130, 138, 142, 148],
    fdiBefore:  [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13],
    fdiAfter:   [8, 8.4, 8.8, 9.0, 8.5, 7.0, 10, 11, 11.5, 12, 12.5],
    description: "EU sanctions on Russia and Iran created compliance complexities for Indian companies. CBAM (Carbon Border Adjustment) threatened $8B in Indian steel/aluminium exports. EU-India FTA negotiations affected.",
  },
  Japan: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.9, 6.5, 6.4, 6.2, -5.5, 8.3, 6.8, 7.0, 6.6, 6.5],
    tradeBefore:[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    tradeAfter: [15, 15.5, 16, 16.5, 15, 12, 18, 20, 21, 22, 23],
    fdiBefore:  [4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    fdiAfter:   [4.5, 4.8, 5.2, 5.8, 6.0, 5.0, 7.0, 7.5, 8.0, 8.5, 9.0],
    description: "Japan aligned with US-led sanctions on Russia. Impacted joint India-Japan industrial corridors. However, Japan increased investment in India as China+1 strategy, with $42B Delhi-Mumbai corridor commitment.",
  },
  UK: {
    gdpBefore:  [7.5, 8.0, 6.6, 6.5, 6.8, 6.2, 7.0, 7.2, 7.0, 6.8, 6.9],
    gdpAfter:   [7.5, 7.9, 6.5, 6.3, 6.0, -5.8, 8.4, 6.7, 7.0, 6.5, 6.4],
    tradeBefore:[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    tradeAfter: [18, 18.5, 19, 19.5, 18, 14, 21, 23, 24, 25, 26],
    fdiBefore:  [3.5, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0, 5.3, 5.5, 5.8, 6.0],
    fdiAfter:   [3.5, 3.7, 3.9, 4.0, 3.8, 3.2, 4.5, 5.0, 5.2, 5.5, 5.8],
    description: "Post-Brexit UK sanctions regime aligned with US/EU on Russia and Iran. India-UK FTA negotiations complicated by sanction compliance requirements. UK remains 6th largest investor in India.",
  },
};

export function getCountryGdpComparison(country: ImpactCountry) {
  const d = countryData[country];
  return years.map((y, i) => ({
    year: y,
    before: d.gdpBefore[i],
    after: d.gdpAfter[i],
  }));
}

export function getCountryTradeComparison(country: ImpactCountry) {
  const d = countryData[country];
  return years.map((y, i) => ({
    year: y,
    before: d.tradeBefore[i],
    after: d.tradeAfter[i],
  }));
}

export function getCountryFdiComparison(country: ImpactCountry) {
  const d = countryData[country];
  return years.map((y, i) => ({
    year: y,
    before: d.fdiBefore[i],
    after: d.fdiAfter[i],
  }));
}

export function getCountryDescription(country: ImpactCountry) {
  return countryData[country].description;
}

export function getCountryStats(country: ImpactCountry) {
  const d = countryData[country];
  const gdpDiff = d.gdpAfter[d.gdpAfter.length - 1] - d.gdpBefore[d.gdpBefore.length - 1];
  const tradeDiff = ((d.tradeAfter[d.tradeAfter.length - 1] - d.tradeBefore[d.tradeBefore.length - 1]) / d.tradeBefore[d.tradeBefore.length - 1] * 100);
  const fdiDiff = ((d.fdiAfter[d.fdiAfter.length - 1] - d.fdiBefore[d.fdiBefore.length - 1]) / d.fdiBefore[d.fdiBefore.length - 1] * 100);
  return {
    gdpChange: gdpDiff.toFixed(1),
    tradeChange: tradeDiff.toFixed(1),
    fdiChange: fdiDiff.toFixed(1),
  };
}
