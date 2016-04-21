/**
 *
 */

/* PART OF SPEECH  (POS) possible values */
var PartOfSpeech = Object.freeze({
                        ADJECTIVE: 'ADJECTIVE', 
                        ADVERB: 'ADVERB', 
                        ARTICLE: 'ARTICLE', 
                        CONJUNCTION:'CONJUNCTION', 
                        DETERMINER:'DETERMINER', 
                        INTERJECTION:'INTERJECTION',
                        NOUN : 'NOUN',
                        PREPOSITION : 'PREPOSITION',
                        PRONOUN : 'PRONOUN',
                        VERB : 'VERB'
                    });

/* Sources */
var Source = Object.freeze({
                        BABELNET: 'BABELNET', 
                        GEONM: 'GEONM', 
                        IWN: 'IWN', 
                        MSTERM:'MSTERM', 
                        OMWIKI:'OMWIKI', 
                        OMWN:'OMWN',
                        VERBNET : 'VERBNET',
                        WIKI : 'WIKI',
                        WIKIDATA : 'WIKIDATA',
                        WIKICAT : 'WIKICAT',
                        WIKIDIS: 'WIKIDIS', 
                        WIKIQU: 'WIKIQU', 
                        WIKIQUREDI: 'WIKIQUREDI', 
                        WIKIRED:'WIKIRED', 
                        WIKITR:'WIKITR', 
                        WIKT:'WIKT',
                        WIKTLB : 'WIKTLB',
                        WN : 'WN',
                        WNTR : 'WNTR',
                        WONEF : 'WONEF'
                    });

/*Languages*/
var Languages = Object.freeze({
                        ES: 'ES', 
                        EN: 'EN', 
                        FR: 'FR'
                    });


/*Type of relations*/
var TypeOfRelations = Object.freeze({
                        HYPERNYM: 'HYPERNYM', 
                        HYPONYM: 'HYPONYM', 
                        MERONYM: 'MERONYM', 
                        HOLONYM: 'HOLONYM',
                        OTHER: 'OTHER', 
                    });


var ScoredCandidates = Object.freeze({
                        ALL: 'ALL', 
                        TOP: 'TOP'
                    });
/*
Part of Speech tagging option. See https://babelfy.io/javadoc/it/uniroma1/lcl/babelfy/commons/BabelfyParameters.PosTaggingOptions.html
*/
var PosTaggingOptions = Object.freeze({
                        CHAR_BASED_TOKENIZATION_ALL_NOUN : 'CHAR_BASED_TOKENIZATION_ALL_NOUN',
                        INPUT_FRAGMENTS_AS_NOUNS : 'INPUT_FRAGMENTS_AS_NOUNS',
                        NOMINALIZE_ADJECTIVES : 'NOMINALIZE_ADJECTIVES',
                        STANDARD : 'STANDARD'

});