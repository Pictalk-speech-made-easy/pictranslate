export interface History {
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