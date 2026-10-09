import type { TerritoryPack } from './types'

/**
 * Canada — 13 provinces / territoires.
 * Pictos : ressources & identité provinciale.
 * Emblèmes : drapeaux Wikimedia → public/mockups/emblems/ca/
 * Voir SOURCES.md
 */
export const CA_PACK: TerritoryPack = {
  id: 'ca',
  country: 'Canada',
  unitKind: 'Province',
  backTitle: 'Provinces',
  backSub: 'of Canada',
  ribbonBg: '#0b3d91',
  accent: '#0b3d91',
  emblemKind: 'flag',
  subLabel: 'Capital',
  backIds: ['maple', 'oil', 'bear', 'deer', 'forest', 'ski', 'fish', 'mountain', 'river', 'cow', 'wheat', 'ship', 'crystal', 'duck', 'honey', 'apple', 'cheese', 'butter', 'horse', 'gold', 'metal', 'lighthouse', 'briefcase', 'sea', 'beach', 'salt', 'coal', 'factory', 'pig', 'chicken', 'flower', 'rose', 'mushroom', 'sheep', 'goat', 'airplane', 'barrel', 'wine', 'grape', 'beer'],
  units: [
    { code: 'AB', name: 'Alberta', capital: 'Edmonton', pictos: [{ icon: 'oil', label: 'Pétrole' }, { icon: 'cow', label: 'Ranch' }, { icon: 'mountain', label: 'Rocheuses' }] },
    { code: 'BC', name: 'British Columbia', capital: 'Victoria', pictos: [{ icon: 'forest', label: 'Forêt' }, { icon: 'fish', label: 'Saumon' }, { icon: 'mountain', label: 'Rocheuses' }] },
    { code: 'MB', name: 'Manitoba', capital: 'Winnipeg', pictos: [{ icon: 'wheat', label: 'Blé' }, { icon: 'duck', label: 'Lacs' }, { icon: 'river', label: 'Rouge' }] },
    { code: 'NB', name: 'New Brunswick', capital: 'Fredericton', pictos: [{ icon: 'forest', label: 'Forêt' }, { icon: 'fish', label: 'Homard' }, { icon: 'sea', label: 'Marées' }] },
    { code: 'NL', name: 'Newfoundland and Labrador', capital: 'St. John\'s', pictos: [{ icon: 'fish', label: 'Morue' }, { icon: 'lighthouse', label: 'Phare' }, { icon: 'crystal', label: 'Icebergs' }] },
    { code: 'NS', name: 'Nova Scotia', capital: 'Halifax', pictos: [{ icon: 'ship', label: 'Port' }, { icon: 'lighthouse', label: 'Phare' }, { icon: 'fish', label: 'Homard' }] },
    { code: 'NT', name: 'Northwest Territories', capital: 'Yellowknife', pictos: [{ icon: 'gold', label: 'Mine' }, { icon: 'bear', label: 'Ours' }, { icon: 'forest', label: 'Taïga' }] },
    { code: 'NU', name: 'Nunavut', capital: 'Iqaluit', pictos: [{ icon: 'bear', label: 'Ours' }, { icon: 'fish', label: 'Pêche' }, { icon: 'crystal', label: 'Arctique' }] },
    { code: 'ON', name: 'Ontario', capital: 'Toronto', pictos: [{ icon: 'briefcase', label: 'Finance' }, { icon: 'sea', label: 'Grands Lacs' }, { icon: 'maple', label: 'Érable' }] },
    { code: 'PE', name: 'Prince Edward Island', capital: 'Charlottetown', pictos: [{ icon: 'beet', label: 'Pomme de t.' }, { icon: 'beach', label: 'Plages' }, { icon: 'ship', label: 'Île' }] },
    { code: 'QC', name: 'Québec', capital: 'Québec', pictos: [{ icon: 'maple', label: 'Érable' }, { icon: 'ski', label: 'Hiver' }, { icon: 'river', label: 'Fleuve' }] },
    { code: 'SK', name: 'Saskatchewan', capital: 'Regina', pictos: [{ icon: 'wheat', label: 'Blé' }, { icon: 'cow', label: 'Élevage' }, { icon: 'salt', label: 'Potasse' }] },
    { code: 'YT', name: 'Yukon', capital: 'Whitehorse', pictos: [{ icon: 'gold', label: 'Ruée' }, { icon: 'mountain', label: 'Monts' }, { icon: 'ski', label: 'Hiver' }] },
  ],
}
