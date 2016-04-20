/*
 * This file contains a few examples of how to use the wrapper.
 * Please note that to use this example you need an API key provided by BabelNet
 */


/**
 * 
 */
function showGlossesForTerm(babel, word, lang, container){
    container.html('');

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


/**
 * 
 * @param babel
 * @param word
 * @param from
 * @param to
 * @param container
 */
function showTranslationsForTerm(babel, word, from, to, container){
    container.html('');

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

/**
 * 
 * @param babel
 * @param id
 * @param container
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
*
*/
function showEdgesForTerm(babel, word, lang,container){
    container.html('');
    babel.getSynsetIds(word,lang).done(function(response){
         $.each(response, function(key, val) {
             showEdgesForSynset(babel, val['id'], container);
         });
    });
}

/**
 * 
 * @param babel
 * @param id
 * @param lang
 * @param container
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
*
*/
function showCompoundWordsForTerm(babel, word, lang, container){
    container.html('');
    babel.getSynsetIds(word,lang).done(function(response){
         $.each(response, function(key, val) {
             showCompoudWordsForSynset(babel, val['id'], lang, container);
         });
    });
}

/**
 * 
 * @param babelfy
 * @param text
 * @param lang
 * @param container
 */
function showDisambiguation(babelfy,text, lang, container){
   container.html('');

    babelfy.disambiguate(text,lang).done(function(response) {

        var matches = [];

        $.each(response, function(key, val) {
            // retrieving char fragment
            var charFragment = val['charFragment'];
            var cfStart = charFragment['start'];
            var cfEnd = charFragment['end'];           

            var synsetID = val['babelSynsetID'];
            matches[synsetID] = text.substring(cfStart, cfEnd+1);
        });

        console.log(matches);

        for (var key in matches){
            babelfy.getSynset(key,lang).done(function(response){
                var id = response['senses'][0]['synsetID']['id'];

                var gloss = '-';
                if(typeof response['glosses'][0] !== "undefined")
                    gloss = response['glosses'][0]['gloss'];

                var entry = matches[id] + ': ' + gloss;
                $('<p>',{html:entry}).appendTo(container);
            });
        }
    });
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
        //showEdgesForSynset(babel,'bn:00016606n', $('#results'));
    });

    
    $('#translate').click(function(){        
    	showTranslationsForTerm(babel, $('#term').val(), $('#lang').val(), $('#to').val(), $('#results'));
    });
    
    $('#compoundWords').click(function(){        
        var word = $('#term').val();        
        var lang = $('#lang').val();
        showCompoundWordsForTerm(babel, word, lang, $('#results'));
    });

    $('#term').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            var lang = $('#lang').val();
            showGlossesForTerm(babel,$(this).val(),lang, $('#results'));

            //Do Stuff, submit, etc..
            $(this).removeAttr("disabled");
         }
   });
   
    $('#disambiguate').click(function(){        

        var text = $('#term').val();
        var lang = $('#lang').val();
        showDisambiguation(babel,text,lang, $('#results'));
    });
});