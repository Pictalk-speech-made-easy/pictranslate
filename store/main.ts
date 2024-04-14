import type { MiniPictogram, PictogramPropositions } from "./store-types";
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
        async getPictogram(keyword: string, locale = "fr"): Promise<PictohubV2Document[]> {
            const options = useOptions();
            const config = useRuntimeConfig();
            const useMiniPictohubDb = useMiniPictohubDatabase();
            console.log("locale: ", locale);
            let singleWordPictogram: MiniPictogram[] | undefined = await useMiniPictohubDb.getMiniPictogram(keyword, locale);
            if (!singleWordPictogram) {
                // we should also register the search in the indexeddb
                const pictogram: PictohubV2Document[] = await getPictoFromPictohub(config, keyword, locale, [options.locale, 'en'], 5, useMiniPictohubDb.format);
                pictogram.forEach(async (picto: PictohubV2Document) => {
                    const miniPictogram = picto as MiniPictogram;
                    miniPictogram.word_en = picto.translations.en[0].word;
                    miniPictogram.word = picto.translations[options.locale][0].word;
                    await useMiniPictohubDb.addMiniPictogram(miniPictogram);
                });
                return pictogram;
            }
            return singleWordPictogram;
        },
        async traduction(textInput: string): Promise<Sentence> {
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
                if (options.simplifyTranslation === false) {
                    for (let end = tokens.length; end > start; end--) {
                        const phrase = tokens.slice(start, end).join(' ');
                        const pictogram = await useMiniPictohubDb.getMiniPictogram(phrase);
                        if (pictogram) {
                            usePreferences().accessObject("preferredSearchTerms",phrase);
                            sentence.items.push({
                                token: phrase,
                                state: {
                                    status: 'fetched',
                                    error: undefined,
                                    data: ""
                                },
                                pictogramPropositions: { selected: 0, pictograms: pictogram} as PictogramPropositions,
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
                        usePreferences().accessObject("preferredSearchTerms",tokens[start]);
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
            console.log("Final sentence: ", sentence);
            let sentencePictogramPropositions: PictogramPropositions[] =  sentence.items.map((item: SentenceItems) => item.pictogramPropositions);
            console.log("Sentence pictogram propositions: ", sentencePictogramPropositions);
            console.log(sentencePictogramPropositions[0]);
            console.log(sentencePictogramPropositions[0].pictograms);
            console.log(sentencePictogramPropositions[0].pictograms.length);
            sentencePictogramPropositions = sentencePictogramPropositions.filter((pictogramPropositions: PictogramPropositions) => pictogramPropositions && pictogramPropositions.pictograms.length > 0);
            console.log("Final sentence: ", sentence);
            this.pictogramsPropositions = sentencePictogramPropositions;
            // console.log("Final sentence pictograms: ", sentencePictogramPropositions);
            return sentence;
        },        
        isSentenceComplete(sentence: Sentence): boolean {
            return sentence.items.every((item: SentenceItems) => item.state.status === 'fetched');
        }
    },
});
