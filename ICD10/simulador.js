/**id da lista por posicao**/
var listSection = 'lista_seccao';
var listBodySystem = 'lista_sistema_corporal';
var listOperation = 'lista_tipo_procedimento';
var listBodyPart = 'lista_parte_corpo';
var listApproach = 'lista_abordagem';
var listDevice = 'lista_dispositivo';
var listQualifier = 'lista_qualificador';

/**posicao no array pcsTable.axis**/
var axisSection = 0;
var axisBodySystem = 1;
var axisOperation = 2;
/**posicao no array pcsTable.pcsRow.axis**/
var axisBodyPart = 0;
var axisApproach = 1;
var axisDevice = 2;
var axisQualifier = 3;

/**posicao no no codigo icd10**/
var posSection = '1';
var posBodySystem = '2';
var posOperation = '3'
var posBodyPart = '4'
var posApproach = '5'
var posDevice = '6'
var posQualifier= '7'

var codes = json.ICD10PCS.pcsTable;


/**Devolve as opcoes da SECCAO*/
function buildSectionOptions(){
	var obj = {};
	var control = [];
	$.each(codes, function(i, v) {
		if (v.axis[axisSection]._pos == posSection 
			&& $.inArray( v.axis[axisSection].label._code, control ) == -1) {
			code = {}
			code ["value"] = v.axis[axisSection].label._code;
			code ["label"] = v.axis[axisSection].label.__text;
           obj[i] = code;
		   control.push(v.axis[axisSection].label._code);
		}
    });
	var option = '';
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	$('#'+listSection).append(option);
	
	/**Atualiza o seleccionado e as restantes listas**/
	$('#'+listSection+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listSection+' li label').children(" input:checkbox").not(this).prop('checked', false);  
		$("#"+listBodySystem+"").empty();
		$("#"+listOperation+"").empty();
		$("#"+listBodyPart+"").empty();
		$("#"+listApproach+"").empty();
		$("#"+listDevice+"").empty();
		$("#"+listQualifier+"").empty();
		if(this.checked) {
			buildBodySystemOptions(this.value);
		}	
	});
}

/**Devolve as opcoes da SISTEMA CORPORAL*/
function buildBodySystemOptions(sectionValue){
	var obj = {};
	var control = [];
	$.each(codes, function(i, v) {
		if(v.axis[axisSection].label._code == sectionValue 
			&& v.axis[axisBodySystem]._pos == posBodySystem 
			&& $.inArray( v.axis[axisBodySystem].label._code, control ) == -1) {
			code = {}
			code ["value"] = v.axis[axisBodySystem].label._code;
			code ["label"] = v.axis[axisBodySystem].label.__text;
           obj[i] = code;
		   control.push(v.axis[axisBodySystem].label._code);
		}
    });
	
	var option = '';
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	$('#'+listBodySystem).append(option);
	
	/**Garante que so um esta selecionado e atualiza o seguinte**/
	$('#'+listBodySystem+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listBodySystem+' li label').children(" input:checkbox").not(this).prop('checked', false);  
		$("#"+listOperation+"").empty();
		$("#"+listBodyPart+"").empty();
		$("#"+listApproach+"").empty();
		$("#"+listDevice+"").empty();
		$("#"+listQualifier+"").empty();		
		if(this.checked) {
			buildOperationOptions(sectionValue,this.value);
		}	
	});
}

