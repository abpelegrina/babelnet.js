/**
 * @file This file contains a few examples of how to use the wrapper.
 * Please note that to use this example you need an API key provided by BabelNet
 */


/**
 * This class serves as an example on how to use the BabelNet class
 * @constructor
 */
function BabelNetExample(bb, ctnr){
    this.babel = bb;
    this.container = ctnr;
}

/** 
Shows an error message when an invalid language is provided 
*/
BabelNetExample.prototype.showErrorLang = function(lang){
    $('<h2><strong>Error</strong>: "'+lang+'" is not a valid language</h2>').appendTo(this.container);
}


/** 
Shows an error message when a HTTP request error happens  
*/
BabelNetExample.prototype.showErrorRequest = function(){
    $('<h2><strong>HTTP request error</strong></h2>').appendTo(this.container);
}

/**
 * Shows the glosses (definitions) for a word in a certain language
 * @param {string} word  - The word you want to search for
 * @param {string} lang  - The language of the word
 */
BabelNetExample.prototype.showGlossesForTerm = function(word, lang){
    this.container.html('');

    var babel = this.babel;
    var container = this.container;
    var example = this;

    if(lang in BabelNetParams.Langs){

        $('<h2>Synsets (concepts) denoted by the word: "'+word+'" in lang "' + lang + '"</h2>').appendTo(this.container);

        this.babel.getSynsetIds(word, [lang]).done(function(response){
            $.each(response, function(key, val) {
               
                babel.getSynset(val['id'],[lang])
                .done(function(response){

                    $('<h3>', {html:val['id']}).appendTo(container);

                    if (Object.keys(response['senses']).length > 0){
    	                var entry = '';
    	                $.each(response['senses'], function(key,value){
    	                    entry += value['lemma'] + ', ';
    	                })
    	
    	                entry = entry.replace(/,\s*$/, "");
    	                $('<em>',{html:entry}).appendTo(container);
    	                $('<br>').appendTo(container);
                    }

                    if (Object.keys(response['glosses']).length > 0){
    	                entry = '';
    	                $.each(response['glosses'], function(key,value){
    	                    entry += "Gloss: " + value['gloss'] + ' (' +value['language'] + ")<br/>";
    	                    
    	                })
    	                $('<div>', {html:entry}).appendTo(container);
    	                $('<hr>').appendTo(container);
                    }
                })
                .fail(example.showErrorRequest);
            });
        }).
        fail(this.showErrorRequest);
    }
    else 
        showErrorLang(lang);        
}


/**
 * Shows the translations for a word in a certain language to another language
 * @param {string} word  - The word you want to search for
 * @param {string} from  - The language of the word
 * @param {string} to  - The language we want to translate the word to
 */
BabelNetExample.prototype.showTranslationsForTerm = function(word, from, to){
    this.container.html('');

    var babel = this.babel;
    var container = this.container;
    var example = this;

    if(from in BabelNetParams.Langs && to in BabelNetParams.Langs){

        $('<h2>Translations for: "'+word+'" in lang "' + to + '"</h2>').appendTo(this.container);

        this.babel.getSynsetIds(word, [from])
        .done(function(response){
            $.each(response, function(key, val) {
            	babel.getSynset(val['id'], [to]).done(function(response){
            		if (Object.keys(response['senses']).length > 0){
    	        		 $('<h3>', {html:val['id']}).appendTo(container);
    	                 var entry = '';
    	                 $.each(response['senses'], function(key,value){
    	                     entry += value['lemma'] + ', ';
    	                 })
    	                 entry = entry.replace(/,\s*$/, "");
    	                 $('<em>',{html:entry}).appendTo(container);
    	                 $('<hr>').appendTo(container);
                     }
            	});
            })
            .fail(example.showErrorRequest);
            
        })
        .fail(this.showErrorRequest);
    }
    else 
        showErrorLang(to+' or ' + from);
}

