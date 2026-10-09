import type { TerritoryPack } from './types'

/**
 * Espagne — 17 communautés + Ceuta/Melilla.
 * Pictos recto : DO/DOP/IGP et symboles régionaux documentés (Rioja, Jerez, Manchego…).
 * Emblèmes : drapeaux Wikimedia → public/mockups/emblems/es/
 * Voir SOURCES.md
 */
export const ES_PACK: TerritoryPack = {
  id: 'es',
  country: 'Espagne',
  unitKind: 'Communauté',
  backTitle: 'Comunidades',
  backSub: 'de España',
  ribbonBg: '#aa151b',
  accent: '#aa151b',
  emblemKind: 'flag',
  subLabel: 'Capital',
  backIds: [
    'olive', 'grape', 'wine', 'castle', 'cathedral', 'beach', 'fish', 'sea',
    'pepper', 'garlic', 'horse', 'rose', 'pottery', 'palm', 'melon', 'spa',
    'sheep', 'goat', 'honey', 'wheat', 'pig', 'cheese', 'barrel', 'ship',
    'flower', 'strawberry', 'cherry', 'apple', 'river', 'mountain', 'ski', 'gold',
    'silk', 'lace', 'ribbon', 'sword', 'lion', 'duck', 'cow', 'factory',
  ],
  units: [
    { code: 'AN', name: 'Andalucía', capital: 'Sevilla', pictos: [
      { icon: 'olive', label: 'Huile' }, { icon: 'grape', label: 'Jerez' }, { icon: 'castle', label: 'Alcázar' },
    ]},
    { code: 'AR', name: 'Aragón', capital: 'Zaragoza', pictos: [
      { icon: 'wine', label: 'Cariñena' }, { icon: 'mountain', label: 'Pyrénées' }, { icon: 'castle', label: 'Mudéjar' },
    ]},
    { code: 'AS', name: 'Asturias', capital: 'Oviedo', pictos: [
      { icon: 'apple', label: 'Sidra' }, { icon: 'coal', label: 'Mine' }, { icon: 'sea', label: 'Côte' },
    ]},
    { code: 'CB', name: 'Cantabria', capital: 'Santander', pictos: [
      { icon: 'sea', label: 'Côte' }, { icon: 'cow', label: 'Élevage' }, { icon: 'pottery', label: 'Altamira' },
    ]},
    { code: 'CL', name: 'Castilla y León', capital: 'Valladolid', pictos: [
      { icon: 'wine', label: 'Ribera' }, { icon: 'castle', label: 'Châteaux' }, { icon: 'wheat', label: 'Meseta' },
    ]},
    { code: 'CM', name: 'Castilla-La Mancha', capital: 'Toledo', pictos: [
      { icon: 'cheese', label: 'Manchego' }, { icon: 'wheat', label: 'Moulins' }, { icon: 'sword', label: 'Quichotte' },
    ]},
    { code: 'CN', name: 'Canarias', capital: 'Las Palmas', pictos: [
      { icon: 'banana', label: 'Plátano' }, { icon: 'volcano', label: 'Teide' }, { icon: 'beach', label: 'Plages' },
    ]},
    { code: 'CT', name: 'Catalunya', capital: 'Barcelona', pictos: [
      { icon: 'cathedral', label: 'Sagrada' }, { icon: 'wine', label: 'Priorat' }, { icon: 'factory', label: 'Industrie' },
    ]},
    { code: 'EX', name: 'Extremadura', capital: 'Mérida', pictos: [
      { icon: 'pig', label: 'Ibérico' }, { icon: 'oak', label: 'Dehesa' }, { icon: 'castle', label: 'Romain' },
    ]},
    { code: 'GA', name: 'Galicia', capital: 'Santiago', pictos: [
      { icon: 'scallop', label: 'Camino' }, { icon: 'fish', label: 'Marisco' }, { icon: 'sea', label: 'Atlantique' },
    ]},
    { code: 'IB', name: 'Illes Balears', capital: 'Palma', pictos: [
      { icon: 'beach', label: 'Plages' }, { icon: 'sea', label: 'Méditerranée' }, { icon: 'castle', label: 'Palma' },
    ]},
    { code: 'MC', name: 'Murcia', capital: 'Murcia', pictos: [
      { icon: 'pepper', label: 'Pimentón' }, { icon: 'melon', label: 'Melon' }, { icon: 'sea', label: 'Mar Menor' },
    ]},
    { code: 'MD', name: 'Madrid', capital: 'Madrid', pictos: [
      { icon: 'briefcase', label: 'Capitale' }, { icon: 'castle', label: 'Royal' }, { icon: 'rose', label: 'Prado' },
    ]},
    { code: 'NC', name: 'Navarra', capital: 'Pamplona', pictos: [
      { icon: 'wine', label: 'Navarra' }, { icon: 'cow', label: 'Encierro' }, { icon: 'forest', label: 'Pyrénées' },
    ]},
    { code: 'PV', name: 'País Vasco', capital: 'Vitoria', pictos: [
      { icon: 'fish', label: 'Pintxos' }, { icon: 'factory', label: 'Industrie' }, { icon: 'sea', label: 'Golfe' },
    ]},
    { code: 'RI', name: 'La Rioja', capital: 'Logroño', pictos: [
      { icon: 'wine', label: 'Rioja' }, { icon: 'grape', label: 'Vignoble' }, { icon: 'barrel', label: 'Bodegas' },
    ]},
    { code: 'VC', name: 'Comunitat Valenciana', capital: 'Valencia', pictos: [
      { icon: 'melon', label: 'Naranja' }, { icon: 'wheat', label: 'Paella' }, { icon: 'beach', label: 'Costa' },
    ]},
    { code: 'CE', name: 'Ceuta', capital: 'Ceuta', pictos: [
      { icon: 'ship', label: 'Détroit' }, { icon: 'castle', label: 'Remparts' }, { icon: 'fish', label: 'Mer' },
    ]},
    { code: 'ML', name: 'Melilla', capital: 'Melilla', pictos: [
      { icon: 'castle', label: 'Citadelle' }, { icon: 'sea', label: 'Méditerranée' }, { icon: 'ship', label: 'Port' },
    ]},
  ],
}
