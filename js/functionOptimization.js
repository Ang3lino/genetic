
function accumulateSums(numberArray) {
    let accumulate = [];
    let sum = 0;
    numberArray.forEach( function (e) {
        sum += e;
        accumulate.push(sum);
    });
    return accumulate;
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
            vectors.setElement(i, j, Math.floor(randomVar));
        }
    }
    return vectors;
}

// TODO
function evalObjectiveFunction(strFunction, variables) {
    let strVars = 'abcdefhijklmnopqrstuvwxyz';
    for (let i = 0; i < variables.length; ++i) {
        let x = strVars.charAt(i);
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
function lowestUpperBound(arr, data) {
    let helper = (arr, l, r, data) => {
        if (r > l) {
            for (let i = l; i < arr.length; ++i) 
                if (arr[i] >= data) return i;
            return arr.length - 1;
        }
        let mid = Math.floor((r - l) / 2);
        if (arr[mid] == data) return mid; 
        if (arr[mid] < data) return helper(arr, mid + 1, r, data);
        return helper(arr, l, mid - 1, data);
    }
    return helper(arr, 0, arr.length - 1, data);
}

function binarySearch(arr, findable) { 
    let helper = (arr, l, r, findable) => {
        if (l > r) return false;
        let mid = Math.floor((r - l) / 2) + l;
        if (arr[mid] == findable) return true;
        if (findable < arr[mid]) return helper(arr, l, mid - 1, findable);
        return helper(arr, mid + 1, r, findable);
    }

    return helper(arr, 0, arr.length - 1, findable);
}

/**
 * 0110 1111 = 0101 1111 xor 0010 0000
 * @param {a vector made of variables x0, x1, ..., x_{n-1}} vector 
 * @param {Array which containts the amount of bits used for each variable} bitsRequired 
 */
function mutate(vector, bitsRequired) {
    // decide randomly the bit to mutate
	let selVar = Math.floor(bitsRequired.length * Math.random());
    let indexVar = 	Math.floor(bitsRequired[selVar] * Math.random());

	let newVec = vector.slice(); // copy a vector
	newVec[selVar] = newVec[selVar] ^ (1 << indexVar); // negate the bit using a xor 
	return newVec;
}

/**
 * Example
 * cross the first 3 bits
 * 1110 1010 strong vector
 * 0001 0101 weak vector
 * 1110      mask
 * 1111 0101 result
 * @param {Array} strongVec 
 * @param {Array} weakVec 
 * @param {Array} bitsRequired 
 */
function cross(strongVec, weakVec, bitsRequired) {
	let selVar = Math.floor(bitsRequired.length * Math.random());
	let n =	Math.floor(bitsRequired[selVar] * Math.random());
    let newVec = weakVec.slice(); // copy a vector
    let mask = (1 << n) - 1;
    newVec[selVar] = (strongVec[selVar] & (~mask)) | (weakVec[selVar] & (mask));
    return newVec;
}

function popWeakVectors(vectors, bitsRequired, indexes) {
    let eps = 1e-8;
    for (let i = 0; i < vectors.rows - indexes.length; ++i) {
        if (!binarySearch(indexes, i)) { // the index corresponds to a weak vector
            vectors.matrix[i] = mutate(vectors.matrix[i], bitsRequired);
        }
    }
}

function arrayIndexesStrongestVectors(vectors, strFunction, restrictions, bitsRequired) {
    let variables = new Array(vectors.columns); // create an array of v.columns
    let evaluated = [];
    let maxTupleApplied = new Array(vectors.columns);
    let max = -Infinity;

    vectors.matrix.forEach(function(vecs) {
        let i = 0;
        vecs.forEach( v => variables[i] = computeVariable(v, i++, restrictions, bitsRequired) );
        let y = evalObjectiveFunction(strFunction, variables);
        evaluated.push(y);
        if (y > max) {
            max = y;
            maxTupleApplied = variables; 
        }
    });

    let totalSum = evaluated.reduce((x, y) => x + y, 0), divided = evaluated.map(e => e / totalSum);
	let accumulated = accumulateSums(divided), randoms = new Array(vectors.rows).fill(1).map(e => Math.random());
    let indexes = new Set(); // It's a set given that we don't need repeated indexes

    randoms.forEach(rand => indexes.add(lowestUpperBound(accumulated, rand)));
    //debugger;
    return [maxTupleApplied, Array.from(indexes).sort()];
}


function optimize(variableCount, poblationCount, individualCount, bitsCount,  objectiveFunction, 
                  restrictions) {

    let restrictionCount = variableCount;
    
    let bitsRequired = computeBitsRequired(variableCount, restrictions, bitsCount);
    let vectors = generateValidVectors(individualCount, bitsRequired, restrictions);
    let maxTuples = new Set(); // stores the value of the highest value evaluated per poblation
    let indexes = [];

    for (let i = 0; i < poblationCount; ++i) {
        let pair = arrayIndexesStrongestVectors(vectors, objectiveFunction, restrictions, bitsRequired);
        maxTuples.add(pair[0]);
        indexes = pair[1];
        popWeakVectors(vectors, bitsRequired, indexes); 
    }

    
    let txtAreaResult = document.getElementById("txtarea-result");
    txtAreaResult.value = getResultAsString(maxTuples, objectiveFunction);
}

function getResultAsString(maxTuples, strFunction) {
    let result = "";
    maxTuples.forEach( tuple => {
        result += "( ";
        tuple.forEach(value => {
            result += value + ", ";
        });
        result += " ) => ";
        result += evalObjectiveFunction(strFunction, tuple) + " \n ";
    })
    return result; 
}

//main();
//let arr = new Array(10).fill(1).map(e => Math.floor(10 * Math.random())).sort();
//arr.forEach(e => document.write(binarySearch(arr, e) + "<br/>"));

// Angel