/**
 * Shows the edges for a given sysnset 
 * @param {string} id  - ID of the synset
 */
BabelNetExample.prototype.showEdgesForSynset = function(id){

    var babel = this.babel;
    var container = this.container;

    this.babel.getEdges(id)
    .done(function(response){
        if (response.length > 0) {
            $('<h3>Edges for the synset: "'+ id +'"</h3>').appendTo(container);
            
            $.each(response, function(key, val) {
                var pointer = val['pointer'];
                var relation = pointer['name'];
                var group = pointer['relationGroup'];

                //Show only hypernym, hyponym and meronym relations
                if (  group == BabelNetParams.TypeOfRelations.HYPERNYM || group == BabelNetParams.TypeOfRelations.HYPONYM || group == BabelNetParams.TypeOfRelations.MERONYM) {
                    var entry = "Language: " + val['language']
                        + "<br/>Target: " + val['target']
                        + "<br/>Relation: " + relation
                        + "<br/>Relation group: " + group + "<br/><br/>";
                    $('<div>', {html:entry}).appendTo(container);
                }
            });
        }
    })
    .fail(this.showErrorRequest);
}

/**
 * Shows the edges for a given word 
 * @param {string} word  - the word
 * @param {string} from  - The language of the word
 */
BabelNetExample.prototype.showEdgesForTerm = function(word, lang){
    this.container.html('');
    var example = this;
    if(lang in BabelNetParams.Langs){

        this.babel.getSynsetIds(word, [lang])
        .done(function(response){
             $.each(response, function(key, val) {
                 example.showEdgesForSynset(val['id']);
             });
        })
        .fail(this.showErrorRequest);
    }
    else
       showErrorLang(lang);
}

/**
 * Shows the compound words for a given synset
 * @param {string} id  - ID of the synset
 * @param {string} from  - The language of the compund words
 */
BabelNetExample.prototype.showCompoudWordsForSynset = function(id, lang){

    var babel = this.babel;
    var container = this.container;

    this.babel.getSynset(id, [lang])
    .done(function(response){
        var entry = new Array();
        $.each(response['lnToCompound'], function(key,value){
            entry.push.apply(entry,value);
        })
        entryStr = entry.join(', ');
        if(entryStr != ''){
            $('<h3>Compound words for the synset: "'+id+'"</h3>').appendTo(container);
            $('<em>',{html:entryStr}).appendTo(container);
            $('<br>').appendTo(container);
        }
    })
    .fail(this.showErrorRequest);
}

/**
 * Shows the compound words for a given synset
 * @param {string} word  - the word
 * @param {string} from  - The language of the compund words
 */
BabelNetExample.prototype.showCompoundWordsForTerm = function(word, lang){
    this.container.html('');
    var babel = this.babel;
    var container = this.container;
    var example = this;
    if(lang in BabelNetParams.Langs){
        babel.getSynsetIds(word,[lang])
        .done(function(response){
             $.each(response, function(key, val) {
                 example.showCompoudWordsForSynset(val['id'], lang);
             })
            .fail(example.showErrorRequest);
        })
        .fail(this.showErrorRequest);
    }
    else
        showErrorLang(lang);
}

/**
 * This function counts the number of words in a string
 * @param {string} str - the string
 * @return {int} nomber of words in the string
 @private
 */
function countWordsInString(str){
    return str.split(' ').length;
}

/**
 * @private
 */
BabelNetExample.prototype.compareNumberofWords = function(a,b){        
    var numWordsA = countWordsInString(a.synset);
    var numWordsB = countWordsInString(b.synset);

    if (numWordsA < numWordsB)
        return 1;
    else if (numWordsA > numWordsB)
        return -1;
    else 
        return 0;
}


/**
 * This functions tags a text with span html elements according to the set of matches
 * @param {string} sentence - text to highlight
 * @param {array} m - array with all the matching texts
 * @returns {string} the text tagged with the matched synsets 
 */
