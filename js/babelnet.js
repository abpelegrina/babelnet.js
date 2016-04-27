/**
 * @file This file contains the BabelNet class declaration and all his methods
 */

/**
 * Class that wraps the BabelNet and Babelfy APIs
 * @constructor
 */
function BabelNet(){
	this.KEY = '';
    this.baseURL = 'https://babelnet.io/v3/';
    this.getSynsetURL = 'getSynset';
    this.getSynsetIdsURL =  'getSynsetIds';
    this.getVersionURL = 'getVersion';
    this.getSensesURL = 'getSenses';
    this.getEdgesURL = 'getEdges';
    this.getVersionURL = 'getVersion';
    this.babelfyURL = 'https://babelfy.io/v1/disambiguate';
};

/** Get the current version of the BabelNet API 
*/
BabelNet.prototype.getVersion = function(){
    var params = {        
        'key' : this.KEY
    };
    return $.getJSON(this.baseURL + this.getVersionURL + "?", params);
};


/**
 * Retrieve the IDs of the Babel synsets (concepts) denoted by a given word
 * @param {string} word  - The word you want to search for
 * @param {Langs} lang  - The language of the word
 * @param {array} filterLangs  - The languages in which the data are to be retrieved
 * @param {PartOfSpeech} POS  - Returns only the synsets containing this part of speech (NOUN, VERB, etc)
 * @param {Source} source  - Returns only the synsets containing these sources (WIKT, WIKIDATA, etc)
 * @param {boolean} normalizer  - Enables normalized search
 */
BabelNet.prototype.getSynsetIds = function (word, lang, filterLangs=[], POS='', source='', normalizer=true){
    var params = {
        'word': word,
        'langs': lang,
        'key' : this.KEY
    };

    if (source in Source)
        params['source'] = source;

    if(POS in PartOfSpeech)
        params['POS'] = POS;

    var url = this.baseURL + this.getSynsetIdsURL + "?";
    filterLangs.slice(0,3).forEach(function(lang){
        url += 'filterLangs=' + lang + '&';
    });

    if(normalizer)
        params['normalizer'] = true;

    return $.getJSON(url, params);
}


/**
 * Retrieve the information of a given synset
 * @param {string} id  - The ID of the synset
 * @param {Langs} lang  - The languages in which the data are to be retrieved.
 */
BabelNet.prototype.getSynset = function(id,lang){
    var params = {
        'id'  : id,
        'key' : this.KEY,
        'filterLangs' : lang
    };
    return $.getJSON(this.baseURL + this.getSynsetURL + "?", params);
};


/**
 * Retrieve the senses of a given word
 * @param {string} word  - The word you want to search for
 * @param {Langs} lang  - The language of the word
 * @param {array} filterLangs  - The languages in which the data are to be retrieved
 * @param {PartOfSpeech} POS  - Returns only the synsets containing this part of speech (NOUN, VERB, etc)
 * @param {Source} source  - Returns only the synsets containing these sources (WIKT, WIKIDATA, etc)
 * @param {boolean} normalizer  - Enables normalized search
 */
BabelNet.prototype.getSenses = function (word, lang, filterLangs=[], POS='', source='', normalizer=false){
    var params = {
        'word': word,
        'lang': lang,
        'key' : this.KEY
    };

    if (source in Source)
        params['source'] = source;

    if(POS in PartOfSpeech)
        params['POS'] = POS;

    var url = this.baseURL + this.getSensesURL + "?";
    filterLangs.slice(0,3).forEach(function(lang){
        url += 'filterLangs=' + lang + '&';
    });

    if(normalizer)
        params['normalizer'] = true;

    return $.getJSON(url, params);
}


/**
 * Retrieve a list of BabelNet IDs given a resource identifier
 * @param {string} id  - The word you want to search for
 * @param {Source} source  - Returns only the synsets containing these sources (WIKT, WIKIDATA, etc)
 * @param {Langs} lang  - The language of the word
 * @param {array} filterLangs  - The languages in which the data are to be retrieved
 * @param {PartOfSpeech} POS  - Returns only the synsets containing this part of speech (NOUN, VERB, etc)
 */
BabelNet.prototype.getSynsetIdsFromResourceID = function(id, source, lang, filterLangs=[], POS=''){
    var params = {
        'id':id,
        'key': this.KEY,
        'source' : source
    };

    if (source == Source.WIKIQU || source==Source.WIKI){
        if(POS in PartOfSpeech)
            params['POS'] = POS;
        params['lang'] = lang;
    }

    var url = this.baseURL + this.getSensesURL + "?";
    filterLangs.slice(0,3).forEach(function(lang){
        url += 'filterLangs=' + lang + '&';
    });

    return $.getJSON(this.baseURL + this.getEdgesURL + "?", params);    
}


/**
 * Retrieve edges of a given BabelNet synset
 * @param {string} id  - The ID of the synset
 */
BabelNet.prototype.getEdges = function(id){
    var params = {
        'id':id,
        'key': this.KEY
    };

    return $.getJSON(this.baseURL + this.getEdgesURL + "?", params);    
}

/**
Disambiguate a text
 * @param {string} text  - he text you want to disambiguate
 * @param {Langs} lang  - The language of the text
 * @param {SemanticAnnotationType} annType  - It allows to restrict the disambiguated entries to only named entities, word senses or both
 * @param {SemanticAnnotationResource} annRes  - It allows to restrict the disambiguated entries to only WordNet, Wikipedia or BabelNet.
 * @param {double} th  - the cutting threshold.
 * @param {MatchingType} match  - Select the candidate extraction strategy
 * @param {MCS} mcs  - enable or disable the most common sense backoff strategy
 * @param {boolean} dens  -Enable or disable the densest subgraph heuristic during the disambiguation pipeline.
 * @param {ScoredCandidates} cands  - Wether you get a scored list of candidates or only the top ranked one
 * @param {PosTaggingOptions} posTag  -  Select the tokenization and pos-tagging pipeline for your input text
 * @param {boolean} extAIDA  - Extend the candidates sets with the aida_means relations
*/
BabelNet.prototype.disambiguate = function(text, lang, annType='', annRes='', th='', match='', mcs='', dens='', cands='', posTag='', extAIDA=''){
    var params = {
        'text' : text,
        'lang' : lang,
        'key'  : this.KEY
    };

    if (annType in SemanticAnnotationType)
        params['annType'] = annType;

    if (annRes in SemanticAnnotationResource)
        params['annRes'] = annRes;

    if ($.isNumeric(th))
        params['th'] = th;

    if(match in MatchingType)
        params['match'] = match;

    if(mcs in MCS)
        params['mcs'] = mcs;

    if(typeof(dens) === "boolean")
        params['dens']= dens;

    if (cands in ScoredCandidates)
        params['cands'] = cands;

    if (posTag in PosTaggingOptions)
        params['posTag'] = posTag;

    if(typeof(extAIDA) === "boolean")
        params['extAIDA']= extAIDA;    

    return $.getJSON(this.babelfyURL + "?", params);
}

