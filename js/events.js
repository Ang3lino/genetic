
/**
 * returns a string abc...z
 */
function buildAlphabet() {
    let alphabet = "";
    let a = 'a'.charCodeAt(0), b = 'z'.charCodeAt(0);
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

/**
 * Main function which executes everthing from this document.
 * 
 * Basically, here we must obtain the objective function, infer the number of variables
 * used and with this number create dinamically the restrictions for each one and then 
 * we pass all the parameters to the functionOptimization.js source.
 */
function execEvents() {
    let funcTxt = document.getElementById("objective-func-txt");
    let restrictionsTable = document.getElementById("restrictions-table");
    let updateBtn = document.getElementById("btn-update-restrictions");
    let alphabet = "abcdefghijklmnopqrstuvwxyz";

    //blinkRestrictions(restrictionsTable, funcTxt.value.length);

    // Do not write the preffix "on" at the first parameter
    updateBtn.addEventListener("click", function(e) { 
        let nvar = inferNumberVariables(funcTxt.value, alphabet);

        createHTMLRestrictions(alphabet, nvar, restrictionsTable);

        let maxOn = document.getElementById("switch-max");
        console.log(maxOn);
        if (maxOn.checked) console.log("It is on."); 
        else console.log("It is off.");

    });


}


