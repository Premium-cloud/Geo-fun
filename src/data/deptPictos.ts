/** Pictos de spécialité par département (recto) — blasons historiques. */
import type { PictoId } from '../cards/pictos'

export type Specialty = { icon: PictoId; label: string }

export const DEPT_PICTOS: Record<string, Specialty[]> = {
  '01': [
    { icon: 'chicken', label: 'Poulet de Bresse' },
    { icon: 'cheese', label: 'Comté' },
    { icon: 'wine', label: 'Bugey' },
  ],
  '02': [
    { icon: 'cathedral', label: 'Laon' },
    { icon: 'beet', label: 'Betterave' },
    { icon: 'wheat', label: 'Thiérache' },
  ],
  '03': [
    { icon: 'spa', label: 'Vichy' },
    { icon: 'cow', label: 'Charolais' },
    { icon: 'castle', label: 'Bourbon' },
  ],
  '04': [
    { icon: 'lavender', label: 'Lavande' },
    { icon: 'olive', label: 'Olive' },
    { icon: 'mountain', label: 'Préalpes' },
  ],
  '05': [
    { icon: 'ski', label: 'Écrins' },
    { icon: 'mountain', label: 'Alpes' },
    { icon: 'apple', label: 'Pomme' },
  ],
  '06': [
    { icon: 'flower', label: 'Œillet de Nice' },
    { icon: 'olive', label: 'Olive' },
    { icon: 'sea', label: 'Baie des Anges' },
  ],
  '07': [
    { icon: 'chestnut', label: 'Châtaigne' },
    { icon: 'wine', label: 'Côtes du Vivarais' },
    { icon: 'river', label: 'Gorges' },
  ],
  '08': [
    { icon: 'forest', label: 'Ardenne' },
    { icon: 'beer', label: 'Bières' },
    { icon: 'castle', label: 'Sedan' },
  ],
  '09': [
    { icon: 'castle', label: 'Foix' },
    { icon: 'mountain', label: 'Pyrénées' },
    { icon: 'cheese', label: 'Bethmale' },
  ],
  '10': [
    { icon: 'champagne', label: 'Champagne' },
    { icon: 'textile', label: 'Mail' },
    { icon: 'cathedral', label: 'Troyes' },
  ],
  '11': [
    { icon: 'castle', label: 'Cité' },
    { icon: 'wine', label: 'Corbières' },
    { icon: 'olive', label: 'Olive' },
  ],
  '12': [
    { icon: 'knife', label: 'Laguiole' },
    { icon: 'cheese', label: 'Roquefort' },
    { icon: 'cow', label: 'Aubrac' },
  ],
  '13': [
    { icon: 'sea', label: 'Calanques' },
    { icon: 'olive', label: 'Olive' },
    { icon: 'calisson', label: 'Calisson' },
  ],
  '14': [
    { icon: 'cider', label: 'Cidre' },
    { icon: 'cheese', label: 'Camembert' },
    { icon: 'sea', label: 'Côte fleurie' },
  ],
  '15': [
    { icon: 'cheese', label: 'Cantal' },
    { icon: 'cow', label: 'Salers' },
    { icon: 'mountain', label: 'Volcans' },
  ],
  '16': [
    { icon: 'barrel', label: 'Cognac' },
    { icon: 'wine', label: 'Pineau' },
    { icon: 'river', label: 'Charente' },
  ],
  '17': [
    { icon: 'oyster', label: 'Huître' },
    { icon: 'salt', label: 'Sel' },
    { icon: 'lighthouse', label: 'Phare' },
  ],
  '18': [
    { icon: 'cathedral', label: 'Bourges' },
    { icon: 'wine', label: 'Sancerre' },
    { icon: 'cheese', label: 'Crottin' },
  ],
  '19': [
    { icon: 'apple', label: 'Pomme du Limousin' },
    { icon: 'cow', label: 'Veau' },
    { icon: 'chestnut', label: 'Châtaigne' },
  ],
  '2A': [
    { icon: 'wine', label: 'Vin corse' },
    { icon: 'chestnut', label: 'Châtaigne' },
    { icon: 'sea', label: 'Golfe' },
  ],
  '2B': [
    { icon: 'chestnut', label: 'Farine' },
    { icon: 'wine', label: 'Cap Corse' },
    { icon: 'mountain', label: 'Monte Cinto' },
  ],
  '21': [
    { icon: 'wine', label: 'Bourgogne' },
    { icon: 'mustard', label: 'Moutarde' },
    { icon: 'grape', label: 'Clos' },
  ],
  '22': [
    { icon: 'scallop', label: 'Coquille' },
    { icon: 'sea', label: 'Côte de granit' },
    { icon: 'oyster', label: 'Huître' },
  ],
  '23': [
    { icon: 'textile', label: 'Tapisserie' },
    { icon: 'forest', label: 'Forêt' },
    { icon: 'cow', label: 'Limousin' },
  ],
  '24': [
    { icon: 'truffle', label: 'Truffe' },
    { icon: 'walnut', label: 'Noix' },
    { icon: 'castle', label: 'Périgord' },
  ],
  '25': [
    { icon: 'cheese', label: 'Comté' },
    { icon: 'clock', label: 'Horlogerie' },
    { icon: 'mountain', label: 'Doubs' },
  ],
  '26': [
    { icon: 'nougat', label: 'Montélimar' },
    { icon: 'olive', label: 'Olive' },
    { icon: 'wine', label: 'Hermitage' },
  ],
  '27': [
    { icon: 'cider', label: 'Cidre' },
    { icon: 'cheese', label: 'Neufchâtel' },
    { icon: 'forest', label: 'Vexin' },
  ],
  '28': [
    { icon: 'cathedral', label: 'Chartres' },
    { icon: 'wheat', label: 'Beauce' },
    { icon: 'honey', label: 'Miel' },
  ],
  '29': [
    { icon: 'lighthouse', label: 'Phare' },
    { icon: 'crepe', label: 'Crêpe' },
    { icon: 'fish', label: 'Pêche' },
  ],
  '30': [
    { icon: 'olive', label: 'Olive' },
    { icon: 'wine', label: 'Costières' },
    { icon: 'castle', label: 'Pont du Gard' },
  ],
  '31': [
    { icon: 'plane', label: 'Aéronautique' },
    { icon: 'flower', label: 'Violette' },
    { icon: 'duck', label: 'Cassoulet' },
  ],
  '32': [
    { icon: 'barrel', label: 'Armagnac' },
    { icon: 'duck', label: 'Canard' },
    { icon: 'garlic', label: 'Ail' },
  ],
  '33': [
    { icon: 'wine', label: 'Bordeaux' },
    { icon: 'oyster', label: 'Arcachon' },
    { icon: 'sea', label: 'Bassin' },
  ],
  '34': [
    { icon: 'wine', label: 'Picpoul' },
    { icon: 'sea', label: 'Étangs' },
    { icon: 'oyster', label: 'Bouzigues' },
  ],
  '35': [
    { icon: 'crepe', label: 'Galette' },
    { icon: 'sea', label: 'Saint-Malo' },
    { icon: 'cider', label: 'Cidre' },
  ],
  '36': [
    { icon: 'cheese', label: 'Valençay' },
    { icon: 'castle', label: 'Val de Loire' },
    { icon: 'wheat', label: 'Brenne' },
  ],
  '37': [
    { icon: 'castle', label: 'Châteaux' },
    { icon: 'wine', label: 'Vouvray' },
    { icon: 'cheese', label: 'Chèvre' },
  ],
  '38': [
    { icon: 'walnut', label: 'Noix' },
    { icon: 'ski', label: 'Alpes' },
    { icon: 'mountain', label: 'Chartreuse' },
  ],
  '39': [
    { icon: 'wine', label: 'Vin jaune' },
    { icon: 'cheese', label: 'Comté' },
    { icon: 'forest', label: 'Jura' },
  ],
  '40': [
    { icon: 'forest', label: 'Pins' },
    { icon: 'duck', label: 'Canard' },
    { icon: 'sea', label: "Côte d'Argent" },
  ],
  '41': [
    { icon: 'castle', label: 'Chambord' },
    { icon: 'wine', label: 'Cheverny' },
    { icon: 'cheese', label: 'Selles-sur-Cher' },
  ],
  '42': [
    { icon: 'textile', label: 'Ruban' },
    { icon: 'coal', label: 'Bassin' },
    { icon: 'cheese', label: 'Fourme' },
  ],
  '43': [
    { icon: 'lentil', label: 'Lentille' },
    { icon: 'lace', label: 'Dentelle' },
    { icon: 'cathedral', label: 'Le Puy' },
  ],
  '44': [
    { icon: 'salt', label: 'Guérande' },
    { icon: 'river', label: 'Estuaire' },
    { icon: 'butter', label: 'Beurre' },
  ],
  '45': [
    { icon: 'barrel', label: 'Vinaigre' },
    { icon: 'castle', label: 'Loire' },
    { icon: 'flower', label: 'Rose' },
  ],
  '46': [
    { icon: 'wine', label: 'Cahors' },
    { icon: 'truffle', label: 'Truffe' },
    { icon: 'walnut', label: 'Noix' },
  ],
  '47': [
    { icon: 'prune', label: 'Pruneau' },
    { icon: 'strawberry', label: 'Fraise' },
    { icon: 'wine', label: 'Côtes' },
  ],
  '48': [
    { icon: 'cow', label: 'Aubrac' },
    { icon: 'cheese', label: 'Aligot' },
    { icon: 'mountain', label: 'Causses' },
  ],
  '49': [
    { icon: 'wine', label: 'Anjou' },
    { icon: 'castle', label: 'Forteresse' },
    { icon: 'flower', label: 'Rose' },
  ],
  '50': [
    { icon: 'sea', label: 'Mont-Saint-Michel' },
    { icon: 'oyster', label: 'Huître' },
    { icon: 'cow', label: 'Normande' },
  ],
  '51': [
    { icon: 'champagne', label: 'Champagne' },
    { icon: 'cathedral', label: 'Reims' },
    { icon: 'wheat', label: 'Craie' },
  ],
  '52': [
    { icon: 'knife', label: 'Nogent' },
    { icon: 'cheese', label: 'Langres' },
    { icon: 'forest', label: 'Plateau' },
  ],
  '53': [
    { icon: 'cow', label: 'Mayenne' },
    { icon: 'cider', label: 'Cidre' },
    { icon: 'castle', label: 'Laval' },
  ],
  '54': [
    { icon: 'crystal', label: 'Baccarat' },
    { icon: 'flower', label: 'Bergamote' },
    { icon: 'cathedral', label: 'Nancy' },
  ],
  '55': [
    { icon: 'forest', label: 'Argonne' },
    { icon: 'cherry', label: 'Groseille' },
    { icon: 'cathedral', label: 'Verdun' },
  ],
  '56': [
    { icon: 'oyster', label: 'Huître' },
    { icon: 'sea', label: 'Golfe' },
    { icon: 'castle', label: 'Mégalithes' },
  ],
  '57': [
    { icon: 'crystal', label: 'Cristal' },
    { icon: 'beer', label: 'Bière' },
    { icon: 'cathedral', label: 'Metz' },
  ],
  '58': [
    { icon: 'ceramic', label: 'Faïence' },
    { icon: 'wine', label: 'Pouilly' },
    { icon: 'river', label: 'Loire' },
  ],
  '59': [
    { icon: 'beer', label: 'Bière' },
    { icon: 'textile', label: 'Textile' },
    { icon: 'cheese', label: 'Maroilles' },
  ],
  '60': [
    { icon: 'cathedral', label: 'Beauvais' },
    { icon: 'forest', label: 'Halatte' },
    { icon: 'ceramic', label: 'Faïence' },
  ],
  '61': [
    { icon: 'lace', label: 'Dentelle' },
    { icon: 'cider', label: 'Cidre' },
    { icon: 'forest', label: 'Perche' },
  ],
  '62': [
    { icon: 'sea', label: 'Opale' },
    { icon: 'coal', label: 'Bassin' },
    { icon: 'lighthouse', label: 'Gris-Nez' },
  ],
  '63': [
    { icon: 'volcano', label: 'Chaîne des Puys' },
    { icon: 'cheese', label: 'Saint-Nectaire' },
    { icon: 'river', label: 'Volvic' },
  ],
  '64': [
    { icon: 'beret', label: 'Béret' },
    { icon: 'cheese', label: 'Ossau-Iraty' },
    { icon: 'duck', label: 'Bayonne' },
  ],
  '65': [
    { icon: 'mountain', label: 'Pic du Midi' },
    { icon: 'ski', label: 'Pyrénées' },
    { icon: 'sheep', label: 'Barèges' },
  ],
  '66': [
    { icon: 'wine', label: 'Banyuls' },
    { icon: 'sea', label: 'Côte vermeille' },
    { icon: 'fish', label: 'Anchois' },
  ],
  '67': [
    { icon: 'cathedral', label: 'Notre-Dame' },
    { icon: 'wine', label: 'Riesling' },
    { icon: 'beer', label: 'Bière' },
  ],
  '68': [
    { icon: 'wine', label: 'Alsace' },
    { icon: 'cheese', label: 'Munster' },
    { icon: 'mountain', label: 'Vosges' },
  ],
  '69': [
    { icon: 'wine', label: 'Beaujolais' },
    { icon: 'textile', label: 'Soie' },
    { icon: 'castle', label: 'Fourvière' },
  ],
  '70': [
    { icon: 'cherry', label: 'Kirsch' },
    { icon: 'forest', label: 'Vosges' },
    { icon: 'cheese', label: 'Comté' },
  ],
  '71': [
    { icon: 'wine', label: 'Mâcon' },
    { icon: 'cow', label: 'Charolais' },
    { icon: 'castle', label: 'Cluny' },
  ],
  '72': [
    { icon: 'chicken', label: 'Rillettes' },
    { icon: 'castle', label: 'Le Mans' },
    { icon: 'apple', label: 'Pomme' },
  ],
  '73': [
    { icon: 'ski', label: 'Stations' },
    { icon: 'cheese', label: 'Beaufort' },
    { icon: 'wine', label: 'Savoie' },
  ],
  '74': [
    { icon: 'ski', label: 'Mont-Blanc' },
    { icon: 'cheese', label: 'Reblochon' },
    { icon: 'mountain', label: 'Lac' },
  ],
  '75': [
    { icon: 'cathedral', label: 'Notre-Dame' },
    { icon: 'textile', label: 'Mode' },
    { icon: 'river', label: 'Seine' },
  ],
  '76': [
    { icon: 'cider', label: 'Cidre' },
    { icon: 'cheese', label: 'Neufchâtel' },
    { icon: 'lighthouse', label: 'Falaises' },
  ],
  '77': [
    { icon: 'cheese', label: 'Brie' },
    { icon: 'castle', label: 'Fontainebleau' },
    { icon: 'wheat', label: 'Blé' },
  ],
  '78': [
    { icon: 'castle', label: 'Versailles' },
    { icon: 'forest', label: 'Rambouillet' },
    { icon: 'apple', label: 'Verger' },
  ],
  '79': [
    { icon: 'cheese', label: 'Chabichou' },
    { icon: 'butter', label: 'Beurre' },
    { icon: 'flower', label: 'Angélique' },
  ],
  '80': [
    { icon: 'cathedral', label: 'Amiens' },
    { icon: 'sea', label: 'Baie' },
    { icon: 'duck', label: 'Hortillonnages' },
  ],
  '81': [
    { icon: 'cathedral', label: 'Albi' },
    { icon: 'wine', label: 'Gaillac' },
    { icon: 'garlic', label: 'Ail' },
  ],
  '82': [
    { icon: 'grape', label: 'Chasselas' },
    { icon: 'garlic', label: 'Ail' },
    { icon: 'melon', label: 'Melon' },
  ],
  '83': [
    { icon: 'wine', label: 'Rosé' },
    { icon: 'sea', label: 'Rade' },
    { icon: 'olive', label: 'Olive' },
  ],
  '84': [
    { icon: 'melon', label: 'Melon' },
    { icon: 'nougat', label: 'Nougat' },
    { icon: 'wine', label: 'Châteauneuf' },
  ],
  '85': [
    { icon: 'sea', label: 'Côte' },
    { icon: 'lentil', label: 'Mogette' },
    { icon: 'castle', label: 'Puy du Fou' },
  ],
  '86': [
    { icon: 'castle', label: 'Futuroscope' },
    { icon: 'cheese', label: 'Chèvre' },
    { icon: 'wine', label: 'Haut-Poitou' },
  ],
  '87': [
    { icon: 'ceramic', label: 'Porcelaine' },
    { icon: 'cow', label: 'Limousin' },
    { icon: 'chestnut', label: 'Châtaigne' },
  ],
  '88': [
    { icon: 'mountain', label: 'Ballons' },
    { icon: 'cheese', label: 'Munster' },
    { icon: 'spa', label: 'Vittel' },
  ],
  '89': [
    { icon: 'wine', label: 'Chablis' },
    { icon: 'cherry', label: 'Cerise' },
    { icon: 'cathedral', label: 'Auxerre' },
  ],
  '90': [
    { icon: 'castle', label: 'Lion' },
    { icon: 'textile', label: 'Industrie' },
    { icon: 'forest', label: 'Vosges' },
  ],
  '91': [
    { icon: 'forest', label: 'Sénart' },
    { icon: 'wheat', label: 'Plaine' },
    { icon: 'castle', label: 'Courances' },
  ],
  '92': [
    { icon: 'castle', label: 'La Défense' },
    { icon: 'ceramic', label: 'Sèvres' },
    { icon: 'river', label: 'Seine' },
  ],
  '93': [
    { icon: 'cathedral', label: 'Basilique' },
    { icon: 'plane', label: 'Aéroport' },
    { icon: 'flower', label: 'Marchés' },
  ],
  '94': [
    { icon: 'flower', label: 'Roses' },
    { icon: 'river', label: 'Marne' },
    { icon: 'castle', label: 'Vincennes' },
  ],
  '95': [
    { icon: 'forest', label: 'Vexin' },
    { icon: 'castle', label: 'Auvers' },
    { icon: 'wheat', label: 'Plaine' },
  ],
  '971': [
    { icon: 'banana', label: 'Banane' },
    { icon: 'sugar', label: 'Canne' },
    { icon: 'volcano', label: 'Soufrière' },
    { icon: 'beach', label: 'Plages' },
  ],
  '972': [
    { icon: 'rum', label: 'Rhum' },
    { icon: 'banana', label: 'Banane' },
    { icon: 'volcano', label: 'Pelée' },
    { icon: 'flower', label: 'Fleurs' },
  ],
  '973': [
    { icon: 'rocket', label: 'Spatial' },
    { icon: 'forest', label: 'Amazonie' },
    { icon: 'river', label: 'Fleuve' },
  ],
  '974': [
    { icon: 'volcano', label: 'Piton' },
    { icon: 'vanilla', label: 'Vanille' },
    { icon: 'rum', label: 'Rhum' },
    { icon: 'beach', label: 'Lagon' },
  ],
  '975': [
    { icon: 'ship', label: 'Morutiers' },
    { icon: 'fish', label: 'Pêche' },
    { icon: 'mountain', label: 'Glace' },
  ],
  '976': [
    { icon: 'flower', label: 'Ylang-ylang' },
    { icon: 'beach', label: 'Lagon' },
    { icon: 'vanilla', label: 'Vanille' },
  ],
  '977': [
    { icon: 'beach', label: 'Anse' },
    { icon: 'sea', label: 'Caraïbe' },
    { icon: 'rum', label: 'Rhum' },
  ],
  '978': [
    { icon: 'beach', label: 'Baie' },
    { icon: 'sea', label: 'Lagon' },
    { icon: 'salt', label: 'Salines' },
  ],
  '984': [
    { icon: 'ship', label: 'Marion Dufresne' },
    { icon: 'mountain', label: 'Glace' },
    { icon: 'fish', label: 'Pêche' },
  ],
  '986': [
    { icon: 'palm', label: 'Cocotier' },
    { icon: 'sea', label: 'Lagon' },
    { icon: 'textile', label: 'Tapa' },
  ],
  '987': [
    { icon: 'pearl', label: 'Perle' },
    { icon: 'vanilla', label: 'Vanille' },
    { icon: 'flower', label: 'Tiaré' },
    { icon: 'beach', label: 'Lagon' },
  ],
  '988': [
    { icon: 'beach', label: 'Lagon' },
    { icon: 'palm', label: 'Pins colonnaires' },
    { icon: 'ship', label: 'Nickel' },
  ],
}
