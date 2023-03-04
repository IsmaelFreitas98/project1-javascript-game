class Game {
    constructor() {
        this.gameCanvas = document.getElementById("canvas");
        this.canvasWidth = this.gameCanvas.clientWidth;
        this.canvasHeight = this.gameCanvas.clientHeight;
        this.canvasOnePercentWidth = this.canvasWidth / 100;
        this.canvasOnePercentHeight = this.canvasHeight / 100;
        this.arrowsPressed = [];
        this.player = new Player(this.arrowsPressed, this.canvasOnePercentWidth, this.canvasOnePercentHeight);
        this.spellsArr = [];

        this.start();
    }

    start() {

        document.addEventListener("keydown", (event) => {
            //Check if one of the arrows was pressed. If it is not in the array that contains the pressed arrows, add it.
            if(event.key === "ArrowUp" && !this.arrowsPressed.includes("ArrowUp")) {
                this.arrowsPressed.push(event.key);
            } else if(event.key === "ArrowDown" && !this.arrowsPressed.includes("ArrowDown")) {
                this.arrowsPressed.push(event.key);
            } else if(event.key === "ArrowLeft" && !this.arrowsPressed.includes("ArrowLeft")) {
                this.arrowsPressed.push(event.key);
            } else if(event.key === "ArrowRight" && !this.arrowsPressed.includes("ArrowRight")) {
                this.arrowsPressed.push(event.key);
            }
            
            
        });

        document.addEventListener("keyup", (event) => {
            //Check when the arrows are released, to remove the from the array that contains pressed arrows
            if(event.key === "ArrowUp") {
                this.arrowsPressed.splice(this.arrowsPressed.indexOf("ArrowUp"), 1);
            } else if(event.key === "ArrowDown") {
                this.arrowsPressed.splice(this.arrowsPressed.indexOf("ArrowDown"), 1);
            } else if(event.key === "ArrowLeft") {
                this.arrowsPressed.splice(this.arrowsPressed.indexOf("ArrowLeft"), 1);
            } else if(event.key === "ArrowRight") {
                this.arrowsPressed.splice(this.arrowsPressed.indexOf("ArrowRight"), 1);
            }
        
            //Check if spacebar was pressed to shoot spell (on keyup to avoid being called more than 1 time per press)
            if(event.code === "Space") {
                this.player.shootSpell(this.spellsArr, this.canvasOnePercentWidth, this.canvasOnePercentHeight);
                console.log("Expeliarmus!");
            }
        });

        setInterval(() => {
            this.player.move(this.arrowsPressed, this.canvasOnePercentWidth, this.canvasOnePercentHeight);
        
            this.spellsArr.forEach(spell => {
                spell.move(this.spellsArr, this.canvasOnePercentWidth, this.canvasOnePercentHeight);
            });
        
        }, 16);

    }
}


class Player {

    constructor(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight) {
        this.width = 3;
        this.height;

        //Position in percentage of canvas
        this.positionX = 50;
        this.positionY = 50;
        //Position in absolute units, calculated using canvas size
        this.positionXPix;
        this.positionYPix;

        this.playerElm;

        //properties to determine the speed of movement. Vertical speed is set in proportion to the canvas ratio, so the player moves in the diagonal axis correctly, no matter the screen ratio
        this.verticalSpeed = canvasOnePercentWidth / canvasOnePercentHeight;
        this.speed = 1;
        

        //properties to keep track of wheere the spells will shoot from, and in wich direction
        this.wandX;
        this.wandY;
        this.direction;

        this.buildPlayer(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight);
    }

    buildPlayer(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight) {
        const gameCanvas = document.getElementById("canvas");
        const playerElm = document.createElement("div");
        playerElm.setAttribute("id", "player");
        gameCanvas.appendChild(playerElm);

        this.playerElm = playerElm;

        this.width = Math.floor(this.width * canvasOnePercentWidth);
        this.height = 1.2 * this.width;

        this.playerElm.style.width = this.width + "px";
        this.playerElm.style.height = this.height + "px";

        this.direction = "down";
        this.updatePosition(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight);
    }

