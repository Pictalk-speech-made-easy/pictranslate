export type HistoryItem = {
    text_input: string,
    pictogramsPropositions: Array<PictogramPropositions>,
    created: Date,
    last_used: Date,
    times_used: number,
}

export interface PictogramPropositions {
    selected: number,
    selectedImage?: number,
    pictograms: Array<PictohubV2Document | MiniPictogram>,
}

export type Image = {
    source: typeof ImageSource[number];
    url: string;
    formats?: string[];
}

export const ImageSource = ['arasaac', 'mulberry', 'tawasol', 'sclera'] as const;

export type PictohubV2Document = {
    _id: number;
    filters: Filters;
    analytics: Analytics;
    categories: string[];
    synsets: string[];
    tags: string[];
    created: string;
    updated: string;
    translations: Translations;
    images: Image[];
}

export type Analytics = {
    views: number;
}
export type Filters = {
    schematic?: boolean;
    sex: boolean;
    violence: boolean;
    skin?: boolean;
    hair?: boolean;
}

export type FrenchKeyword = Keyword & {
    fr_gram_cat: French_Grammatical_Category;
    fr_gram_cat_desc: French_Grammatical_Category_Description;
    fr_domain_desc: French_Domain_Description;
    lvf?: boolean;
    //lvf_entries?: LVFEntry[];
}

export type French_Grammatical_Category = "-1" | "-2" | "-3" | "-4" | "-5" | "-6" | "-7" | "-8" | "-9" | "A-" | "K-" | "L-" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "M-" | "Q-" | "R-" | "Vt" | "Vi" | "Vp";
export type French_Grammatical_Category_Description = "nom non-animé masculin" | "nom non-animé féminin" | "nom non-animé des deux genres" | "nom humain des deux genres" | "nom humain masculin" | "nom humain féminin" | "nom animal des deux genres" | "nom animal masculin" | "nom animal féminin" | "adjectif" | "adjectif masculin" | "adjectif féminin" | "adjectif et nom non-animé masculin" | "adjectif et nom non-animé féminin" | "adjectif et nom non-animé des deux genres" | "adjectif et nom humain des deux genres" | "adjectif et nom humain masculin" | "adjectif et nom humain féminin" | "adjectif et nom animal des deux genres" | "adjectif et nom animal masculin" | "adjectif et nom animal féminin" | "adverbe" | "conjonction" | "interjection" | "verbe transitif" | "verbe intransitif" | "verbe pronominal";
export type French_Domain_Description = "administration" | "aéronautique" | "alimentation" | "anatomie" | "animal(petit)" | "arme" | "athropode" | "astronomie" | "automobile" | "oiseau" | "bactérie, virus" | "bâtiment" | "biologie" | "boisson" | "botanique" | "boucherie" | "beaux-arts" | "chirurgie" | "chimie" | "chasse" | "cinéma" | "couleurs" | "commerce" | "cosmétologie" | "couture" | "crustacé" | "culture, agriculture" | "cyclisme" | "départements" | "danse" | "droit" | "économie" | "écriture, écrits" | "électricité" | "élevage" | "enseignement" | "entomologie" | "équitation" | "ethnologie" | "façon, manière" | "fortification" | "gâteau, patisserie" | "géographie" | "géologie" | "antiquité grecque" | "vêtements" | "histoire" | "horlogerie" | "hydrologie" | "informatique" | "jeu" | "lait" | "langue" | "linguistique" | "littérature" | "locatif, lieux" | "parole, parler" | "mammifère" | "manutention" | "marine" | "mathématiques" | "mécanique" | "médecine" | "menuiserie, bois" | "mesure" | "militaire" | "mines" | "mobilier" | "mollusque" | "météorologie" | "métrique" | "musique" | "mythologie" | "nombre" | "objet" | "occultisme" | "océans" | "ver, herpétologie" | "orientalisme" | "papeterie" | "pathologie" | "peausserie" | "pêche" | "peinture industrielle" | "justice, délit" | "pétrole" | "pharmacie" | "philosophie" | "phonétique" | "préhistoire" | "photographie" | "physique" | "poissons" | "plantes" | "politique" | "presse" | "psychiatrie" | "psychologie" | "quantité, quantitatif" | "chemin de fer" | "régions, pays" | "reptiles" | "relation" | "religion" | "antiquité romaine" | "sociologie" | "corps humain" | "spectacle" | "sports" | "sylviculture" | "tabac" | "technique" | "télécommunications" | "textile" | "tourisme" | "temps" | "travaux publics" | "typographie" | "ville" | "vaisselle" | "véhicule, route" | "verrerie" | "viticulture" | "voix, bruit" | "zoologie";

