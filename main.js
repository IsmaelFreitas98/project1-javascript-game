class Player {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = 50 - this.height/2;
        this.positionY = 50 - this.width/2;
        this.playerElm;
        this.speed = 0.5;
        this.direction;

        this.buildPlayer();
    }

    buildPlayer() {
        const gameCanvas = document.getElementById("canvas");
        const playerElm = document.createElement("div");
        playerElm.setAttribute("id", "player");
        gameCanvas.appendChild(playerElm);

        this.playerElm = playerElm;

        this.playerElm.style.width = this.width + "vw";
        this.playerElm.style.height = this.height + "vh";

        this.updatePosition();
    }

    move() {
        if(arrowsPressed.includes("ArrowUp") && arrowsPressed.length === 1){
            this.positionY += this.speed;
        } else if(arrowsPressed.includes("ArrowUp")){
            this.positionY += 0.7 * this.speed; //so it doesnt move faster when moving in a diagonal 
        }

        if(arrowsPressed.includes("ArrowDown")  && arrowsPressed.length === 1){
            this.positionY -= this.speed;
        } else if(arrowsPressed.includes("ArrowDown")){
            this.positionY -= 0.7 * this.speed; //so it doesnt move faster when moving in a diagonal 
        }

        if(arrowsPressed.includes("ArrowRight")  && arrowsPressed.length === 1){
            this.positionX += this.speed;
        } else if(arrowsPressed.includes("ArrowRight")){
            this.positionX += 0.7 * this.speed; //so it doesnt move faster when moving in a diagonal 
        }

        if(arrowsPressed.includes("ArrowLeft")  && arrowsPressed.length === 1){
            this.positionX -= this.speed;
        } else if(arrowsPressed.includes("ArrowLeft")){
            this.positionX -= 0.7 * this.speed; //so it doesnt move faster when moving in a diagonal 
        }

        this.updatePosition();
        
    }

    updatePosition() {
        this.playerElm.style.bottom = this.positionY + "vh";
        this.playerElm.style.left = this.positionX + "vw";
    }
}

const arrowsPressed = [];

const myPlayer = new Player();

document.addEventListener("keydown", (event) => {
    //Check if one of the arrows was pressed. If it is not in the array that contains the pressed arrows, add it.
    if(event.key === "ArrowUp" && !arrowsPressed.includes("ArrowUp")) {
        arrowsPressed.push(event.key);
    } else if(event.key === "ArrowDown" && !arrowsPressed.includes("ArrowDown")) {
        arrowsPressed.push(event.key);
    } else if(event.key === "ArrowLeft" && !arrowsPressed.includes("ArrowLeft")) {
        arrowsPressed.push(event.key);
    } else if(event.key === "ArrowRight" && !arrowsPressed.includes("ArrowRight")) {
        arrowsPressed.push(event.key);
    }

    console.log(arrowsPressed);
    
});

document.addEventListener("keyup", (event) => {
    //Check when the arrows are released, to remove the from the array that contains pressed arrows
    if(event.key === "ArrowUp") {
        arrowsPressed.splice(arrowsPressed.indexOf("ArrowUp"), 1);
    } else if(event.key === "ArrowDown") {
        arrowsPressed.splice(arrowsPressed.indexOf("ArrowDown"), 1);
    } else if(event.key === "ArrowLeft") {
        arrowsPressed.splice(arrowsPressed.indexOf("ArrowLeft"), 1);
    } else if(event.key === "ArrowRight") {
        arrowsPressed.splice(arrowsPressed.indexOf("ArrowRight"), 1);
    }

    console.log(arrowsPressed);
});

setInterval(() => {
    myPlayer.move();
}, 16);