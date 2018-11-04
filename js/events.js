
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

    funcTxt.addEventListener("onchange", function(e) {
        let nvar = inferNumberVariables(funcTxt.value, alphabet);

        className = restrictionsTable.className;
        if (className.includes("hide")) className = className.replace("hide", "");
        else className += "hide";
        restrictionsTable.className = className;
        console.log(className);
    });


}

function eventStrFun() {
    let funcTxt = document.getElementById("objective-func-txt");
    let restrictionsTable = document.getElementById("restrictions-table");
    let alphabet = "abcdefghijklmnopqrstuvwxyz";

    let nvar = inferNumberVariables(funcTxt.value, alphabet);

    className = restrictionsTable.className;
    if (className.includes("hide")) className = className.replace("hide", "");
    else className += "hide";
    restrictionsTable.className = className;
    console.log(className);

}
