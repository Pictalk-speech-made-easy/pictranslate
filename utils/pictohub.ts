import type { RuntimeConfig } from "nuxt/schema";

export const getPictoFromPictohub = async (config: RuntimeConfig,search: string, searchLocale: string, additionnalLocales: string[] = [], limit=1, format='png'): Promise<PictohubV2Document[]> => {
    // For words that have a dash, replace it with a space
    // Pictogram suggestions that have more than a word are separated by a dash
    search = search.replace('-', ' ');
  
    console.debug("[main] getPictoFromPictohub", search, searchLocale, additionnalLocales)
    let queryParams = [
      `term=${search}`,
      `path[]=translations.${searchLocale}.word`,
      `index=search`,
      `path[]=translations.${searchLocale}.synonyms`,
      `path[]=translations.${searchLocale}.definition`,
      `path[]=translations.${searchLocale}.lexical_siblings`,
      `path[]=translations.${searchLocale}.lvf_entries.meaning`,
      `path[]=translations.${searchLocale}.fr_domain_desc`,
      `path[]=translations.${searchLocale}.plural`,
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
      let data: PictohubV2Document[] = await $fetch(`${config.public.pictohub.PICTOHUB_API_URL}?${queryParams}`, {
        method: 'GET',
        headers: {
          'x-api-key': config.public.pictohub.PICTOHUB_API_KEY
        }
      });
      // For each pictogram, replace the image URL with the one from the pictohub
      data = data.map(pictogram => {
        pictogram.images.map(image => {
            image.url = `https://images.pictohub.org/${image.url}?preferredformat=${format}`
        });
        return pictogram;
    });
      console.log("[main] getPictoFromPictohub", data)
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }