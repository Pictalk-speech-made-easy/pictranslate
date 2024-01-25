// Variable that contains the prepositions of various languages
export const prepositions = {
  en: ["a", "an", "the", "of", "in", "for", "on", "with", "to", "by", "about"],
  es: [
    "el",
    "la",
    "los",
    "las",
    "de",
    "en",
    "para",
    "por",
    "sobre",
    "con",
    "a",
    "al",
    "ante",
    "bajo",
    "cabe",
    "contra",
    "desde",
    "durante",
    "entre",
    "hacia",
    "hasta",
    "mediante",
    "salvo",
    "según",
    "sin",
    "so",
    "sobre",
    "tras",
    "versus",
    "vía",
  ],
  pt: [
    "o",
    "a",
    "os",
    "as",
    "um",
    "uma",
    "uns",
    "umas",
    "de",
    "em",
    "para",
    "por",
    "sobre",
    "com",
    "a",
    "ao",
    "à",
    "às",
    "ante",
    "após",
    "até",
    "com",
    "contra",
    "de",
    "desde",
    "entre",
    "para",
    "per",
    "perante",
    "por",
    "sem",
    "sob",
    "sobre",
    "trás",
  ],
  fr: [
    "un",
    "ce",
    "une",
    "le",
    "la",
    "les",
    "de",
    "du",
    "des",
    "à",
    "au",
    "aux",
    "en",
    "pour",
    "sur",
    "par",
    "dans",
    "sous",
    "entre",
    "vers",
    "contre",
    "chez",
    "pendant",
    "depuis",
    "jusqu'à",
    "selon",
    "sans",
    "versus",
    "via",
  ],
};

const personal_pronouns: { [key: string]: { [key: string]: string } } = {
  fr: { je: "moi", tu: "toi", il: "il", elle: "elle", nous: "nous", vous: "vous", ils: "ils", elles: "elles" },
  en: { i: "me", you: "you", he: "him", she: "her", we: "us", they: "them" },
  es: {},
  pt: {},
}

/**
 * @param sentence The sentence to remove prepositions from
 * @param lang The language of the sentence
 * @returns The sentence without prepositions
 * @example removePrepositions("le chat est sur la table", "fr") // ["chat", "est", "table"]
 */
export function removePrepositions(sentence: string, lang: 'en' | 'fr' | 'es' | 'pt'): string[] {
  console.log(sentence);
  if (lang === "fr") {
    console.log("replace ’ by '", sentence)
    sentence = sentence.replace("’", "'")
    console.debug("[RemovePrepositions] Removing prepositions from french sentence");
    sentence = sentence.replace("l'", "");
    console.log("replace l' by nothing", sentence);
    sentence = sentence.replace("j'", "je ");
    console.log("replace j' by je", sentence);
    sentence = sentence.replace("d'", "");   
    console.log("replace d' by nothing", sentence);
    sentence = sentence.replace("qu'", "que ");
    console.log("replace qu' by que", sentence);
    sentence = sentence.replace("n'", "");
    console.log("replace n' by nothing", sentence);
    sentence = sentence.replace(" ai ", " avoir ");
    console.log("replace ai by avoir", sentence);
    console.log(sentence);
  }
  sentence = sentence.replace(/[^A-zÀ-ÿ\s]|_/g, "").replace(/\s+/g, " ");
  const words = sentence.split(" ");
  if (prepositions[lang] === undefined ||useOptions().removePrepositions === false) {
    return words;
  }
  const preps = prepositions[lang];
  // We need to filter empty strings
  let filteredWords = words.filter((word) => !preps.includes(word) && word !== "");
  filteredWords = filteredWords.map((word) => {
    const pronoun = personal_pronouns[lang][word]
    return pronoun ? pronoun : word;
  });
  return filteredWords;
}

import nlp from 'fr-compromise'
/**
 * 
 * @param sentence The sentence to lemmatize
 * @returns The lemmatized sentence words
 * @example lemmatize("le chat est sur la table") // ["chat", "être", "sur", "table"]
 */
export function lemmatize(sentence: string): string[] {
  const doc = nlp(sentence);
  doc.compute('root');
  console.debug("[Lemmatize] Sentence: ",sentence)
  const words = doc.json()[0].terms.map((term: any) => {
    console.debug("[Lemmatize] Term: ",term)
    if(term.chunk == 'Verb') return term.root;
    if (term.chunk == 'Noun') {
      if (term.implicit) return term.implicit;
      //if (term.root) return term.root;
      return term.text;
    }
    return term.text;
  });
  return words.filter((word: string) => word !== '');
}

/**
 * @param sentence The sentence to manually remove prepositions from
 * @returns The sentence without prepositions
 * @example removePrepositions("Je vais a la montagne") // ["je", "aller", "la", "montagne"]
 */
export function removePrepositionsManually(sentence: string): string {
  if (sentence.includes("aller a")) {
    sentence = sentence.replace("aller a", "aller");
  }
  return sentence;
}