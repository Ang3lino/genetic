

function generateVectors(bits) {
    vectors = []
    sum = bits.reduce((a, b) => a + b, 0); // obtain the sum of the bits required
    for (var i = 0; i < sum; ++i)
        vectors.push(((1 << sum) - 1) * Math.random());
    return vectors;
}

// Problem inicialization
variableCount = 2;
restrictionCount = variableCount;
poblationCount = 10;
individualCount = 10;
bitsCount = 1;

objectiveFunction = (x, y) => x + y;

restrictions = new Matrix(2, 2);

// restrictions for the first variable
restrictions.setElement(0, 0, 0);
restrictions.setElement(0, 1, 0.5);

// restrictions for the second variable
restrictions.setElement(1, 0, 0);
restrictions.setElement(1, 1, 1);


bitsRequired = [ ];
for (var i = 0; i < variableCount; ++i) {
	var diff = restrictions.getElement(i, 1) - restrictions.getElement(i, 0);
	var data = Math.floor(Math.log2(diff * 10 ** bitsCount) + 1);
	bitsRequired.push(data);
}

vectors = generateVectors(bitsRequired);
console.log(bitsRequired);
console.log(vectors);
console.log(Math.log(2.7182));


