
function accumulateSums(numberArray) {
    let accumulate = [];
    let sum = 0;
    numberArray.forEach( function (e) {
        sum += e;
        accumulate.push(sum);
    });
    return accumulate;
}


function createRestrictions(amountVariables) {
    var restrictions = new Matrix(amountVariables, 2);

    // restrictions for the first variable
    restrictions.setElement(0, 0, 0);
    restrictions.setElement(0, 1, 0.5);

    // restrictions for the second variable
    restrictions.setElement(1, 0, 0);
    restrictions.setElement(1, 1, 1);

    return restrictions;
}

function computeBitsRequired(variableCount, restrictions, bitsCount) {
    let bitsRequired = [ ];
    for (let i = 0; i < variableCount; ++i) {
        let diff = restrictions.getElement(i, 1) - restrictions.getElement(i, 0);
        let data = Math.floor(Math.log2(diff * 10 ** bitsCount) + 1);
        bitsRequired.push(data);
    }
    return bitsRequired;
}

function isValidVariable (variable, index, restrictions) {
    return restrictions.getElement(index, 0) <= variable 
        && variable <= restrictions.getElement(index, 1);
}

function computeVariable(x, i, restrictions, bitsRequired) {
    let a = restrictions.getElement(i, 0);
    let b = restrictions.getElement(i, 1);
    return a + x * ((b - a) / ((1 << bitsRequired[i]) - 1));
}

/**
 * Complexity O(n ** 3)
 * @param {amount of individuals} nIndividuals 
 * @param {array of the bits needed for every single variable} bitsRequired 
 * @param {A Matrix of restrictions} restrictions 
 */
function generateValidVectors(nIndividuals, bitsRequired, restrictions) {
    let nVariables = bitsRequired.length;
    let vectors = new Matrix(nIndividuals, nVariables);
    let randomVar;
    for (let i = 0; i < vectors.rows; ++i) {
        for (let j = 0; j < vectors.columns; ++j) {
            do {
                randomVar = ((1 << bitsRequired[j]) - 1) * Math.random(); 
                restrictedValue = computeVariable(randomVar, j, restrictions, bitsRequired);
            } while (!isValidVariable(restrictedValue, j, restrictions)); 
            console.log(restrictedValue);
            vectors.setElement(i, j, Math.floor(randomVar));
        }
    }
    return vectors;
}

function evalObjectiveFunction(strFunction, variables) {
    let char = 'abcdefhijklmnopqrstuvwxyz';
    for (let i = 0; i < variables.length; ++i) {
        let x = char.charAt(i);
        let y = variables[i];
        strFunction = strFunction.replace(x, y);
    }
    //console.log(strFunction);
    return eval(strFunction);
}

/**
 * Finds the lowest upper bound of a sorted array, it is a kind of binary search.
 * Complexity: Theta(lg n)
 * @param {A sorted array} arr 
 * @param {index for the low limit} l 
 * @param {index for the high limit} r 
 * @param {findable data} data 
 */
function lowestUpperBound(arr, l, r, data) {
    if (r > l) {
        for (let i = l; i < arr.length; ++i) 
            if (arr[i] >= data) return i;
        return arr.length - 1;
    }
	let mid = Math.floor((r - l) / 2);
	if (arr[mid] == data) return mid; 
    if (arr[mid] < data) return lowestUpperBound(arr, mid + 1, r, data);
    return lowestUpperBound(arr, l, mid - 1, data);
}

function process(vectors, strFunction, restrictions, bitsRequired) {
    let variables = new Array(vectors.columns);
    let evaluated = [];

    vectors.matrix.forEach(function(vecs) {
        let i = 0;
        vecs.forEach(v => variables[i] = computeVariable(v, i++, restrictions, bitsRequired) );
        evaluated.push(evalObjectiveFunction(strFunction, variables));
    });

    let totalSum = evaluated.reduce((x, y) => x + y, 0);
    let divided = evaluated.map(e => e / totalSum);
	let accumulated = accumulateSums(divided);
	let randoms = new Array(vectors.rows).fill(1).map(e => Math.random());
    let indexes = new Set(); // It's a set given that we don't need repeated indexes

    debugger;
    randoms.forEach(rand => indexes.add(lowestUpperBound(accumulated, 0, accumulated.length - 1, rand)));
}

function main() {
    // Problem inicialization
    let variableCount = 2;
    let restrictionCount = variableCount;
    let poblationCount = 5;
    let individualCount = 10;
    let bitsCount = 1;

    let restrictions = createRestrictions(variableCount);
    //restrictions.writeInDocument();

    let objectiveFunction = 'a + b';
    let bitsRequired = computeBitsRequired(variableCount, restrictions, bitsCount);

    vectors = generateValidVectors(individualCount, bitsRequired, restrictions);

    process(vectors, objectiveFunction, restrictions, bitsRequired);
}

main();
