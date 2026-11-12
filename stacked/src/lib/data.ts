// Puzzle content and demo leaderboards. In production these come from Supabase
// (daily_stacks, puzzles_*, categories) — see README.md.

const L = (s: string) => s.split(',').map((x) => x.trim());

export const CATS: Record<string, string[]> = {
  fruits: L('apple,banana,orange,grape,mango,pear,peach,plum,cherry,kiwi,lemon,lime,melon,watermelon,cantaloupe,honeydew,pineapple,strawberry,blueberry,raspberry,blackberry,cranberry,papaya,guava,apricot,fig,date,coconut,pomegranate,nectarine,tangerine,grapefruit,lychee,passion fruit,dragon fruit,persimmon,clementine,mandarin,avocado,tomato,olive,quince,starfruit,jackfruit,durian,plantain,gooseberry,elderberry,mulberry,kumquat,boysenberry,currant,raisin,prune'),
  'pizza toppings': L('pepperoni,sausage,mushroom,onion,pepper,green pepper,olive,ham,pineapple,bacon,chicken,spinach,tomato,basil,cheese,mozzarella,jalapeno,anchovy,anchovies,beef,salami,garlic,artichoke,feta,parmesan,arugula,broccoli,corn,egg,prosciutto,ricotta,meatball,bbq sauce,buffalo chicken,cheddar,goat cheese,oregano,shrimp,pesto,chorizo'),
  'countries in europe': L('france,germany,spain,italy,portugal,ireland,uk,united kingdom,england,scotland,wales,norway,sweden,finland,denmark,iceland,poland,ukraine,greece,netherlands,holland,belgium,switzerland,austria,hungary,romania,bulgaria,croatia,serbia,czechia,czech republic,slovakia,slovenia,estonia,latvia,lithuania,albania,belarus,moldova,bosnia,montenegro,north macedonia,macedonia,luxembourg,malta,monaco,andorra,liechtenstein,san marino,vatican,cyprus,kosovo,russia,turkey'),
  'sports with a ball': L('soccer,football,basketball,baseball,tennis,golf,volleyball,softball,rugby,cricket,field hockey,lacrosse,handball,ping pong,table tennis,bowling,polo,water polo,dodgeball,kickball,squash,racquetball,pickleball,netball,billiards,pool,croquet,bocce,four square,tee ball,futsal,wiffle ball,beach volleyball,paddle ball,jai alai,snooker'),
  colors: L('red,orange,yellow,green,blue,purple,pink,brown,black,white,gray,grey,violet,indigo,teal,turquoise,cyan,magenta,maroon,navy,beige,tan,gold,silver,lavender,lilac,lime,olive,peach,coral,salmon,crimson,scarlet,burgundy,mint,aqua,ivory,cream,mustard,khaki,charcoal,fuchsia,amber,emerald,ruby,periwinkle,mauve,rust,bronze,plum,cerulean,chartreuse,sienna,ochre,taupe,rose,sky blue,royal blue'),
  'ocean animals': L('shark,whale,dolphin,octopus,squid,jellyfish,starfish,sea star,crab,lobster,shrimp,seal,sea lion,walrus,otter,sea otter,turtle,sea turtle,stingray,ray,manta ray,eel,clownfish,tuna,salmon,cod,swordfish,marlin,seahorse,sea urchin,urchin,coral,narwhal,orca,killer whale,penguin,pufferfish,barracuda,anchovy,sardine,krill,clam,oyster,mussel,scallop,anemone,manatee,dugong,plankton,halibut,mackerel,hammerhead,blue whale,humpback,beluga,angelfish,sea cucumber'),
  'breakfast foods': L('pancake,waffle,bacon,egg,toast,cereal,oatmeal,bagel,muffin,sausage,hash brown,french toast,yogurt,granola,croissant,omelet,omelette,breakfast burrito,burrito,smoothie,grits,biscuit,biscuits and gravy,donut,doughnut,crepe,porridge,fruit,coffee,orange juice,juice,ham,scone,danish,quiche,pop tart,cinnamon roll,avocado toast,eggs benedict,frittata,breakfast sandwich,milk,tea,chocolate milk,english muffin'),
};
export const DAILY_CAT = 'fruits';
export const PARTY_CATS = ['pizza toppings', 'countries in europe', 'sports with a ball', 'colors', 'ocean animals', 'breakfast foods'];

