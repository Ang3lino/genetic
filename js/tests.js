
function lowBound() {
    let randoms = [0, 3, 5, 7, 9, 11, 13];
    let values  = [2, 4, 7, 8, 12, 13, 15];
    test = [];
    values.forEach(e => { test.push(lowestUpperBound(randoms, 0, randoms.length - 1, e))});
    debugger;
    document.write(test);
}

