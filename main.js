//GameManager-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Levels------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class Level {
    constructor() {
        //to make scaling and moving elements possible
        this.gameCanvas = document.getElementById("canvas");
        this.canvasWidth = this.gameCanvas.clientWidth;
        this.canvasHeight = this.gameCanvas.clientHeight;
        this.canvasOnePercentWidth = this.canvasWidth / 100;
        this.canvasOnePercentHeight = this.canvasHeight / 100;

        //to keep track of the active objects in the game;
        this.spellsArr = [];
        this.enemiesArr = [];
        this.collidablesArr = [];
        this.solidCollidablesArr = [];

        //to keep track of player input
        this.arrowsPressed = [];
        this.player = new Player(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 3, 1, 50, 50, [this.collidablesArr, this.spellsArr, this.solidCollidablesArr], 20, this.arrowsPressed);

        this.start();
        this.placeEnemies(4);
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
                this.player.shootSpell();
                console.log("Expeliarmus!");
            }
        });

        setInterval(() => {
            this.player.move();

            this.spellsArr.forEach(spell => {
                spell.move();
            });

        }, 16);

    }

    placeEnemies(numberOfEnemies) {

        for(let i = 0; i < numberOfEnemies; i++) {

            const posX = Math.random() * 80 + 10;
            const posY = Math.random() * 80 + 10;

            const newEnemy = new Enemy(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 3, 1, posX, posY, [this.collidablesArr, this.spellsArr, this.solidCollidablesArr], 20);
            this.enemiesArr.push(newEnemy);
            this.collidablesArr.push(newEnemy);
        }

    }
}

//Game Objects------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Inheritance Map:
//                             --> Player
//               --> Wizards -->
//                             --> Enemy
// GameObject -->
//
//               --> Spell
//
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class GameObject {
    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs) {
        //Store canvas dimension to access in methods
        this.canvasOnePercentWidth = canvasOnePercentWidth;
        this.canvasOnePercentHeight = canvasOnePercentHeight;
        
        //Object dimension in relative units
        this.width = relativeWidth;
        this.height;
        this.proportion = widthHeightRatio; //width/height ratio

        //Position in percentage of canvas
        this.positionX = positionX;
        this.positionY = positionY;

        //Position in absolute units, calculated using canvas one percent unit in pixels
        this.positionXPix;
        this.positionYPix;

        //Speed properties
        this.speed;
        this.verticalSpeed = canvasOnePercentWidth / canvasOnePercentHeight;

        //DOM Elements
        this.objectElm;

        //Since all objects will be collidables, they need to access the level's array of collidable to add e«and remove themselves, and a collider
        this.relatedArrs = relatedArrs;
        this.collidablesArr = relatedArrs[0];
        this.collider;

        //Object builder method
        this.buildObject();

        //Each object should call the setAttributes() Method here, to set specific attributes
    }

    buildObject() {
        //Create and append object to the DOM
        const gameCanvas = document.getElementById("canvas");
        const objectElm = document.createElement("div");
        gameCanvas.appendChild(objectElm);

        this.objectElm = objectElm;

        //Calculate dimentions
        this.width = Math.floor(this.width * this.canvasOnePercentWidth);
        this.height = Math.floor(this.proportion * this.width);

        //Set Element's dimensions
        this.objectElm.style.width = this.width + "px";
        this.objectElm.style.height = this.height + "px";

        //Position the new object in the canvas
        this.setPosition();

        //Set object's collider and add to the level's array of collidable objects
        this.collider = new Collider("object", [(this.positionYPix + this.height), this.positionYPix, this.positionXPix, (this.positionXPix + this.width)]);
        this.collidablesArr.push(this);
        
    }

    move() {
        //Change objects relative position in the code
        this.changePosition();

        //Update object's position in the DOM
        this.setPosition();

        //Update collider's position
        this.updateColliderPosition();

    }

    changePosition() {
    }

    setPosition() {
        //Calculet X and Y coordinates in absolute units
        this.positionXPix = Math.floor(this.positionX * this.canvasOnePercentWidth) - this.width / 2;
        this.positionYPix = Math.floor(this.positionY * this.canvasOnePercentHeight) - this.height / 2;

        //Position the DOM Element in the calculated position
        this.objectElm.style.bottom = this.positionYPix + "px";
        this.objectElm.style.left = this.positionXPix + "px";

    }
    
    updateColliderPosition() {
        //Store the limits of the object
        const newLimits = [(this.positionYPix + this.height), this.positionYPix, this.positionXPix, (this.positionXPix + this.width)];

        //Set the new limits on the object's collider
        this.collider.setLimits(newLimits);

        //check for collisions
        this.detectCollisions();
    }

    detectCollisions() {

        this.collidablesArr.forEach(collidable => {

            //Skip cycle if checking itself
            if(collidable === this) {
                return;
            }

            //Check if there is a collision with any of the level's collidables
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                //Collison detected, manage according to the tags involved
                this.manageCollision(collidable);
            }

        });

    }

    manageCollision(otherObject) {
        //Each object has a specific behaviour to implement
    }

    removeObject() {
        //Remove the object from the arrays it belongs to
        for(let i = 0; i < this.relatedArrs.length; i++) {
            const objectPos = this.relatedArrs[i].indexOf(this);
            this.relatedArrs[i].splice(objectPos, 1);
        }

        //Remove from the DOM
        this.objectElm.remove();

        //Remove Collider from the levels
        this.collider.removeCollider();
    }

    setAtributes(type, name) {
        this.collider.setTag(name);
        this.objectElm.setAttribute(type, name);
    }
}
//--------------------------------------------------------