/**Devolve as opcoes da TIPO PROCEDIMENTOS*/
function buildOperationOptions(sectionValue,bodySystemValue){
	var obj = {};
	var control = [];
	$.each(codes, function(i, v) {
		if(v.axis[axisSection].label._code == sectionValue 
			&& v.axis[axisBodySystem].label._code == bodySystemValue
			&& v.axis[axisOperation]._pos == posOperation 
			&& $.inArray( v.axis[axisOperation].label._code, control ) == -1) {
			code = {}
			code ["value"] = v.axis[axisOperation].label._code;
			code ["label"] = v.axis[axisOperation].label.__text;
			obj[i] = code;
			control.push(v.axis[axisOperation].label._code);
		}
    });
	
	var option = '';
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	$('#'+listOperation).append(option);
	
	/**Garante que so um esta selecionado e atualiza o seguinte**/
	$('#'+listOperation+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listOperation+' li label').children(" input:checkbox").not(this).prop('checked', false);  
		$("#"+listBodyPart+"").empty();
		$("#"+listApproach+"").empty();
		$("#"+listDevice+"").empty();
		$("#"+listQualifier+"").empty();		
		if(this.checked) {
			buildBodyPartOptions(sectionValue,bodySystemValue,this.value);
		}	
	});
}

/**Devolve as opcoes da PARTE DO CORPO*/
function buildBodyPartOptions(sectionValue,bodySystemValue,operationValue){
	/**Array de objetos para guardar as opcoes*/
	var obj = {};
	/**Array para controlar os repetidos*/
	var control = [];
	/**Variavel para controlar o index dos repetidos*/
	var arrayIndex = 0;
	/**Itera todas as posicoes do json*/
	$.each(codes, function(i, v) {
		/**Verifica o primeiro se corresponde a section,bodySystem e Operation*/
		if(v.axis[axisSection].label._code == sectionValue 
			&& v.axis[axisBodySystem].label._code == bodySystemValue
			&& v.axis[axisOperation].label._code == operationValue) {
				
			/**Variavel com o array das opcoes bodyPart,approach,device,qualifier*/	
			var axisPcsRow = v.pcsRow;
			
			/**verifica se tem mais que um array de opcoes**/
			if(axisPcsRow.length > 1){
				for(var index in axisPcsRow){
					/**verifica se tem so tem um objeto axis e se e a opcao bodyPart**/
					if(axisPcsRow[index].axis && axisPcsRow[index].axis[axisBodyPart]._pos == posBodyPart){
						/**adiciona os valores ao array de opcoes*/
						arrayIndex = buildArrayOptions(axisPcsRow[index].axis[axisBodyPart].label,obj,control,arrayIndex);
					}else{
						/**Itera as rows*/
						$.each(axisPcsRow[index], function(p, r) {
						/**Verifica se tem o axis para a opcao bodyPart */	
							if(r.axis[axisBodyPart]._pos == posBodyPart){
								/**adiciona os valores ao array de opcoes*/
								arrayIndex = buildArrayOptions(r.axis[axisBodyPart].label,obj,control,arrayIndex);
							}
						});	
					}					
				}
			}
			else{
				/**verifica se tem so tem um objeto axis e se e a opcao bodyPart**/
				if(axisPcsRow.axis && axisPcsRow.axis[axisBodyPart]._pos == posBodyPart){
					/**adiciona os valores ao array de opcoes*/
					arrayIndex = buildArrayOptions(axisPcsRow.axis[axisBodyPart].label,obj,control,arrayIndex);
				}else{
					/**Itera as rows*/
					$.each(axisPcsRow, function(p, r) {
					/**Verifica se tem o axis para a opcao bodyPart */	
						if(r.axis[axisBodyPart]._pos == posBodyPart){
							/**adiciona os valores ao array de opcoes*/
							arrayIndex = buildArrayOptions(r.axis[axisBodyPart].label,obj,control,arrayIndex);
						}
					});	
				}				
			}			
		}
    });
	
	/**Variavel para guardar o HTML*/
	var option = '';
	/**Adiciona o HTML a variavel*/
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	/**Adiciona o HTML a pagina*/
	$('#'+listBodyPart).append(option);
	
	/**Garante que so um esta selecionado e atualiza o seguinte**/
	$('#'+listBodyPart+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listBodyPart+' li label').children(" input:checkbox").not(this).prop('checked', false);
		$("#"+listApproach+"").empty();
		$("#"+listDevice+"").empty();
		$("#"+listQualifier+"").empty();		
		if(this.checked) {
			buildApproachOptions(sectionValue,bodySystemValue,operationValue,this.value);
		}	
	});
}