export const GROUPS = [
  { name: 'CARD GAMES', words: ['POKER', 'RUMMY', 'SNAP', 'HEARTS'] },
  { name: '___BALL', words: ['FOOT', 'BASKET', 'MEAT', 'SNOW'] },
  { name: 'SHADES OF ORANGE', words: ['AMBER', 'RUST', 'APRICOT', 'COPPER'] },
  { name: 'STARTS WITH AN ANIMAL', words: ['CATALOG', 'PIGMENT', 'RAMBLE', 'COWARD'] },
];
export const GROUP_ORDER = ['SNAP', 'AMBER', 'CATALOG', 'FOOT', 'HEARTS', 'RUST', 'MEAT', 'PIGMENT', 'COPPER', 'POKER', 'RAMBLE', 'SNOW', 'BASKET', 'COWARD', 'RUMMY', 'APRICOT'];

// Name That Tune. The bundled clip (assets/audio/tune.wav) is a synthesized public-domain melody.
export const SONG: [string, number][] = [['E4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1], ['C4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1.5], ['D4', 0.5], ['D4', 2]];
export const BEAT = 0.36;
export const CUM = SONG.reduce<number[]>((a, n) => (a.push(a[a.length - 1] + n[1]), a), [0]);
export const TUNE_TOTAL = CUM[CUM.length - 1] * BEAT;
export const STAGES = [1, 2, 4, 7, 11, 15];
export const stageEnd = (k: number) => CUM[STAGES[k]] * BEAT;
export const TUNE_ANSWER = 'Ode to Joy';
export const TUNE_TITLES = ['Twinkle Twinkle', 'Ode to Joy', 'Jingle Bells', 'Happy Birthday', 'Für Elise', 'Frère Jacques', 'Mary Had a Little Lamb', 'Greensleeves'];
export const TUNE_PTS = [100, 85, 70, 55, 40, 25];

export type DailyKey = 'tune' | 'groups' | 'name';
export type FreeKey = 'rare' | 'zoom' | 'trivia' | 'hilo';

export const GAMES: { key: DailyKey; name: string; sub: string }[] = [
  { key: 'tune', name: 'NAME THAT TUNE', sub: 'Guess the song from a snippet' },
  { key: 'groups', name: 'GROUP UP', sub: 'Sort 16 words into 4 groups' },
  { key: 'name', name: "NAME 'EM", sub: 'One category, against the clock' },
];
export const FREE: { key: FreeKey; name: string; sub: string }[] = [
  { key: 'rare', name: 'RARE WORDS', sub: 'Say the word nobody else would' },
  { key: 'zoom', name: 'ZOOM OUT', sub: 'Guess the word from a close-up' },
  { key: 'trivia', name: 'TRIVIA STREAK', sub: 'One wrong answer ends it' },
  { key: 'hilo', name: 'HIGHER / LOWER', sub: 'Which country has more people?' },
];

export const BOARDS: [string, number][][] = [
  [['maya_r', 268], ['jordo', 251], ['dev.p', 239], ['samwise', 212], ['priya.k', 198], ['alexx', 176]],
  [['k.oyelaran', 291], ['maya_r', 268], ['bennyb', 262], ['jordo', 251], ['lucia.m', 247], ['dev.p', 239], ['theo_w', 224]],
  [['qwertyqueen', 300], ['ninebolt', 300], ['harpo', 295], ['zed.k', 292], ['lumi', 290], ['k.oyelaran', 291], ['obi', 288]],
];
export const BOARD_NAMES = ['FRIENDS', 'SCHOOL', 'GLOBAL'];

