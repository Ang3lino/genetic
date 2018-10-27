
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

/**
 * 
 * @param {amount of individuals} nIndividuals 
 * @param {array of the bits needed for every single variable} bitsRequired 
 * @param {A Matrix of restrictions} restrictions 
 */
function generateValidVectors(nIndividuals, bitsRequired, restrictions) {
    let nVariables = bitsRequired.length;
    let vectors = new Matrix(nIndividuals, nVariables);
    for (let i = 0; i < vectors.rows; ++i) {
        for (let j = 0; j < vectors.columns; ++j) {
            let variable = restrictions.getElement(j, 1) + 1; // it is not valid at first
            while (!isValidVariable(variable, j, restrictions)) {
                variable = ((1 << bitsRequired[j]) - 1) * Math.random(); 
            }
            vectors.setElement(i, j, variable);
        }
    }
    return vectors;
}

// Problem inicialization
let variableCount = 2;
let restrictionCount = variableCount;
let poblationCount = 10;
let individualCount = 10;
let bitsCount = 1;

let restrictions = createRestrictions(variableCount);
restrictions.writeInDocument();

objectiveFunction = (x, y) => x + y;
bitsRequired = computeBitsRequired(variableCount, restrictions);

vectors = generateValidVectors(individualCount, bitsRequired, restrictions);
vectors.writeInDocument();