/**Devolve as opcoes da ABORDAGEM*/
function buildApproachOptions(sectionValue,bodySystemValue,operationValue,bodyPartValue){
	/**Array de objetos para guardar as opcoes*/
	var obj = {};
	/**Array para controlar os repetidos*/
	var control = [];
	/**Variavel para controlar o index dos repetidos*/
	var arrayIndex = 0;
	/**Itera todas as posicoes do json*/
	$.each(codes, function(i, v) {
		/**Verifica o primeiro se corresponde a section,bodySystem e Operation*/
		if(v.axis[axisSection].label._code == sectionValue 
			&& v.axis[axisBodySystem].label._code == bodySystemValue
			&& v.axis[axisOperation].label._code == operationValue) {
				
			/**Variavel com o array das opcoes bodyPart,approach,device,qualifier*/	
			var axisPcsRow = v.pcsRow;
			
			/**verifica se tem mais que um array de opcoes**/
			if(axisPcsRow.length > 1){
				/**verifica as opcoes bodyPart**/
				for(var index in axisPcsRow){
					if(validateBodyPartValue(axisPcsRow[index],bodyPartValue)){
						/**verifica se tem so tem um objeto axis e se e a opcao approach**/
						if(axisPcsRow[index].axis && axisPcsRow[index].axis[axisApproach]._pos == posApproach){
							/**adiciona os valores ao array de opcoes*/
							arrayIndex = buildArrayOptions(axisPcsRow[index].axis[axisApproach].label,obj,control,arrayIndex);
						}else{
							/**Itera as rows*/
							$.each(axisPcsRow[index], function(p, r) {
							/**Verifica se tem o axis para a opcao approach */	
								if(r.axis[axisApproach]._pos == posApproach){
									/**adiciona os valores ao array de opcoes*/
									arrayIndex = buildArrayOptions(r.axis[axisApproach].label,obj,control,arrayIndex);
								}
							});	
						}
					}
				}
			}
			else{
				/**verifica as opcoes bodyPart**/
				if(validateBodyPartValue(axisPcsRow,bodyPartValue)){
					/**verifica se tem so tem um objeto axis e se e a opcao approach**/
					if(axisPcsRow.axis && axisPcsRow.axis[axisApproach]._pos == posApproach){
						/**adiciona os valores ao array de opcoes*/
						arrayIndex = buildArrayOptions(axisPcsRow.axis[axisApproach].label,obj,control,arrayIndex);
					}else{
						/**Itera as rows*/
						$.each(axisPcsRow, function(p, r) {
						/**Verifica se tem o axis para a opcao approach */	
							if(r.axis[axisApproach]._pos == posApproach){
								/**adiciona os valores ao array de opcoes*/
								arrayIndex = buildArrayOptions(r.axis[axisApproach].label,obj,control,arrayIndex);
							}
						});	
					}
				}
			}				
		}
    });
	
	/**Variavel para guardar o HTML*/
	var option = '';
	/**Adiciona o HTML a variavel*/
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	/**Adiciona o HTML a pagina*/
	$('#'+listApproach).append(option);
	
	/**Garante que so um esta selecionado e atualiza o seguinte**/
	$('#'+listApproach+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listApproach+' li label').children(" input:checkbox").not(this).prop('checked', false); 	
		$("#"+listDevice+"").empty();
		$("#"+listQualifier+"").empty();
		if(this.checked) {
			buildDeviceOptions(sectionValue,bodySystemValue,operationValue,bodyPartValue,this.value);
		}	
	});
}

