import { PictogramPropositions } from "./store-types";
import { useMiniPictohubDatabase } from "./mini-pictohub-db";
import { MiniPictogram, Pictogram } from "./store-types";
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
        async getPictogram(keyword: string, locale = "fr"): Promise<BasePictogram> {
            const options = useOptions();
            const config = useRuntimeConfig();
            const useMiniPictohubDb = useMiniPictohubDatabase();
            let singleWordPictogram = await useMiniPictohubDb.getMiniPictogram(keyword, locale);
            if (!singleWordPictogram) {
                singleWordPictogram = await getPictoFromPictohub(config, keyword, locale, [options.locale, 'en'], 5);
            }
            return singleWordPictogram;
        },
        async traduction(textInput: string): Sentence {
            const options = useOptions();
            const config = useRuntimeConfig();
            const useMiniPictohubDb = useMiniPictohubDatabase();
            const sentence: Sentence = {
                items: [] as Array<SentenceItems>,
                text_input: textInput,
            };
            // Remove trailing spaces
            textInput = textInput.trim();
            const tokens = textInput.split(' ');
            console.log("Tokens: ", tokens);
            let start = 0;
        
            while (start < tokens.length) {
                let found = false;
                if (options.simplifyTranslation) {
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
                }
        
                if (!found) {
                    // Handling single word (no match found in phrases)
                    let singleWordPictogram = await this.getPictogram(tokens[start]);
                    if (singleWordPictogram) {
                        sentence.items.push({
                            token: tokens[start],
                            state: {
                                status: singleWordPictogram ? 'fetched' : 'not_fetched',
                                error: undefined,
                            },
                            pictogramPropositions: { selected: 0, pictograms: singleWordPictogram},
                            source: 'mini-pictohub',
                        });
                    }  
                    
                    start++;
                }
            }
            let sentencePictogramPropositions: PictogramPropositions[] =  sentence.items.map((item: SentenceItems) => item.pictogramPropositions);
            sentencePictogramPropositions = sentencePictogramPropositions.filter((pictogramPropositions: PictogramPropositions) => pictogramPropositions && pictogramPropositions.pictograms.length > 0);
            console.log("Final sentence: ", sentence);
            this.pictogramsPropositions = sentencePictogramPropositions;
            return sentence;
        },        
        isSentenceComplete(sentence: Sentence): boolean {
            return sentence.items.every((item: SentenceItems) => item.state.status === 'fetched');
        }
    },
});

