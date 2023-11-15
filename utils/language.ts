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
    "avec",
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
export function removePrepositions(sentence: string, lang: 'en' | 'fr' | 'es' | 'pt') {
  sentence = cleanSentence(sentence);
  const words = sentence.split(" ");
  if (prepositions[lang] === undefined) {
    return words;
  }
  // If the language is french, we remove the l'
  if (lang === "fr") {
    sentence = sentence.replace("l'", "");
    sentence = sentence.replace("d'", "");
    sentence = sentence.replace("j'", "je ");
  }
  const preps = prepositions[lang];
  // We need to filter empty strings
  let filteredWords = words.filter((word) => !preps.includes(word) && word !== "");
  return filteredWords.map((word) => {
    const pronoun = personal_pronouns[lang][word]
    return pronoun ? pronoun : word;
  });
}
/**
 * @param sentence The sentence to clean
 * @returns The cleaned sentence
 * @example cleanSentence("le chat est, sur la table !?") // "le chat est sur la table"
 */
export function cleanSentence(sentence: string) {
  const clean = sentence.replace(/[^A-zÀ-ÿ\s]|_/g, "").replace(/\s+/g, " ");
  return clean;
}