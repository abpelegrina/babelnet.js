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
BabelNet.prototype.getSynsetGlosses = function(id,lan, callback){
    this.getSynset(id,lan).done(function(response){
        $.each(response['glosses'], function (key, val){callback(key, val)});
    });
};

/**
 * 
 */
BabelNet.prototype.getSynsetIds = function (word,lang){
    var params = {
        'word': word,
        'langs': lang,
        'key' : this.KEY
    };
    return $.getJSON(this.baseURL + this.getSynsetIdsURL + "?", params);
}

/**
 * 
 */
BabelNet.prototype.getEdges = function(id){
    var params = {
        'id':id,
        'key': babel.KEY
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