/**Devolve as opcoes da DISPOSITIVO*/
function buildDeviceOptions(sectionValue,bodySystemValue,operationValue,bodyPartValue,approachValue){
	/**Array de objetos para guardar as opcoes*/
	var obj = {};
	/**Array para controlar os repetidos*/
	var control = [];
	/**Variavel para controlar o index dos repetidos*/
	var arrayIndex = 0;
	/**Itera todas as posicoes do json*/
	$.each(codes, function(i, v) {
		/**Verifica o primeiro se corresponde a section,bodySystem e Operation*/
		if(v.axis[axisSection].label._code == sectionValue 
			&& v.axis[axisBodySystem].label._code == bodySystemValue
			&& v.axis[axisOperation].label._code == operationValue) {
				
			/**Variavel com o array das opcoes bodyPart,approach,device,qualifier*/	
			var axisPcsRow = v.pcsRow;
			
			/**verifica se tem mais que um array de opcoes**/
			if(axisPcsRow.length > 1){
				/**verifica as opcoes bodyPart,approach**/
				for(var index in axisPcsRow){
					if(validateBodyPartValue(axisPcsRow[index],bodyPartValue) 
					&& validateApproachValue(axisPcsRow[index],approachValue)){
						/**verifica se tem so tem um objeto axis e se e a opcao device**/
						if(axisPcsRow[index].axis && axisPcsRow[index].axis[axisDevice]._pos == posDevice){
							/**adiciona os valores ao array de opcoes*/
							arrayIndex = buildArrayOptions(axisPcsRow[index].axis[axisDevice].label,obj,control,arrayIndex);
						}else{
							/**Itera as rows*/
							$.each(axisPcsRow[index], function(p, r) {
							/**Verifica se tem o axis para a opcao device */	
								if(r.axis[axisDevice]._pos == posDevice){
									/**adiciona os valores ao array de opcoes*/
									arrayIndex = buildArrayOptions(r.axis[axisDevice].label,obj,control,arrayIndex);
								}
							});	
						}
					}
				}
			}
			else{
				/**verifica as opcoes bodyPart,approach,device**/
				if(validateBodyPartValue(axisPcsRow,bodyPartValue) 
					&& validateApproachValue(axisPcsRow,approachValue)){
					/**verifica se tem so tem um objeto axis e se e a opcao device**/
					if(axisPcsRow.axis && axisPcsRow.axis[axisDevice]._pos == posDevice){
						/**adiciona os valores ao array de opcoes*/
						arrayIndex = buildArrayOptions(axisPcsRow.axis[axisDevice].label,obj,control,arrayIndex);
					}else{
						/**Itera as rows*/
						$.each(axisPcsRow, function(p, r) {
						/**Verifica se tem o axis para a opcao device */	
							if(r.axis[axisDevice]._pos == posDevice){
								/**adiciona os valores ao array de opcoes*/
								arrayIndex = buildArrayOptions(r.axis[axisDevice].label,obj,control,arrayIndex);
							}
						});	
					}
				}
			}
		}
    });
	
	/**Variavel para guardar o HTML*/
	var option = '';
	/**Adiciona o HTML a variavel*/
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	/**Adiciona o HTML a pagina*/
	$('#'+listDevice).append(option);
	
	/**Garante que so um esta selecionado e atualiza o seguinte**/
	$('#'+listDevice+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listDevice+' li label').children(" input:checkbox").not(this).prop('checked', false);
		$("#"+listQualifier+"").empty();
		if(this.checked) {
			buildQualifierOptions(sectionValue,bodySystemValue,operationValue,bodyPartValue,approachValue,this.value);
		}	
	});
}