    move(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight) {

        if(arrowsPressed.includes("ArrowUp") && arrowsPressed.length === 1){
            this.positionY += this.speed * this.verticalSpeed;
        } else if(arrowsPressed.includes("ArrowUp")){
            this.positionY += 0.7 * this.speed * this.verticalSpeed; //so it doesnt move faster when moving in a diagonal 
        }

        if(arrowsPressed.includes("ArrowDown")  && arrowsPressed.length === 1){
            this.positionY -= this.speed * this.verticalSpeed;
        } else if(arrowsPressed.includes("ArrowDown")){
            this.positionY -= 0.7 * this.speed * this.verticalSpeed; //so it doesnt move faster when moving in a diagonal 
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

        this.updatePosition(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight);
        
    }

    updatePosition(arrowsPressed, canvasOnePercentWidth, canvasOnePercentHeight) {

        this.positionXPix = Math.floor(this.positionX * canvasOnePercentWidth) - this.width / 2;
        this.positionYPix = Math.floor(this.positionY * canvasOnePercentHeight) - this.height / 2;

        this.playerElm.style.bottom = this.positionYPix + "px";
        this.playerElm.style.left = this.positionXPix + "px";

        this.updateDirection(arrowsPressed);
    }

    updateDirection(arrowsPressed) {
        //Update direction for vertical and horizontal axis input
        if(arrowsPressed.includes("ArrowUp") && arrowsPressed.length === 1) {
            this.direction = "up";
        } else if(arrowsPressed.includes("ArrowDown") && arrowsPressed.length === 1) {
            this.direction = "down";
        } else if(arrowsPressed.includes("ArrowLeft") && arrowsPressed.length === 1) {
            this.direction = "left";
        } else if(arrowsPressed.includes("ArrowRight") && arrowsPressed.length === 1) {
            this.direction = "right";
        }

        //Update direction for diagonal axis input
        if(arrowsPressed.includes("ArrowUp") && arrowsPressed.includes("ArrowLeft") && arrowsPressed.length === 2) {
            this.direction = "upLeft";
        } else if(arrowsPressed.includes("ArrowUp") && arrowsPressed.includes("ArrowRight") && arrowsPressed.length === 2) {
            this.direction = "upRight";
        } else if(arrowsPressed.includes("ArrowDown") && arrowsPressed.includes("ArrowLeft") && arrowsPressed.length === 2) {
            this.direction = "downLeft";
        } else if(arrowsPressed.includes("ArrowDown") && arrowsPressed.includes("ArrowRight") && arrowsPressed.length === 2) {
            this.direction = "downRight";
        }

        //Update the position from where spells are shot
        this.updateWandPosition();
    }

    updateWandPosition() {
        switch (this.direction) {
            case "up":
                this.wandX = this.positionXPix + (this.width/2);
                this.wandY = this.positionYPix + this.height;
                break;
            
            case "down":
                this.wandX = this.positionXPix + (this.width/2);
                this.wandY = this.positionYPix;
                break;

            case "left":
                this.wandX = this.positionXPix;
                this.wandY = this.positionYPix + (this.height/2);
                break;
            
            case "right":
                this.wandX = this.positionXPix + this.width;
                this.wandY = this.positionYPix + (this.height/2);
                break;

            case "upLeft":
                this.wandX = this.positionXPix;
                this.wandY = this.positionYPix + this.height;
                break;
            
            case "downLeft":
                this.wandX = this.positionXPix;
                this.wandY = this.positionYPix;
                break;

            case "upRight":
                this.wandX = this.positionXPix + this.width;
                this.wandY = this.positionYPix + this.height;
                break;
            
            case "downRight":
                this.wandX = this.positionXPix + this.width;
                this.wandY = this.positionYPix;
                break;
            
            default:
                console.log("Invalid Direction");
        }
    }

    shootSpell(spellsArr, canvasOnePercentWidth, canvasOnePercentHeight) {
        const newSpell = new Spell(this.wandX, this.wandY, this.direction, spellsArr, canvasOnePercentWidth, canvasOnePercentHeight);
    }


}

class Spell {
    constructor(positionXPix, positionYPix, direction, spellsArr, canvasOnePercentWidth, canvasOnePercentHeight) {

        this.spellElm;
        this.positionXPix = positionXPix;
        this.positionYPix = positionYPix;
        this.positionX = positionXPix / canvasOnePercentWidth;
        this.positionY = positionYPix / canvasOnePercentHeight;

        this.direction = direction;
        this.speed = 2;
        this.verticalSpeed = canvasOnePercentWidth / canvasOnePercentHeight;

        this.buildSpell(spellsArr);
    }

    buildSpell(spellsArr) {
        const gameCanvas = document.getElementById("canvas");
        const spellElm = document.createElement("div");
        spellElm.className = "spell";
        gameCanvas.appendChild(spellElm);

        spellElm.style.width = "3px";
        spellElm.style.height = "3px";
        spellElm.style.bottom = this.positionYPix + "px";
        spellElm.style.left = this.positionXPix + "px";

        this.spellElm = spellElm;

        spellsArr.push(this);
    }

    move(spellsArr, canvasOnePercentWidth, canvasOnePercentHeight) {

        switch (this.direction) {
            case "up":
                this.positionY += this.speed * this.verticalSpeed;
                break;
            
            case "down":
                this.positionY -= this.speed * this.verticalSpeed;
                break;

            case "left":
                this.positionX -= this.speed;
                break;
            
            case "right":
                this.positionX += this.speed;
                break;

            case "upLeft":
                this.positionX -= 0.7 * this.speed;
                this.positionY += 0.7 * this.speed * this.verticalSpeed;
                break;
            
            case "downLeft":
                this.positionX -= 0.7 * this.speed;
                this.positionY -= 0.7 * this.speed * this.verticalSpeed;
                break;

            case "upRight":
                this.positionX += 0.7 * this.speed;
                this.positionY += 0.7 * this.speed * this.verticalSpeed;
                break;
            
            case "downRight":
                this.positionX += 0.7 * this.speed;
                this.positionY -= 0.7 * this.speed * this.verticalSpeed;
                break;
            
            default:
                console.log("Invalid Direction");
        }

        this.updatePosition(spellsArr, canvasOnePercentWidth, canvasOnePercentHeight);
    }

    updatePosition(spellsArr, canvasOnePercentWidth, canvasOnePercentHeight) {
        this.positionXPix = Math.floor(this.positionX * canvasOnePercentWidth);
        this.positionYPix = Math.floor(this.positionY * canvasOnePercentHeight);


        this.spellElm.style.bottom = this.positionYPix + "px";
        this.spellElm.style.left = this.positionXPix + "px";

        if(this.positionY < 0 || this.positionY > 100){
            this.removeSpell(spellsArr);
        }
        if(this.positionX < 0 || this.positionX > 100){
            this.removeSpell(spellsArr);
        }
    }

    removeSpell(spellsArr) {
        //remove spell from the spells array
        const spellPos = spellsArr.indexOf(this);
        spellsArr.splice(spellPos, 1);

        //remove spell from the DOM
        this.spellElm.remove();

        //remove from memory
        delete(this);

    } 
}



const myGame = new Game();