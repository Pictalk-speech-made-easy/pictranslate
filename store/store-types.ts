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

type Pictogram = {
    _id: {
        $numberInt: string;
    };
    schematic?: boolean;
    sex: boolean;
    violence: boolean;
    aac?: boolean;
    aacColor?: boolean;
    skin?: boolean;
    hair?: boolean;
    downloads: {
        $numberInt: string;
    };
    categories: string[];
    synsets: string[];
    tags: string[];
    created: string;
    lastUpdated: string;
    keywords: {
        fr: Keyword[];
        en: Keyword[];
        [key: string]: Keyword[]; // For other languages
    };
    external_alt_image: string;
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

export interface MiniPictogram {
    type: {
        $numberInt: string,
    };
    keyword: string,
    hasLocution: boolean,
    plural?: string,
    linguistic_category?: string,
    categories: string[],
    tags: string[],
    violence: boolean,
    sex: boolean,
    external_alt_image: string,
    keywords: {
        fr: Keyword[];
        en: Keyword[];
        [key: string]: Keyword[]; // For other languages
    },
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
