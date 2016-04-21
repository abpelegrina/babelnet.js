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

