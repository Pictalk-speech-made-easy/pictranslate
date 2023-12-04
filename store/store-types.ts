export interface HistoryItem {
    text_input: string,
    pictogramsPropositions: Array<PictogramPropositions>,
    created: Date,
    last_used: Date,
    times_used: number,
}

export interface PictogramPropositions {
    selected: number,
    pictograms: Array<Pictogram | MiniPictogram>,
}

export type BasePictogram = {
    sex: boolean;
    violence: boolean;
    categories: string[];
    synsets: string[];
    tags: string[];
    external_alt_image: string;
    keywords: {
        fr: Keyword[];
        en: Keyword[];
        [key: string]: Keyword[]; // For other languages
    },
}

export type Pictogram = BasePictogram & {
    _id: {
        $numberInt: string;
    };
    schematic?: boolean;
    aac?: boolean;
    aacColor?: boolean;
    skin?: boolean;
    hair?: boolean;
    downloads: {
        $numberInt: string;
    };
    created: string;
    lastUpdated: string;
    image: string[];
};


type Keyword = {
    type: {
        $numberInt: string;
    };
    keyword: string;
    hasLocution: boolean;
    plural?: string;
    linguistic_category?: string;
    synonymes?: string[];
    lexical_siblings?: string[];
    conjugates?: any[];
};

export type MiniPictogram = BasePictogram & {
    type: {
        $numberInt: string,
    };
    keyword: string,
    hasLocution: boolean,
    plural?: string,
    linguistic_category?: string,
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

export type StimulusResponse = {
    stimulus: string,
    probability: number,
    responses: BasePictogram[],
}

export type ObjectAccessInfo = {
    count: number;
    lastAccessed: number;
}