export const RARE: Record<string, number> = { happy: 31, glad: 12, joyful: 9, cheerful: 8, excited: 7, content: 4, delighted: 4, pleased: 3, thrilled: 3, ecstatic: 3, satisfied: 2.5, merry: 2, overjoyed: 2, elated: 1.6, gleeful: 1.2, upbeat: 1.1, jolly: 1, cheery: 1, carefree: 0.9, blissful: 0.8, lighthearted: 0.7, chipper: 0.6, stoked: 0.6, jubilant: 0.5, giddy: 0.5, euphoric: 0.4, sunny: 0.4, radiant: 0.4, buoyant: 0.3, jovial: 0.3, perky: 0.3, exuberant: 0.3, blithe: 0.1, ebullient: 0.08, exultant: 0.06, chuffed: 0.05, rapturous: 0.05, sanguine: 0.04, beatific: 0.03, gladsome: 0.02 };
export const rarePts = (p: number) => Math.round(Math.max(5, Math.min(100, 100 - 25 * Math.log10(p * 50))));

export const ZOOM = [
  { word: 'BEAGLE', opts: ['BAGEL', 'BANGLE', 'BEAGLE', 'BUGLE'], o: [0.3, 0.5] },
  { word: 'JIGSAW', opts: ['JIGGLE', 'JIGSAW', 'SEESAW', 'JACKAL'], o: [0.72, 0.45] },
  { word: 'WHISKER', opts: ['WHISPER', 'WHIMPER', 'WHISTLE', 'WHISKER'], o: [0.55, 0.55] },
  { word: 'QUARTZ', opts: ['QUARTZ', 'QUARRY', 'QUOTA', 'QUARTER'], o: [0.84, 0.5] },
  { word: 'OXYGEN', opts: ['OXFORD', 'OCTAGON', 'OXYGEN', 'OXIDE'], o: [0.4, 0.6] },
] as const;
export const ZSCALE = [7, 4, 2.2, 1];
export const ZPTS = [20, 15, 10, 5];

export const TRIVIA: [string, string[], number][] = [
  ['How many sides does a hexagon have?', ['5', '6', '7', '8'], 1],
  ['Which planet is called the Red Planet?', ['Venus', 'Jupiter', 'Mars', 'Mercury'], 2],
  ['What is the chemical symbol for gold?', ['Go', 'Gd', 'Ag', 'Au'], 3],
  ['What is the largest ocean on Earth?', ['Pacific', 'Atlantic', 'Indian', 'Arctic'], 0],
  ['What is the capital of Canada?', ['Toronto', 'Ottawa', 'Vancouver', 'Montreal'], 1],
  ['What is the smallest prime number?', ['0', '1', '2', '3'], 2],
  ['Which gas do plants absorb from the air?', ['Oxygen', 'Nitrogen', 'Helium', 'Carbon dioxide'], 3],
  ['How many bones are in the adult human body?', ['186', '206', '226', '256'], 1],
  ['Who painted the Mona Lisa?', ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli'], 0],
  ['How many minutes are in a day?', ['1,140', '1,240', '1,400', '1,440'], 3],
  ['Which language has the most native speakers?', ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'], 2],
  ['What is the hardest natural substance?', ['Quartz', 'Diamond', 'Iron', 'Granite'], 1],
];

// Population in millions, 2024 estimates.
export const POP: [string, number][] = [['India', 1451], ['China', 1419], ['USA', 345], ['Indonesia', 283], ['Pakistan', 251], ['Nigeria', 233], ['Brazil', 212], ['Bangladesh', 174], ['Russia', 144], ['Ethiopia', 132], ['Mexico', 131], ['Japan', 124], ['Egypt', 116], ['Vietnam', 101], ['Iran', 91], ['Turkey', 87], ['Germany', 84], ['Thailand', 72], ['UK', 69], ['France', 66], ['South Africa', 64], ['Italy', 59], ['Kenya', 56], ['Colombia', 53], ['South Korea', 52], ['Spain', 48], ['Argentina', 46], ['Canada', 40], ['Australia', 27], ['Netherlands', 18]];
