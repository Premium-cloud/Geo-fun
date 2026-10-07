/** 3 pictos de spécialité par département (recto). */
import type { PictoId } from '../cards/pictos'

export type Specialty = { icon: PictoId; label: string }

export const DEPT_PICTOS: Record<string, Specialty[]> = {
  '01': [
    { icon: 'chicken', label: 'Poulet de Bresse' },
    { icon: 'cheese', label: 'Comté' },
    { icon: 'wine', label: 'Bugey' },
  ],
  '02': [
    { icon: 'cathedral', label: 'Cathédrales' },
    { icon: 'wheat', label: 'Blés' },
    { icon: 'flower', label: 'Picardie' }
  ],
  '03': [
    { icon: 'forest', label: 'Forêts' },
    { icon: 'cow', label: 'Élevage' },
    { icon: 'forest', label: 'Bourbonnais' }
  ],
  '04': [
    { icon: 'lavender', label: 'Lavande' },
    { icon: 'honey', label: 'Miel' },
    { icon: 'olive', label: 'Provence' }
  ],
  '05': [
    { icon: 'ski', label: 'Ski' },
    { icon: 'sheep', label: 'Alpages' },
    { icon: 'honey', label: 'Miel' },
  ],
  '06': [
    { icon: 'olive', label: 'Olivier' },
    { icon: 'beach', label: 'Côte d’Azur' },
    { icon: 'lavender', label: 'Mimosa' }
  ],
  '07': [
    { icon: 'forest', label: 'Châtaigne' },
    { icon: 'wine', label: 'Côtes du Rhône' },
    { icon: 'grape', label: 'Ardèche' }
  ],
  '08': [
    { icon: 'forest', label: 'Ardennes' },
    { icon: 'knife', label: 'Coutellerie' },
    { icon: 'cow', label: 'Sanglier' }
  ],
  '09': [
    { icon: 'cow', label: 'Fromage' },
    { icon: 'ski', label: 'Pyrénées' },
    { icon: 'forest', label: 'Ariège' }
  ],
  '10': [
    { icon: 'knife', label: 'Coutellerie' },
    { icon: 'champagne', label: 'Champagne' },
    { icon: 'cheese', label: 'Chaource' }
  ],
  '11': [
    { icon: 'castle', label: 'Cité de Carcassonne' },
    { icon: 'wine', label: 'Corbières' },
    { icon: 'olive', label: 'Corbières' }
  ],
  '12': [
    { icon: 'cheese', label: 'Roquefort' },
    { icon: 'sheep', label: 'Causses' },
    { icon: 'cow', label: 'Laguiole' }
  ],
  '13': [
    { icon: 'soap', label: 'Savon de Marseille' },
    { icon: 'sea', label: 'Méditerranée' },
    { icon: 'fish', label: 'Bouillabaisse' }
  ],
  '14': [
    { icon: 'cheese', label: 'Camembert' },
    { icon: 'cider', label: 'Cidre' },
    { icon: 'apple', label: 'Pommes' },
  ],
  '15': [
    { icon: 'cheese', label: 'Cantal' },
    { icon: 'cow', label: 'Salers' },
    { icon: 'volcano', label: 'Cantal' }
  ],
  '16': [
    { icon: 'barrel', label: 'Cognac' },
    { icon: 'grape', label: 'Vignoble' },
    { icon: 'grape', label: 'Pineau' }
  ],
  '17': [
    { icon: 'oyster', label: 'Huîtres' },
    { icon: 'sea', label: 'Atlantique' },
    { icon: 'ship', label: 'Ré' }
  ],
  '18': [
    { icon: 'castle', label: 'Châteaux' },
    { icon: 'wheat', label: 'Céréales' },
    { icon: 'wine', label: 'Sancerre' }
  ],
  '19': [
    { icon: 'oak', label: 'Chêne' },
    { icon: 'cow', label: 'Élevage' },
    { icon: 'forest', label: 'Corrèze' }
  ],
  '2A': [
    { icon: 'forest', label: 'Châtaigne' },
    { icon: 'sea', label: 'Méditerranée' },
    { icon: 'sheep', label: 'Brocciu' }
  ],
  '2B': [
    { icon: 'wine', label: 'Patrimonio' },
    { icon: 'sheep', label: 'Brocciu' },
    { icon: 'sea', label: 'Cap Corse' }
  ],
  '21': [
    { icon: 'mustard', label: 'Moutarde' },
    { icon: 'wine', label: 'Bourgogne' },
    { icon: 'grape', label: 'Côte-d’Or' }
  ],
  '22': [
    { icon: 'crepe', label: 'Galettes' },
    { icon: 'sea', label: 'Côte' },
    { icon: 'lighthouse', label: 'Granit' }
  ],
  '23': [
    { icon: 'forest', label: 'Limousin' },
    { icon: 'cow', label: 'Élevage' },
    { icon: 'oak', label: 'Creuse' }
  ],
  '24': [
    { icon: 'duck', label: 'Canard' },
    { icon: 'walnut', label: 'Noix' },
    { icon: 'wine', label: 'Périgord' }
  ],
  '25': [
    { icon: 'watch', label: 'Horlogerie' },
    { icon: 'cheese', label: 'Comté' },
    { icon: 'ski', label: 'Jura' }
  ],
  '26': [
    { icon: 'wine', label: 'Hermitage' },
    { icon: 'lavender', label: 'Drôme' },
    { icon: 'olive', label: 'Nyons' }
  ],
  '27': [
    { icon: 'apple', label: 'Pommes' },
    { icon: 'butter', label: 'Produits laitiers' },
    { icon: 'cider', label: 'Normandie' }
  ],
  '28': [
    { icon: 'cathedral', label: 'Cathédrale' },
    { icon: 'wheat', label: 'Beauce' },
    { icon: 'castle', label: 'Perche' }
  ],
  '29': [
    { icon: 'lighthouse', label: 'Phares' },
    { icon: 'crepe', label: 'Crêpes' },
    { icon: 'sea', label: 'Océan' },
  ],
  '30': [
    { icon: 'olive', label: 'Olives' },
    { icon: 'castle', label: 'Pont du Gard' },
    { icon: 'grape', label: 'Costières' }
  ],
  '31': [
    { icon: 'flower', label: 'Violette' },
    { icon: 'airplane', label: 'Aérospatiale' },
    { icon: 'duck', label: 'Cassoulet' }
  ],
  '32': [
    { icon: 'duck', label: 'Foie gras' },
    { icon: 'grape', label: 'Armagnac' },
    { icon: 'wine', label: 'Madiran' }
  ],
  '33': [
    { icon: 'wine', label: 'Bordeaux' },
    { icon: 'oyster', label: 'Arcachon' },
    { icon: 'barrel', label: 'Médoc' }
  ],
  '34': [
    { icon: 'wine', label: 'Languedoc' },
    { icon: 'beach', label: 'Littoral' },
    { icon: 'oyster', label: 'Bouzigues' }
  ],
  '35': [
    { icon: 'crepe', label: 'Galettes' },
    { icon: 'butter', label: 'Beurre' },
    { icon: 'cider', label: 'Cidre' }
  ],
  '36': [
    { icon: 'castle', label: 'Châteaux' },
    { icon: 'goat', label: 'Chèvre' },
    { icon: 'forest', label: 'Brenne' }
  ],
  '37': [
    { icon: 'wine', label: 'Vouvray' },
    { icon: 'castle', label: 'Loire' },
    { icon: 'castle', label: 'Rabelais' }
  ],
  '38': [
    { icon: 'ski', label: 'Alpes' },
    { icon: 'walnut', label: 'Noix de Grenoble' },
    { icon: 'forest', label: 'Chartreuse' }
  ],
  '39': [
    { icon: 'cheese', label: 'Comté' },
    { icon: 'wine', label: 'Vin jaune' },
    { icon: 'ski', label: 'Jura' }
  ],
  '40': [
    { icon: 'forest', label: 'Landes' },
    { icon: 'duck', label: 'Foie gras' },
    { icon: 'beach', label: 'Dune' }
  ],
  '41': [
    { icon: 'castle', label: 'Chambord' },
    { icon: 'wine', label: 'Loire' },
    { icon: 'forest', label: 'Sologne' }
  ],
  '42': [
    { icon: 'ribbon', label: 'Ruban' },
    { icon: 'coal', label: 'Mine' },
    { icon: 'cow', label: 'Forez' }
  ],
  '43': [
    { icon: 'mustard', label: 'Lentille' },
    { icon: 'volcano', label: 'Volcans' },
    { icon: 'cheese', label: 'Velay' }
  ],
  '44': [
    { icon: 'salt', label: 'Guérande' },
    { icon: 'ship', label: 'Port' },
    { icon: 'wine', label: 'Muscadet' }
  ],
  '45': [
    { icon: 'barrel', label: 'Vinaigre' },
    { icon: 'wheat', label: 'Céréales' },
    { icon: 'castle', label: 'Loiret' }
  ],
  '46': [
    { icon: 'wine', label: 'Cahors' },
    { icon: 'mushroom', label: 'Truffe' },
    { icon: 'goat', label: 'Rocamadour' }
  ],
  '47': [
    { icon: 'plum', label: 'Pruneau' },
    { icon: 'duck', label: 'Canard' },
    { icon: 'wine', label: 'Buzet' }
  ],
  '48': [
    { icon: 'sheep', label: 'Aubrac' },
    { icon: 'forest', label: 'Cévennes' },
    { icon: 'cow', label: 'Lozère' }
  ],
  '49': [
    { icon: 'castle', label: 'Ardoise / châteaux' },
    { icon: 'wine', label: 'Anjou' },
    { icon: 'castle', label: 'Ardoise' }
  ],
  '50': [
    { icon: 'butter', label: 'Beurre' },
    { icon: 'sea', label: 'Cotentin' },
    { icon: 'ship', label: 'Mont-St-Michel' }
  ],
  '51': [
    { icon: 'champagne', label: 'Champagne' },
    { icon: 'cookie', label: 'Biscuits' },
    { icon: 'cathedral', label: 'Reims' }
  ],
  '52': [
    { icon: 'knife', label: 'Couteaux' },
    { icon: 'cheese', label: 'Langres' },
    { icon: 'forest', label: 'Nogent' }
  ],
  '53': [
    { icon: 'wheat', label: 'Lin' },
    { icon: 'cow', label: 'Élevage' },
    { icon: 'apple', label: 'Mayenne' }
  ],
  '54': [
    { icon: 'cheese', label: 'Quiche' },
    { icon: 'crystal', label: 'Cristal' },
    { icon: 'fleur', label: 'Nancy' }
  ],
  '55': [
    { icon: 'sword', label: 'Mémoire' },
    { icon: 'forest', label: 'Argonne' },
    { icon: 'sword', label: 'Verdun' }
  ],
  '56': [
    { icon: 'crepe', label: 'Crêpes' },
    { icon: 'oyster', label: 'Huîtres' },
    { icon: 'ship', label: 'Golfe' }
  ],
  '57': [
    { icon: 'cherry', label: 'Mirabelle' },
    { icon: 'crystal', label: 'Cristal' },
    { icon: 'pretzel', label: 'Moselle' }
  ],
  '58': [
    { icon: 'pottery', label: 'Faïence' },
    { icon: 'wine', label: 'Pouilly' },
    { icon: 'forest', label: 'Nivernais' }
  ],
  '59': [
    { icon: 'fries', label: 'Frites' },
    { icon: 'beer', label: 'Bières' },
    { icon: 'wheat', label: 'Ch’ti' }
  ],
  '60': [
    { icon: 'cathedral', label: 'Cathédrale' },
    { icon: 'forest', label: 'Compiègne' },
    { icon: 'castle', label: 'Chantilly' }
  ],
  '61': [
    { icon: 'horse', label: 'Chevaux' },
    { icon: 'cheese', label: 'Camembert' },
    { icon: 'apple', label: 'Perche' }
  ],
  '62': [
    { icon: 'beer', label: 'Bières' },
    { icon: 'sea', label: 'Côte d’Opale' },
    { icon: 'lighthouse', label: 'Opale' }
  ],
  '63': [
    { icon: 'volcano', label: 'Puy de Dôme' },
    { icon: 'cheese', label: 'Saint-Nectaire' },
    { icon: 'cow', label: 'Salers' }
  ],
  '64': [
    { icon: 'beret', label: 'Béret' },
    { icon: 'pepper', label: 'Piment d’Espelette' },
    { icon: 'wine', label: 'Jurançon' }
  ],
  '65': [
    { icon: 'ski', label: 'Pyrénées' },
    { icon: 'pig', label: 'Noir de Bigorre' },
    { icon: 'sheep', label: 'Bigorre' }
  ],
  '66': [
    { icon: 'wine', label: 'Banyuls' },
    { icon: 'beach', label: 'Côte Vermeille' },
    { icon: 'olive', label: 'Catalan' }
  ],
  '67': [
    { icon: 'pretzel', label: 'Bretzel' },
    { icon: 'wine', label: 'Riesling' },
    { icon: 'beer', label: 'Strasbourg' }
  ],
  '68': [
    { icon: 'stork', label: 'Cigogne' },
    { icon: 'wine', label: 'Alsace' },
    { icon: 'cheese', label: 'Munster' }
  ],
  '69': [
    { icon: 'silk', label: 'Soie' },
    { icon: 'wine', label: 'Beaujolais' },
    { icon: 'coq', label: 'Lyon' },
  ],
  '70': [
    { icon: 'cheese', label: 'Comté' },
    { icon: 'forest', label: 'Vosges' },
    { icon: 'cow', label: 'Charolais' }
  ],
  '71': [
    { icon: 'wine', label: 'Mâconnais' },
    { icon: 'cow', label: 'Charolais' },
    { icon: 'castle', label: 'Cluny' }
  ],
  '72': [
    { icon: 'pig', label: 'Rillettes' },
    { icon: 'race', label: '24 Heures' },
    { icon: 'horse', label: 'Sarthe' }
  ],
  '73': [
    { icon: 'ski', label: 'Alpes' },
    { icon: 'cheese', label: 'Beaufort' },
    { icon: 'cow', label: 'Tarentaise' }
  ],
  '74': [
    { icon: 'ski', label: 'Alpes' },
    { icon: 'cheese', label: 'Reblochon' },
    { icon: 'sea', label: 'Lac' }
  ],
  '75': [
    { icon: 'eiffel', label: 'Tour Eiffel' },
    { icon: 'baguette', label: 'Baguette' },
    { icon: 'croissant', label: 'Croissant' },
  ],
  '76': [
    { icon: 'apple', label: 'Pommes' },
    { icon: 'ship', label: 'Port' },
    { icon: 'cider', label: 'Cidre' }
  ],
  '77': [
    { icon: 'cheese', label: 'Brie' },
    { icon: 'castle', label: 'Fontainebleau' },
    { icon: 'forest', label: 'Fontainebleau' }
  ],
  '78': [
    { icon: 'castle', label: 'Versailles' },
    { icon: 'fleur', label: 'Île-de-France' },
    { icon: 'forest', label: 'Rambouillet' }
  ],
  '79': [
    { icon: 'butter', label: 'Beurre' },
    { icon: 'goat', label: 'Chèvre' },
    { icon: 'wheat', label: 'Niort' }
  ],
  '80': [
    { icon: 'cathedral', label: 'Cathédrale' },
    { icon: 'duck', label: 'Canard' },
    { icon: 'sea', label: 'Baie' }
  ],
  '81': [
    { icon: 'flower', label: 'Pastel' },
    { icon: 'cathedral', label: 'Albi' },
    { icon: 'wine', label: 'Gaillac' }
  ],
  '82': [
    { icon: 'garlic', label: 'Ail rose' },
    { icon: 'cow', label: 'Élevage' },
    { icon: 'wine', label: 'Fronton' }
  ],
  '83': [
    { icon: 'ship', label: 'Marine' },
    { icon: 'lavender', label: 'Provence' },
    { icon: 'olive', label: 'Olivier' },
  ],
  '84': [
    { icon: 'lavender', label: 'Lavande' },
    { icon: 'wine', label: 'Côtes du Rhône' },
    { icon: 'olive', label: 'Ventoux' }
  ],
  '85': [
    { icon: 'salt', label: 'Marais salants' },
    { icon: 'sea', label: 'Vendée' },
    { icon: 'ship', label: 'Noirmoutier' }
  ],
  '86': [
    { icon: 'goat', label: 'Chabichou' },
    { icon: 'atom', label: 'Futuroscope' },
    { icon: 'castle', label: 'Poitiers' }
  ],
  '87': [
    { icon: 'crystal', label: 'Porcelaine' },
    { icon: 'cow', label: 'Limousin' },
    { icon: 'oak', label: 'Limoges' }
  ],
  '88': [
    { icon: 'forest', label: 'Vosges' },
    { icon: 'cheese', label: 'Munster' },
    { icon: 'ski', label: 'Vosges' }
  ],
  '89': [
    { icon: 'wine', label: 'Chablis' },
    { icon: 'cherry', label: 'Cerises' },
    { icon: 'castle', label: 'Vézelay' }
  ],
  '90': [
    { icon: 'lion', label: 'Lion' },
    { icon: 'watch', label: 'Horlogerie' },
    { icon: 'forest', label: 'Ballon' }
  ],
  '91': [
    { icon: 'atom', label: 'Recherche' },
    { icon: 'fleur', label: 'Île-de-France' },
    { icon: 'forest', label: 'Essonne' }
  ],
  '92': [
    { icon: 'briefcase', label: 'La Défense' },
    { icon: 'fleur', label: 'Île-de-France' },
    { icon: 'eiffel', label: 'Paris proche' }
  ],
  '93': [
    { icon: 'film', label: 'Cinéma' },
    { icon: 'fleur', label: 'Île-de-France' },
    { icon: 'cathedral', label: 'Basilique' }
  ],
  '94': [
    { icon: 'rose', label: 'Roses' },
    { icon: 'fleur', label: 'Île-de-France' },
    { icon: 'castle', label: 'Vincennes' }
  ],
  '95': [
    { icon: 'airplane', label: 'Roissy' },
    { icon: 'castle', label: 'Châteaux' },
    { icon: 'forest', label: 'Vexin' }
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
    { icon: 'ship', label: 'Fleuve' }
  ],
  '974': [
    { icon: 'volcano', label: 'Piton' },
    { icon: 'vanilla', label: 'Vanille' },
    { icon: 'beach', label: 'Lagons' },
  ],
  '976': [
    { icon: 'flower', label: 'Ylang-ylang' },
    { icon: 'beach', label: 'Lagon' },
    { icon: 'palm', label: 'Récifs' }
  ],
  '975': [
    { icon: 'fish', label: 'Morue' },
    { icon: 'ship', label: 'Pêche' },
    { icon: 'sea', label: 'Terreneuve' }
  ],
  '977': [
    { icon: 'beach', label: 'Plages' },
    { icon: 'pearl', label: 'Luxe' },
    { icon: 'palm', label: 'Gustavia' }
  ],
  '978': [
    { icon: 'beach', label: 'Plages' },
    { icon: 'sea', label: 'Caraïbes' },
    { icon: 'palm', label: 'Lagons' }
  ],
  '984': [
    { icon: 'penguin', label: 'Austral' },
    { icon: 'ship', label: 'Base' },
    { icon: 'sea', label: 'Kerguelen' }
  ],
  '986': [
    { icon: 'palm', label: 'Pacifique' },
    { icon: 'pearl', label: 'Océanie' },
    { icon: 'beach', label: 'Uvea' }
  ],
  '987': [
    { icon: 'pearl', label: 'Perle' },
    { icon: 'palm', label: 'Polynésie' },
    { icon: 'beach', label: 'Lagons' },
  ],
  '988': [
    { icon: 'metal', label: 'Nickel' },
    { icon: 'palm', label: 'Pacifique' },
    { icon: 'beach', label: 'Nouméa' }
  ],
}
