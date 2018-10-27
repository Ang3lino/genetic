
class Matrix {
    
    constructor(nFiles, nColumns) {
        this.m = nFiles; 
        this.n = nColumns;
        this.matrix = Array(nFiles).fill().map(() => Array(nColumns).fill());
    }

    get rows() { return this.m; }

    get columns() { return this.n; }

    getElement(i, j) {
        //document.write(i.toString() + " " + j.toString() + " <br />");
        if (i < this.m && j < this.n) 
            return this.matrix[i][j];
        throw "invalid position.";
    }

    setElement(i, j, data) {
        if (i < this.m && j < this.n) 
            this.matrix[i][j] = data;
        else 
            throw "invalid position";
    }

    showInConsole() {
        for (var i = 0; i < this.m; ++i) {
            for (var j = 0; j < this.n; ++j) {
                console.log(this.matrix[i][j]);
            }
            console.log("\n");
        }
    }

    writeInDocument() {
        document.write("<pre>")
        for (var i = 0; i < this.m; ++i) {
            for (var j = 0; j < this.n; ++j) {
                document.write(this.matrix[i][j] + "    ");
            }
            //document.write("<br />");
            document.writeln("");
        }
        document.write("<pre/>")
    }

}
