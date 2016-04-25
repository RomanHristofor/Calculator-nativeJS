var fnf = document.getElementById("sumCredit");
fnf.addEventListener('keyup', function(evt){
		var n = parseInt(this.value.replace(/\D/g,''),10);
		fnf.value = n.toLocaleString();
}, false);

function CheckForm(){
	var hash, flag, key, fieldValue, elementId;
		hash = {
			 'sumCredit': 'Сумма кредита',
			 'termCredit': 'Срок кредита',
			 'percentCredit': 'Процент кредита'
		};
		flag = true;
		for (key in hash) {
				fieldValue = document.getElementById(key).value;
				elementId = "isEmpty" + key;

				if(key === 'sumCredit') {
					fieldValue = parseInt(fieldValue.replace(/\D/g,''),10);
					if( isNaN(fieldValue) ) {
						document.getElementById(elementId).innerHTML = "Вы не заполнили поле &laquo;" + hash[key]+ "&raquo;";
						flag = false;
					}
					else if ( fieldValue > 999999999999 ) {
						document.getElementById(elementId).innerHTML = "Поле &laquo;" + hash[key] + "&raquo; заполнено в неверном формате";
						flag = false;
					}
					else if ( fieldValue < 1 ) {
						document.getElementById(elementId).innerHTML = "Поле &laquo;" + hash[key] + "&raquo; заполнено в неверном формате";
						flag = false;
					}
					else document.getElementById(elementId).innerHTML = "";
				}

					else if( isNaN(fieldValue) ) {
						document.getElementById(elementId).innerHTML = "Поле &laquo;" + hash[key] + "&raquo; заполнено в неверном формате";
							flag = false;
					}
					else if( fieldValue == "" ) {
						document.getElementById(elementId).innerHTML = "Вы не заполнили поле &laquo;" + hash[key]+ "&raquo;";
							flag = false;
					}
					else if ( fieldValue < 1 ) {
						document.getElementById(elementId).innerHTML = "Поле &laquo;" + hash[key] + "&raquo; заполнено в неверном формате";
						flag = false;
					}

				else if(key === 'termCredit') {
					if( fieldValue >= 61 ) {
						document.getElementById(elementId).innerHTML = "Максимальный &laquo;" + hash[key] + "&raquo; не более 60 месяцев";
						flag = false;
					}
					else document.getElementById(elementId).innerHTML = "";
				}
				else if(key === 'percentCredit') {
					if( fieldValue >= 201 ) {
						document.getElementById(elementId).innerHTML = "Максимальный &laquo;" + hash[key] + "&raquo; не более 200%";
						flag = false;
					}
					else document.getElementById(elementId).innerHTML = "";
				}
				else {
							document.getElementById(elementId).innerHTML = "";
				}
		}
		if(flag === true) {
			calculate();
		}
		else {
			document.getElementById('result').innerHTML = "";
			document.getElementById('buildTable').innerHTML = "";
		}
}

var container = document.getElementById("result");

function calculate() {
	var output, itog, month, current, over, valuta, PV, IR, NP, PT,
			pPercent, mPayment, pAmortization, month, dataTable, debt,
			i, tmp, Percent, Payment;

	valuta = document.getElementById("valuta").value;
	PV = document.PMT.PV.value;
	PV = parseInt(PV.replace(/\D/g,''),10);
	IR = +document.PMT.IR.value / 100;
	NP = +document.PMT.NP.value;
	PT = +document.PMT.PayType.value;

	if(PT === 1) {
		IR = +document.PMT.IR.value / 100 /12;
		output = ( ( PV * IR ) / (1 - Math.pow(1 + IR, - NP)) ) * NP;
		itog = +output.toFixed();
		output = itog.toLocaleString() + valuta;
		month = ( PV * IR ) / (1 - Math.pow(1 + IR, - NP));
		current = +month.toFixed();
		month = current.toLocaleString() + valuta;
		over = itog - PV;
		over = over.toLocaleString() + valuta;
		document.getElementById('result').innerHTML = "";
		document.getElementById('buildTable').innerHTML = "";
		buildDivPay(output, month, over);
	}
	else if(PT === 2) {
		document.getElementById('result').innerHTML = "";
		pPercent = [];
		mPayment = [];
		pAmortization = [];
		month = [];
		dataTable = [];
		debt = PV / NP;
		debt = Math.floor(debt);

		for (i = 1; i <= NP; i++) {
			tmp = ( PV * IR ) / 12;
			tmp = Math.floor(tmp);
			PV -= debt;
			Percent = tmp;
			Payment = Percent + debt;
			month.push(i);
			pPercent.push(Percent);
			mPayment.push(Payment);
			pAmortization.push(debt);
		}
		dataTable = [month,pAmortization,pPercent,mPayment];
		buildDivPay( pPercent );
		buildArrString(dataTable);
	}
}

