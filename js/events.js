
function buildAlphabet() {
    let alphabet = "";
    let a = 'a'.charCodeAt(0), b = 'z'.charCodeAt(0);
    for (let i = a; i <= b; ++i) {
        alphabet += String.fromCharCode(i);
    }
    return alphabet;
}

function inferNumberVariables(strFun, alphabet) {
    let count = 0;
    let unique = new Set(strFun);
    for (let char of unique) if (alphabet.includes(char)) ++count;
    return count;
}

/**
 * main function which should execute everthing from this document.
 */
function execEvents() {
    let funcTxt = document.getElementById("objective-func-txt");
    let restrictionsTable = document.getElementById("restrictions-table");
    let alphabet = "abcdefghijklmnopqrstuvwxyz";

    // Do not write the preffix "on" at the first parameter
    funcTxt.addEventListener("change", function(e) { 
        let nvar = inferNumberVariables(funcTxt.value, alphabet);

        blinkRestrictions(restrictionsTable);
        console.log(restrictionsTable);
        createHTMLRestrictions(alphabet, nvar, restrictionsTable);
    });

}

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
    console.log(mainBody);
    mainBody.innerHTML = newStr;
    console.log(mainBody);
}

function blinkRestrictions(restrictionsTable) {
    className = restrictionsTable.className;
    if (className.includes("hide")) className = className.replace("hide", "");
    else className += "hide";
    restrictionsTable.className = className;
    console.log(className);
}
