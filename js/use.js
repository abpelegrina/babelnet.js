/*
 * This file contains a few examples of how to use the wrapper.
 * Please note that to use this example you need an API key provided by BabelNet
 */


// initi



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
    container.html('');

    $('<h2>Edges for the synset: "'+id+'"</h2>').appendTo(container);

    babel.getEdges(id).done(function(response){
        $.each(response, function(key, val) {
            var pointer = val['pointer'];
            var relation = pointer['name'];
            var group = pointer['relationGroup'];

            //Types of relationGroup: HYPERNYM,  HYPONYM, MERONYM, HOLONYM, OTHER
            if ((group.toLowerCase().indexOf("hypernym") > -1) || (group.toLowerCase().indexOf("hyponym") > -1) || (relation.toLowerCase().indexOf("antonym") > -1)) {
                var entry = "Language: " + val['language']
                    + "<br/>Target: " + val['target']
                    + "<br/>Relation: " + relation
                    + "<br/>Relation group: " + group + "<br/><br/>";
                $('<div>', {html:entry}).appendTo(container);
            }
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
function showCompoudWords4Synset(babel, id, lang, container){
    container.html('');

    $('<h2>Compound words for the synset: "'+id+'"</h2>').appendTo(container);

    babel.getSynset(id,lang).done(function(response){
        var entry = '';
        $.each(response['lnToCompound'], function(key,value){
            entry += value + ', ';
        })

        entry = entry.replace(/,\s*$/, "");
        $('<em>',{html:entry}).appendTo(container);
        $('<br>').appendTo(container);
    });
}

//Setup the JQuery components
$(document).ready(function (){
	
	var babel = new BabelNet('605862f1-fb95-4658-9cb1-53abf1b4e22a');
	
    $('#search').click(function(){
        var word = $('#term').val();        
        var lang = $('#lang').val();
        showGlossesForTerm(babel,word,lang, $('#results'));
    });

    $('#edges').click(function(){        
        showEdgesForSynset(babel,'bn:00016606n', $('#results'));
    });

    
    $('#translate').click(function(){        
    	showTranslationsForTerm(babel, $('#term').val(), $('#lang').val(), $('#to').val(), $('#results'));
    });
    
    $('#compoundWords').click(function(){        
        showCompoudWords4Synset(babel,'bn:00012945n', 'EN', $('#results'));
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

});