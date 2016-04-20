/**
 * 
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
/**
 *
*/
BabelNet.prototype.getVersion = function(){
    var params = {        
        'key' : this.KEY
    };
    return $.getJSON(this.baseURL + this.getVersionURL + "?", params);
};


/**
 * 
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
 * 
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
 * 
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
 * 
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
 * 
 */
BabelNet.prototype.getEdges = function(id){
    var params = {
        'id':id,
        'key': this.KEY
    };

    return $.getJSON(this.baseURL + this.getEdgesURL + "?", params);    
}

/**
 * 
 */
BabelNet.prototype.disambiguate = function(text, lang, match='EXACT_MATCHING'){
    var params = {
        'text' : text,
        'lang' : lang,
        'key'  : this.KEY
    };

    return $.getJSON(this.babelfyURL + "?", params);
}