/**Devolve as opcoes da QUALIFICADOR*/
function buildQualifierOptions(sectionValue,bodySystemValue,operationValue,bodyPartValue,approachValue,deviceValue){
	/**Array de objetos para guardar as opcoes*/
	var obj = {};
	/**Array para controlar os repetidos*/
	var control = [];
	/**Variavel para controlar o index dos repetidos*/
	var arrayIndex = 0;
	/**Itera todas as posicoes do json*/
	$.each(codes, function(i, v) {
		/**Verifica o primeiro se corresponde a section,bodySystem e Operation*/
		if(v.axis[axisSection].label._code == sectionValue 
			&& v.axis[axisBodySystem].label._code == bodySystemValue
			&& v.axis[axisOperation].label._code == operationValue) {
				
			/**Variavel com o array das opcoes bodyPart,approach,device,qualifier*/	
			var axisPcsRow = v.pcsRow;
			
			/**verifica se tem mais que um array de opcoes**/
			if(axisPcsRow.length > 1){
				/**verifica as opcoes bodyPart,approach,device**/
				for(var index in axisPcsRow){
					if(validateBodyPartValue(axisPcsRow[index],bodyPartValue) 
					&& validateApproachValue(axisPcsRow[index],approachValue)
					&& validateDeviceValue(axisPcsRow[index], deviceValue)){
						/**verifica se tem so tem um objeto axis e se e a opcao qualifier**/
						if(axisPcsRow[index].axis && axisPcsRow[index].axis[axisQualifier]._pos == posQualifier){
							/**adiciona os valores ao array de opcoes*/
							arrayIndex = buildArrayOptions(axisPcsRow[index].axis[axisQualifier].label,obj,control,arrayIndex);
						}else{
							/**Itera as rows*/
							$.each(axisPcsRow[index], function(p, r) {
							/**Verifica se tem o axis para a opcao qualifier */	
								if(r.axis[axisQualifier]._pos == posQualifier){
									/**adiciona os valores ao array de opcoes*/
									arrayIndex = buildArrayOptions(r.axis[axisQualifier].label,obj,control,arrayIndex);
								}
							});	
						}
					}
				}
			}
			else{
				/**verifica as opcoes bodyPart,approach,device**/
				if(validateBodyPartValue(axisPcsRow,bodyPartValue) 
					&& validateApproachValue(axisPcsRow,approachValue)
					&& validateDeviceValue(axisPcsRow, deviceValue)){
					/**verifica se tem so tem um objeto axis e se e a opcao qualifier**/
					if(axisPcsRow.axis && axisPcsRow.axis[axisQualifier]._pos == posQualifier){
						/**adiciona os valores ao array de opcoes*/
						arrayIndex = buildArrayOptions(axisPcsRow.axis[axisQualifier].label,obj,control,arrayIndex);
					}else{
						/**Itera as rows*/
						$.each(axisPcsRow, function(p, r) {
						/**Verifica se tem o axis para a opcao qualifier */	
							if(r.axis[axisQualifier]._pos == posQualifier){
								/**adiciona os valores ao array de opcoes*/
								arrayIndex = buildArrayOptions(r.axis[axisQualifier].label,obj,control,arrayIndex);
							}
						});	
					}
				}
			}
		}
	});
	
	/**Variavel para guardar o HTML*/
	var option = '';
	/**Adiciona o HTML a variavel*/
	for(var index in obj){
	   option += '<li data-mode="checkbox" data-name="c1">';
	   option += '<label>';
	   option += '<input id="'+index+'" value="'+obj[index].value+'" type="checkbox">';
	   option += '</label>';
	   option += '<span class="leaf">'+obj[index].value+' - '+obj[index].label+'</span>';
	   option += '</li>'
	}
	
	/**Adiciona o HTML a pagina*/
	$('#'+listQualifier).append(option);
	
	/**Garante que so um esta selecionado e atualiza o seguinte**/
	$('#'+listQualifier+' li label').children(" input:checkbox").on('change', function() {
		$('#'+listQualifier+' li label').children(" input:checkbox").not(this).prop('checked', false); 	
		if(this.checked) {
			//buildBodySystemOptions(this.value);
		}	
	});
}

