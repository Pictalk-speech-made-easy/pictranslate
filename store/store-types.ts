export interface History {
    text_input: string,
    pictogramsPropositions: Array<{'selected': number, 'pictograms': Array<any>}>,
    created: Date,
    last_used: Date,
    times_used: number,
}