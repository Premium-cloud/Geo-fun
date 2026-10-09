import type { TerritoryPack } from './types'

/**
 * Suisse — 26 cantons.
 * Pictos recto : curation croisée AOP/IGP (aop-igp.ch), UNESCO, identité cantonale.
 * Emblèmes : Wikimedia `Wappen … matt.svg` → public/mockups/emblems/ch/
 * Voir SOURCES.md
 */
export const CH_PACK: TerritoryPack = {
  id: 'ch',
  country: 'Suisse',
  unitKind: 'Canton',
  backTitle: 'Cantons',
  backSub: 'de Suisse',
  ribbonBg: '#c8102e',
  accent: '#c8102e',
  emblemKind: 'blason',
  subLabel: 'Chef-lieu',
  backIds: [
    'cheese', 'cow', 'ski', 'mountain', 'watch', 'clock', 'grape', 'wine',
    'honey', 'forest', 'oak', 'sheep', 'goat', 'river', 'crystal', 'castle',
    'apple', 'cherry', 'wheat', 'butter', 'mushroom', 'duck', 'fish', 'ship',
    'factory', 'metal', 'gold', 'ribbon', 'flower', 'rose', 'spa', 'cathedral',
    'pottery', 'silk', 'horse', 'beer', 'barrel', 'knife', 'salt', 'plum',
  ],
  units: [
    { code: 'AG', name: 'Aargau', capital: 'Aarau', pictos: [
      { icon: 'river', label: 'Aar' }, { icon: 'castle', label: 'Habsbourg' }, { icon: 'factory', label: 'Industrie' },
    ]},
    { code: 'AI', name: 'Appenzell Innerrhoden', capital: 'Appenzell', pictos: [
      { icon: 'cheese', label: 'Appenzeller' }, { icon: 'cow', label: 'Alpage' }, { icon: 'mountain', label: 'Alpstein' },
    ]},
    { code: 'AR', name: 'Appenzell Ausserrhoden', capital: 'Herisau', pictos: [
      { icon: 'textile', label: 'Broderie' }, { icon: 'cheese', label: 'Appenzeller' }, { icon: 'cow', label: 'Alpage' },
    ]},
    { code: 'BE', name: 'Bern', capital: 'Bern', pictos: [
      { icon: 'cheese', label: 'Emmental' }, { icon: 'cow', label: 'Tête Moine' }, { icon: 'mountain', label: 'Oberland' },
    ]},
    { code: 'BL', name: 'Basel-Landschaft', capital: 'Liestal', pictos: [
      { icon: 'factory', label: 'Chimie' }, { icon: 'grape', label: 'Vignoble' }, { icon: 'river', label: 'Rhin' },
    ]},
    { code: 'BS', name: 'Basel-Stadt', capital: 'Basel', pictos: [
      { icon: 'factory', label: 'Pharma' }, { icon: 'river', label: 'Rhin' }, { icon: 'cathedral', label: 'Münster' },
    ]},
    { code: 'FR', name: 'Fribourg', capital: 'Fribourg', pictos: [
      { icon: 'cheese', label: 'Gruyère' }, { icon: 'cheese', label: 'Vacherin' }, { icon: 'cow', label: 'Pré-alpes' },
    ]},
    { code: 'GE', name: 'Genève', capital: 'Genève', pictos: [
      { icon: 'watch', label: 'Horlogerie' }, { icon: 'briefcase', label: 'ONU' }, { icon: 'spa', label: 'Jet d’eau' },
    ]},
    { code: 'GL', name: 'Glarus', capital: 'Glarus', pictos: [
      { icon: 'mountain', label: 'Alpes' }, { icon: 'textile', label: 'Textile' }, { icon: 'cheese', label: 'Glarner' },
    ]},
    { code: 'GR', name: 'Graubünden', capital: 'Chur', pictos: [
      { icon: 'ski', label: 'Engadine' }, { icon: 'mountain', label: 'Alpes' }, { icon: 'spa', label: 'Thermal' },
    ]},
    { code: 'JU', name: 'Jura', capital: 'Delémont', pictos: [
      { icon: 'watch', label: 'Horlogerie' }, { icon: 'horse', label: 'Franches-M.' }, { icon: 'forest', label: 'Jura' },
    ]},
    { code: 'LU', name: 'Luzern', capital: 'Luzern', pictos: [
      { icon: 'sea', label: 'Lac' }, { icon: 'mountain', label: 'Pilatus' }, { icon: 'cheese', label: 'Fromage' },
    ]},
    { code: 'NE', name: 'Neuchâtel', capital: 'Neuchâtel', pictos: [
      { icon: 'watch', label: 'Horlogerie' }, { icon: 'grape', label: 'Vignoble' }, { icon: 'sea', label: 'Lac' },
    ]},
    { code: 'NW', name: 'Nidwalden', capital: 'Stans', pictos: [
      { icon: 'mountain', label: 'Alpes' }, { icon: 'cow', label: 'Alpage' }, { icon: 'cheese', label: 'Fromage' },
    ]},
    { code: 'OW', name: 'Obwalden', capital: 'Sarnen', pictos: [
      { icon: 'mountain', label: 'Alpes' }, { icon: 'cheese', label: 'Fromage' }, { icon: 'ski', label: 'Ski' },
    ]},
    { code: 'SG', name: 'St. Gallen', capital: 'St. Gallen', pictos: [
      { icon: 'textile', label: 'Broderie' }, { icon: 'cathedral', label: 'Abbaye' }, { icon: 'cow', label: 'Alpage' },
    ]},
    { code: 'SH', name: 'Schaffhausen', capital: 'Schaffhausen', pictos: [
      { icon: 'river', label: 'Chutes Rhin' }, { icon: 'castle', label: 'Munot' }, { icon: 'grape', label: 'Vignoble' },
    ]},
    { code: 'SO', name: 'Solothurn', capital: 'Solothurn', pictos: [
      { icon: 'cathedral', label: 'St-Ours' }, { icon: 'watch', label: 'Horlogerie' }, { icon: 'river', label: 'Aar' },
    ]},
    { code: 'SZ', name: 'Schwyz', capital: 'Schwyz', pictos: [
      { icon: 'mountain', label: 'Mythen' }, { icon: 'cheese', label: 'Fromage' }, { icon: 'sword', label: 'Schwyz' },
    ]},
    { code: 'TG', name: 'Thurgau', capital: 'Frauenfeld', pictos: [
      { icon: 'apple', label: 'Cidre' }, { icon: 'grape', label: 'Vignoble' }, { icon: 'wheat', label: 'Cultures' },
    ]},
    { code: 'TI', name: 'Ticino', capital: 'Bellinzona', pictos: [
      { icon: 'grape', label: 'Merlot' }, { icon: 'castle', label: 'Castelli' }, { icon: 'palm', label: 'Sud' },
    ]},
    { code: 'UR', name: 'Uri', capital: 'Altdorf', pictos: [
      { icon: 'mountain', label: 'Gotthard' }, { icon: 'cow', label: 'Alpage' }, { icon: 'sword', label: 'Tell' },
    ]},
    { code: 'VD', name: 'Vaud', capital: 'Lausanne', pictos: [
      { icon: 'grape', label: 'Lavaux' }, { icon: 'cheese', label: 'Tomme' }, { icon: 'wine', label: 'Chasselas' },
    ]},
    { code: 'VS', name: 'Valais', capital: 'Sion', pictos: [
      { icon: 'cheese', label: 'Raclette' }, { icon: 'grape', label: 'Vin' }, { icon: 'mountain', label: 'Cervin' },
    ]},
    { code: 'ZG', name: 'Zug', capital: 'Zug', pictos: [
      { icon: 'cherry', label: 'Kirsch' }, { icon: 'briefcase', label: 'Finance' }, { icon: 'sea', label: 'Zugersee' },
    ]},
    { code: 'ZH', name: 'Zürich', capital: 'Zürich', pictos: [
      { icon: 'briefcase', label: 'Finance' }, { icon: 'factory', label: 'Industrie' }, { icon: 'river', label: 'Limmat' },
    ]},
  ],
}