/**Recebe uma posicao axis e devolve um array com as opcoes*/
function buildArrayOptions(axisLabel,obj,control,arrayIndex){
	if($.isArray(axisLabel)){
		$.each(axisLabel, function(w, q) {
			if($.inArray( q._code, control ) == -1){
				code = {}
				code ["value"] = q._code;
				code ["label"] = q.__text;
				obj[arrayIndex] = code;
				arrayIndex++;
				control.push(q._code);
			}
		});
	}else{
		if($.inArray( axisLabel._code, control ) == -1){
			code = {}
			code ["value"] = axisLabel._code;
			code ["label"] = axisLabel.__text;
			obj[arrayIndex] = code;
			arrayIndex++;
			control.push(axisLabel._code);
		}
	}
	return arrayIndex;
}

/**Valida se no lote de opcoes existe a opcao do bodyPart**/
function validateBodyPartValue(axisPcsRow, bodyPartValue){
	var exist = false;
	if(axisPcsRow.axis 
		&& axisPcsRow.axis[axisBodyPart]._pos == posBodyPart){
		if($.isArray(axisPcsRow.axis[axisBodyPart].label)){
			$.each(axisPcsRow.axis[axisBodyPart].label, function(w, q) {
				if(q._code == bodyPartValue){
					exist = true;
				}
			});
		}else{
			if(axisPcsRow.axis[axisBodyPart].label._code == bodyPartValue){
				exist = true;
			}
		}
	}
	else{
		$.each(axisPcsRow, function(p, r) {
			if(r.axis[axisBodyPart]._pos == posBodyPart){
				if($.isArray(r.axis[axisBodyPart].label)){
					$.each(r.axis[axisBodyPart].label, function(w, q) {
						if(q._code == bodyPartValue){
							exist = true;
						}
					});
				}
				else{
					if(r.axis[axisBodyPart].label._code == bodyPartValue){
						exist = true;
					}
				}
			}
		});	
	}
	return exist;
}

/**Valida se no lote de opcoes existe a opcao do Approach**/
function validateApproachValue(axisPcsRow, approachValue){
	var exist = false;
	if(axisPcsRow.axis 
		&& axisPcsRow.axis[axisApproach]._pos == posApproach){
		if($.isArray(axisPcsRow.axis[axisApproach].label)){
			$.each(axisPcsRow.axis[axisApproach].label, function(w, q) {
				if(q._code == approachValue){
					exist = true;
				}
			});
		}else{
			if(axisPcsRow.axis[axisApproach].label._code == approachValue){
				exist = true;
			}
		}
	}
	else{
		$.each(axisPcsRow, function(p, r) {
			if(r.axis[axisApproach]._pos == posApproach){
				if($.isArray(r.axis[axisApproach].label)){
					$.each(r.axis[axisApproach].label, function(w, q) {
						if(q._code == approachValue){
							exist = true;
						}
					});
				}
				else{
					if(r.axis[axisApproach].label._code == approachValue){
						exist = true;
					}
				}
			}
		});	
	}
	return exist;
}

/**Valida se no lote de opcoes existe a opcao do Device**/
function validateDeviceValue(axisPcsRow, deviceValue){
	var exist = false;
	if(axisPcsRow.axis 
		&& axisPcsRow.axis[axisDevice]._pos == posDevice){
		if($.isArray(axisPcsRow.axis[axisDevice].label)){
			$.each(axisPcsRow.axis[axisDevice].label, function(w, q) {
				if(q._code == deviceValue){
					exist = true;
				}
			});
		}else{
			if(axisPcsRow.axis[axisDevice].label._code == deviceValue){
				exist = true;
			}
		}
	}
	else{
		$.each(axisPcsRow, function(p, r) {
			if(r.axis[axisDevice]._pos == posDevice){
				if($.isArray(r.axis[axisDevice].label)){
					$.each(r.axis[axisDevice].label, function(w, q) {
						if(q._code == deviceValue){
							exist = true;
						}
					});
				}
				else{
					if(r.axis[axisDevice].label._code == deviceValue){
						exist = true;
					}
				}
			}
		});	
	}
	return exist;
}