import { RuntimeConfig } from "nuxt/schema";

export const getPictoFromPictohub = async (config: RuntimeConfig,search: string, searchLocale: string, additionnalLocales: string[] = [], limit=1): Promise<BasePictogram[]> => {
    // For words that have a dash, replace it with a space
    // Pictogram suggestions that have more than a word are separated by a dash
    search = search.replace('-', ' ');
  
    console.debug("[main] getPictoFromPictohub", search, searchLocale, additionnalLocales)
    let queryParams = [
      `term=${search}`,
      `path[]=keywords.${searchLocale}.keyword`,
      `index=keyword`,
      `path[]=keywords.${searchLocale}.synonymes`,
      `path[]=keywords.${searchLocale}.lexical_siblings`,
      `path[]=keywords.${searchLocale}.conjugates.verbe_m`,
      `path[]=keywords.${searchLocale}.conjugates.verbe_f`,
      `path[]=keywords.${searchLocale}.plural`,
      `lang[]=${searchLocale}`,
      `completeIfEmpty=true`,
      `limit=${limit}`,
    ].join('&');
  
    if (additionnalLocales.length > 0) {
      additionnalLocales.forEach((additionnalLocale) => {
        queryParams += `&lang[]=${additionnalLocale}`
      })
    }
    // Gracefully handle the case where the pictohub API is not available with a try/catch
    try {
      let data: BasePictogram[] = await $fetch(`${config.public.pictohub.PICTOHUB_API_URL}?${queryParams}`, {
        method: 'GET',
        headers: {
          'x-api-key': config.public.pictohub.PICTOHUB_API_KEY
        }
      });
      console.log("[main] getPictoFromPictohub", data)
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }