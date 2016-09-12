var diagnosticoSelect;

var chapters;
$( document ).ready(function() {
    $.getJSON( "https://rawgit.com/SIMHSPMS/SIMH_REPO/master/ICD10/Simulador/icd10cm-min.json", function( data ) {
	  chapters = data["ICD10CM.tabular"].chapter;
	});
	
});

/**Devolve o diagnostico principal*/
function getDiagOptions(diagKey){
	var obj = {};
	/**Percorre os capitulos**/
	$.each(chapters, function(i, v) {
		/**variavel com as seccoes do capitulo**/
		var sections = v.section;
		/**Percorre as seccoes**/
		$.each(sections, function(w, q) {
			/**variavel com os diagnosticos**/
			var diagnostics = q.diag;
			/**Se tiver varias opcoes iteras**/
			if($.isArray(diagnostics)){
				for(var index in diagnostics){
					var xpto = diagnostics[index];
					if(diagnostics[index].name == diagKey){
						diagnosticoSelect = diagnostics[index];
						return false;		
					}
				}
			}else{
				if(diagnostics && diagnostics.name == diagKey){
					diagnosticoSelect = diagnostics;
					return false;	
				}
			}
		});
		if(diagnosticoSelect){
			return false;	
		}
    });
}

/**Carrega as opcoes disponiveis**/
function buildOptions(filter){
	
	diagnosticoSelect;
	$('#lista_diag').empty();
	/**se estiver algum diagnostico seleccionado**/
	if(diagnosticoSelect){
		var option = '';
	
		/**Adiciona o diagnostico principal**/
		option += '<li class="node" style="padding-top: 7px;">';
		option += '<span class="node-toggle"></span>';
		option += '<span class="leaf"><strong>'+diagnosticoSelect.name+'</strong> '+diagnosticoSelect.desc+'</span>';
		option += buildSubOptions(diagnosticoSelect.diag,filter);
		option += '</li>'
		
		$('#lista_diag').append(option);
	}
}

/**Carrega as sub opcoes disponiveis**/
function buildSubOptions(diagnostic,filter){
	
	/**verifica se tem sub diagnosticos**/
	if(diagnostic && diagnostic.name == 'C50.01'){
		var a = '';
	}
	var option = '';
	if($.isArray(diagnostic)){
		$.each(diagnostic, function(i, v) {
			/**Se tiver sub diagnosticos**/
			if($.isArray(v.diag)){
				var childs = '';
				/**vai a procura dos codigos finais**/
				$.each(v.diag, function(w, q) {
					childs += buildSubOptions(q,filter);
				});
				/**Se existirem adiciona o nome do grupo tambem**/
				if(childs.length > 0){
					option += buildHtmlGroupDiagnostic(v, childs);
					childs = null;
				}
			}else{
				/**Se nao tiver sub opcoes adiciona como codigo final**/
				if(v.name.indexOf(filter) == 0){
					option += buildHtmlDiagnostic(v);
				}
			}
		});
	}else{
		/**Se tiver sub diagnosticos**/
		if($.isArray(diagnostic.diag)){
			var childs = '';
			/**Se tiver sub diagnosticos**/
			$.each(diagnostic.diag, function(w, q) {
				childs += buildSubOptions(q,filter);
			});
			/**Se existirem adiciona o nome do grupo tambem**/
			if(childs.length > 0){
				option += buildHtmlGroupDiagnostic(diagnostic, childs);
				childs = null;
			}
		}else{
			/**Se nao tiver sub opcoes adiciona como codigo final**/
			if(diagnostic.name.indexOf(filter) == 0){
				option += buildHtmlDiagnostic(diagnostic);
			}
		}
	}
	return option;
}

/**Cria o HTML para um grupo de diagnostico**/
function buildHtmlGroupDiagnostic(diagnostic, childs){
	var option = '<ul id="subList" style="margin-top: 5px;">';
	option += '<li class="node" style="padding-top: 7px;">';
	option += '<span class="node-toggle"><strong>'+diagnostic.name+'</strong> '+diagnostic.desc+'</span>';
	option += childs;
	option += '</li>';
	option += '</ul>';
	return option;
}

/**Cria o HTML para um codigo de diagnostico**/
function buildHtmlDiagnostic(diagnostic){
	var option = '<li>';
	option += '<span class="mif-plus" style="margin-left:10px;margin-top:-4px;"/>';
	option += '<span class="leaf" style="margin-left:7px;"><strong>'+diagnostic.name+'</strong> '+diagnostic.desc+'</span>';
	option += '</li>';
	return option;
}


/**Funcao para determinar pesquisa**/
function searchCodes(obj,e) {
	var valueOld = obj.value.toUpperCase();
	var valueNew = "";
	var key;
    
    var event = e || window.event;
    if (event){ 
    	key = event.key;
    }
   
    if(key != null && key != "Backspace" ){
    	valueNew = valueOld + key;
    }
    if(key == "Backspace"){
    	valueNew = valueOld.substring(0,valueOld.length-1);
    }
    
    if(valueNew.length < 3){
    	$('#lista_diag').empty();
		diagnosticoSelect = null;
	}
    
	/**Carrega o diagnostico principal**/
	if(valueNew.length == 3){
		getDiagOptions(valueNew);
	}
	
	/**Filtra no diagnostico principal*/
	if(valueNew.length > 3){
    	$('#lista_diag').empty();
	}
	
	buildOptions(valueNew);
}
