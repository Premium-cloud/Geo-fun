import type { TerritoryPack } from './types'

/**
 * Allemagne — 16 Länder.
 * Pictos : spécialités / identité régionale (bière, vin, industrie).
 * Emblèmes : blasons Wikimedia → public/mockups/emblems/de/
 * Voir SOURCES.md
 */
export const DE_PACK: TerritoryPack = {
  id: 'de',
  country: 'Allemagne',
  unitKind: 'Land',
  backTitle: 'Länder',
  backSub: 'Deutschlands',
  ribbonBg: '#111111',
  accent: '#111111',
  emblemKind: 'blason',
  subLabel: 'Capital',
  backIds: ['pretzel', 'beer', 'castle', 'oak', 'mountain', 'ski', 'forest', 'factory', 'clock', 'horse', 'wheat', 'lion', 'metal', 'mushroom', 'river', 'cow', 'pig', 'cheese', 'apple', 'cherry', 'honey', 'wine', 'grape', 'barrel', 'cathedral', 'duck', 'fish', 'sheep', 'goat', 'flower', 'rose', 'spa', 'knife', 'butter', 'salt', 'coal', 'gold', 'briefcase', 'race', 'ship'],
  units: [
    { code: 'BW', name: 'Baden-Württemberg', capital: 'Stuttgart', pictos: [{ icon: 'factory', label: 'Auto' }, { icon: 'wine', label: 'Baden' }, { icon: 'forest', label: 'Forêt-Noire' }] },
    { code: 'BY', name: 'Bayern', capital: 'München', pictos: [{ icon: 'pretzel', label: 'Brezel' }, { icon: 'beer', label: 'Bier' }, { icon: 'ski', label: 'Alpen' }] },
    { code: 'BE', name: 'Berlin', capital: 'Berlin', pictos: [{ icon: 'briefcase', label: 'Capitale' }, { icon: 'film', label: 'Culture' }, { icon: 'lion', label: 'Ours' }] },
    { code: 'BB', name: 'Brandenburg', capital: 'Potsdam', pictos: [{ icon: 'castle', label: 'Châteaux' }, { icon: 'forest', label: 'Forêt' }, { icon: 'river', label: 'Havel' }] },
    { code: 'HB', name: 'Bremen', capital: 'Bremen', pictos: [{ icon: 'ship', label: 'Port' }, { icon: 'briefcase', label: 'Hanse' }, { icon: 'beer', label: 'Bière' }] },
    { code: 'HH', name: 'Hamburg', capital: 'Hamburg', pictos: [{ icon: 'ship', label: 'Port' }, { icon: 'fish', label: 'Elbe' }, { icon: 'briefcase', label: 'Commerce' }] },
    { code: 'HE', name: 'Hessen', capital: 'Wiesbaden', pictos: [{ icon: 'briefcase', label: 'Finance' }, { icon: 'spa', label: 'Thermal' }, { icon: 'wine', label: 'Rheingau' }] },
    { code: 'MV', name: 'Mecklenburg-Vorpommern', capital: 'Schwerin', pictos: [{ icon: 'sea', label: 'Baltique' }, { icon: 'castle', label: 'Schwerin' }, { icon: 'beach', label: 'Côte' }] },
    { code: 'NI', name: 'Niedersachsen', capital: 'Hannover', pictos: [{ icon: 'horse', label: 'Saxe' }, { icon: 'wheat', label: 'Cultures' }, { icon: 'sea', label: 'Mer du N.' }] },
    { code: 'NW', name: 'Nordrhein-Westfalen', capital: 'Düsseldorf', pictos: [{ icon: 'factory', label: 'Ruhr' }, { icon: 'coal', label: 'Charbon' }, { icon: 'beer', label: 'Kölsch' }] },
    { code: 'RP', name: 'Rheinland-Pfalz', capital: 'Mainz', pictos: [{ icon: 'wine', label: 'Moselle' }, { icon: 'grape', label: 'Vignoble' }, { icon: 'cathedral', label: 'Cathédrale' }] },
    { code: 'SL', name: 'Saarland', capital: 'Saarbrücken', pictos: [{ icon: 'coal', label: 'Mine' }, { icon: 'metal', label: 'Acier' }, { icon: 'forest', label: 'Forêt' }] },
    { code: 'SN', name: 'Sachsen', capital: 'Dresden', pictos: [{ icon: 'pottery', label: 'Porcelaine' }, { icon: 'castle', label: 'Dresde' }, { icon: 'metal', label: 'Industrie' }] },
    { code: 'ST', name: 'Sachsen-Anhalt', capital: 'Magdeburg', pictos: [{ icon: 'cathedral', label: 'Magdeburg' }, { icon: 'wheat', label: 'Cultures' }, { icon: 'factory', label: 'Chimie' }] },
    { code: 'SH', name: 'Schleswig-Holstein', capital: 'Kiel', pictos: [{ icon: 'sea', label: 'Baltique' }, { icon: 'ship', label: 'Ports' }, { icon: 'cow', label: 'Élevage' }] },
    { code: 'TH', name: 'Thüringen', capital: 'Erfurt', pictos: [{ icon: 'forest', label: 'Forêt' }, { icon: 'pig', label: 'Saucisse' }, { icon: 'castle', label: 'Wartburg' }] },
  ],
}
