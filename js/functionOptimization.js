
variableCount = 2;
restrictionCount = variablesCount;
poblationCount = 10;
individualCount = 10;
bitsCount = 2;

objectiveFunction = (x, y) => return x + y;

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
	var data = Math.floor(Math.log(diff * 10 ** bitsCount) + 1);
	bitsRequired.push(data);
}


