/**
 * Génère src/data/territories/*.ts — recto par zone, verso pool pack.
 * Usage: node scripts/gen-territory-packs.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'

const VALID = new Set(
  `wheat,wine,cheese,croissant,fleur,baguette,palm,lavender,lighthouse,castle,olive,fish,cathedral,oyster,ship,grape,barrel,cow,coq,duck,scallop,honey,mustard,knife,apple,sea,champagne,cider,butter,ski,strawberry,chicken,forest,salt,cherry,pearl,volcano,beach,flower,sheep,goat,soap,oak,watch,airplane,ribbon,coal,cookie,crystal,fries,beer,horse,pepper,pig,pretzel,stork,race,garlic,lion,atom,briefcase,film,rose,gold,penguin,metal,factory,vanilla,sword,walnut,mushroom,plum,pottery,silk,beet,spa,mountain,chestnut,river,textile,calisson,truffle,clock,nougat,plane,lentil,lace,prune,ceramic,melon,banana,sugar,rum,rocket,eiffel,beret,crepe`.split(','),
)

function p(icon, label) {
  if (!VALID.has(icon)) throw new Error(`invalid picto "${icon}" (${label})`)
  return { icon, label }
}
function u(code, name, capital, a, b, c) {
  return { code, name, capital, pictos: [a, b, c] }
}

const BACK = {
  ch: 'cheese,cow,ski,mountain,watch,clock,grape,wine,honey,forest,oak,sheep,goat,river,crystal,castle,apple,cherry,wheat,butter,mushroom,duck,fish,ship,factory,metal,gold,ribbon,flower,rose,spa,cathedral,pottery,silk,horse,beer,barrel,knife,salt,plum',
  us: 'gold,film,palm,beach,airplane,rocket,horse,cow,wheat,oak,sea,ship,factory,briefcase,atom,race,mountain,ski,fish,apple,grape,wine,cheese,honey,forest,river,crystal,castle,pepper,pig,chicken,duck,flower,rose,melon,strawberry,cherry,metal,coal,clock',
  es: 'olive,grape,wine,castle,cathedral,beach,fish,sea,pepper,garlic,horse,rose,pottery,palm,melon,spa,sheep,goat,honey,wheat,pig,cheese,barrel,ship,flower,strawberry,cherry,apple,river,mountain,ski,gold,silk,lace,ribbon,sword,lion,duck,cow,factory',
  de: 'pretzel,beer,castle,oak,mountain,ski,forest,factory,clock,horse,wheat,lion,metal,mushroom,river,cow,pig,cheese,apple,cherry,honey,wine,grape,barrel,cathedral,duck,fish,sheep,goat,flower,rose,spa,knife,butter,salt,coal,gold,briefcase,race,ship',
  jp: 'flower,fleur,fish,volcano,mountain,sea,ship,castle,silk,crystal,airplane,pearl,plum,ribbon,rose,spa,pottery,ceramic,cherry,apple,honey,forest,river,oak,duck,goat,sheep,horse,sword,gold,metal,factory,clock,watch,beach,palm,grape,wine,mushroom,lace',
  ca: 'forest,ski,oak,fish,mountain,river,cow,wheat,ship,crystal,duck,honey,apple,castle,sheep,goat,cheese,butter,horse,pig,chicken,flower,rose,grape,wine,barrel,factory,gold,metal,coal,clock,airplane,beach,sea,pepper,melon,cherry,plum,mushroom,spa',
  br: 'palm,beach,banana,rum,sugar,fish,sea,factory,pepper,flower,ship,gold,melon,airplane,river,race,cow,horse,wheat,pig,chicken,duck,goat,sheep,honey,apple,cherry,grape,wine,barrel,castle,cathedral,pottery,crystal,metal,coal,clock,film,rocket,spa',
}
for (const [k, s] of Object.entries(BACK)) {
  const ids = s.split(',')
  if (ids.length !== 40 || new Set(ids).size !== 40) throw new Error(`back ${k}`)
  for (const id of ids) if (!VALID.has(id)) throw new Error(`back ${k} ${id}`)
}

const packs = {
  ch: {
    id: 'ch', country: 'Suisse', unitKind: 'Canton', backTitle: 'Cantons', backSub: 'de Suisse',
    ribbonBg: '#c8102e', accent: '#c8102e', emblemKind: 'blason', subLabel: 'Chef-lieu',
    backIds: BACK.ch.split(','),
    units: [
      u('AG','Aargau','Aarau', p('river','Aar'), p('castle','Habsbourg'), p('factory','Industrie')),
      u('AI','Appenzell Innerrhoden','Appenzell', p('cow','Alpage'), p('cheese','Appenzeller'), p('mountain','Alpstein')),
      u('AR','Appenzell Ausserrhoden','Herisau', p('textile','Broderie'), p('cow','Alpage'), p('forest','Préalpes')),
      u('BE','Bern','Bern', p('cheese','Emmental'), p('lion','Ours'), p('mountain','Oberland')),
      u('BL','Basel-Landschaft','Liestal', p('factory','Chimie'), p('grape','Vignoble'), p('river','Rhin')),
      u('BS','Basel-Stadt','Basel', p('factory','Pharma'), p('river','Rhin'), p('cathedral','Münster')),
      u('FR','Fribourg','Fribourg', p('cheese','Gruyère'), p('cow','Pré-alpes'), p('cathedral','Cathédrale')),
      u('GE','Genève','Genève', p('watch','Horlogerie'), p('briefcase','ONU'), p('spa','Jet d’eau')),
      u('GL','Glarus','Glarus', p('mountain','Alpes'), p('textile','Textile'), p('river','Linth')),
      u('GR','Graubünden','Chur', p('ski','Engadine'), p('mountain','Alpes'), p('spa','Thermal')),
      u('JU','Jura','Delémont', p('watch','Horlogerie'), p('horse','Franches-M.'), p('forest','Jura')),
      u('LU','Luzern','Luzern', p('sea','Lac'), p('mountain','Pilatus'), p('cheese','Fromage')),
      u('NE','Neuchâtel','Neuchâtel', p('watch','Horlogerie'), p('grape','Vignoble'), p('sea','Lac')),
      u('NW','Nidwalden','Stans', p('mountain','Alpes'), p('cow','Alpage'), p('forest','Forêt')),
      u('OW','Obwalden','Sarnen', p('mountain','Alpes'), p('cheese','Fromage'), p('ski','Ski')),
      u('SG','St. Gallen','St. Gallen', p('textile','Broderie'), p('cathedral','Abbaye'), p('cow','Alpage')),
      u('SH','Schaffhausen','Schaffhausen', p('river','Rhin'), p('castle','Munot'), p('grape','Vignoble')),
      u('SO','Solothurn','Solothurn', p('cathedral','St-Ours'), p('watch','Horlogerie'), p('river','Aar')),
      u('SZ','Schwyz','Schwyz', p('mountain','Mythen'), p('cheese','Fromage'), p('sword','Schwyz')),
      u('TG','Thurgau','Frauenfeld', p('apple','Cidre'), p('grape','Vignoble'), p('wheat','Cultures')),
      u('TI','Ticino','Bellinzona', p('palm','Sud'), p('castle','Castelli'), p('grape','Merlot')),
      u('UR','Uri','Altdorf', p('mountain','Gotthard'), p('cow','Alpage'), p('sword','Tell')),
      u('VD','Vaud','Lausanne', p('grape','Lavaux'), p('cheese','Tomme'), p('ski','Alpes')),
      u('VS','Valais','Sion', p('ski','Alpes'), p('grape','Vin'), p('mountain','Cervin')),
      u('ZG','Zug','Zug', p('briefcase','Finance'), p('cherry','Kirsch'), p('sea','Zugersee')),
      u('ZH','Zürich','Zürich', p('briefcase','Finance'), p('factory','Industrie'), p('river','Limmat')),
    ],
  },

  es: {
    id: 'es', country: 'Espagne', unitKind: 'Communauté', backTitle: 'Comunidades', backSub: 'de España',
    ribbonBg: '#aa151b', accent: '#aa151b', emblemKind: 'flag', subLabel: 'Capital',
    backIds: BACK.es.split(','),
    units: [
      u('AN','Andalucía','Sevilla', p('olive','Huile'), p('grape','Sherry'), p('cathedral','Alcázar')),
      u('AR','Aragón','Zaragoza', p('castle','Mudéjar'), p('mountain','Pyrénées'), p('wine','Cariñena')),
      u('AS','Asturias','Oviedo', p('apple','Cidre'), p('coal','Mine'), p('sea','Côte')),
      u('CB','Cantabria','Santander', p('sea','Côte'), p('cave' && 'crystal','Altamira'), p('cow','Élevage')),
      u('CL','Castilla y León','Valladolid', p('castle','Châteaux'), p('wine','Ribera'), p('wheat','Meseta')),
      u('CM','Castilla-La Mancha','Toledo', p('wheat','Moulins'), p('cheese','Manchego'), p('sword','Quichotte')),
      u('CN','Canarias','Las Palmas', p('volcano','Teide'), p('banana','Banane'), p('beach','Plages')),
      u('CT','Catalunya','Barcelona', p('cathedral','Sagrada'), p('wine','Priorat'), p('factory','Industrie')),
      u('EX','Extremadura','Mérida', p('pig','Jambon'), p('castle','Romain'), p('oak','Dehesa')),
      u('GA','Galicia','Santiago', p('scallop','Camino'), p('sea','Atlantique'), p('fish','Fruits mer')),
      u('IB','Illes Balears','Palma', p('beach','Plages'), p('sea','Méditerranée'), p('castle','Palma')),
      u('MC','Murcia','Murcia', p('pepper','Piment'), p('melon','Melon'), p('sea','Mar Menor')),
      u('MD','Madrid','Madrid', p('briefcase','Capitale'), p('castle','Royal'), p('film','Culture')),
      u('NC','Navarra','Pamplona', p('horse','Sanfermines'), p('wine','Navarra'), p('forest','Pyrénées')),
      u('PV','País Vasco','Vitoria', p('fish','Gastronomie'), p('factory','Industrie'), p('sea','Golfe')),
      u('RI','La Rioja','Logroño', p('wine','Rioja'), p('grape','Vignoble'), p('barrel','Bodegas')),
      u('VC','Comunitat Valenciana','Valencia', p('melon','Orange'), p('beach','Costa'), p('pottery','Céramique')),
      u('CE','Ceuta','Ceuta', p('ship','Détroit'), p('castle','Remparts'), p('fish','Mer')),
      u('ML','Melilla','Melilla', p('castle','Citadelle'), p('sea','Méditerranée'), p('ship','Port')),
    ],
  },
}

// Fix the hacky CB line
packs.es.units[3] = u('CB','Cantabria','Santander', p('sea','Côte'), p('crystal','Altamira'), p('cow','Élevage'))

packs.us = {
  id: 'us', country: 'USA', unitKind: 'État', backTitle: 'States of', backSub: 'the USA',
  ribbonBg: '#1d3557', accent: '#1d3557', emblemKind: 'flag', subLabel: 'Capital',
  backIds: BACK.us.split(','),
  units: [
    u('AL','Alabama','Montgomery', p('cotton' && 'textile','Coton'), p('steel' && 'metal','Acier'), p('football' && 'race','Sport')),
    u('AK','Alaska','Juneau', p('fish','Pêche'), p('penguin','Froid'), p('gold','Or')),
    u('AZ','Arizona','Phoenix', p('cactus' && 'palm','Désert'), p('canyon' && 'mountain','Canyon'), p('crystal','Cuivre')),
    u('AR','Arkansas','Little Rock', p('diamond' && 'crystal','Diamant'), p('river','Mississippi'), p('chicken','Volaille')),
    u('CA','California','Sacramento', p('gold','Or'), p('film','Cinéma'), p('palm','Côte')),
    u('CO','Colorado','Denver', p('ski','Rocheuses'), p('mountain','Sommets'), p('gold','Mine')),
    u('CT','Connecticut','Hartford', p('briefcase','Assurance'), p('ship','Côte'), p('oak','Chêne')),
    u('DE','Delaware','Dover', p('briefcase','Sociétés'), p('beach','Plages'), p('chicken','Volaille')),
    u('FL','Florida','Tallahassee', p('palm','Tropiques'), p('beach','Plages'), p('rocket','Espace')),
    u('GA','Georgia','Atlanta', p('peach' && 'plum','Pêche'), p('film','Cinéma'), p('factory','Industrie')),
    u('HI','Hawaii','Honolulu', p('volcano','Volcans'), p('beach','Plages'), p('flower','Hibiscus')),
    u('ID','Idaho','Boise', p('potato' && 'beet','Pomme de t.'), p('mountain','Rocheuses'), p('ski','Ski')),
    u('IL','Illinois','Springfield', p('wheat','Blé'), p('factory','Industrie'), p('briefcase','Chicago')),
    u('IN','Indiana','Indianapolis', p('race','Indy 500'), p('wheat','Cultures'), p('factory','Industrie')),
    u('IA','Iowa','Des Moines', p('wheat','Maïs'), p('pig','Porc'), p('cow','Élevage')),
    u('KS','Kansas','Topeka', p('wheat','Blé'), p('cow','Élevage'), p('airplane','Aviation')),
    u('KY','Kentucky','Frankfort', p('horse','Courses'), p('coal','Charbon'), p('barrel','Bourbon')),
    u('LA','Louisiana','Baton Rouge', p('pepper','Épices'), p('jazz' && 'music' && 'film','Jazz'), p('river','Mississippi')),
    u('ME','Maine','Augusta', p('lighthouse','Phare'), p('lobster' && 'fish','Homard'), p('forest','Forêt')),
    u('MD','Maryland','Annapolis', p('crab' && 'fish','Crabe'), p('ship','Baie'), p('briefcase','DC')),
    u('MA','Massachusetts','Boston', p('ship','Histoire'), p('briefcase','Universités'), p('fish','Pêche')),
    u('MI','Michigan','Lansing', p('car' && 'factory','Auto'), p('sea','Grands Lacs'), p('cherry','Cerise')),
    u('MN','Minnesota','Saint Paul', p('sea','Lacs'), p('wheat','Cultures'), p('ski','Hiver')),
    u('MS','Mississippi','Jackson', p('cotton' && 'textile','Coton'), p('river','Fleuve'), p('music' && 'film','Blues')),
    u('MO','Missouri','Jefferson City', p('river','Missouri'), p('beer','Bière'), p('briefcase','St Louis')),
    u('MT','Montana','Helena', p('mountain','Rocheuses'), p('cow','Ranch'), p('gold','Mine')),
    u('NE','Nebraska','Lincoln', p('wheat','Maïs'), p('cow','Élevage'), p('airplane','Aviation')),
    u('NV','Nevada','Carson City', p('gold','Casino'), p('mountain','Désert'), p('atom','Essais')),
    u('NH','New Hampshire','Concord', p('mountain','White Mts'), p('forest','Forêt'), p('maple' && 'oak','Érable')),
    u('NJ','New Jersey','Trenton', p('beach','Shore'), p('factory','Industrie'), p('briefcase','Finance')),
    u('NM','New Mexico','Santa Fe', p('chili' && 'pepper','Chili'), p('mountain','Désert'), p('atom','Los Alamos')),
    u('NY','New York','Albany', p('briefcase','Finance'), p('apple','Big Apple'), p('film','Culture')),
    u('NC','North Carolina','Raleigh', p('tobacco' && 'leaf' && 'forest','Tabac'), p('beach','Outer Banks'), p('factory','Industrie')),
    u('ND','North Dakota','Bismarck', p('wheat','Blé'), p('oil' && 'coal','Énergie'), p('cow','Élevage')),
    u('OH','Ohio','Columbus', p('factory','Industrie'), p('airplane','Aviation'), p('race','Sport')),
    u('OK','Oklahoma','Oklahoma City', p('cow','Ranch'), p('oil' && 'coal','Pétrole'), p('wheat','Blé')),
    u('OR','Oregon','Salem', p('forest','Forêt'), p('wine','Pinot'), p('volcano','Cascades')),
    u('PA','Pennsylvania','Harrisburg', p('steel' && 'metal','Acier'), p('coal','Charbon'), p('cheese','Amish')),
    u('RI','Rhode Island','Providence', p('ship','Port'), p('beach','Côte'), p('jewelry' && 'pearl','Bijoux')),
    u('SC','South Carolina','Columbia', p('palm','Palmetto'), p('beach','Côte'), p('textile','Textile')),
    u('SD','South Dakota','Pierre', p('mountain','Rushmore'), p('gold','Black Hills'), p('cow','Élevage')),
    u('TN','Tennessee','Nashville', p('music' && 'film','Country'), p('whiskey' && 'barrel','Whiskey'), p('river','Tennessee')),
    u('TX','Texas','Austin', p('cow','Ranch'), p('oil' && 'coal','Pétrole'), p('star' && 'gold','Lone Star')),
    u('UT','Utah','Salt Lake City', p('ski','Ski'), p('salt','Grand Lac'), p('mountain','Canyons')),
    u('VT','Vermont','Montpelier', p('maple' && 'oak','Érable'), p('cheese','Fromage'), p('ski','Ski')),
    u('VA','Virginia','Richmond', p('history' && 'castle','Histoire'), p('ship','Côte'), p('horse','Élevage')),
    u('WA','Washington','Olympia', p('apple','Pomme'), p('airplane','Aviation'), p('volcano','Rainier')),
    u('WV','West Virginia','Charleston', p('coal','Charbon'), p('mountain','Appalaches'), p('forest','Forêt')),
    u('WI','Wisconsin','Madison', p('cheese','Fromage'), p('cow','Lait'), p('beer','Bière')),
    u('WY','Wyoming','Cheyenne', p('cow','Ranch'), p('mountain','Yellowstone'), p('coal','Énergie')),
  ],
}

// The US units used invalid hacks with && — rebuild clean US list
packs.us.units = [
  u('AL','Alabama','Montgomery', p('textile','Coton'), p('metal','Acier'), p('race','Sport')),
  u('AK','Alaska','Juneau', p('fish','Pêche'), p('penguin','Froid'), p('gold','Or')),
  u('AZ','Arizona','Phoenix', p('palm','Désert'), p('mountain','Canyon'), p('crystal','Cuivre')),
  u('AR','Arkansas','Little Rock', p('crystal','Diamant'), p('river','Mississippi'), p('chicken','Volaille')),
  u('CA','California','Sacramento', p('gold','Or'), p('film','Cinéma'), p('palm','Côte')),
  u('CO','Colorado','Denver', p('ski','Rocheuses'), p('mountain','Sommets'), p('gold','Mine')),
  u('CT','Connecticut','Hartford', p('briefcase','Assurance'), p('ship','Côte'), p('oak','Chêne')),
  u('DE','Delaware','Dover', p('briefcase','Sociétés'), p('beach','Plages'), p('chicken','Volaille')),
  u('FL','Florida','Tallahassee', p('palm','Tropiques'), p('beach','Plages'), p('rocket','Espace')),
  u('GA','Georgia','Atlanta', p('plum','Pêche'), p('film','Cinéma'), p('factory','Industrie')),
  u('HI','Hawaii','Honolulu', p('volcano','Volcans'), p('beach','Plages'), p('flower','Hibiscus')),
  u('ID','Idaho','Boise', p('beet','Pomme de t.'), p('mountain','Rocheuses'), p('ski','Ski')),
  u('IL','Illinois','Springfield', p('wheat','Blé'), p('factory','Industrie'), p('briefcase','Chicago')),
  u('IN','Indiana','Indianapolis', p('race','Indy 500'), p('wheat','Cultures'), p('factory','Industrie')),
  u('IA','Iowa','Des Moines', p('wheat','Maïs'), p('pig','Porc'), p('cow','Élevage')),
  u('KS','Kansas','Topeka', p('wheat','Blé'), p('cow','Élevage'), p('airplane','Aviation')),
  u('KY','Kentucky','Frankfort', p('horse','Courses'), p('coal','Charbon'), p('barrel','Bourbon')),
  u('LA','Louisiana','Baton Rouge', p('pepper','Épices'), p('film','Jazz'), p('river','Mississippi')),
  u('ME','Maine','Augusta', p('lighthouse','Phare'), p('fish','Homard'), p('forest','Forêt')),
  u('MD','Maryland','Annapolis', p('fish','Crabe'), p('ship','Baie'), p('briefcase','DC')),
  u('MA','Massachusetts','Boston', p('ship','Histoire'), p('briefcase','Universités'), p('fish','Pêche')),
  u('MI','Michigan','Lansing', p('factory','Auto'), p('sea','Grands Lacs'), p('cherry','Cerise')),
  u('MN','Minnesota','Saint Paul', p('sea','Lacs'), p('wheat','Cultures'), p('ski','Hiver')),
  u('MS','Mississippi','Jackson', p('textile','Coton'), p('river','Fleuve'), p('film','Blues')),
  u('MO','Missouri','Jefferson City', p('river','Missouri'), p('beer','Bière'), p('briefcase','St Louis')),
  u('MT','Montana','Helena', p('mountain','Rocheuses'), p('cow','Ranch'), p('gold','Mine')),
  u('NE','Nebraska','Lincoln', p('wheat','Maïs'), p('cow','Élevage'), p('airplane','Aviation')),
  u('NV','Nevada','Carson City', p('gold','Casino'), p('mountain','Désert'), p('atom','Essais')),
  u('NH','New Hampshire','Concord', p('mountain','White Mts'), p('forest','Forêt'), p('oak','Érable')),
  u('NJ','New Jersey','Trenton', p('beach','Shore'), p('factory','Industrie'), p('briefcase','Finance')),
  u('NM','New Mexico','Santa Fe', p('pepper','Chili'), p('mountain','Désert'), p('atom','Los Alamos')),
  u('NY','New York','Albany', p('briefcase','Finance'), p('apple','Big Apple'), p('film','Culture')),
  u('NC','North Carolina','Raleigh', p('forest','Tabac'), p('beach','Outer Banks'), p('factory','Industrie')),
  u('ND','North Dakota','Bismarck', p('wheat','Blé'), p('coal','Énergie'), p('cow','Élevage')),
  u('OH','Ohio','Columbus', p('factory','Industrie'), p('airplane','Aviation'), p('race','Sport')),
  u('OK','Oklahoma','Oklahoma City', p('cow','Ranch'), p('coal','Pétrole'), p('wheat','Blé')),
  u('OR','Oregon','Salem', p('forest','Forêt'), p('wine','Pinot'), p('volcano','Cascades')),
  u('PA','Pennsylvania','Harrisburg', p('metal','Acier'), p('coal','Charbon'), p('cheese','Amish')),
  u('RI','Rhode Island','Providence', p('ship','Port'), p('beach','Côte'), p('pearl','Bijoux')),
  u('SC','South Carolina','Columbia', p('palm','Palmetto'), p('beach','Côte'), p('textile','Textile')),
  u('SD','South Dakota','Pierre', p('mountain','Rushmore'), p('gold','Black Hills'), p('cow','Élevage')),
  u('TN','Tennessee','Nashville', p('film','Country'), p('barrel','Whiskey'), p('river','Tennessee')),
  u('TX','Texas','Austin', p('cow','Ranch'), p('coal','Pétrole'), p('gold','Lone Star')),
  u('UT','Utah','Salt Lake City', p('ski','Ski'), p('salt','Grand Lac'), p('mountain','Canyons')),
  u('VT','Vermont','Montpelier', p('oak','Érable'), p('cheese','Fromage'), p('ski','Ski')),
  u('VA','Virginia','Richmond', p('castle','Histoire'), p('ship','Côte'), p('horse','Élevage')),
  u('WA','Washington','Olympia', p('apple','Pomme'), p('airplane','Aviation'), p('volcano','Rainier')),
  u('WV','West Virginia','Charleston', p('coal','Charbon'), p('mountain','Appalaches'), p('forest','Forêt')),
  u('WI','Wisconsin','Madison', p('cheese','Fromage'), p('cow','Lait'), p('beer','Bière')),
  u('WY','Wyoming','Cheyenne', p('cow','Ranch'), p('mountain','Yellowstone'), p('coal','Énergie')),
]

packs.de = {
  id: 'de', country: 'Allemagne', unitKind: 'Land', backTitle: 'Länder', backSub: 'Deutschlands',
  ribbonBg: '#111111', accent: '#111111', emblemKind: 'blason', subLabel: 'Capital',
  backIds: BACK.de.split(','),
  units: [
    u('BW','Baden-Württemberg','Stuttgart', p('factory','Auto'), p('wine','Baden'), p('forest','Forêt-Noire')),
    u('BY','Bayern','München', p('pretzel','Brezel'), p('beer','Bier'), p('ski','Alpen')),
    u('BE','Berlin','Berlin', p('briefcase','Capitale'), p('film','Culture'), p('bear' && 'lion','Ours')),
    u('BB','Brandenburg','Potsdam', p('castle','Châteaux'), p('forest','Forêt'), p('river','Havel')),
    u('HB','Bremen','Bremen', p('ship','Port'), p('briefcase','Hanse'), p('beer','Bière')),
    u('HH','Hamburg','Hamburg', p('ship','Port'), p('fish','Elbe'), p('briefcase','Commerce')),
    u('HE','Hessen','Wiesbaden', p('briefcase','Finance'), p('spa','Thermal'), p('wine','Rheingau')),
    u('MV','Mecklenburg-Vorpommern','Schwerin', p('sea','Baltique'), p('castle','Schwerin'), p('beach','Côte')),
    u('NI','Niedersachsen','Hannover', p('horse','Saxe'), p('wheat','Cultures'), p('sea','Mer du N.')),
    u('NW','Nordrhein-Westfalen','Düsseldorf', p('factory','Ruhr'), p('coal','Charbon'), p('beer','Kölsch')),
    u('RP','Rheinland-Pfalz','Mainz', p('wine','Moselle'), p('grape','Vignoble'), p('cathedral','Cathédrale')),
    u('SL','Saarland','Saarbrücken', p('coal','Mine'), p('metal','Acier'), p('forest','Forêt')),
    u('SN','Sachsen','Dresden', p('porcelain' && 'pottery','Porcelaine'), p('castle','Dresde'), p('metal','Industrie')),
    u('ST','Sachsen-Anhalt','Magdeburg', p('cathedral','Magdeburg'), p('wheat','Cultures'), p('chemical' && 'factory','Chimie')),
    u('SH','Schleswig-Holstein','Kiel', p('sea','Baltique'), p('ship','Ports'), p('cow','Élevage')),
    u('TH','Thüringen','Erfurt', p('forest','Forêt'), p('sausage' && 'pig','Saucisse'), p('castle','Wartburg')),
  ],
}
packs.de.units[2] = u('BE','Berlin','Berlin', p('briefcase','Capitale'), p('film','Culture'), p('lion','Ours'))
packs.de.units[12] = u('SN','Sachsen','Dresden', p('pottery','Porcelaine'), p('castle','Dresde'), p('metal','Industrie'))
packs.de.units[13] = u('ST','Sachsen-Anhalt','Magdeburg', p('cathedral','Magdeburg'), p('wheat','Cultures'), p('factory','Chimie'))
packs.de.units[15] = u('TH','Thüringen','Erfurt', p('forest','Forêt'), p('pig','Saucisse'), p('castle','Wartburg'))

packs.jp = {
  id: 'jp', country: 'Japon', unitKind: 'Préfecture', backTitle: '都道府県', backSub: 'Japan',
  ribbonBg: '#bc002d', accent: '#bc002d', emblemKind: 'flag', subLabel: 'Chef-lieu',
  backIds: BACK.jp.split(','),
  units: [
    // 47 prefectures — codes ISO 1–47
    u('01','Hokkaidō','Sapporo', p('ski','Hiver'), p('fish','Crabe'), p('forest','Nature')),
    u('02','Aomori','Aomori', p('apple','Pomme'), p('fish','Pêche'), p('forest','Forêt')),
    u('03','Iwate','Morioka', p('horse','Élevage'), p('forest','Forêt'), p('castle','Morioka')),
    u('04','Miyagi','Sendai', p('fish','Huîtres'), p('rice' && 'wheat','Riz'), p('castle','Sendai')),
    u('05','Akita','Akita', p('rice' && 'wheat','Riz'), p('dog' && 'dog' && 'sheep','Akita'), p('spa','Onsen')),
    u('06','Yamagata','Yamagata', p('cherry','Cerise'), p('rice' && 'wheat','Riz'), p('spa','Onsen')),
    u('07','Fukushima','Fukushima', p('peach' && 'plum','Pêche'), p('spa','Onsen'), p('mountain','Monts')),
    u('08','Ibaraki','Mito', p('plum','Ume'), p('atom','Science'), p('sea','Côte')),
    u('09','Tochigi','Utsunomiya', p('strawberry','Fraise'), p('spa','Nikkō'), p('temple' && 'cathedral','Nikkō')),
    u('10','Gunma','Maebashi', p('spa','Kusatsu'), p('silk','Soie'), p('mountain','Monts')),
    u('11','Saitama','Saitama', p('briefcase','Banlieue'), p('factory','Industrie'), p('river','Arakawa')),
    u('12','Chiba','Chiba', p('airplane','Narita'), p('fish','Pêche'), p('peanut' && 'walnut','Arachide')),
    u('13','Tōkyō','Tōkyō', p('flower','Sakura'), p('fish','Sushi'), p('volcano','Fuji')),
    u('14','Kanagawa','Yokohama', p('ship','Port'), p('spa','Hakone'), p('factory','Industrie')),
    u('15','Niigata','Niigata', p('rice' && 'wheat','Riz'), p('ski','Ski'), p('sea','Mer du Japon')),
    u('16','Toyama','Toyama', p('fish','Crabe'), p('mountain','Tateyama'), p('medicine' && 'factory','Pharma')),
    u('17','Ishikawa','Kanazawa', p('pottery','Kutani'), p('gold','Feuille or'), p('garden' && 'flower','Jardin')),
    u('18','Fukui','Fukui', p('dinosaur' && 'crystal','Dinosaures'), p('crab' && 'fish','Crabe'), p('temple' && 'cathedral','Eiheiji')),
    u('19','Yamanashi','Kōfu', p('grape','Vin'), p('volcano','Fuji'), p('crystal','Cristal')),
    u('20','Nagano','Nagano', p('ski','JO 98'), p('mountain','Alpes'), p('soba' && 'wheat','Soba')),
    u('21','Gifu','Gifu', p('sword','Coutellerie'), p('paper' && 'textile','Washi'), p('river','Nagara')),
    u('22','Shizuoka','Shizuoka', p('tea' && 'leaf' && 'forest','Thé'), p('volcano','Fuji'), p('fish','Maguro')),
    u('23','Aichi','Nagoya', p('factory','Auto'), p('castle','Nagoya'), p('pottery','Seto')),
    u('24','Mie','Tsu', p('pearl','Perles'), p('shrine' && 'cathedral','Ise'), p('beef' && 'cow','Matsusaka')),
    u('25','Shiga','Ōtsu', p('sea','Biwa'), p('temple' && 'cathedral','Enryaku'), p('castle','Hikone')),
    u('26','Kyōto','Kyōto', p('temple' && 'cathedral','Temples'), p('tea' && 'forest','Thé'), p('silk','Kimono')),
    u('27','Ōsaka','Ōsaka', p('briefcase','Commerce'), p('castle','Château'), p('food' && 'pepper','Cuisine')),
    u('28','Hyōgo','Kōbe', p('cow','Bœuf Kōbe'), p('ship','Port'), p('spa','Arima')),
    u('29','Nara','Nara', p('deer' && 'goat','Cerfs'), p('temple' && 'cathedral','Temples'), p('history' && 'castle','Histoire')),
    u('30','Wakayama','Wakayama', p('orange' && 'melon','Mikan'), p('temple' && 'cathedral','Kōya'), p('spa','Onsen')),
    u('31','Tottori','Tottori', p('sand' && 'beach','Dunes'), p('pear' && 'apple','Poire'), p('crab' && 'fish','Crabe')),
    u('32','Shimane','Matsue', p('shrine' && 'cathedral','Izumo'), p('sea','Mer'), p('silver' && 'metal','Iwami')),
    u('33','Okayama','Okayama', p('peach' && 'plum','Pêche'), p('castle','Okayama'), p('denim' && 'textile','Denim')),
    u('34','Hiroshima','Hiroshima', p('oyster','Huîtres'), p('castle','Château'), p('peace' && 'ribbon','Paix')),
    u('35','Yamaguchi','Yamaguchi', p('fugu' && 'fish','Fugu'), p('factory','Industrie'), p('shrine' && 'cathedral','Temples')),
    u('36','Tokushima','Tokushima', p('indigo' && 'textile','Indigo'), p('dance' && 'film','Awa Odori'), p('whirlpool' && 'sea','Naruto')),
    u('37','Kagawa','Takamatsu', p('udon' && 'wheat','Udon'), p('olive','Olive'), p('garden' && 'flower','Ritsurin')),
    u('38','Ehime','Matsuyama', p('orange' && 'melon','Mikan'), p('spa','Dōgo'), p('ship','Ports')),
    u('39','Kōchi','Kōchi', p('bonito' && 'fish','Katsuo'), p('forest','Forêt'), p('castle','Kōchi')),
    u('40','Fukuoka','Fukuoka', p('ramen' && 'bowl' && 'pepper','Ramen'), p('factory','Industrie'), p('briefcase','Commerce')),
    u('41','Saga','Saga', p('pottery','Arita'), p('rice' && 'wheat','Riz'), p('spa','Ureshino')),
    u('42','Nagasaki','Nagasaki', p('ship','Port'), p('castle','Histoire'), p('cake' && 'cookie','Castella')),
    u('43','Kumamoto','Kumamoto', p('castle','Kumamoto'), p('volcano','Aso'), p('horse','Élevage')),
    u('44','Ōita','Ōita', p('spa','Beppu'), p('chicken','Toriten'), p('mountain','Monts')),
    u('45','Miyazaki','Miyazaki', p('palm','Tropiques'), p('chicken','Miyazaki'), p('beach','Côte')),
    u('46','Kagoshima','Kagoshima', p('volcano','Sakurajima'), p('sweetpotato' && 'beet','Patate'), p('rum','Shōchū')),
    u('47','Okinawa','Naha', p('beach','Plages'), p('palm','Tropiques'), p('castle','Gusuku')),
  ],
}

// Rebuild JP with only valid icons — the list above is full of invalid && hacks
packs.jp.units = [
  u('01','Hokkaidō','Sapporo', p('ski','Hiver'), p('fish','Crabe'), p('forest','Nature')),
  u('02','Aomori','Aomori', p('apple','Pomme'), p('fish','Pêche'), p('forest','Forêt')),
  u('03','Iwate','Morioka', p('horse','Élevage'), p('forest','Forêt'), p('castle','Morioka')),
  u('04','Miyagi','Sendai', p('fish','Huîtres'), p('wheat','Riz'), p('castle','Sendai')),
  u('05','Akita','Akita', p('wheat','Riz'), p('dog' && 'sheep','Akita'), p('spa','Onsen')),
  u('06','Yamagata','Yamagata', p('cherry','Cerise'), p('wheat','Riz'), p('spa','Onsen')),
  u('07','Fukushima','Fukushima', p('plum','Pêche'), p('spa','Onsen'), p('mountain','Monts')),
  u('08','Ibaraki','Mito', p('plum','Ume'), p('atom','Science'), p('sea','Côte')),
  u('09','Tochigi','Utsunomiya', p('strawberry','Fraise'), p('spa','Nikkō'), p('cathedral','Nikkō')),
  u('10','Gunma','Maebashi', p('spa','Kusatsu'), p('silk','Soie'), p('mountain','Monts')),
  u('11','Saitama','Saitama', p('briefcase','Banlieue'), p('factory','Industrie'), p('river','Arakawa')),
  u('12','Chiba','Chiba', p('airplane','Narita'), p('fish','Pêche'), p('walnut','Arachide')),
  u('13','Tōkyō','Tōkyō', p('flower','Sakura'), p('fish','Sushi'), p('volcano','Fuji')),
  u('14','Kanagawa','Yokohama', p('ship','Port'), p('spa','Hakone'), p('factory','Industrie')),
  u('15','Niigata','Niigata', p('wheat','Riz'), p('ski','Ski'), p('sea','Mer du Japon')),
  u('16','Toyama','Toyama', p('fish','Crabe'), p('mountain','Tateyama'), p('factory','Pharma')),
  u('17','Ishikawa','Kanazawa', p('pottery','Kutani'), p('gold','Feuille or'), p('flower','Jardin')),
  u('18','Fukui','Fukui', p('crystal','Dinosaures'), p('fish','Crabe'), p('cathedral','Eiheiji')),
  u('19','Yamanashi','Kōfu', p('grape','Vin'), p('volcano','Fuji'), p('crystal','Cristal')),
  u('20','Nagano','Nagano', p('ski','JO 98'), p('mountain','Alpes'), p('wheat','Soba')),
  u('21','Gifu','Gifu', p('sword','Coutellerie'), p('textile','Washi'), p('river','Nagara')),
  u('22','Shizuoka','Shizuoka', p('forest','Thé'), p('volcano','Fuji'), p('fish','Maguro')),
  u('23','Aichi','Nagoya', p('factory','Auto'), p('castle','Nagoya'), p('pottery','Seto')),
  u('24','Mie','Tsu', p('pearl','Perles'), p('cathedral','Ise'), p('cow','Matsusaka')),
  u('25','Shiga','Ōtsu', p('sea','Biwa'), p('cathedral','Enryaku'), p('castle','Hikone')),
  u('26','Kyōto','Kyōto', p('cathedral','Temples'), p('forest','Thé'), p('silk','Kimono')),
  u('27','Ōsaka','Ōsaka', p('briefcase','Commerce'), p('castle','Château'), p('pepper','Cuisine')),
  u('28','Hyōgo','Kōbe', p('cow','Bœuf Kōbe'), p('ship','Port'), p('spa','Arima')),
  u('29','Nara','Nara', p('goat','Cerfs'), p('cathedral','Temples'), p('castle','Histoire')),
  u('30','Wakayama','Wakayama', p('melon','Mikan'), p('cathedral','Kōya'), p('spa','Onsen')),
  u('31','Tottori','Tottori', p('beach','Dunes'), p('apple','Poire'), p('fish','Crabe')),
  u('32','Shimane','Matsue', p('cathedral','Izumo'), p('sea','Mer'), p('metal','Iwami')),
  u('33','Okayama','Okayama', p('plum','Pêche'), p('castle','Okayama'), p('textile','Denim')),
  u('34','Hiroshima','Hiroshima', p('oyster','Huîtres'), p('castle','Château'), p('ribbon','Paix')),
  u('35','Yamaguchi','Yamaguchi', p('fish','Fugu'), p('factory','Industrie'), p('cathedral','Temples')),
  u('36','Tokushima','Tokushima', p('textile','Indigo'), p('film','Awa Odori'), p('sea','Naruto')),
  u('37','Kagawa','Takamatsu', p('wheat','Udon'), p('olive','Olive'), p('flower','Ritsurin')),
  u('38','Ehime','Matsuyama', p('melon','Mikan'), p('spa','Dōgo'), p('ship','Ports')),
  u('39','Kōchi','Kōchi', p('fish','Katsuo'), p('forest','Forêt'), p('castle','Kōchi')),
  u('40','Fukuoka','Fukuoka', p('pepper','Ramen'), p('factory','Industrie'), p('briefcase','Commerce')),
  u('41','Saga','Saga', p('pottery','Arita'), p('wheat','Riz'), p('spa','Ureshino')),
  u('42','Nagasaki','Nagasaki', p('ship','Port'), p('castle','Histoire'), p('cookie','Castella')),
  u('43','Kumamoto','Kumamoto', p('castle','Kumamoto'), p('volcano','Aso'), p('horse','Élevage')),
  u('44','Ōita','Ōita', p('spa','Beppu'), p('chicken','Toriten'), p('mountain','Monts')),
  u('45','Miyazaki','Miyazaki', p('palm','Tropiques'), p('chicken','Miyazaki'), p('beach','Côte')),
  u('46','Kagoshima','Kagoshima', p('volcano','Sakurajima'), p('beet','Patate'), p('rum','Shōchū')),
  u('47','Okinawa','Naha', p('beach','Plages'), p('palm','Tropiques'), p('castle','Gusuku')),
]
// fix Akita dog
packs.jp.units[4] = u('05','Akita','Akita', p('wheat','Riz'), p('sheep','Akita'), p('spa','Onsen'))

packs.ca = {
  id: 'ca', country: 'Canada', unitKind: 'Province', backTitle: 'Provinces', backSub: 'of Canada',
  ribbonBg: '#0b3d91', accent: '#0b3d91', emblemKind: 'flag', subLabel: 'Capital',
  backIds: BACK.ca.split(','),
  units: [
    u('AB','Alberta','Edmonton', p('coal','Pétrole'), p('cow','Ranch'), p('mountain','Rocheuses')),
    u('BC','British Columbia','Victoria', p('forest','Forêt'), p('fish','Saumon'), p('mountain','Rocheuses')),
    u('MB','Manitoba','Winnipeg', p('wheat','Blé'), p('polar' && 'penguin','Ours pol.'), p('river','Rouge')),
    u('NB','New Brunswick','Fredericton', p('forest','Forêt'), p('fish','Homard'), p('tide' && 'sea','Marées')),
    u('NL','Newfoundland and Labrador','St. John\'s', p('fish','Morue'), p('lighthouse','Phare'), p('iceberg' && 'crystal','Icebergs')),
    u('NS','Nova Scotia','Halifax', p('ship','Port'), p('lighthouse','Phare'), p('fish','Homard')),
    u('NT','Northwest Territories','Yellowknife', p('gold','Mine'), p('northern' && 'crystal','Aurores'), p('forest','Taïga')),
    u('NU','Nunavut','Iqaluit', p('penguin','Arctique'), p('fish','Pêche'), p('crystal','Glace')),
    u('ON','Ontario','Toronto', p('briefcase','Finance'), p('sea','Grands Lacs'), p('maple' && 'oak','Érable')),
    u('PE','Prince Edward Island','Charlottetown', p('beet','Pomme de t.'), p('beach','Plages'), p('ship','Île')),
    u('QC','Québec','Québec', p('forest','Forêt'), p('ski','Hiver'), p('river','Fleuve')),
    u('SK','Saskatchewan','Regina', p('wheat','Blé'), p('cow','Élevage'), p('potash' && 'salt','Potasse')),
    u('YT','Yukon','Whitehorse', p('gold','Ruée'), p('mountain','Monts'), p('ski','Hiver')),
  ],
}
packs.ca.units[2] = u('MB','Manitoba','Winnipeg', p('wheat','Blé'), p('penguin','Nord'), p('river','Rouge'))
packs.ca.units[3] = u('NB','New Brunswick','Fredericton', p('forest','Forêt'), p('fish','Homard'), p('sea','Marées'))
packs.ca.units[4] = u('NL','Newfoundland and Labrador',"St. John's", p('fish','Morue'), p('lighthouse','Phare'), p('crystal','Icebergs'))
packs.ca.units[6] = u('NT','Northwest Territories','Yellowknife', p('gold','Mine'), p('crystal','Aurores'), p('forest','Taïga'))
packs.ca.units[8] = u('ON','Ontario','Toronto', p('briefcase','Finance'), p('sea','Grands Lacs'), p('oak','Érable'))
packs.ca.units[11] = u('SK','Saskatchewan','Regina', p('wheat','Blé'), p('cow','Élevage'), p('salt','Potasse'))

packs.br = {
  id: 'br', country: 'Brésil', unitKind: 'État', backTitle: 'Estados', backSub: 'do Brasil',
  ribbonBg: '#009c3b', accent: '#002776', emblemKind: 'flag', subLabel: 'Capital',
  backIds: BACK.br.split(','),
  units: [
    u('AC','Acre','Rio Branco', p('forest','Amazonie'), p('rubber' && 'factory','Caoutchouc'), p('river','Fleuve')),
    u('AL','Alagoas','Maceió', p('beach','Plages'), p('sugar','Sucre'), p('coconut' && 'palm','Coco')),
    u('AP','Amapá','Macapá', p('forest','Amazonie'), p('gold','Or'), p('equator' && 'river','Équateur')),
    u('AM','Amazonas','Manaus', p('forest','Amazonie'), p('river','Amazone'), p('fish','Pirarucu')),
    u('BA','Bahia','Salvador', p('rum','Cachaça'), p('beach','Plages'), p('film','Capoeira')),
    u('CE','Ceará','Fortaleza', p('beach','Plages'), p('wind' && 'airplane','Vent'), p('cattle' && 'cow','Élevage')),
    u('DF','Distrito Federal','Brasília', p('briefcase','Capitale'), p('plane','Architecture'), p('film','Culture')),
    u('ES','Espírito Santo','Vitória', p('coffee' && 'bean' && 'forest','Café'), p('beach','Côte'), p('iron' && 'metal','Fer')),
    u('GO','Goiás','Goiânia', p('cow','Élevage'), p('wheat','Soja'), p('crystal','Cristaux')),
    u('MA','Maranhão','São Luís', p('palm','Babassu'), p('beach','Côte'), p('delta' && 'river','Delta')),
    u('MT','Mato Grosso','Cuiabá', p('wheat','Soja'), p('cow','Élevage'), p('forest','Pantanal')),
    u('MS','Mato Grosso do Sul','Campo Grande', p('cow','Élevage'), p('forest','Pantanal'), p('wheat','Soja')),
    u('MG','Minas Gerais','Belo Horizonte', p('cheese','Fromage'), p('gold','Mine'), p('coffee' && 'forest','Café')),
    u('PA','Pará','Belém', p('forest','Amazonie'), p('pepper','Poivre'), p('river','Amazone')),
    u('PB','Paraíba','João Pessoa', p('textile','Textile'), p('beach','Côte'), p('sugar','Sucre')),
    u('PR','Paraná','Curitiba', p('pine' && 'forest','Araucaria'), p('wheat','Soja'), p('waterfall' && 'river','Iguaçu')),
    u('PE','Pernambuco','Recife', p('sugar','Sucre'), p('beach','Côte'), p('film','Frevo')),
    u('PI','Piauí','Teresina', p('cow','Élevage'), p('park' && 'forest','Parcs'), p('beach','Côte')),
    u('RJ','Rio de Janeiro','Rio de Janeiro', p('beach','Copacabana'), p('mountain','Pain de S.'), p('film','Carnaval')),
    u('RN','Rio Grande do Norte','Natal', p('beach','Plages'), p('salt','Sel'), p('wind' && 'airplane','Éolien')),
    u('RS','Rio Grande do Sul','Porto Alegre', p('cow','Gaúcho'), p('wine','Vin'), p('wheat','Riz')),
    u('RO','Rondônia','Porto Velho', p('forest','Amazonie'), p('tin' && 'metal','Étain'), p('cow','Élevage')),
    u('RR','Roraima','Boa Vista', p('mountain','Roraima'), p('forest','Amazonie'), p('gold','Or')),
    u('SC','Santa Catarina','Florianópolis', p('beach','Plages'), p('factory','Industrie'), p('coal','Charbon')),
    u('SP','São Paulo','São Paulo', p('factory','Industrie'), p('race','Interlagos'), p('palm','Tropiques')),
    u('SE','Sergipe','Aracaju', p('beach','Plages'), p('oil' && 'coal','Pétrole'), p('sugar','Sucre')),
    u('TO','Tocantins','Palmas', p('river','Tocantins'), p('cow','Élevage'), p('savanna' && 'wheat','Cerrado')),
  ],
}

// Clean BR
packs.br.units = [
  u('AC','Acre','Rio Branco', p('forest','Amazonie'), p('factory','Caoutchouc'), p('river','Fleuve')),
  u('AL','Alagoas','Maceió', p('beach','Plages'), p('sugar','Sucre'), p('palm','Coco')),
  u('AP','Amapá','Macapá', p('forest','Amazonie'), p('gold','Or'), p('river','Équateur')),
  u('AM','Amazonas','Manaus', p('forest','Amazonie'), p('river','Amazone'), p('fish','Pirarucu')),
  u('BA','Bahia','Salvador', p('rum','Cachaça'), p('beach','Plages'), p('film','Capoeira')),
  u('CE','Ceará','Fortaleza', p('beach','Plages'), p('airplane','Vent'), p('cow','Élevage')),
  u('DF','Distrito Federal','Brasília', p('briefcase','Capitale'), p('plane','Architecture'), p('film','Culture')),
  u('ES','Espírito Santo','Vitória', p('forest','Café'), p('beach','Côte'), p('metal','Fer')),
  u('GO','Goiás','Goiânia', p('cow','Élevage'), p('wheat','Soja'), p('crystal','Cristaux')),
  u('MA','Maranhão','São Luís', p('palm','Babassu'), p('beach','Côte'), p('river','Delta')),
  u('MT','Mato Grosso','Cuiabá', p('wheat','Soja'), p('cow','Élevage'), p('forest','Pantanal')),
  u('MS','Mato Grosso do Sul','Campo Grande', p('cow','Élevage'), p('forest','Pantanal'), p('wheat','Soja')),
  u('MG','Minas Gerais','Belo Horizonte', p('cheese','Fromage'), p('gold','Mine'), p('forest','Café')),
  u('PA','Pará','Belém', p('forest','Amazonie'), p('pepper','Poivre'), p('river','Amazone')),
  u('PB','Paraíba','João Pessoa', p('textile','Textile'), p('beach','Côte'), p('sugar','Sucre')),
  u('PR','Paraná','Curitiba', p('forest','Araucaria'), p('wheat','Soja'), p('river','Iguaçu')),
  u('PE','Pernambuco','Recife', p('sugar','Sucre'), p('beach','Côte'), p('film','Frevo')),
  u('PI','Piauí','Teresina', p('cow','Élevage'), p('forest','Parcs'), p('beach','Côte')),
  u('RJ','Rio de Janeiro','Rio de Janeiro', p('beach','Copacabana'), p('mountain','Pain de S.'), p('film','Carnaval')),
  u('RN','Rio Grande do Norte','Natal', p('beach','Plages'), p('salt','Sel'), p('airplane','Éolien')),
  u('RS','Rio Grande do Sul','Porto Alegre', p('cow','Gaúcho'), p('wine','Vin'), p('wheat','Riz')),
  u('RO','Rondônia','Porto Velho', p('forest','Amazonie'), p('metal','Étain'), p('cow','Élevage')),
  u('RR','Roraima','Boa Vista', p('mountain','Roraima'), p('forest','Amazonie'), p('gold','Or')),
  u('SC','Santa Catarina','Florianópolis', p('beach','Plages'), p('factory','Industrie'), p('coal','Charbon')),
  u('SP','São Paulo','São Paulo', p('factory','Industrie'), p('race','Interlagos'), p('palm','Tropiques')),
  u('SE','Sergipe','Aracaju', p('beach','Plages'), p('coal','Pétrole'), p('sugar','Sucre')),
  u('TO','Tocantins','Palmas', p('river','Tocantins'), p('cow','Élevage'), p('wheat','Cerrado')),
]

function emit(pack) {
  const back = pack.backIds.map((id) => `'${id}'`).join(', ')
  const units = pack.units
    .map((unit) => {
      const pics = unit.pictos
        .map((s) => `{ icon: '${s.icon}', label: '${s.label.replace(/'/g, "\\'")}' }`)
        .join(', ')
      return `    { code: '${unit.code}', name: '${unit.name.replace(/'/g, "\\'")}', capital: '${unit.capital.replace(/'/g, "\\'")}', pictos: [${pics}] },`
    })
    .join('\n')

  return `import type { TerritoryPack } from './types'

export const ${pack.id.toUpperCase()}_PACK: TerritoryPack = {
  id: '${pack.id}',
  country: '${pack.country}',
  unitKind: '${pack.unitKind}',
  backTitle: '${pack.backTitle}',
  backSub: '${pack.backSub}',
  ribbonBg: '${pack.ribbonBg}',
  accent: '${pack.accent}',
  emblemKind: '${pack.emblemKind}',
  subLabel: '${pack.subLabel}',
  backIds: [${back}],
  units: [
${units}
  ],
}
`
}

mkdirSync('src/data/territories', { recursive: true })
const counts = {}
for (const pack of Object.values(packs)) {
  // validate
  for (const unit of pack.units) {
    if (unit.pictos.length !== 3) throw new Error(`${pack.id} ${unit.code} pictos`)
    for (const s of unit.pictos) if (!VALID.has(s.icon)) throw new Error(`${pack.id} ${unit.code} ${s.icon}`)
  }
  counts[pack.id] = pack.units.length
  writeFileSync(`src/data/territories/${pack.id}.ts`, emit(pack))
  console.log('wrote', pack.id, pack.units.length)
}
console.log(JSON.stringify(counts))
