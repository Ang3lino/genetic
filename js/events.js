
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
function createHTMLRestrictions(vars, varCount, tableHTML) {
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
 * @param {HTMLObjects, the main container of the restrictions table} restrictionsTable 
 */
function blinkRestrictions(restrictionsTable, valid) {
    className = restrictionsTable.className;

    if (className.includes("hide") && valid) {
        className = className.replace("hide", "");
    } else className += "hide";
    restrictionsTable.className = className;

}

function createRestrictions(amountVariables) {
    var restrictions = new Matrix(amountVariables, 2);
    for (let i = 0; i < amountVariables; ++i) {
        const a = document.getElementById("low-" + i.toString());
        const b = document.getElementById("high-" + i.toString());
        restrictions.setElement(i, 0, Number(a.value));
        restrictions.setElement(i, 1, Number(b.value));
    }
    return restrictions;
}

function invertCoefficients(strFun, alphabet, variableCount) {
    for (let i = 0; i < variableCount; ++i) 
        strFun = strFun.replace(alphabet[i], "(-"+alphabet[i] + ")");
    return strFun;
}

/**
 * Main function which executes everthing from this document.
 * 
 * Basically, here we must obtain the objective function, infer the number of variables
 * used and with this number create dinamically the restrictions for each one and then 
 * we pass all the parameters to the functionOptimization.js source.
 */
function execEvents() {
    let restrictionsTable = document.getElementById("restrictions-table");
    let updateBtn = document.getElementById("btn-update-restrictions");
    let computeBtn = document.getElementById("btn-compute");
    let funcTxt = document.getElementById("objective-func-txt");
    let txtAreaResult = document.getElementById("txtarea-result");

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let nvar;

    const individualCountTxt = document.getElementById("nindividual-txt");
    const poblationCountTxt = document.getElementById("npoblation-txt");
    const bitsCountTxt = document.getElementById("nbits-txt");
    let maxOn = document.getElementById("switch-max");

    //blinkRestrictions(restrictionsTable, funcTxt.value.length);

    // Do not write the preffix "on" at the first parameter
    updateBtn.addEventListener("click", function(e) { 
        nvar = inferNumberVariables(funcTxt.value, alphabet);

        createHTMLRestrictions(alphabet, nvar, restrictionsTable);
        
        if (maxOn.checked) console.log("It is on."); 
        else console.log("It is off.");

    });

    computeBtn.addEventListener("click", function(e) {
        let restrictions = createRestrictions(nvar);
    
        txtAreaResult.value = "un mamut chiquitito queria volar";
        let mStrFun = funcTxt.value;

        // prepare string for minimizing
        if ( !maxOn.checked ) mStrFun = invertCoefficients(funcTxt.value, alphabet, nvar); 
        optimize(nvar, parseInt(poblationCountTxt.value), parseInt(individualCountTxt.value), 
            parseInt(bitsCountTxt.value), mStrFun, restrictions);
    });

}