export type Translations = {
    fr : FrenchKeyword[];
    en : Keyword[];
    es : Keyword[];
    de : Keyword[];
    it : Keyword[];
    pt : Keyword[];
}

export type Keyword = {
    word: string;
    plural?: string;
    domain: Domain;
    definition: string;
    gram_cat: Grammatical_Category;
    synonyms?: string[];
    lexical_siblings?: string[];
}

export type Domain = "ADM" | "AER" | "ALI" | "ANA" | "ANI" | "ARM" | "ART" | "AST" | "AUT" | "AVI" | "BAC" | "BAT" | "BIO" | "BOI" | "BOT" | "BOU" | "BXA" | "CHI" | "CHM" | "CHS" | "CIN" | "COL" | "COM" | "COS" | "COU" | "CRU" | "CUL" | "CYC" | "D01" | "DAN" | "DRO" | "ECN" | "ECR" | "ELT" | "ELV" | "ENS" | "ENT" | "EQU" | "ETH" | "FAC" | "FOR" | "GAT" | "GEG" | "GEL" | "GRE" | "HAB" | "HIS" | "HRL" | "HYD" | "INF" | "JEU" | "LAI" | "LAN" | "LIN" | "LIT" | "LOC" | "LOQ" | "MAM" | "MAN" | "MAR" | "MAT" | "MEC" | "MED" | "MEN" | "MES" | "MIL" | "MIN" | "MOB" | "MOL" | "MTO" | "MTR" | "MUS" | "MYT" | "NBR" | "OBJ" | "OCC" | "OCE" | "OMB" | "ORI" | "PAP" | "PAT" | "PEA" | "PEC" | "PEI" | "PEN" | "PET" | "PHA" | "PHI" | "PHN" | "PHS" | "PHT" | "PHY" | "PIS" | "PLA" | "POL" | "PRE" | "PSP" | "PSY" | "QUA" | "RAI" | "REG" | "REP" | "RLA" | "RLG" | "ROM" | "SOC" | "SOM" | "SPE" | "SPO" | "SYL" | "TAB" | "TEC" | "TEL" | "TEX" | "TOU" | "TPS" | "TRA" | "TYP" | "URB" | "VAI" | "VEH" | "VER" | "VIT" | "VOX" | "ZOO" | "UKN";

export type Grammatical_Category = "noun" | "verb" |  "adjective" | "adverb" | "preposition" | "conjunction" | "pronoun" | "interjection";


export type MiniPictogram = PictohubV2Document & {
    word_en: string,
    word: string,
}

export interface Sentence {
    items: Array<SentenceItems>,
    text_input: string,
}

export interface SentenceItems {
    token: string,
    state: State,
    source: "pictohub" | "mini-pictohub" | "pictalk",
    pictogramPropositions?: Array<PictogramPropositions>,
}

export interface State {
    status: 'not_fetched' | 'fetched' | 'error',
    data: any,
    error: any,
}

export interface MiniDatabaseInformations {
    url: string,
    db_name: string,
    date_created: Date,
}

export type GramResponse = {
    gram: string,
    word:string,
    count: number,
    predictions: Array<PictohubV2Document | MiniPictogram>,
}

export type ObjectAccessInfo = {
    count: number;
    lastAccessed: number;
}

export type BundleInformations = {
    packs: Array<Bundle>,
}

export type Bundle = {
    name: string,
    url: string,
    tag: string,
    type: 'avif' | 'webp' | 'png' | 'jpg' | 'jpeg',
    date_created: Date,
}