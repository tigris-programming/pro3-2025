export default class Grass {
    constructor() {
        this.color = "green";
        this.stepCount = globalStep + 1;
        this.energy = 0;
        this.row;
        this.col;
    }

    step() {
        this.energy++;
        if (this.energy >= 6) {
            this.multiply();
        }
    }

    multiply() {
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