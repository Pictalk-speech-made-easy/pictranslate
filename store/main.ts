import { PictogramPropositions } from "./store-types";
import { useMiniPictohubDatabase } from "./mini-pictohub-db";
export const useMain = defineStore('main', {
    state: () => ({
        textInput: '' as string,
        pictogramsPropositions: [] as Array<PictogramPropositions>,
        suggestedPictograms: [] as Array<PictogramPropositions>,
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
        async traduction(textInput: string): Sentence {
            const useMiniPictohubDb = useMiniPictohubDatabase();
            const sentence: Sentence = {
                items: [] as Array<SentenceItems>,
                text_input: textInput,
            };
        
            const tokens = textInput.split(' ');
            let start = 0;
        
            while (start < tokens.length) {
                let found = false;
                for (let end = tokens.length; end > start; end--) {
                    const phrase = tokens.slice(start, end).join(' ');
                    const pictogram = await useMiniPictohubDb.getMiniPictogram(phrase);
                    if (pictogram) {
                        sentence.items.push({
                            token: phrase,
                            state: {
                                status: 'fetched',
                                error: undefined,
                            },
                            pictogramPropositions: { selected: 0, pictograms: pictogram},
                            source: 'mini-pictohub',
                        });
                        start = end;
                        found = true;
                        break;
                    }
                }
        
                if (!found) {
                    // Handling single word (no match found in phrases)
                    const singleWordPictogram = await useMiniPictohubDb.getMiniPictogram(tokens[start]);
                    sentence.items.push({
                        token: tokens[start],
                        state: {
                            status: singleWordPictogram ? 'fetched' : 'not_fetched',
                            data: singleWordPictogram,
                            error: undefined,
                        },
                        source: 'mini-pictohub',
                    });
                    start++;
                }
            }
            let sentencePictogramPropositions: PictogramPropositions[] =  sentence.items.map((item: SentenceItems) => item.pictogramPropositions);
            sentencePictogramPropositions = sentencePictogramPropositions.filter((pictogramPropositions: PictogramPropositions) => pictogramPropositions && pictogramPropositions.pictograms.length > 0);
            this.pictogramsPropositions = sentencePictogramPropositions;
            return sentence;
        },        
        isSentenceComplete(sentence: Sentence): boolean {
            return sentence.items.every((item: SentenceItems) => item.state.status === 'fetched');
        }
    },
});

