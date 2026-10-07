/** 2–3 pictos de spécialité par département (recto). */
import type { PictoId } from '../cards/pictos'

export type Specialty = { icon: PictoId; label: string }

export const DEPT_PICTOS: Record<string, Specialty[]> = {
  '01': [
    { icon: 'chicken', label: 'Poulet de Bresse' },
    { icon: 'butter', label: 'Beurre' },
  ],
  '02': [
    { icon: 'cathedral', label: 'Cathédrales' },
    { icon: 'wheat', label: 'Blés' },
  ],
  '03': [
    { icon: 'forest', label: 'Forêts' },
    { icon: 'cow', label: 'Élevage' },
  ],
  '04': [
    { icon: 'lavender', label: 'Lavande' },
    { icon: 'honey', label: 'Miel' },
  ],
  '05': [
    { icon: 'ski', label: 'Ski' },
    { icon: 'sheep', label: 'Alpages' },
  ],
  '06': [
    { icon: 'olive', label: 'Olivier' },
    { icon: 'beach', label: 'Côte d’Azur' },
  ],
  '07': [
    { icon: 'forest', label: 'Châtaigne' },
    { icon: 'wine', label: 'Côtes du Rhône' },
  ],
  '08': [
    { icon: 'forest', label: 'Ardennes' },
    { icon: 'knife', label: 'Coutellerie' },
  ],
  '09': [
    { icon: 'cow', label: 'Fromage' },
    { icon: 'ski', label: 'Pyrénées' },
  ],
  '10': [
    { icon: 'knife', label: 'Coutellerie' },
    { icon: 'champagne', label: 'Champagne' },
  ],
  '11': [
    { icon: 'castle', label: 'Cité de Carcassonne' },
    { icon: 'wine', label: 'Corbières' },
  ],
  '12': [
    { icon: 'cheese', label: 'Roquefort' },
    { icon: 'sheep', label: 'Causses' },
  ],
  '13': [
    { icon: 'soap', label: 'Savon de Marseille' },
    { icon: 'sea', label: 'Méditerranée' },
  ],
  '14': [
    { icon: 'cheese', label: 'Camembert' },
    { icon: 'cider', label: 'Cidre' },
    { icon: 'apple', label: 'Pommes' },
  ],
  '15': [
    { icon: 'cheese', label: 'Cantal' },
    { icon: 'cow', label: 'Salers' },
  ],
  '16': [
    { icon: 'barrel', label: 'Cognac' },
    { icon: 'grape', label: 'Vignoble' },
  ],
  '17': [
    { icon: 'oyster', label: 'Huîtres' },
    { icon: 'sea', label: 'Atlantique' },
  ],
  '18': [
    { icon: 'castle', label: 'Châteaux' },
    { icon: 'wheat', label: 'Céréales' },
  ],
  '19': [
    { icon: 'oak', label: 'Chêne' },
    { icon: 'cow', label: 'Élevage' },
  ],
  '2A': [
    { icon: 'forest', label: 'Châtaigne' },
    { icon: 'sea', label: 'Méditerranée' },
  ],
  '2B': [
    { icon: 'wine', label: 'Patrimonio' },
    { icon: 'sheep', label: 'Brocciu' },
  ],
  '21': [
    { icon: 'mustard', label: 'Moutarde' },
    { icon: 'wine', label: 'Bourgogne' },
  ],
  '22': [
    { icon: 'crepe', label: 'Galettes' },
    { icon: 'sea', label: 'Côte' },
  ],
  '23': [
    { icon: 'forest', label: 'Limousin' },
    { icon: 'cow', label: 'Élevage' },
  ],
  '24': [
    { icon: 'duck', label: 'Canard' },
    { icon: 'walnut', label: 'Noix' },
  ],
  '25': [
    { icon: 'watch', label: 'Horlogerie' },
    { icon: 'cheese', label: 'Comté' },
  ],
  '26': [
    { icon: 'wine', label: 'Hermitage' },
    { icon: 'lavender', label: 'Drôme' },
  ],
  '27': [
    { icon: 'apple', label: 'Pommes' },
    { icon: 'butter', label: 'Produits laitiers' },
  ],
  '28': [
    { icon: 'cathedral', label: 'Cathédrale' },
    { icon: 'wheat', label: 'Beauce' },
  ],
  '29': [
    { icon: 'lighthouse', label: 'Phares' },
    { icon: 'crepe', label: 'Crêpes' },
    { icon: 'sea', label: 'Océan' },
  ],
  '30': [
    { icon: 'olive', label: 'Olives' },
    { icon: 'castle', label: 'Pont du Gard' },
  ],
  '31': [
    { icon: 'flower', label: 'Violette' },
    { icon: 'airplane', label: 'Aérospatiale' },
  ],
  '32': [
    { icon: 'duck', label: 'Foie gras' },
    { icon: 'grape', label: 'Armagnac' },
  ],
  '33': [
    { icon: 'wine', label: 'Bordeaux' },
    { icon: 'oyster', label: 'Arcachon' },
  ],
  '34': [
    { icon: 'wine', label: 'Languedoc' },
    { icon: 'beach', label: 'Littoral' },
  ],
  '35': [
    { icon: 'crepe', label: 'Galettes' },
    { icon: 'butter', label: 'Beurre' },
  ],
  '36': [
    { icon: 'castle', label: 'Châteaux' },
    { icon: 'goat', label: 'Chèvre' },
  ],
  '37': [
    { icon: 'wine', label: 'Vouvray' },
    { icon: 'castle', label: 'Loire' },
  ],
  '38': [
    { icon: 'ski', label: 'Alpes' },
    { icon: 'walnut', label: 'Noix de Grenoble' },
  ],
  '39': [
    { icon: 'cheese', label: 'Comté' },
    { icon: 'wine', label: 'Vin jaune' },
  ],
  '40': [
    { icon: 'forest', label: 'Landes' },
    { icon: 'duck', label: 'Foie gras' },
  ],
  '41': [
    { icon: 'castle', label: 'Chambord' },
    { icon: 'wine', label: 'Loire' },
  ],
  '42': [
    { icon: 'ribbon', label: 'Ruban' },
    { icon: 'coal', label: 'Mine' },
  ],
  '43': [
    { icon: 'mustard', label: 'Lentille' },
    { icon: 'volcano', label: 'Volcans' },
  ],
  '44': [
    { icon: 'salt', label: 'Guérande' },
    { icon: 'ship', label: 'Port' },
  ],
  '45': [
    { icon: 'barrel', label: 'Vinaigre' },
    { icon: 'wheat', label: 'Céréales' },
  ],
  '46': [
    { icon: 'wine', label: 'Cahors' },
    { icon: 'mushroom', label: 'Truffe' },
  ],
  '47': [
    { icon: 'plum', label: 'Pruneau' },
    { icon: 'duck', label: 'Canard' },
  ],
  '48': [
    { icon: 'sheep', label: 'Aubrac' },
    { icon: 'forest', label: 'Cévennes' },
  ],
  '49': [
    { icon: 'castle', label: 'Ardoise / châteaux' },
    { icon: 'wine', label: 'Anjou' },
  ],
  '50': [
    { icon: 'butter', label: 'Beurre' },
    { icon: 'sea', label: 'Cotentin' },
  ],
  '51': [
    { icon: 'champagne', label: 'Champagne' },
    { icon: 'cookie', label: 'Biscuits' },
  ],
  '52': [
    { icon: 'knife', label: 'Couteaux' },
    { icon: 'cheese', label: 'Langres' },
  ],
  '53': [
    { icon: 'wheat', label: 'Lin' },
    { icon: 'cow', label: 'Élevage' },
  ],
  '54': [
    { icon: 'cheese', label: 'Quiche' },
    { icon: 'crystal', label: 'Cristal' },
  ],
  '55': [
    { icon: 'sword', label: 'Mémoire' },
    { icon: 'forest', label: 'Argonne' },
  ],
  '56': [
    { icon: 'crepe', label: 'Crêpes' },
    { icon: 'oyster', label: 'Huîtres' },
  ],
  '57': [
    { icon: 'cherry', label: 'Mirabelle' },
    { icon: 'crystal', label: 'Cristal' },
  ],
  '58': [
    { icon: 'pottery', label: 'Faïence' },
    { icon: 'wine', label: 'Pouilly' },
  ],
  '59': [
    { icon: 'fries', label: 'Frites' },
    { icon: 'beer', label: 'Bières' },
  ],
  '60': [
    { icon: 'cathedral', label: 'Cathédrale' },
    { icon: 'forest', label: 'Compiègne' },
  ],
  '61': [
    { icon: 'horse', label: 'Chevaux' },
    { icon: 'cheese', label: 'Camembert' },
  ],
  '62': [
    { icon: 'beer', label: 'Bières' },
    { icon: 'sea', label: 'Côte d’Opale' },
  ],
  '63': [
    { icon: 'volcano', label: 'Puy de Dôme' },
    { icon: 'cheese', label: 'Saint-Nectaire' },
  ],
  '64': [
    { icon: 'beret', label: 'Béret' },
    { icon: 'pepper', label: 'Piment d’Espelette' },
  ],
  '65': [
    { icon: 'ski', label: 'Pyrénées' },
    { icon: 'pig', label: 'Noir de Bigorre' },
  ],
  '66': [
    { icon: 'wine', label: 'Banyuls' },
    { icon: 'beach', label: 'Côte Vermeille' },
  ],
  '67': [
    { icon: 'pretzel', label: 'Bretzel' },
    { icon: 'wine', label: 'Riesling' },
  ],
  '68': [
    { icon: 'stork', label: 'Cigogne' },
    { icon: 'wine', label: 'Alsace' },
  ],
  '69': [
    { icon: 'silk', label: 'Soie' },
    { icon: 'wine', label: 'Beaujolais' },
    { icon: 'coq', label: 'Lyon' },
  ],
  '70': [
    { icon: 'cheese', label: 'Comté' },
    { icon: 'forest', label: 'Vosges' },
  ],
  '71': [
    { icon: 'wine', label: 'Mâconnais' },
    { icon: 'cow', label: 'Charolais' },
  ],
  '72': [
    { icon: 'pig', label: 'Rillettes' },
    { icon: 'race', label: '24 Heures' },
  ],
  '73': [
    { icon: 'ski', label: 'Alpes' },
    { icon: 'cheese', label: 'Beaufort' },
  ],
  '74': [
    { icon: 'ski', label: 'Alpes' },
    { icon: 'cheese', label: 'Reblochon' },
  ],
  '75': [
    { icon: 'eiffel', label: 'Tour Eiffel' },
    { icon: 'baguette', label: 'Baguette' },
    { icon: 'croissant', label: 'Croissant' },
  ],
  '76': [
    { icon: 'apple', label: 'Pommes' },
    { icon: 'ship', label: 'Port' },
  ],
  '77': [
    { icon: 'cheese', label: 'Brie' },
    { icon: 'castle', label: 'Fontainebleau' },
  ],
  '78': [
    { icon: 'castle', label: 'Versailles' },
    { icon: 'fleur', label: 'Île-de-France' },
  ],
  '79': [
    { icon: 'butter', label: 'Beurre' },
    { icon: 'goat', label: 'Chèvre' },
  ],
  '80': [
    { icon: 'cathedral', label: 'Cathédrale' },
    { icon: 'duck', label: 'Canard' },
  ],
  '81': [
    { icon: 'flower', label: 'Pastel' },
    { icon: 'cathedral', label: 'Albi' },
  ],
  '82': [
    { icon: 'garlic', label: 'Ail rose' },
    { icon: 'cow', label: 'Élevage' },
  ],
  '83': [
    { icon: 'ship', label: 'Marine' },
    { icon: 'lavender', label: 'Provence' },
    { icon: 'olive', label: 'Olivier' },
  ],
  '84': [
    { icon: 'lavender', label: 'Lavande' },
    { icon: 'wine', label: 'Côtes du Rhône' },
  ],
  '85': [
    { icon: 'salt', label: 'Marais salants' },
    { icon: 'sea', label: 'Vendée' },
  ],
  '86': [
    { icon: 'goat', label: 'Chabichou' },
    { icon: 'atom', label: 'Futuroscope' },
  ],
  '87': [
    { icon: 'crystal', label: 'Porcelaine' },
    { icon: 'cow', label: 'Limousin' },
  ],
  '88': [
    { icon: 'forest', label: 'Vosges' },
    { icon: 'cheese', label: 'Munster' },
  ],
  '89': [
    { icon: 'wine', label: 'Chablis' },
    { icon: 'cherry', label: 'Cerises' },
  ],
  '90': [
    { icon: 'lion', label: 'Lion' },
    { icon: 'watch', label: 'Horlogerie' },
  ],
  '91': [
    { icon: 'atom', label: 'Recherche' },
    { icon: 'fleur', label: 'Île-de-France' },
  ],
  '92': [
    { icon: 'briefcase', label: 'La Défense' },
    { icon: 'fleur', label: 'Île-de-France' },
  ],
  '93': [
    { icon: 'film', label: 'Cinéma' },
    { icon: 'fleur', label: 'Île-de-France' },
  ],
  '94': [
    { icon: 'rose', label: 'Roses' },
    { icon: 'fleur', label: 'Île-de-France' },
  ],
  '95': [
    { icon: 'airplane', label: 'Roissy' },
    { icon: 'castle', label: 'Châteaux' },
  ],
  '971': [
    { icon: 'palm', label: 'Antilles' },
    { icon: 'barrel', label: 'Rhum' },
    { icon: 'beach', label: 'Plages' },
  ],
  '972': [
    { icon: 'palm', label: 'Antilles' },
    { icon: 'barrel', label: 'Rhum' },
    { icon: 'volcano', label: 'Pelée' },
  ],
  '973': [
    { icon: 'forest', label: 'Amazonie' },
    { icon: 'gold', label: 'Or' },
  ],
  '974': [
    { icon: 'volcano', label: 'Piton' },
    { icon: 'vanilla', label: 'Vanille' },
    { icon: 'beach', label: 'Lagons' },
  ],
  '976': [
    { icon: 'flower', label: 'Ylang-ylang' },
    { icon: 'beach', label: 'Lagon' },
  ],
  '975': [
    { icon: 'fish', label: 'Morue' },
    { icon: 'ship', label: 'Pêche' },
  ],
  '977': [
    { icon: 'beach', label: 'Plages' },
    { icon: 'pearl', label: 'Luxe' },
  ],
  '978': [
    { icon: 'beach', label: 'Plages' },
    { icon: 'sea', label: 'Caraïbes' },
  ],
  '984': [
    { icon: 'penguin', label: 'Austral' },
    { icon: 'ship', label: 'Base' },
  ],
  '986': [
    { icon: 'palm', label: 'Pacifique' },
    { icon: 'pearl', label: 'Océanie' },
  ],
  '987': [
    { icon: 'pearl', label: 'Perle' },
    { icon: 'palm', label: 'Polynésie' },
    { icon: 'beach', label: 'Lagons' },
  ],
  '988': [
    { icon: 'metal', label: 'Nickel' },
    { icon: 'palm', label: 'Pacifique' },
  ],
}
