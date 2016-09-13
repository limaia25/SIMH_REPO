var diagnosticoSelect;

var chapters;
$( document ).ready(function() {
    $.getJSON( "http://rawgit.com/SIMHSPMS/SIMH_REPO/master/ICD10/Simulador/icd10cm-min.json", function( data ) {
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
		option += '<div class="capitulo" aria-expanded="true" data-toggle="collapse" data-target="#subList'+diagnosticoSelect.name.split('.').join("")+'">';
		option += '<strong>'+diagnosticoSelect.name.split('.').join("")+'</strong> '+diagnosticoSelect.desc+'</div>';
		option += '<ul id="subList'+diagnosticoSelect.name+'" class="collapse in" style="margin-top: 5px;">';
		option += buildSubOptions(diagnosticoSelect.diag,filter);
		option += '</ul>'
		option += '</li>'
		
		$('#lista_diag').append(option);
	}
}

/**Carrega as sub opcoes disponiveis**/
function buildSubOptions(diagnostic,filter){
	
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
	var option = '';
	option += '<li style="padding-top: 7px;">';
	option += '<div class="capitulo" aria-expanded="true" data-toggle="collapse" data-target="#subList'+diagnostic.name.split('.').join("")+'">';
	option += '<strong>'+diagnostic.name+'</strong> '+diagnostic.desc+'</div>';
	option += '<ul id="subList'+diagnostic.name.split('.').join("")+'" class="collapse in" style="margin-top: 5px;">';
	option += childs;
	option += '</ul>';
	option += '</li>';
	option += '';
	return option;
}

/**Cria o HTML para um codigo de diagnostico**/
function buildHtmlDiagnostic(diagnostic){
	var diag = "'"+diagnostic.name.split('.').join("")+"'";
	var option = '<li>';
	option += '<span onclick="addDiagnosticToTable('+diag+');" class="fa fa-plus iconAdd" style="margin-left:10px;"/>';
	option += '<span class="option" style="margin-left:7px;"><strong>'+diagnostic.name+'</strong> '+diagnostic.desc+'</span>';
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

/**Funcao para determinar o codigo**/
function searchIndexCode(code) {
	var value = code.toUpperCase();
	value = value.replace('-', '' );
	$('#lista_diag').empty();
	$('#lista_diag').scrollTop(0);
	diagnosticoSelect = null;
   
    
	/**Carrega o diagnostico principal**/
	if(value.length == 3){
		getDiagOptions(valueNew);
	}else if(value.length > 3){
		getDiagOptions(value.substring(0, 3));
	} 
	
	buildOptions(value);
}

/**funcao para adicionar o codigo diagnostico a tabela**/
function addDiagnosticToTable(nameDiag){
	 $('#codigoDiagnostico').val(nameDiag);
	 showBusysign();
	 $('#adicionarDiagnostico').click();
}