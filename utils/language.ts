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
    sentence = sentence.replace("l'", "");
    sentence = sentence.replace("d'", "");
    sentence = sentence.replace("'ai ", "'avoir ");
    sentence = sentence.replace("j'", "je ");
  }
  sentence = sentence.replace(/[^A-zÀ-ÿ\s]|_/g, "").replace(/\s+/g, " ");
  const words = sentence.split(" ");
  if (prepositions[lang] === undefined) {
    return words;
  }
  const preps = prepositions[lang];
  // We need to filter empty strings
  let filteredWords = words.filter((word) => !preps.includes(word) && word !== "");
  filteredWords = filteredWords.map((word) => {
    const pronoun = personal_pronouns[lang][word]
    return pronoun ? pronoun : word;
  });
  console.log(filteredWords);
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
  console.log(doc.json());
  const words = doc.json()[0].terms.map((term: any) => {
    if(term.chunk !== 'Verb') return term.text;
    return term.root ? term.root : term.text
  });
  return words.filter((word: string) => word !== '');
}