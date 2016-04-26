var fnf = document.getElementById("sumCredit");
fnf.addEventListener('keyup', function(evt){
		var n = parseInt(this.value.replace(/\D/g,''),10);
		fnf.value = n.toLocaleString();
}, false);

function checkForm(){
	var hash, flag, key, fieldValue, elementId;
		hash = {
			'sumCredit':     'Сумма кредита',
			'termCredit':    'Срок кредита',
			'percentCredit': 'Процент кредита'
		};
		flag = true;
		for (key in hash) {
			if( hash.hasOwnProperty( key ) ) {
				fieldValue = document.getElementById(key).value;
				elementId = "isEmpty" + key;

				if(key === 'sumCredit') {
					fieldValue = parseInt(fieldValue.replace(/\D/g,''),10);
					if( isNaN(fieldValue) ) {
						document.getElementById(elementId).innerHTML = "Вы не заполнили поле «" + hash[key]+ "»";
						flag = false;
					}
					else if ( fieldValue > 999999999999 ) {
						document.getElementById(elementId).innerHTML = "Поле «" + hash[key] + "» заполнено в неверном формате";
						flag = false;
					}
					else if ( fieldValue < 1 ) {
						document.getElementById(elementId).innerHTML = "Поле «" + hash[key] + "» заполнено в неверном формате";
						flag = false;
					}
					else document.getElementById(elementId).innerHTML = "";
				}
				else if( isNaN(fieldValue) ) {
					document.getElementById(elementId).innerHTML = "Поле «" + hash[key] + "» заполнено в неверном формате";
						flag = false;
				}
				else if( fieldValue === "" ) {
					document.getElementById(elementId).innerHTML = "Вы не заполнили поле «" + hash[key]+ "»";
						flag = false;
				}
				else if ( fieldValue < 1 ) {
					document.getElementById(elementId).innerHTML = "Поле «" + hash[key] + "» заполнено в неверном формате";
					flag = false;
				}
				else if(key === 'termCredit') {
					if( fieldValue >= 61 ) {
						document.getElementById(elementId).innerHTML = "Максимальный «" + hash[key] + "» не более 60 месяцев";
						flag = false;
					}
					else document.getElementById(elementId).innerHTML = "";
				}
				else if(key === 'percentCredit') {
					if( fieldValue >= 201 ) {
						document.getElementById(elementId).innerHTML = "Максимальный «" + hash[key] + "» не более 200%";
						flag = false;
					}
					else document.getElementById(elementId).innerHTML = "";
				}
				else {
						document.getElementById(elementId).innerHTML = "";
				}
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
			pPercent, mPayment, pAmortization, dataTable, debt,
			i, tmp, Percent, Payment;
	pPercent = []; mPayment = []; pAmortization = []; month = []; dataTable = [];

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
	var div, i, k, key, p, pPercent, PV, valuta, tmp, result, above, divLessSumPay, divEqualPay, style,
	classNameDecrease, classNameEqual, outputDecrease, outputEqual;
		div = document.createElement("div");
		div.setAttribute("class","output");

	if (arguments.length === 1) {
		pPercent = arg;
		PV = document.PMT.PV.value;
		PV = parseInt(PV.replace(/\D/g,''),10);
		valuta = document.getElementById("valuta").value;

		div.setAttribute("style","height: 120px;");
		tmp =0;
		divLessSumPay = ['Итоговая выплата', 'Переплата по кредиту'];

		for(i = 0; i < pPercent.length;i++) {
					tmp += pPercent[i];
					result = PV+tmp;
					result = Math.floor(result);
					outputDecrease = result.toLocaleString() + valuta;
					result -= PV;
					above = result.toLocaleString() + valuta;
		}
		for(k in divLessSumPay) {
			if(k === '0') {
				classNameDecrease = 'resultCredit';
				p = divLessSumPay[k];
				createDiv( p, classNameDecrease, div, outputDecrease );
			}
			else {
				classNameDecrease = 'overPayment';
				p = divLessSumPay[k];
				createDiv( p, classNameDecrease, div, above );
			}
		}
		container.appendChild(div);
	}

	else if (arguments.length === 3) {
		outputEqual = arg;
		divEqualPay = ['Итоговая выплата','Ежемесячный платеж','Переплата по кредиту'];

		for(key in divEqualPay) {
			if(key === '0') {
				classNameEqual = 'resultCredit';
				p = divEqualPay[key];
				createDiv( p, classNameEqual, div, outputEqual );
			}
			else if(key === '1') {
				classNameEqual = 'montPayment';
				p = divEqualPay[key];
				createDiv( p, classNameEqual, div, month );
			}
			else if(key === '2') {
				classNameEqual = 'overPayment';
				p = divEqualPay[key];
				style = "top:110px;";
				createDiv( p, classNameEqual, div, over, style );
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
	var arr = [], NP, valuta, html, row, col;
			NP = +document.PMT.NP.value;
			valuta = document.getElementById("valuta").value;

	html ='<table><tr><th>Номер месяца</th><th>В погашение долга</th><th>Погашение процентов</th><th>Ежемесячный платеж</th>';
	for (row = 0; row < NP; row++) {

			html +='<tr style="text-align:right;">';

			for(col = 0; col < dataTabStr.length; col++) {
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



