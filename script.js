console.clear();
console.error("ATTENTION: GAME STARTED!");
console.warn("ATTENTION: GAME STARTED!");
console.log("ATTENTION: GAME STARTED!");


// ------------
// | classes: |
// ------------
class Empty { }

class LivingCreature {
    constructor(color, energy){
        this.stepcount = frameCount + 1;  // stepcount
        this.color = color;               // color
        this.energy = energy;             // energy
        this.row;
        this.col;
    }
}

/*
class Grass {
    constructor(){
        this.color = "green";
        this.stepCount = frameCount + 1;
        this.energy = 0;
        this.row;
        this.col;
    }

    step(){
        this.energy++;
        if (this.energy >= 6) {
            this.multiply();
        }
    }

    multiply(){
        let elems = findNeighbours(this.row, this.col, 1, Empty)
        if (elems.length > 0) {
            let free = random(elems);
            let row = free[0];
            let col = free[1];
            matrix[row][col] = new Grass();
            this.energy = 0;
        }
    }
}
*/


class Grass extends LivingCreature{
    constructor(){
        super("green", 0);
    }

    step(){
        console.log(this.energy)
        this.energy++;
        if (this.energy >= 6) {
            this.multiply();
        }
    }

    multiply(){
        let elems = findNeighbours(this.row, this.col, 1, Empty)
        if (elems.length > 0) {
            let free = random(elems);
            let row = free[0];
            let col = free[1];
            matrix[row][col] = new Grass();
            this.energy = 0;
        }
    }
}


class Grazer {
    constructor(){
        this.color = "yellow";
        this.stepCount = frameCount + 1;
        this.energy = 5;
        this.row;
        this.col;
    }

    eat(){
        let food = findNeighbours(this.row, this.col, 1, Grass)
        if (food.length > 0) {
            let grassField = random(food);
            updatePosition(this, grassField);
            this.energy++;
        } else {
            let others = findNeighbours(this.row, this.col, 1, Empty)
            if (others.length > 0) {
                let emptyField = random(others);
                updatePosition(this, emptyField);
            }
            this.energy--;
        }
    }


    // multiply:
    mul(){
        let spawnElems = findNeighbours(this.row, this.col, 1, Empty)
        if (spawnElems.length > 0) {
            let spawnField = random(spawnElems);
            matrix[spawnField[0]][spawnField[1]] = new Grazer();
            this.energy -= 5;
        };

        if (random(0,100) > 95){
            matrix[this.row][this.col] = new NoIdea();
        }
    }

    step(){
        this.eat()
        if (this.energy >= 10) {
            this.mul();
        } else if (this.energy <= 0) {
            matrix[this.row][this.col] = new Empty();
        }
    }
};



class Tyrant {
    constructor(){
        this.color = "red";
        this.stepCount = frameCount + 1;
        this.energy = 50;
        this.row;
        this.col;
    }

    eat(){
        let food = findNeighbours(this.row, this.col, 1, Grazer)
        if (food.length > 0) {
            let grazerField = random(food);
            updatePosition(this, grazerField);
            this.energy += 10;
        } else {
            this.energy--;
        }
    }

    // mulitply:
    mul(){
        let spawnElems = findNeighbours(this.row, this.col, 1, Empty)
        if (spawnElems.length > 0) {
            let emptyField = random(spawnElems);
            matrix[emptyField[0]][emptyField[1]] = new Tyrant();
            this.energy -= 50;
        }
    }

    step(){
        this.eat()
        if (this.energy >= 100) {
            this.mul();
        } else if (this.energy <= 0) {
            matrix[this.row][this.col] = new Empty();
        }
    }
};

class NoIdea{
    constructor(){
        this.color = "#4287f5";
        this.stepCount = frameCount + 1;
        this.energy = 1
        this.row;
        this.col;
    }

    eat(){
        let i = 0;
        let food = findNeighbours(this.row, this.col, 3, Grass);
        if (food.length >= 13) {
            let grassFields = food;
            for (i in food){
                matrix[grassFields[i][0]][grassFields[i][1]] = new Empty();
            }
            this.energy =0;
        }
    };

    sameType(){
        let sameNeighbours = findNeighbours(this.row, this.col, 1, NoIdea);
        if (sameNeighbours.length >=1){
            for (i in sameNeighbours){
                matrix[sameNeighbours[i][0]][sameNeighbours[i][1]] = new Grass();
            }
        }
    }
    step(){
        this.sameType;
        this.eat();
        if (this.energy < 1){
            matrix[this.row][this.col] = new Grazer();
        }
    }
};


// ----------------------------------------------------------
// other code:
let matrix = [];
let previousMatrix = [];
let size = 50;
let blockSize = 16;
let frameCount = 0;

// randomly fill the matrix with creatures
let creatureTypes = [Grazer, Tyrant, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Grass, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, NoIdea]
function fillMatrix() {
    for (let row = 0; row < size; row++) {
        matrix.push([])
        for (let col = 0; col < size; col++) {
            let cls = random(creatureTypes);
            matrix[row][col] = new cls();
        }
    }
}

// update the position of an object in the matrix and set the old position to Empty
function updatePosition(obj, newPos, oldPosCreate = Empty) {
    let [newRow, newCol] = newPos;
    matrix[newRow][newCol] = obj;
    matrix[obj.row][obj.col] = new oldPosCreate();
    obj.row = newRow;
    obj.col = newCol;
}

// draw the creature on the canvas
function drawCreature(row, col, obj) {
    if (obj instanceof Empty) return;
    fill(obj.color)
    rect(blockSize * col, blockSize * row, blockSize, blockSize);
}


// DO NOT TOUCH IT!!!! (it is working!)
// find all neighbours of a certain creature type in a certain radius
function findNeighbours(row, col, n, cls, usePrevious = false) {             // "cls" = class
    let mat = usePrevious ? previousMatrix : matrix;
    let fields = []
    for (let nCol = col - n; nCol <= col + n; nCol++) {
        for (let nRow = row - n; nRow <= row + n; nRow++) {
            if (nCol >= 0 && nCol < size && nRow >= 0 && nRow < size && (mat[nRow][nCol] instanceof cls)) {
                fields.push([nRow, nCol])
            }
        }
    }
    return fields
}

function setup() {
    createCanvas(size * blockSize, size * blockSize);
    fillMatrix();
    noStroke();
    frameRate(5);
}

function draw() {
    background(200)
    // copy the matrix to a previous matrix
    // this is only necessary if you want to use the previous state in the current step
    // E.g. if you want to recreate the original Conway's Game of Life
    previousMatrix = matrix.map(row => { return { ...row } });
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let obj = matrix[row][col];
            drawCreature(row, col, obj);

            // this prevents newly created objects from being updated in the same step
            // you can also create objects that get "activated" only after a certain number of steps after creation
            if (obj.stepCount === frameCount) {
                obj.row = row;
                obj.col = col;
                obj.step();
                obj.stepCount++;
            }
        }
    }
}