BabelNetExample.prototype.tagDisambiguation = function(sentence, m){

    m.sort(this.compareNumberofWords);

    var highlighted = '#' + sentence + '#';
    $.each(m, function(key, val) {
        var fragments = highlighted.split(val.synset);

        highlighted = fragments[0];
        for (var i = 1; i<fragments.length; i++){
            highlighted += '<span id="'+val.id+'" class="highlight">' + val.synset + '</span>' + fragments[i];
        }
    });

    return highlighted.substring(1, highlighted.length-1);
}

/**
 * Disambiguates a text using the Babelfy API call disambiguate
 * @param {string} text - the text to disambiguate
 * @param {string} lang - the language of the text
 */
BabelNetExample.prototype.showDisambiguation = function(text, lang){
    this.container.html('<h2>Disambiguation for sentence: "'+text+'"</h2>');

    var babel = this.babel;
    var container = this.container;
    var example = this;

    if(lang in BabelNetParams.Langs){

        babel.disambiguate(text.toUpperCase(),lang/*, '','',0.5, '', MCS.ON_WITH_STOPWORDS/*, SemanticAnnotationType.ALL, SemanticAnnotationResource.BN, 0.0, MatchingType.EXACT_MATCHING*/)
        .done(function(response) {

            var matches = [];

            $.each(response, function(key, val) {
                // retrieving char fragment
                var charFragment = val['charFragment'];
                var cfStart = charFragment['start'];
                var cfEnd = charFragment['end'];           

                var synsetID = val['babelSynsetID'];

                var inArray = $.grep(matches, function(e){ return e.id == synsetID; }).length;

                if (inArray == 0)
                    matches.push({id:synsetID, synset:text.substring(cfStart, cfEnd+1)});
            });


            var highlightedSentence = example.tagDisambiguation(text, matches);
            
            container.append(highlightedSentence);

            $.each(matches, function(key, val) {
                babel.getSynset(val.id, [lang])
                .done(function(response){
                    var id = response['senses'][0]['synsetID']['id'];

                    var gloss = '';
                    if(typeof response['glosses'][0] !== "undefined"){
                        $.each(response['glosses'], function(key, value){
                            gloss += value.gloss + '\n-\n';
                        });
                    }

                    if (gloss != ''){
                        $(document.getElementById(val.id)).prop('title', gloss);

                        var entry = val.synset + ': ' + gloss;
                        $('<p>',{html:entry}).appendTo(container);
                    }
                })
                .fail(example.showErrorRequest);
            });
        })
        .fail(this.showErrorRequest);
    }
    else 
        showErrorLang(lang); 
}

//Setup the JQuery components
$(document).ready(function (){
	
	var babel = new BabelNet();
    var example = new BabelNetExample(babel, $('#results'));

    $.getJSON('config.json')
        .done(function(response){
            babel.KEY = response['key'];

        })
        .fail(function(){
            console.log('uh-oh');
        });
	

    $('#search').click(function(){
        var word = $('#term').val();        
        var lang = $('#lang').val();
        example.showGlossesForTerm(word,lang);
    });

    $('#edges').click(function(){        
        
        var word = $('#term').val();        
        var lang = $('#lang').val();
        example.showEdgesForTerm(word, lang);
    });


    $('#translate').click(function(){  

        var to = $('#to').val();
        var from = $('#lang').val();

        if (to != from)
    	   example.showTranslationsForTerm($('#term').val(), from, to);
        else
            alert('The source and target language are both the same!!!');
    });
    
    $('#compoundWords').click(function(){        
        var word = $('#term').val();        
        var lang = $('#lang').val();
        example.showCompoundWordsForTerm(word, lang);
    });
   
    $('#disambiguate').click(function(){        

        var text = $('#term').val();
        var lang = $('#lang').val();
        example.showDisambiguation(text,lang);
    });
});