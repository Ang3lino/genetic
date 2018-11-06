

function accumulateSums(numberArray) {
    let accumulate = [];
    let sum = 0;
    numberArray.forEach( function (e) {
        sum += e;
        accumulate.push(sum);
    });
    return accumulate;
}

function computeBitsRequired(variableCount, limits, bitsCount) {
    let bitsRequired = [ ];
    for (let i = 0; i < variableCount; ++i) {
        const b = limits.getElement(i, 1);
        const a = limits.getElement(i, 0);
        let diff = b - a;
        if (isClose(a, b)) ++diff; // patch ?
        let data = Math.floor(Math.log2(diff * 10 ** bitsCount) + 1);
        bitsRequired.push(data);
    }
    return bitsRequired;
}

const eps = 1;

/**
 * deprecated
 * @param {} variable 
 * @param {*} index 
 * @param {*} limits 
 */
/*
function isValidVariable (variable, index, limits) {
    const x = limits.getElement(index, 0) - eps <= variable;
    const y = variable <= limits.getElement(index, 1) + eps; 
    return x && y;
}
*/

function computeVariable(x, i, limits, bitsRequired) {
    let a = limits.getElement(i, 0);
    let b = limits.getElement(i, 1);
    return a + x * ((b - a) / ((1 << bitsRequired[i]) - 1));
}

function isClose(a, b) {
    return Math.abs(a - b) <= eps;
}


/**
 * Complexity O(n ** 3)
 * @param {amount of individuals} nIndividuals 
 * @param {array of the bits needed for every single variable} bitsRequired 
 * @param {A Matrix of limits} limits 
 */
// isValid ( tuple, restrictions )
function generateValidVectors(nIndividuals, bitsRequired, limits, restrictions) {
    let nVariables = bitsRequired.length;
    let vectors = new Matrix(nIndividuals, nVariables);
    let randomVar;
    for (let i = 0; i < vectors.rows; ++i) {
        let binTuple, realTuple;
        do {
            binTuple = [];
            for (let j = 0; j < vectors.columns; ++j) {
                randomVar = ((1 << bitsRequired[j]) - 1) * Math.random(); 
                binTuple.push(randomVar);
            }
            realTuple = [];
            for (let j = 0; j < binTuple.length; ++j) {
                realTuple.push(computeVariable(binTuple[j], j, limits, bitsRequired));
            }
        } while (!isValidVariable(realTuple, restrictions));
        for (let j = 0; j < binTuple.length; ++j) {
            vectors.setElement(i, j, Math.floor(binTuple[j]));
        }
    }
    return vectors;
}

/*
function generateValidVectors(nIndividuals, bitsRequired, limits, restrictions) {
    let nVariables = bitsRequired.length;
    let vectors = new Matrix(nIndividuals, nVariables);
    let randomVar;
    for (let i = 0; i < vectors.rows; ++i) {
        for (let j = 0; j < vectors.columns; ++j) {
            do {
		        //debugger;
                randomVar = ((1 << bitsRequired[j]) - 1) * Math.random(); 
                restrictedValue = computeVariable(randomVar, j, limits, bitsRequired);
                console.log("lol");
            } while (!isValidVariable(restrictedValue, j, limits)); 
            vectors.setElement(i, j, Math.floor(randomVar));
        }
    }
    return vectors;
}
*/




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



function printPairs(x, y) {
    for (let i = 0; i < x.length; ++i) 
        console.log(i, x[i], y[i]);
}

function getMaxTuple(tuples, yvecs) {
    const n = tuples.length;
    let maxTuple = new Array(n);
    let max = -Infinity;
    //debugger;
    for (let i = 0; i < n; ++i) {
        if (yvecs[i] > max) {
            max = yvecs[i];
            maxTuple = tuples[i];
        }
    }
    printPairs(tuples, yvecs);
    return maxTuple;
}

function evalObjectiveFunction(strFunction, variables) {
    let strVars = 'abcdefhijklmnopqrstuvwxyz';
    let buff = strFunction;
    for (let i = 0; i < variables.length; ++i) {
        let x = strVars.charAt(i);
        let y = variables[i];
        buff = buff.replace(x, y);
    }
    console.log(buff);
    return eval(buff);
}

