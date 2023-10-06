// Variable that contains the prepositions of various languages
export const prepositions: Object = {
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

const personal_pronouns = {
  fr: { je: "moi", tu: "toi", il: "il", elle: "she", nous: "nous", vous: "vous", ils: "ils", elles: "elles" },
  en: { i: "me", you: "you", he: "him", she: "her", we: "us", they: "them" },
}

// Fonction qui prend en entrée une phrase et qui retourne un tableau de mots sans les prépositions
// Exemple : "le chat est sur la table" => ["chat", "est", "table"]
export function removePrepositions(sentence: string, lang: string) {
  // If the language is french, we remove the l'
  if (lang === "fr") {
    sentence = sentence.replace("l'", "");
    sentence = sentence.replace("d'", "");
  }

  sentence = cleanSentence(sentence);
  const words = sentence.split(" ");
  if (!prepositions[lang]) {
    return words;
  }
  const preps = prepositions[lang];
  let filteredWords = words.filter((word) => !preps.includes(word));
  filteredWords = filteredWords.map((word) => {
    if (Object.keys(personal_pronouns[lang]).includes(word)) {
      return personal_pronouns[lang][word];
    }
    return word;
  }
  )


  return filteredWords;
}

// Fonction qui nettoie une phrase de caractères spéciaux
// Exemple : "le chat est, sur la table !?" => "le chat est sur la table"
export function cleanSentence(sentence: string) {
  const clean = sentence.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
  return clean;
}