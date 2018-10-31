
function lowBoundTest() {
    let randoms = [0, 3, 5, 7, 9, 11, 13];
    let values  = [2, 4, 7, 8, 12, 13, 15];
    test = [];
    values.forEach(e => { test.push(lowestUpperBound(randoms, 0, randoms.length - 1, e))});
    debugger;
    document.write(test);
}

function mutateTest() {
    vec = [6, 15];
    bitsRequired = [4, 4];
    debugger;
    mutVec = mutate(vec, bitsRequired);
}

function crossTest() {
    vec1 = [14, 6];
    vec2 = [1, 5];
    bitsRequired = [4, 4];
    debugger;
    cross(vec1, vec2, bitsRequired);
    
}