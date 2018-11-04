
function execEvents() {
    var funcTxt = document.getElementById("objective-func-txt");

    funcTxt.addEventListener("input", function() {
        console.log(funcTxt.value);
    });


}
