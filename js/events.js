
/**
 * returns a string abc...z
 */
function buildAlphabet() {
    let alphabet = "";
    const a = 'a'.charCodeAt(0), b = 'z'.charCodeAt(0);
    for (let i = a; i <= b; ++i) {
        alphabet += String.fromCharCode(i);
    }
    return alphabet;
}

/**
 * Given the objective function and an alphabet this will infer the amount of variables used. 
 * @param {strin} strFun 
 * @param {string} alphabet 
 */
function inferNumberVariables(strFun, alphabet) {
    let count = 0;
    let unique = new Set(strFun);
    for (let char of unique) if (alphabet.includes(char)) ++count;
    return count;
}


/**
 * This function will create dynamically a table of restrictions to fill.
 * @param {A string of the alphabet ab...z} vars 
 * @param {integer of the amount of variables used} varCount 
 * @param {An HTMLObject (container) of the restrictions table} tableHTML 
 */
function createHTMLLimits(vars, varCount, tableHTML) {
    const template = '<tr> <td> <input type="number" id="low-X"> </td> \
        <td>var</td> \
        <td> <input type="number" id="high-X"> </td> </tr>';
    let mainBody = tableHTML.getElementsByTagName("table")[0]
                            .getElementsByTagName("tbody")[0];
    let newStr = "";
    for (let i = 0; i < varCount; ++i) {
        let buff = template.replace("X", i);
        newStr += buff.replace("X", i).replace("var", vars[i]);
    }
    mainBody.innerHTML = newStr;
}



/**
 * It appears or disappears the restrictions.
 * @param {HTMLObjects, the main container of the restrictions table} limitsTable 
 */
function blinkRestrictions(limitsTable, valid) {
    className = limitsTable.className;

    if (className.includes("hide") && valid) {
        className = className.replace("hide", "");
    } else className += "hide";
    limitsTable.className = className;

}

// this name may confuse... v:
function createLimits(amountVariables) {
    var restrictions = new Matrix(amountVariables, 2);
    for (let i = 0; i < amountVariables; ++i) {
        const a = document.getElementById("low-" + i.toString());
        const b = document.getElementById("high-" + i.toString());
        restrictions.setElement(i, 0, Number(a.value));
        restrictions.setElement(i, 1, Number(b.value));
    }
    return restrictions;
}

function getRestriction(i) {
    let tableHTML = document.getElementById("restrictions");
    let table = tableHTML.getElementsByTagName("table")[0];
    let tbodies = table.getElementsByTagName("tbody")[0];
    const n = tbodies.getElementsByTagName("tr").length; // number of tr elements
    if (i <  n) {
        var restrictionX = document.getElementById("restriction-" + i.toString());
        return restrictionX.value;
    } else {
        throw "restriction unavailable";
    }
}

/**
 * It returns all the restrictions as an array of strings.
 */
function getAllRestrictions() {
    let tableHTML = document.getElementById("restrictions");
    let table = tableHTML.getElementsByTagName("table")[0];
    let tbodies = table.getElementsByTagName("tbody")[0];
    const n = tbodies.getElementsByTagName("tr").length; // number of tr elements
    var listOfRestrictions = []; 
    for (let i = 0; i < n; ++i) {
        let restriction = getRestriction(i);
        listOfRestrictions.push(restriction);
    }
    return listOfRestrictions;
}

function invertCoefficients(strFun, alphabet, variableCount) {
    for (let i = 0; i < variableCount; ++i) 
        strFun = strFun.replace(alphabet[i], "(-1)*"+alphabet[i] );
    return strFun;
}

/**
 * This function will create  or delete dynamically new restrictions.
 * @param {An HTMLObject (container) of the restrictions} 
 */
function addRestrictions(tableHTML, n) {
    const template = '<tr> \
							<div class="col s12 input-field valign"> \
								<label style="color:black"> Restriccion X </label> \
								<input type="text" id="restriction-X"> \
							</div> \
						</tr>';
    let table = tableHTML.getElementsByTagName("table")[0];
    let tbodies = table.getElementsByTagName("tbody")[0];
    console.log(tbodies.getElementsByTagName("tr").length); // number of tr elements
    let mainBody = tbodies;
    //console.log(mainBody.getElementsByTagName("tr")[0]);
    let newStr = "";
    for (let i = 0; i < n; ++i) {
        let buff = template.replace("X", i);
        newStr += buff.replace("X", i).replace("X", i);
    }
    mainBody.innerHTML = newStr;
}

/**
 * 
 * @param {Array of values (a, b, ..., z) to be evaluated } tuple 
 * @param {Array of restrictions represented as strings } restrictions 
 */
function isValidVariable(tuple, restrictions) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (restriction of restrictions) {
        //debugger;
        const nargs = tuple.length;
        let buff = restriction; 
        if (buff.includes("==")) {
            let arr = buff.split("==");
            let sum = arr[0], data = arr[1];
            for (let i = 0; i < nargs; ++i) 
                sum = sum.replace(alphabet[i], tuple[i]);
            let x = eval(sum), d = eval(data);
            if (Math.abs(x - d) > 10) 
               return false	; 
        } else {
            for (let i = 0; i < nargs; ++i) 
                buff = buff.replace(alphabet[i], tuple[i]);
            const b = eval(buff);
            if (!b) return false; 
        }
    }
    return true;
}

/**
 * Main function which executes everthing from this document.
 * 
 * Basically, here we must obtain the objective function, infer the number of variables
 * used and with this number create dinamically the restrictions for each one and then 
 * we pass all the parameters to the functionOptimization.js source.
 */
function execEvents() {

    let limitsTable = document.getElementById("limits-table");
	let newrestrictions = document.getElementById("restrictions");
    let updateBtn = document.getElementById("btn-update-restrictions");
	let addResBtn = document.getElementById("add-btn");
	let delResBtn = document.getElementById("min-btn");
    let computeBtn = document.getElementById("btn-compute");
    let funcTxt = document.getElementById("objective-func-txt");

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const individualCountTxt = document.getElementById("nindividual-txt");
    const poblationCountTxt = document.getElementById("npoblation-txt");
    const bitsCountTxt = document.getElementById("nbits-txt");

    let maxOn = document.getElementById("switch-max");
    let nvar = 0;
    let nres = 0;

    //blinkRestrictions(limitsTable, funcTxt.value.length);

    // Do not write the preffix "on" at the first parameter
    updateBtn.addEventListener("click", function(e) { 
        nvar = inferNumberVariables(funcTxt.value, alphabet);
        createHTMLLimits(alphabet, nvar, limitsTable);

    });
	
	addResBtn.addEventListener("click", function(e) { 
		++nres;
        addRestrictions(newrestrictions, nres);
		//let newRests = getRestriction(nres);
    });
	
	delResBtn.addEventListener("click", function(e) { 
        if (nres > 0) --nres;
		addRestrictions(newrestrictions, nres);
		//let newRests = getRestriction(nres);
    });

    computeBtn.addEventListener("click", function(e) {
        //debugger;
        let restrictions = getAllRestrictions();
        let limits = createLimits(nvar);

        // hasta aqui
        let mStrFun = funcTxt.value;

        // prepare string for minimizing
        if ( !maxOn.checked ) mStrFun = invertCoefficients(funcTxt.value, alphabet, nvar); 
        console.log(mStrFun);
        optimize(nvar, parseInt(poblationCountTxt.value), parseInt(individualCountTxt.value), 
            parseInt(bitsCountTxt.value), mStrFun, limits, restrictions);
    });

}