function arrayIndexesStrongestVectors(vectors, strFunction, limits, bitsRequired) {
    let variables = new Array(vectors.columns); // create an array of v.columns
    let evaluated = []; // it'll be printed

    let tuples = new Array(vectors.rows); // for printing

    let j = 0;
    vectors.matrix.forEach(function(vecs) {
        let i = 0;
        vecs.forEach( v => variables[i] = computeVariable(v, i++, limits, bitsRequired) );
        //debugger;
        let y = evalObjectiveFunction(strFunction, variables);
        tuples[j++] = variables.slice();
        evaluated.push(y);
        //debugger;
    });

    let totalSum = evaluated.reduce((x, y) => x + y, 0), divided = evaluated.map(e => e / totalSum);
	let accumulated = accumulateSums(divided), randoms = new Array(vectors.rows).fill(1).map(e => Math.random());
    let indexes = new Set(); // It's a set given that we don't need repeated indexes
    printPairs(tuples, evaluated);

    randoms.forEach(rand => indexes.add(lowestUpperBound(accumulated, rand)));
    //debugger;
    return [getMaxTuple(tuples, evaluated), Array.from(indexes).sort(function(a, b) { return a - b })];
}

function binTupleAsReal(binTuple, bitsRequired, limits) {
    realTuple = [];
    for (let j = 0; j < binTuple.length; ++j) {
        realTuple.push(computeVariable(binTuple[j], j, limits, bitsRequired));
    }
    return realTuple;
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

function popWeakVectors(vectors, bitsRequired, indexes, restrictions, limits) {
    const nweaks = vectors.rows - indexes.length;
    let tries = 0;
    for (let i = 0; i < nweaks; ++i) {
        if (!binarySearch(indexes, i)) { // the index corresponds to a weak vector
            do {
                const coin = Math.random();
                if (coin < 0.5) vectors.matrix[i] = mutate(vectors.matrix[i], bitsRequired);
                else {
                    const strongIndexLim = Math.floor(Math.random() * indexes.length);
                    vectors.matrix[i] = cross(vectors.matrix[indexes[strongIndexLim]], vectors.matrix[i], bitsRequired);
                }
                const realTuple = binTupleAsReal(vectors.matrix[i], bitsRequired, limits);
                console.log(++tries); 
            } while (!isValidVariable(realTuple, restrictions));
            console.log("done !");
        }
    }
}

// main function
function optimize(variableCount, poblationCount, individualCount, bitsCount,  objectiveFunction, 
                  limits, restrictions) {

    let restrictionCount = variableCount;
    
    //debugger;
    let bitsRequired = computeBitsRequired(variableCount, limits, bitsCount);
    let vectors = generateValidVectors(individualCount, bitsRequired, limits,  restrictions);
    let maxTuples = new Set(); // stores the value of the highest value evaluated per poblation
    let indexes = [];

    for (let i = 0; i < poblationCount; ++i) {
        let pair = arrayIndexesStrongestVectors(vectors, objectiveFunction, limits, bitsRequired);
        maxTuples.add(pair[0]);
        indexes = pair[1];
        popWeakVectors(vectors, bitsRequired, indexes, restrictions, limits); 
    }

    
    let txtAreaResult = document.getElementById("txtarea-result");
    txtAreaResult.value = getResultAsString(maxTuples, objectiveFunction);
}

function getResultAsString(maxTuples, strFunction) {
    let result = "";
    let i = 1;
    let maxOn = document.getElementById("switch-max");
    maxTuples.forEach( tuple => {
        result += "Poblacion numero " + i.toString();
        result += ": ( ";
        tuple.forEach(value => {
            result += value + ", ";
        });
        result += " ) => ";
        if (maxOn.checked) result += " Z = " + evalObjectiveFunction(strFunction, tuple) + " \n ";
        else result += " Z = " + -evalObjectiveFunction(strFunction, tuple) + " \n ";
        ++i;
    })
    return result; 
}

//main();
//let arr = new Array(10).fill(1).map(e => Math.floor(10 * Math.random())).sort();
//arr.forEach(e => document.write(binarySearch(arr, e) + "<br/>"));