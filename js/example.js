/**
 * @file This file contains a few examples of how to use the wrapper.
 * Please note that to use this example you need an API key provided by BabelNet
 */

/** Show and error message when an invalid language is provided */
function showErrorLang(lang, container){
    $('<h2><strong>Error</strong>: "'+lang+'" is not a valid language</h2>').appendTo(container);
}

/**
 * Shows the glosses (definitions) for a word in a certain language
 * @param {BabelNet} babel  - a BabelNet object
 * @param {string} word  - The word you want to search for
 * @param {string} lang  - The language of the word
 * @param {JQueryObject} container  - the html element where we want to show the glosses
 */
function showGlossesForTerm(babel, word, lang, container){
    container.html('');

    if(lang in Langs){

        $('<h2>Synsets (concepts) denoted by the word: "'+word+'" in lang "' + lang + '"</h2>').appendTo(container);

        babel.getSynsetIds(word,lang).done(function(response){
            $.each(response, function(key, val) {
               
                babel.getSynset(val['id'],lang).done(function(response){

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
                });
            });
        });
    }
    else 
        showErrorLang(lang, container);        
}


/**
 * Shows the translations for a word in a certain language to another language
 * @param {BabelNet} babel  - a BabelNet object
 * @param {string} word  - The word you want to search for
 * @param {string} from  - The language of the word
 * @param {string} to  - The language we want to translate the word to
 * @param {JQueryObject} container  - the html element where we want to show the translations
 */
function showTranslationsForTerm(babel, word, from, to, container){
    container.html('');

    if(from in Langs && to in Langs){

        $('<h2>Translations for: "'+word+'" in lang "' + to + '"</h2>').appendTo(container);

        babel.getSynsetIds(word,from).done(function(response){
            $.each(response, function(key, val) {
            	babel.getSynset(val['id'],to).done(function(response){
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
            });
            
        });
    }
    else 
        showErrorLang(to+' or ' + from, container);
}

/**
 * Shows the edges for a given sysnset 
 * @param {BabelNet} babel  - a BabelNet object
 * @param {string} id  - ID of the synset
 * @param {JQueryObject} container  - the html element where we want to show the edges for the synset
 */
function showEdgesForSynset(babel, id, container){
    babel.getEdges(id).done(function(response){
        if (response.length > 0) {
            $('<h3>Edges for the synset: "'+ id +'"</h3>').appendTo(container);
            
            $.each(response, function(key, val) {
                var pointer = val['pointer'];
                var relation = pointer['name'];
                var group = pointer['relationGroup'];

                //Show only hypernym, hyponym and meronym relations
                if (  group == TypeOfRelations.HYPERNYM || group == TypeOfRelations.HYPONYM || group == TypeOfRelations.MERONYM) {
                    var entry = "Language: " + val['language']
                        + "<br/>Target: " + val['target']
                        + "<br/>Relation: " + relation
                        + "<br/>Relation group: " + group + "<br/><br/>";
                    $('<div>', {html:entry}).appendTo(container);
                }
            });
        }
    });
}

/**
 * Shows the edges for a given word 
 * @param {BabelNet} babel  - a BabelNet object
 * @param {string} word  - the word
 * @param {string} from  - The language of the word
 * @param {JQueryObject} container  - the html element where we want to show the edges for the word
 */
function showEdgesForTerm(babel, word, lang,container){
    container.html('');
    if(lang in Langs){
        babel.getSynsetIds(word,lang).done(function(response){
             $.each(response, function(key, val) {
                 showEdgesForSynset(babel, val['id'], container);
             });
        });
    }
    else
       showErrorLang(lang, container);
}

/**
 * Shows the compound words for a given synset
 * @param {BabelNet} babel  - a BabelNet object
 * @param {string} id  - ID of the synset
 * @param {string} from  - The language of the compund words
 * @param {JQueryObject} container  - the html element where we want to show the compound words
 */
function showCompoudWordsForSynset(babel, id, lang, container){

    babel.getSynset(id,lang).done(function(response){
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
    });
}

/**
 * Shows the compound words for a given synset
 * @param {BabelNet} babel  - a BabelNet object
 * @param {string} word  - the word
 * @param {string} from  - The language of the compund words
 * @param {JQueryObject} container  - the html element where we want to show the compound words
 */
function showCompoundWordsForTerm(babel, word, lang, container){
    container.html('');
    if(lang in Langs){
        babel.getSynsetIds(word,lang).done(function(response){
             $.each(response, function(key, val) {
                 showCompoudWordsForSynset(babel, val['id'], lang, container);
             });
        });
    }
    else
        showErrorLang(lang, container);
}

/**
 * this function counts the number of words in a string
 * @param {string} str - the string
 */
function countWordsInString(str){
    return str.split(' ').length;
}

/**
 * This functions highlights a text with span html elements according to set of matches
 * @param {string} sentence - text to highlight
 * @param {array} m - array with all the matching texts
 */
function highlightDisambiguation(sentence, m){

    m.sort(function(a,b){
        
        var numWordsA = countWordsInString(a.synset);
        var numWordsB = countWordsInString(b.synset);

        if (numWordsA < numWordsB)
            return 1;
        else if (numWordsA > numWordsB)
            return -1;
        else 
            return 0;
    });

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
 * @param {BabelNet} babelfy - A BabelNet object
 * @param {string} text - the text to disambiguate
 * @param {string} lang - the language of the text
 * @param {JQueryObject} container - the html element where we want to show the disambiguation
 */
function showDisambiguation(babelfy,text, lang, container){
    container.html('<h2>Disambiguation for sentence: "'+text+'"</h2>');

    if(lang in Langs){

        babelfy.disambiguate(text.toUpperCase(),lang/*, '','',0.5, '', MCS.ON_WITH_STOPWORDS/*, SemanticAnnotationType.ALL, SemanticAnnotationResource.BN, 0.0, MatchingType.EXACT_MATCHING*/).done(function(response) {

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


            var highlightedSentence = highlightDisambiguation2(text, matches);
            

            $(highlightedSentence).appendTo(container);

            $.each(matches, function(key, val) {
                babelfy.getSynset(val.id,lang).done(function(response){
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
                });
            });
        });
    }
    else 
        showErrorLang(lang, container); 
}

//Setup the JQuery components
$(document).ready(function (){
	
	var babel = new BabelNet();


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
        showGlossesForTerm(babel,word,lang, $('#results'));
    });

    $('#edges').click(function(){        
        
        var word = $('#term').val();        
        var lang = $('#lang').val();
        showEdgesForTerm(babel, word, lang, $('#results'));
    });


    $('#translate').click(function(){  

        var to = $('#to').val();
        var from = $('#lang').val();

        if (to != from)
    	   showTranslationsForTerm(babel, $('#term').val(), from, to, $('#results'));
        else
            alert('The source and target language are both the same!!!');
    });
    
    $('#compoundWords').click(function(){        
        var word = $('#term').val();        
        var lang = $('#lang').val();
        showCompoundWordsForTerm(babel, word, lang, $('#results'));
    });

    $('#term').on('keypress', function (event) {
         if(event.which === 13){
            var lang = $('#lang').val();
            showGlossesForTerm(babel,$(this).val(),lang, $('#results'));
         }
   });
   
    $('#disambiguate').click(function(){        

        var text = $('#term').val();
        var lang = $('#lang').val();
        showDisambiguation(babel,text,lang, $('#results'));
    });


    /*$('#results').on("mouseover", 'span',function(){  
        console.log($( this ).text());
    });*/
});