class Wizard extends GameObject {

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs);

        //Wizards need health points
        this.healthPoints = healthPoints;

        //Properties to create spells
        this.spellsArr = relatedArrs[1];
        this.direction = "down";
        this.wandX;
        this.wandY;

        //Properties to check that the wizard can move in all directions
        this.solidCollidablesArr = relatedArrs[2];
        this.solidCollidablesArr.push(this);
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveLeft = true;
        this.canMoveRight = true;

        this.setAtributes("class", "wizard");
    }

    takeDamage(damage) {
        this.healthPoints -= damage;

        if(this.healthPoints <= 0) {
            this.removeObject(this.collidablesArr);
        }
    }

    updateDirection() {
        //Player and enemies have diferent ways of defining direction
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

    shootSpell() {
        const newSpell = new Spell(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 1, 1, (this.wandX / this.canvasOnePercentWidth), (this.wandY / this.canvasOnePercentHeight), [this.collidablesArr, this.spellsArr], 10, this.direction);
    }

    checkAvailableMoves() {

        //All moves are considered available before checking
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveLeft = true;
        this.canMoveRight = true;

        this.solidCollidablesArr.forEach(collidable => {

            //Skip cycle if checking itself
            if(collidable === this) {
                return;
            }

            //Check if there is will be a colision if it moves up
            if (
              collidable.collider.bottomLimit < this.collider.topLimit + (this.speed * this.verticalSpeed * this.canvasOnePercentHeight) &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                this.canMoveUp = false;
            }
            
            //Check if there is will be a colision if it moves down
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit - (this.speed * this.verticalSpeed * this.canvasOnePercentHeight) &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                this.canMoveDown = false;
            }
            
            //Check if there is will be a colision if it moves right
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit + (this.speed * this.canvasOnePercentWidth) &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                this.canMoveRight = false;
            }
            
            //Check if there is will be a colision if it moves left
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit - (this.speed * this.canvasOnePercentWidth)
            ) {
                this.canMoveLeft = false;
            }

        });
    }
}

class Player extends Wizard {

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints, inputArr) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints);
        this.inputArr = inputArr;
        this.speed = 0.5;
        this.setAtributes("id", "player");
    }

    changePosition() {

        this.checkAvailableMoves();

        if((this.positionYPix + this.height) < (100 * this.canvasOnePercentHeight - 10) && this.canMoveUp){ //check if it is not at the top limit

            if(this.inputArr.includes("ArrowUp") && this.inputArr.length === 1){
                this.positionY += this.speed * this.verticalSpeed;
            } else if(this.inputArr.includes("ArrowUp")){
                this.positionY += 0.7 * this.speed * this.verticalSpeed;
            }
        }

        if(this.positionYPix > 10 && this.canMoveDown){ //check if it's not at the bottom limit

            if(this.inputArr.includes("ArrowDown")  && this.inputArr.length === 1){
                this.positionY -= this.speed * this.verticalSpeed;
            } else if(this.inputArr.includes("ArrowDown")){
                this.positionY -= 0.7 * this.speed * this.verticalSpeed;
            }
        }

        if((this.positionXPix + this.width) < (100 * this.canvasOnePercentWidth - 10) && this.canMoveRight){ //check if it's not at the right limit of the canvas

            if(this.inputArr.includes("ArrowRight")  && this.inputArr.length === 1){
                this.positionX += this.speed;
            } else if(this.inputArr.includes("ArrowRight")){
                this.positionX += 0.7 * this.speed;
            }
        }

        if(this.positionXPix > 10 && this.canMoveLeft){ // check if it's not at the left limit

            if(this.inputArr.includes("ArrowLeft")  && this.inputArr.length === 1){
                this.positionX -= this.speed;
            } else if(this.inputArr.includes("ArrowLeft")){
                this.positionX -= 0.7 * this.speed;
            }
        }

        this.updateDirection();
    }

    updateDirection() {

        //Update direction for vertical and horizontal axis input
        if(this.inputArr.includes("ArrowUp") && this.inputArr.length === 1) {
            this.direction = "up";
        } else if(this.inputArr.includes("ArrowDown") && this.inputArr.length === 1) {
            this.direction = "down";
        } else if(this.inputArr.includes("ArrowLeft") && this.inputArr.length === 1) {
            this.direction = "left";
        } else if(this.inputArr.includes("ArrowRight") && this.inputArr.length === 1) {
            this.direction = "right";
        }

        //Update direction for diagonal axis input
        if(this.inputArr.includes("ArrowUp") && this.inputArr.includes("ArrowLeft") && this.inputArr.length === 2) {
            this.direction = "upLeft";
        } else if(this.inputArr.includes("ArrowUp") && this.inputArr.includes("ArrowRight") && this.inputArr.length === 2) {
            this.direction = "upRight";
        } else if(this.inputArr.includes("ArrowDown") && this.inputArr.includes("ArrowLeft") && this.inputArr.length === 2) {
            this.direction = "downLeft";
        } else if(this.inputArr.includes("ArrowDown") && this.inputArr.includes("ArrowRight") && this.inputArr.length === 2) {
            this.direction = "downRight";
        }

        this.updateWandPosition();
    }
}

