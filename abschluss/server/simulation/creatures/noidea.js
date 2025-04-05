export default class NoIdea{
    constructor(){
        this.color = "#4287f5";
        this.stepCount = globalStep + 1;
        this.energy = 1
        this.row;
        this.col;
    }

    eat() {
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
}