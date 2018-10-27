
function generateVectors(bits) {
    vectors = []
    sum = bits.reduce((a, b) => a + b, 0); // obtain the sum of the bits required
    for (var i = 0; i < sum; ++i) {
        randValue = ((1 << sum) - 1) * Math.random();
        vectors.push(Math.floor(randValue)); // we add an INTEGER random number
    }
    return vectors;
}

function createRestrictions(amountVariables) {
    restrictions = new Matrix(variableCount, 2);

    // restrictions for the first variable
    restrictions.setElement(0, 0, 0);
    restrictions.setElement(0, 1, 0.5);

    // restrictions for the second variable
    restrictions.setElement(1, 0, 0);
    restrictions.setElement(1, 1, 1);

    return restrictions;
}

// Problem inicialization
variableCount = 2;
restrictionCount = variableCount;
poblationCount = 10;
individualCount = 10;
bitsCount = 1;

restrictions = createRestrictions(variableCount);

objectiveFunction = (x, y) => x + y;

bitsRequired = [ ];
for (var i = 0; i < variableCount; ++i) {
	var diff = restrictions.getElement(i, 1) - restrictions.getElement(i, 0);
	var data = Math.floor(Math.log2(diff * 10 ** bitsCount) + 1);
	bitsRequired.push(data);
}

vectors = generateVectors(bitsRequired);
console.log(bitsRequired);
console.log(vectors);
console.log(2 ** 7 - 1);

function accumulateSums(numberArray) {
    accumulate = [];
    sum = 0;
    numberArray.forEach( function (e) {
        sum += e;
        accumulate.push(sum);
    });
    return accumulate;
}

/**
 *        4       12         8
 * v =  1010 101010010110 1110000 
 * x = (v >> (12 + 8)) & (2 ** 4 - 1)
 * y = (v >> 8) & (2 ** 12 - 1)
 * z = (v >> 0) & (2 ** 8 - 1)
 * 
 * sums = [8, 20, 24]
 */
function obtainValidVariables(vectors, bitsRequired, nIndividuals, nVariables, 
        restrictions) {
    validVariables = new Matrix(nIndividuals, nVariables);
    sums = accumulateSums(bitsRequired.reverse());
    shifts = [] ;
    for (var i = 0; i < nVariables; ++i) {
    }    
    return validVariables;
}

validVariables = obtainValidVariables(vectors, bitsRequired, individualCount, 
    variableCount, restrictions); 