class Enemy extends Wizard {

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints);
        this.setAtributes("class", "enemy");
    }
}

//--------------------------------------------------------
class Spell extends GameObject {

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, damage, direction) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs);

        //It is necessary to corect the spawn positon of the spell according to it's size, so it doenst affect the object that shoots it
        this.direction = direction;
        this.correctSpellPosition();

        //Spell properties
        this.damage = damage;
        this.spellsArr = relatedArrs[1];
        this.speed = 1;
        this.setAtributes("class", "spell");
        this.spellsArr.push(this);
    }

    correctSpellPosition() {
        switch(this.direction) {

            case "up":
                this.positionY = (this.positionYPix + 3 * this.height) / this.canvasOnePercentHeight;
                break;

            case "down":
                this.positionY = (this.positionYPix - 2 * this.height) / this.canvasOnePercentHeight;
                break;

            case "left":
                this.positionX = (this.positionXPix - 2 * this.width) / this.canvasOnePercentWidth;
                break;

            case "right":
                this.positionX = (this.positionXPix + 3 * this.width) / this.canvasOnePercentWidth;
                break;

            case "upLeft":
                this.positionX = (this.positionXPix - 0.7 * (2 * this.width)) / this.canvasOnePercentWidth;
                this.positionY = (this.positionYPix + 0.7 * (3 * this.height)) / this.canvasOnePercentHeight;
                break;

            case "downLeft":
                this.positionX = (this.positionXPix - 0.7 * (2 * this.width)) / this.canvasOnePercentWidth;
                this.positionY = (this.positionYPix - 0.7 * (2 * this.height)) / this.canvasOnePercentHeight;
                break;

            case "upRight":
                this.positionX = (this.positionXPix + 0.7 * (3 * this.width)) / this.canvasOnePercentWidth;
                this.positionY = (this.positionYPix + 0.7 * (3 * this.height)) / this.canvasOnePercentHeight;
                break;

            case "downRight":
                this.positionX = (this.positionXPix + 0.7 * (3 * this.width)) / this.canvasOnePercentWidth;
                this.positionY = (this.positionYPix - 0.7 * (2 * this.height)) / this.canvasOnePercentHeight;
                break;

            default:
                console.log("Invalid Direction");

        }

        this.setPosition();
    }

    changePosition() {

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

        if(this.positionY < 0 || this.positionY > 100){
            this.removeObject(this.collidablesArr, this.spellsArr);
        }
        if(this.positionX < 0 || this.positionX > 100){
            this.removeObject(this.collidablesArr, this.spellsArr);
        }
    }

    manageCollision(otherObject) {
       
        if (otherObject.collider.tag !== "obstacle" && otherObject.collider.tag !== "spell") {
            otherObject.takeDamage(this.damage);
            console.log(otherObject.healthPoints);          
        } else if(otherObject.collider.tag === "spell") {
            otherObject.removeObject();
        }

        this.removeObject();
    }

}

//Utility Classes----------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Collider {
    constructor(tag, limits) {
        this.tag = tag;
        this.topLimit = limits[0];
        this.bottomLimit = limits[1];
        this.leftLimit = limits[2];
        this.rightLimit = limits[3];
    }

    setTag(newTag) {
        this.tag = newTag;
    }

    setLimits(limits) {
        this.topLimit = limits[0];
        this.bottomLimit = limits[1];
        this.leftLimit = limits[2];
        this.rightLimit = limits[3];
    }

    removeCollider() {
        this.tag = null;
        this.topLimit = null;
        this.bottomLimit = null;
        this.leftLimit = null;
        this.rightLimit = null;
    }
}

/***********************************************************************************************************************************************************************************/

const myLevel = new Level();