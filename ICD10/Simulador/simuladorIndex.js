var indexSelect;

var indexs;
$( document ).ready(function() {
    $.getJSON( "http://rawgit.com/SIMHSPMS/SIMH_REPO/master/ICD10/Simulador/icd10cm-index-min.json", function( data ) {
	  indexs = data["ICD10CM.index"].letter;
	  builIndexs();
	});
	
});

/**Devolve o opcoes do index*/
function builIndexs(){
	var option = '';
	/**Percorre os indexs**/
	$.each(indexs, function(i, letter) {
		/**gera a opcao**/
		option += '<li>';
		option += '<a href="#" onclick="getIndexOptions($(this).text());">'+letter.title+'</a>';
		option += '</li>';
	});
	$('#lista_index_search').empty();
	$('#lista_index_search').append(option);
}

/**Devolve o opcoes do index*/
function getIndexOptions(search){
	var obj = {};
	var indexKey = search.toUpperCase();
	if(indexKey && indexKey.length > 1){
		indexKey = str.substring(0,1);
	}
	if(indexKey && indexKey.length > 0){
		/**Percorre os indexs**/
		$.each(indexs, function(i, v) {
			/**verifica se e o index introduzido**/
			if(v.title == indexKey){
				indexSelect = v;
				buildIndex(search);
			}
		});
	}
}

/**Carrega as opcoes disponiveis**/
function buildIndex(filter){
	
	$('#lista_index').empty();
	$('#lista_index').scrollTop(0);
	/**se estiver algum diagnostico seleccionado**/
	if(indexSelect){
		var option = '';
	
		/**Adiciona o diagnostico principal**/
		option += '<li class="node" style="padding-top: 7px;">';
		option += '<span class="capitulo" aria-expanded="true"><strong>'+indexSelect.title+'</strong></span>';
		
		$.each(indexSelect.mainTerm, function(i, index) {
			option += '<ul id="subList" style="margin-top: 5px;">';
			option += '<li style="padding-top: 7px;">';
			option += '<span class="fa fa-arrow-right" style="margin-left:10px;margin-right:5px;margin-top:-4px;color: #3e8f24;"/>';
			/**Se o title for um array*/
			if($.isPlainObject(index.title)){
				option += '<span><strong>'+index.title.__text+' '+index.title.nemod+'</strong>';
			}else{
				option += '<span><strong>'+index.title+'</strong>';
			}
			if(index.code){
				option += ' '+index.code;
			}
			if(index.see){
				option += ' see '+index.see ;
			}
			if(index.seeAlso){
				option += ' see also '+index.seeAlso ;
			}
			option += '</span>';
			if(index.code){
				option += '<span onclick="$('+"'"+'#pesquisa'+"'"+').val('+"'"+index.code+"'"+');searchIndexCode('+"'"+index.code+"'"+');" class="fa fa-search" style="margin-left:10px;color: #3e8f24;"></span>';
			}
			/**Se tem terms*/
			if(index.term && $.isArray(index.term)){
				option += '<ul id="term" style="margin-top: 5px;">';
				$.each(index.term, function(t, term) {
					
					option += buildHtmlTerm(term);
					
				});
				option += '</ul>';
			}
			option += '</li>';
			option += '</ul>';
		});
		option += '</li>'
		
		$('#lista_index').append(option);
	}
}

/**Cria o HTML para um codigo de diagnostico**/
function buildHtmlTerm(indexTerm){
	var option = '<li style="margin-left:10px;">';
	option += '<span><strong> - </strong></span>';
	if($.isPlainObject(indexTerm.title)){
		option += '<span><strong>'+indexTerm.title.__text+' '+indexTerm.title.nemod+'</strong>';
	}else{
		option += '<span><strong>'+indexTerm.title+'</strong>';
	}
	if(indexTerm.code){
		option += ' '+indexTerm.code;
	}
	if(indexTerm.see){
		option += ' see '+indexTerm.see ;
	}
	if(indexTerm.seeAlso){
		option += ' see also '+indexTerm.seeAlso ;
	}
	option += '</span>';
	
	if(indexTerm.code){
		option += '<span onclick="$('+"'"+'#pesquisa'+"'"+').val('+"'"+indexTerm.code+"'"+');searchIndexCode('+"'"+indexTerm.code+"'"+');" class="fa fa-search" style="margin-left:10px;color: #3e8f24;"></span>';
	}
	
	if(indexTerm.term && $.isArray(indexTerm.term)){
		option += '<ul id="term" style="margin-top: 5px;">';
		$.each(indexTerm.term, function(t, term) {
			option += buildHtmlTerm(term);
		});
		option += '</ul>';
	}
	option += '</li>';
	return option;
}