
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
    var funcTxt = document.getElementById("objective-func-txt");

    funcTxt.addEventListener("input", function() {
        console.log(funcTxt.value);
        console.log(inferNumberVariables(funcTxt.value, buildAlphabet()));
    });

}
