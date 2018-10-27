
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
    var restrictions = new Matrix(variableCount, 2);

    // restrictions for the first variable
    restrictions.setElement(0, 0, 0);
    restrictions.setElement(0, 1, 0.5);

    // restrictions for the second variable
    restrictions.setElement(1, 0, 0);
    restrictions.setElement(1, 1, 1);

    return restrictions;
}

function computeBitsRequired(variableCount, restrictions) {
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

// Problem inicialization
let variableCount = 2;
let restrictionCount = variableCount;
let poblationCount = 900000;
let individualCount = 3000;
let bitsCount = 1;

let restrictions = createRestrictions(variableCount);
restrictions.writeInDocument();

objectiveFunction = (x, y) => x + y;
bitsRequired = computeBitsRequired(variableCount, restrictions);

vectors = generateValidVectors(individualCount, bitsRequired, restrictions);
vectors.writeInDocument();