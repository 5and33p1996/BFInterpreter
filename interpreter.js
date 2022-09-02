class BFResult{

    constructor(result, error){

        this.result = result;
        this.error = error;
    }
}

class BFInterpreter {

    constructor(cellSize, numCells){

        this.cellSize = cellSize;
        this.numCells = numCells;
        this.maxValue = 0;
        this.minValue = 0;

        this.cells = new Array(this.numCells);

        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = 0;
        }

        if(this.cellSize == 8){
            this.maxValue = 127;
            this.minValue = -128;
        }

        else if(this.cellSize == 16){
            this.maxValue = 32767
            this.minValue = -32768
        }

        else if(this.cellSize == 32){
            this.maxValue = 2147483647;
            this.minValue = -2147483648;
        }
    }

    wrappedIncrement(value){

        if(value == this.maxValue){
            value = this.minValue;
        }
        else{
            value++;
        }

        return value;
    }

    wrappedDecrement(value){

        if(value == this.minValue){
            value = this.maxValue;
        }
        else{
            value--;
        }

        return value;
    }

    run(code, inputs) {

        let codePointer = 0, inputPointer = 0, cellPointer = 0, numOpenLoops = 0;
        let skipToCloseLoop = false;
        let result = "";
        let loopStack = [];

        while (codePointer < code.length) {

            if (code[codePointer] == '+' && !skipToCloseLoop) {

                this.cells[cellPointer] = this.wrappedIncrement(this.cells[cellPointer]);
            }

            else if (code[codePointer] == '-' && !skipToCloseLoop) {

                this.cells[cellPointer] = this.wrappedDecrement(this.cells[cellPointer]);
            }

            else if (code[codePointer] == '>' && !skipToCloseLoop) {

                cellPointer = (cellPointer + 1) % (this.numCells);
            }

            else if (code[codePointer] == '<' && !skipToCloseLoop) {

                if (cellPointer == 0) {

                    cellPointer = this.numCells - 1;
                }

                cellPointer--;
            }

            else if (code[codePointer] == "." && !skipToCloseLoop) {

                result = result + String.fromCharCode(this.cells[cellPointer]);
            }

            else if (code[codePointer] == "," && !skipToCloseLoop) {

                if (inputPointer != inputs.length) {

                    this.cells[cellPointer] = inputs[inputPointer].charCodeAt();
                    inputPointer++;
                }
            }

            else if (code[codePointer] == '[') {

                codePointer++;

                if (skipToCloseLoop) {

                    numOpenLoops++;
                    continue;
                }

                if (this.cells[cellPointer] == 0) {

                    skipToCloseLoop = true;
                    continue;
                }

                loopStack.push(codePointer);
                continue;
            }

            else if(code[codePointer] == ']'){

                if(skipToCloseLoop){

                    if(numOpenLoops != 0){

                        numOpenLoops--;
                        codePointer++;
                    }
                    else{
                        codePointer++;
                        skipToCloseLoop = false;
                    }
                    continue;
                }

                if(loopStack.length == 0){
                    return new BFResult(null, "No start of loop found " + codePointer);
                }

                if(this.cells[cellPointer] != 0){

                    codePointer = loopStack[loopStack.length - 1];
                    continue;
                }

                loopStack.pop();
            }

            codePointer++;
        }

        if(loopStack.length != 0 || skipToCloseLoop){

            return new BFResult(null, "No close of loop found at position " + codePointer);
        }

        return new BFResult(result, null);
    }
}