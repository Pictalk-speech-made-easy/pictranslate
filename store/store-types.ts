export interface HistoryItem {
    text_input: string,
    pictogramsPropositions: Array<PictogramPropositions>,
    created: Date,
    last_used: Date,
    times_used: number,
}

export interface PictogramPropositions {
    selected: number,
    pictograms: Array<any>,
}

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
}