function buildDivPay( arg, month, over) {
	var div = document.createElement("div");
	div.setAttribute("class","output");

	if (arguments.length == 1) {
		var pPercent = arg;
		var PV = document.PMT.PV.value;
		PV = parseInt(PV.replace(/\D/g,''),10);
		var valuta = document.getElementById("valuta").value;

		div.setAttribute("style","height: 120px;");
		var p, clas, result, output, over;
		var tmp =0; var divLessSumPay = ['Итоговая выплата', 'Переплата по кредиту'];

		for(var i = 0; i < pPercent.length;i++) {
					tmp += pPercent[i];
					result = PV+tmp;
					result = Math.floor(result);
					output = result.toLocaleString() + valuta;
					result -= PV;
					over = result.toLocaleString() + valuta;
		}
			for(var k in divLessSumPay) {
				if(k === '0') {
					clas = 'resultCredit';
					p = divLessSumPay[k];
					createDiv(p,clas,div,output);
				}
				else {
					clas = 'overPayment';
					p = divLessSumPay[k];
					createDiv(p,clas,div,over);
				}
			}
		container.appendChild(div);
	}

	else if (arguments.length == 3) {
		var output = arg;
		var divEqualPay = ['Итоговая выплата','Ежемесячный платеж','Переплата по кредиту'];
		var p, clas, style;

		for(var k in divEqualPay) {
			if(k === '0') {
				clas = 'resultCredit';
				p = divEqualPay[k];
				createDiv( p, clas, div, output );
			}
			else if(k === '1') {
				clas = 'montPayment';
				p = divEqualPay[k];
				createDiv( p, clas, div, month );
			}
			else if(k === '2') {
				clas = 'overPayment';
				p = divEqualPay[k];
				style = "top:110px;"
				createDiv( p, clas, div, over, style );
			}
		}
		container.appendChild(div);
	}
}

function createDiv( P, clas, div, res, style ) {
	var p, span;
	p = document.createElement('p');
	p.setAttribute("class", clas);
	p.textContent = P;
	div.appendChild(p);
	span = document.createElement('span');
	if(style !== undefined) {
		span.setAttribute("style", style);
	}
	span.textContent = res;
	div.appendChild(span);
}

function buildArrString(dataTable) {
	for (var i = 0; i < dataTable.length; i++) {
		for (var j = 0; j < dataTable[i].length; j++)
			dataTable[i][j] = dataTable[i][j].toLocaleString();
	}
	buildTable( dataTable );
}

function buildTable(dataTabStr) {
	var arr = [];
	var NP = +document.PMT.NP.value;
	var valuta = document.getElementById("valuta").value;

	var html ='<table><tr><th>Номер месяца</th><th>В погашение долга</th><th>Погашение процентов</th><th>Ежемесячный платеж</th>';
	for (var row = 0; row < NP; row++) {

			html +='<tr style="text-align:right;">';

			for(var col = 0; col < dataTabStr.length; col++) {
					html +='<td>';

					arr[col] = dataTabStr[col][row];
					if(dataTabStr[col] !== dataTabStr[0]) {
						arr[col] += valuta;
					}
					html += arr[col] + '</td>';
			}
			html += '</tr>';
	}
	html +='</tr></table>';
	document.getElementById("buildTable").innerHTML = html;
}



