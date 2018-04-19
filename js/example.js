/**
 * @file This file contains a few examples of how to use the wrapper.
 * Please note that to use this example you need an API key provided by BabelNet
 */


/**
 * This class serves as an example on how to use the BabelNet class
 * @constructor
 */
function BabelNetExample(bb, ctnr, dis, loadr){
    this.babel = bb;
    this.container = ctnr;
    this.dis = dis;
    this.loader = loadr;
    this.numSynsets = 0;
    this.word;
    this.disambiguationData = {segment:'', synsets:[]};
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
BabelNetExample.prototype.showImagesforTerm = function(word, lang,menu=true){
    this.container.html('');

    var babel = this.babel;
    var container = this.container;
    var loader = this.loader;
    var example = this;

    if(lang in BabelNetParams.Langs){


        var source = menu ? 'menu':'form';

        //$('<h2>Synsets (concepts) denoted by the word: "'+word+'" in lang "' + lang + '"</h2>').appendTo(this.container);

        this.babel.getSynsetIds(word, [lang]).done(function(response){

          
            if (response.length < 1){
                $('<p style="color:red">No results found for "'+word+'"</p>').appendTo(container);
                loader.hide();
                return;
            }

            Promise.all(
                response.map(function(val){                    
                    return babel.getSynset(val.id, [lang]);
                })
            ).then(function(synsets){

                //sort synsets
                example.sortSynsetsArray(synsets);   
                loader.hide();

                if (synsets.length > 0){


                    $.each(synsets, function(k, synset){
                        if (synset.synsetType == 'CONCEPT' &&  Object.keys(synset['images']).length > 0){
                            var content = getSynsetTitle(synset, lang);
                            for (var i=0; i<5; i++){
                                var value = synset.images[i];
                                content += '<div class="round"><a target="_blank" href="'+value.url+'"><img src="'+value.thumbUrl+'" title="'+value.name+'"/></a></div>';
                            }
                             content += '</div><hr style="clear:both;">';

                             container.append(content);
                        }
                       
                    });
                }
                else {
                    container.html('<p style="color:red">No results found for "'+word+'"</p>');
                }
            }, example.showErrorRequest);
        }).
        fail(this.showErrorRequest);
    }
    else 
        showErrorLang(lang);        
}


/**
 * Shows the edges for a given sysnset 
 * @param {string} id  - ID of the synset
 */
BabelNetExample.prototype.showEdgesForSynset = function(id){

    var babel = this.babel;
    var container = this.container;
    var loader = this.loader;

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

            if (response.length < 1){
                $('<p style="color:red">No results found for "'+word+'"</p>').appendTo(container);
                loader.hide();
                return;
            }

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
BabelNetExample.prototype.showCompoudWordsForSynsets = function(synsets, lang, word){

    var babel = this.babel;
    var container = this.container;
    var loader = this.loader;

    var empty = true;


    synsets.forEach(
        function(synset){
            var entry = new Array();
            var i=0;
            $.each(synset['lnToCompound'], function(key,value){
                console.log(lang, key);
                if (key == lang){
                    console.log('IN',value);
                    $.each(value, function(key, compound){
                        i++;
                        entry.push('<span class="compound-word">'+compound.split('_').join(' ')+'</span>');
                    });
                }
            })
            entryStr = entry.join(', ');

            console.log(entry);
            
            if(i>0){
                empty = false;
                container.append(getSynsetTitle(synset, lang));
                $('<p>',{html:entryStr}).appendTo(container);
            }
        }
    );

    if (empty)
        container.html('<p style="color:red">No compound words found for "'+word+'"</p>');
}

/**
 * Shows the compound words for a given synset
 * @param {string} word  - the word
 * @param {string} lang  - The language of the compund words
 */
BabelNetExample.prototype.showCompoundWordsForTerm = function(word, lang, menu=true){
    this.container.html('');
    var babel = this.babel;
    var container = this.container;
    var loader = this.loader;
    var example = this;
    if(lang in BabelNetParams.Langs){


        var source = menu ? 'menu':'form';

        babel.getSynsetIds(word,[lang]).then(function(response){

            if (response.length < 1){
                $('<p style="color:red">No results found for "'+word+'"</p>').appendTo(container);
                loader.hide();
                return;
            }

            Promise.all(
                response.map(function(val){                    
                    return babel.getSynset(val.id, [lang]);
                })
            ).then(function(synsets){
                synsets.sort(example.compareSynsets);
                loader.hide();
                if (synsets.length > 0)
                    example.showCompoudWordsForSynsets(synsets, lang, word);
                else {
                    container.html('<p style="color:red">No results found for "'+word+'"</p>');
                }
            }, this.showErrorRequest);
        }, this.showErrorRequest);
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

    if (a.type == 'CONCEPT' && b.type != 'CONCEPT')
        return -1;
    else  if (a.type != 'CONCEPT' && b.type == 'CONCEPT')
        return 1;
    else if (numWordsA < numWordsB)
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

        //if (val.synset != 'high'){

            highlighted = fragments[0];
            for (var i = 1; i<fragments.length; i++){
                highlighted += '<span id="'+val.id+'" class="higlight">' + val.synset + '</span>' + fragments[i];
            }
        //}
    });

    return highlighted.substring(1, highlighted.length-1);
}


BabelNetExample.prototype.findSense = function(babelnetID, lan='EN'){
    
    var results=[];

    this.disambiguationData.synsets.forEach(function(synset){
        
        if (Array.isArray(synset.senses))
            synset.senses.forEach(function(sense){
                if (sense.synsetID.id == babelnetID && sense.language==lan)
                    results.push(  JSON.parse(JSON.stringify(sense)) ); 
            });
    });

    return results;
}


BabelNetExample.prototype.findTranslation = function(babelnetID, lan='EN'){
    
    var results=[];

    this.disambiguationData.synsets.forEach(function(synset){

        
        if (Array.isArray(synset.translations))
            synset.translations.forEach(function(translation){
                if (translation[0].synsetID.id == babelnetID && translation[0].language==lan)
                    results.push(JSON.parse(JSON.stringify(translation))); 
            });
    })

    return results;
}



BabelNetExample.prototype.findTranslationAndGlosses = function(babelnetID, lan='EN'){
    
    var filterdSynsets = [];

    this.disambiguationData.synsets = example.sortSynsetsArray(this.disambiguationData.synsets);   

    this.disambiguationData.synsets.forEach(function(synset){
        if (synset.senses[0].synsetID.id == babelnetID){

            var data = {main: synset.mainSense};

            var trans = [];


            if (Array.isArray(synset.translations))
                synset.translations.forEach(function(translation){
                    if (translation[0].language==lan)
                        trans.push(JSON.parse(JSON.stringify(translation))); 
                });

            data['translations'] = trans;


            var defs = [];

            if (Array.isArray(synset.glosses))
                synset.glosses.forEach(function(gloss){
                    if (gloss.language==lan)
                        defs.push(JSON.parse(JSON.stringify(gloss))); 
                });

            data['definitions'] = defs;

            filterdSynsets.push(data);
        }
    })

    return filterdSynsets;
}


BabelNetExample.prototype.findGlosses = function(babelnetID, lan='EN'){
    
    var result = [];

    this.disambiguationData.synsets.forEach(function(synset){


        if (Array.isArray(synset.glosses))
            synset.glosses.forEach(function(gloss){
                if (gloss[0].synsetID.id == babelnetID && translation[0].language==lan)
                    result.push(JSON.parse(JSON.stringify(translation))); 
            });
    });

    return result;
}

/**
 * Disambiguates a text using the Babelfy API call disambiguate
 * @param {string} text - the text to disambiguate
 * @param {string} lang - the language of the text
 */
BabelNetExample.prototype.showDisambiguation = function(text, source_lang, target_lang){
    //this.container.html('<h2>Disambiguation for sentence: "'+text+'"</h2>');
    this.dis.html('');
    var babel = this.babel;
    var container = this.dis;
    var loader = this.loader;
    var example = this;

    this.disambiguationData.synsets.length = 0;

    var disData = this.disambiguationData;

    disData.segment = text;  

    if (text == '' || typeof text == "undefined")
        return;

    if(source_lang in BabelNetParams.Langs ){
        var synsetsList = [];

        var test= babel.disambiguate(text,source_lang.toUpperCase()).then( 
            function(response) {

                Promise.all(
                    response.map(function(val){                    
                        return babel.getSynset(val.babelSynsetID, [source_lang, target_lang]);
                    })
                ).then(function (synsets){

                    synsets = example.sortSynsetsArray(synsets);   

                    var matches = [];
                    container.html('');

                    $.each(response, function(key, val) {
                        // retrieving char fragment
                        var charFragment = val['charFragment'];
                        var cfStart = charFragment['start'];
                        var cfEnd = charFragment['end'];           

                        var synsetID = val['babelSynsetID'];

                        var inArray = $.grep(matches, function(e){ return e.id == synsetID; }).length;


                        var type = synsets.find(x=> x.senses[0].synsetID.id == synsetID).synsetType;

                        if (inArray == 0)
                            matches.push({id:synsetID, synset:text.substring(cfStart, cfEnd+1), type:type});
                    });

                    var highlightedSentence = example.tagDisambiguation(text, matches);
                    loader.hide();

                    console.log(highlightedSentence);

                    container.append('<div id="disambiguation-container">'+highlightedSentence+'</div>');

                    synsets.forEach(function(synset){
                        var senses=[];


                         disData.synsets.push(  JSON.parse(JSON.stringify(synset)) );

                        if(typeof synset['translations'][0] !== "undefined"){

                             $.each(synset['translations'], function(key, translation){


                                if (translation[0].language == source_lang){
                                    var entries = [];
                                    $.each(translation[1], function(k, value){
                                         if (value.language == target_lang)
                                            entries.push(value.lemma);
                                    })

                                    entries = entries.join(', ');

                                    senses.push(translation[0].lemma+': '+entries);

                                }
                            });

                            if (senses.length>0)
                                senses = '• '+senses.join('\n• ');
                            else 
                                senses = '';
                        }
                        else if(typeof synset['senses'][0] !== "undefined"){
                            $.each(synset['senses'], function(key, sense){
                                if (sense.language == target_lang && senses.indexOf(sense.lemma) == -1)
                                    senses.push(sense.lemma);
                            });

                            if (senses.length>0)
                                senses = '• '+senses.join(', ');
                            else 
                                senses = ''; 
                        }

                        if (senses != '')
                            $(document.getElementById(synset.senses[0].synsetID.id)).prop('title', senses);
                    });
                });
            }
        );
    }
    else 
        showErrorLang(source_lang); 
}

function countSenses(mainSense, senses){
    var count = 0;
    $.each(senses, function(key, sense){
        if (typeof sense.lemma != 'undefined' && typeof  BabelNetExample.word  != 'undefined' &&  sense.lemma.toLowerCase() ==  BabelNetExample.word.toLowerCase() )
            count++;
    });

    //console.log('synset with main sense ' + mainSense + 'has ' + count + ' coincidences with "' +  BabelNetExample.word + '" in his senses');

    return count;
}

/*
Compare synsets to order them. Sorting criteria:
1. First concepts, then named entities
2. First nouns, then verbs, then rest of PoS
3. First entries from WordNet, then entries from other sources
4. Ordered by number of coincidences in the sense list
4. Finally, sorted alphabetically
*/
BabelNetExample.prototype.compareSynsets = function(s1, s2){
    var pos1 = s1.senses[0].pos;
    var pos2 = s2.senses[0].pos;

    if (s1.synsetType == "CONCEPT" && s2.synsetType != "CONCEPT")
        return -1;
    else if (s1.synsetType != "CONCEPT" && s2.synsetType == "CONCEPT")
        return 1;
    else if (pos1 == 'NOUN' && pos2 != 'NOUN')
        return -1;
    else if (pos1 != 'NOUN' && pos2 == 'NOUN')
        return 1;
    else if (pos1 == 'VERB' && pos2 != 'VERB')
        return -1;
    else if (pos1 != 'VERB' && pos2 == 'VERB')
        return 1;
    else if (s1.synsetSource == 'WIKIWN' || s1.synsetSource == 'WN')
        if (s2.synsetSource == 'WIKIWN' || s2.synsetSource == 'WN'){

            var count1 = countSenses(s1.mainSense, s1.senses);
            var count2 = countSenses(s2.mainSense, s2.senses);
            

            if (count1 > count2)
                return -1;
            else if (count1 < count2)
                return 1;
            else 
                return s1.mainSense > s2.mainSense;
        }
        else 
            return -1;
    else 
        if (s2.synsetSource == 'WIKIWN' || s2.synsetSource == 'WN')
            return 1;
        else 
            return s1.mainSense > s2.mainSense;
}

BabelNetExample.prototype.sortSynsetsArray = function(synsets){
   
    return synsets.sort(this.compareSynsets);
}

/**
 * Shows the glosses (definitions) for a word in a certain language
 * @param {string} word  - The word you want to search for
 * @param {string} lang  - The language of the word
 */
BabelNetExample.prototype.showGlossesForTerm = function(word, lang, menu=true){
    this.container.html('');

    BabelNetExample.word = word;

    var babel = this.babel;
    var container = this.container;
    var loader = this.loader;
    var example = this;
   


    if(lang in BabelNetParams.Langs){

        //$('<h2>Synsets (concepts) denoted by the word: "'+word+'" in lang "' + lang + '"</h2>').appendTo(this.container);



        var source = menu ? 'menu':'form';
       
        this.babel.getSynsetIds(word, [lang]).done(function(response){

            if (response.length < 1){
                $('<p style="color:red">No results found for "'+word+'"</p>').appendTo(container);
                loader.hide();
                return;
            }

            console.log(response);

            Promise.all(
                response.map(function(val){                    
                    return babel.getSynset(val.id, [lang]);
                })
            ).then(function (synsets){

                example.sortSynsetsArray(synsets);
                loader.hide();
                $.each(synsets, function(key, synset){

                    if ( Object.keys(synset['glosses']).length > 0){
                        if (synset.images.length > 0)
                            entry = '<div class="round"><a target="_blank" href="'+synset.images[0].url+'"><img src="'+synset.images[0].thumbUrl+'" title="'+synset.images[0].name+'"/></a></div>';
                        else
                            entry = '';

                       
                        // title
                        entry += getSynsetTitle(synset, lang);                                

                        // gloss
                        var gloss, found=false;

                        for (var i = 0; i <  synset['glosses'].length && !found; i++)
                             if (synset['glosses'][i]['language'] == lang){
                                found = true;
                                gloss =  synset['glosses'][i]['gloss'];
                             }

                        if (!found)
                            gloss =  synset['glosses'][0]['gloss'];


                        entry += '<p class="babelnet-def">' + gloss + ' (PoS: '+  synset.senses[0].pos +', source:' + synset.synsetSource + ')  ';
                        entry += '<small><a href="http://babelnet.org/synset?word='+synset.senses[0].synsetID.id+'&details=1&lang='+lang+'" target="_blank">View in BabelNet</a></small></p>';

                        // separator
                        entry += '<hr style="clear:both;" />';

                        container.append(entry);
                    }
                    else {
                         container.html('<p style="color:red">No results found for "'+word+'"</p>');
                    }
                });
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
 * @param {string} lang  - The language of the word
 * @param {string} target  - The language we want to translate the word to
 */
BabelNetExample.prototype.showTranslationsForTerm = function(word, lang, target, menu=true){
    this.container.html('');

    BabelNetExample.word = word;

    var babel = this.babel;
    var container = this.container;
    var loader = this.loader;
    var example = this;
   


    var source = menu ? 'menu':'form';


    if(lang in BabelNetParams.Langs && target in BabelNetParams.Langs){

        //$('<h2>Synsets (concepts) denoted by the word: "'+word+'" in lang "' + lang + '"</h2>').appendTo(this.container);

        this.babel.getSynsetIds(word, [lang]).done(function(response){

            if (response.length < 1){
                $('<p style="color:red">No results found for "'+word+'"</p>').appendTo(container);
                loader.hide();
                return;
            }
            

           Promise.all(
                response.map(function(val){                    
                    return babel.getSynset(val.id, [lang, target]);
                })
            ).then(function (synsets){
                loader.hide();
                // ordeanr lista de synsets
               
                example.sortSynsetsArray(synsets);

                // para cada synset en la lista
                $.each(synsets, function(key, synset){

                    if (Object.keys(synset['senses']).length > 0){
                        if (synset.images.length > 0)
                            entry = '<div class="round"><a target="_blank" href="'+synset.images[0].url+'"><img src="'+synset.images[0].thumbUrl+'" title="'+synset.images[0].name+'"/></a></div>';
                        else
                            entry = '';

                        entry += getSynsetTitle(synset, lang);

                        var translations = [];

                        $.each(synset.senses, function(key, sense){
                            if (sense.language == target && translations.indexOf(sense.lemma) == -1)
                                translations.push(sense.lemma);
                        });

                        if (translations.length > 0){                                
                            entry += '<p class="babelnet-def">' + translations.join(', ') + '</p>';


                             // separator
                            entry += '<hr style="clear:both;" />';
                            container.append(entry);
                        }
                    }
                    else {
                         container.html('<p style="color:red">No results found for "'+word+'"</p>');
                    }
                });

            
            }, example.showErrorRequest);
        }).fail(this.showErrorRequest);
    }
    else 
        showErrorLang(lang);        
}


function getSynsetTitle(synset, lang){
    var senses = [], entry = '', sensesList;

    $.each(synset.senses, function(key, sense){
        if ( (sense.language==lang /*|| (sense.lang=='EN'*/ && sense.sensekey != '') && senses.indexOf(sense.lemma) == -1) 
            senses.push(sense.lemma);
    });
    entry += '<h4 class="main-sense">' + synset.mainSense.split('#')[0];
    if (senses.length > 0)
        entry  += '&nbsp;<small>(' + senses.join(', ') + ')</small>';
    
    entry += '</h4>';
    return entry;
}

//Setup the JQuery components
$(document).ready(function (){
	
	var babel = new BabelNet();
    var example = new BabelNetExample(babel, $('#results'), $('#container'),$('#loader'));

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