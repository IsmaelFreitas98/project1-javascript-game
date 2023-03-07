//GameMenu-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class GameMenu {
    constructor(levelNumber) {
        //DOM elements to manipulate
        this.playerInfo = document.getElementById("player-info");
        this.gameCanvas = document.getElementById("canvas");
        this.statusInfo = document.getElementById("status");

        //Info on the Level to create in this instance
        this.levelNumber = levelNumber;

        //Game and player information
        this.playerExp;
        this.nextLevel;

        this.start();
    }

    start() {
        //check level number
        if(!this.levelNumber) {
            this.levelNumber = 1
        }
        //Build Main menu
        this.buildMainMenu();        
    }

    buildMainMenu() {

        //Set Game Text
        this.setGameRulesText();

        //Set Controls Text
        this.setControlsText();

        //Create and append Play button
        const playButtonElm = document.createElement("button");
        playButtonElm.innerText = "GO!!"
        playButtonElm.classList += "btn";
        this.gameCanvas.appendChild(playButtonElm);

        //Create and append Setup button
        const shopButtonElm = document.createElement("button");
        shopButtonElm.innerText = "SHOP"
        shopButtonElm.classList += "btn";
        this.gameCanvas.appendChild(shopButtonElm);

        //Organize content in the canvas
        this.gameCanvas.style.display = "flex";
        this.gameCanvas.style.flexDirection = "column";
        this.gameCanvas.style.alignItems = "center";
        this.gameCanvas.style.justifyContent = "center";

        //Add button listeners
        playButtonElm.addEventListener("click", () => {
            this.clearCanvas();
            const newLevel = new Level(this.levelNumber);
        });
        
        shopButtonElm.addEventListener("click", () => {
            this.clearCanvas();
            this.buildSetupMenu();
        });
    }

    buildSetupMenu() {
        //Create and append Return button
        const returnButtonElm = document.createElement("button");
        returnButtonElm.innerText = "RETURN"
        returnButtonElm.classList += "btn";
        this.returnBtn = returnButtonElm;
        this.gameCanvas.appendChild(returnButtonElm);

        //add listener
        this.returnBtn.addEventListener("click", () => {
            this.clearCanvas();
            this.buildMainMenu();
        })

    }

    setGameRulesText() {
        const gameTitleElm = document.getElementById("player-header");
        gameTitleElm.innerText = "GAME";

        const rulesTextContainer = document.getElementById("player-info");
        const rulesText = document.createElement("p");
        rulesText.innerText = ` - You are an Auror (dark wizard catcher) in training!

        - To pass each level, you will have to kill a certain amount of enemies, that increases with the levels!

        - When you kill an enemy, you will earn Exp, that you can use to unlock new spells!

        - Don't be killed!!!`;

        rulesTextContainer.appendChild(rulesText);
    }

    setControlsText() {
        const controlsTitleElm = document.getElementById("status-header");
        controlsTitleElm.innerText = "CONTROLS";

        const controlsTextContainer = document.getElementById("status-info");
        const controlsText = document.createElement("p");
        controlsText.innerText = ` - Use the arrows to move your Auror!

        - Press Space to cast spells!`;

        controlsTextContainer.appendChild(controlsText);
    }

    clearCanvas() {
        this.gameCanvas.innerHTML = "";
        const rulesTextContainer = document.getElementById("player-info");
        rulesTextContainer.innerHTML = "";
        const controlsTextContainer = document.getElementById("status-info");
        controlsTextContainer.innerHTML = "";
    }
}
//LevelBuilder---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class Level {

    constructor(levelNumber) {
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
        this.player = new Player(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 3, 1, 50, 50, [this.collidablesArr, this.solidCollidablesArr], 20, this.spellsArr, this.arrowsPressed);

        //To track time to spawn enemies
        this.spawnTimer = 0;

        //To control game stops
        this.enemyShootingId = [];
        this.frameIntervalId;

        //To control level flow
        this.levelNumber = levelNumber;

        //It is neccessary to store the function applied by the listeners, so we are able to remove them once the level is finished
        this.keyDown = (event) => {
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
        }

        this.keyUp = (event) => {
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
        }

        this.start();
    }

    start() {

        //Add listeners for player input is its the first time the level is being instanced
        this.addListeners();
               
        //initialize level frames cycle
        this.frameUpdate();
        

    }

    addListeners() {
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);

    }

    removeListeners() {
        document.removeEventListener("keydown", this.keyDown);
        document.removeEventListener("keyup", this.keyUp);
    }


    frameUpdate() {

        this.frameIntervalId = setInterval(() => {
            //For player movement
            this.player.move();

            //For spells movement
            this.spellsArr.forEach(spell => {
                spell.move();
            });

            //For enemy spawn
            this.spawnTimer += 16;
            if(this.spawnTimer >= 2000 && this.enemiesArr.length < (2 * this.levelNumber)) {
                this.placeEnemies(1);
                this.spawnTimer = 0;
            }

            //Check vistory/defeat conditions
            this.checkStatus();

        }, 16);

    }

    checkStatus() {
        
        //check for victory
        if(this.player.killCount === 5) {
            this.enemyShootingId.forEach(id => clearInterval(id));
            clearInterval(this.frameIntervalId);
            this.clearCanvas();
            this.buildVictoryScreen();
        } else if(!document.getElementById("player")) {
            this.enemyShootingId.forEach(id => clearInterval(id));
            clearInterval(this.frameIntervalId);
            this.clearCanvas();
            this.buildDefeatScreen();
        }
    }

    placeEnemies(numberOfEnemies) {

        for(let i = 0; i < numberOfEnemies; i++) {

            const posX = Math.random() * 80 + 10;
            const posY = Math.random() * 80 + 10;

            const newEnemy = new Enemy(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 3, 1, posX, posY, [this.collidablesArr, this.solidCollidablesArr, this.enemiesArr], 20, this.spellsArr, this.enemyShootingId, this.player);
        }

    }

    buildDefeatScreen() {
        //Message
        const messageElm = document.createElement("div");
        messageElm.className = "defeat";
        messageElm.innerText = "YOU LOSE!"

        this.gameCanvas.appendChild(messageElm);

        //Create and append Return button
        const returnButtonElm = document.createElement("button");
        returnButtonElm.innerText = "RETURN"
        returnButtonElm.classList += "btn";
        this.gameCanvas.appendChild(returnButtonElm);

        //add listener
        returnButtonElm.addEventListener("click", () => {
            this.clearCanvas();
            const menu = new GameMenu(1);
        })
    }

    buildVictoryScreen() {
        //Message
        const messageElm = document.createElement("div");
        messageElm.className = "victory";
        messageElm.innerText = "YOU PASSED FASE!";

        this.gameCanvas.appendChild(messageElm);

        //Button
        //Create and append Return button
        const continueButtonElm = document.createElement("button");
        continueButtonElm.innerText = "CONTINUE"
        continueButtonElm.classList += "btn";
        this.gameCanvas.appendChild(continueButtonElm);

        //add listener
        continueButtonElm.addEventListener("click", () => {
            this.clearCanvas();
            const menu = new GameMenu(this.levelNumber + 1); 
        })
    }

    clearCanvas() {
        this.removeListeners();
        clearInterval(this.frameIntervalId);
        delete(this.player);
        this.gameCanvas.innerHTML = "";
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

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints, spellArr) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs);

        //Wizards need health points
        this.healthPoints = healthPoints;

        //Properties to create spells
        this.spellsArr = spellArr;
        this.direction = "down";
        this.wandX;
        this.wandY;

        //Properties to check that the wizard can move in all directions
        this.solidCollidablesArr = relatedArrs[1];
        this.solidCollidablesArr.push(this);
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveLeft = true;
        this.canMoveRight = true;

        //Tocheck if it can shoot
        this.canShoot = true;

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
                this.wandX = this.originX + (this.width / 2) * this.direction[0];
                this.wandY = this.originY + (this.height / 2) * this.direction[1];
        }
    }

    shootSpell() {
        if(this.canShoot) {
            const newSpell = new Spell(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 1, 1, (this.wandX / this.canvasOnePercentWidth), (this.wandY / this.canvasOnePercentHeight), [this.collidablesArr, this.spellsArr], 10, this.direction);

            this.setCastCoolDown(newSpell);
        }
    }

    setCastCoolDown(spell) {
        this.canShoot = false;

        setTimeout(() => {
            this.canShoot = true;
        }, spell.coolDown * 1000);
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
              collidable.collider.bottomLimit < this.collider.topLimit + (this.speed * this.verticalSpeed * this.canvasOnePercentHeight + 1) &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                this.canMoveUp = false;
            }
            
            //Check if there is will be a colision if it moves down
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit - (this.speed * this.verticalSpeed * this.canvasOnePercentHeight + 1) &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                this.canMoveDown = false;
            }
            
            //Check if there is will be a colision if it moves right
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit + (this.speed * this.canvasOnePercentWidth + 1) &&
              collidable.collider.rightLimit > this.collider.leftLimit
            ) {
                this.canMoveRight = false;
            }
            
            //Check if there is will be a colision if it moves left
            if (
              collidable.collider.bottomLimit < this.collider.topLimit &&
              collidable.collider.topLimit > this.collider.bottomLimit &&
              collidable.collider.leftLimit < this.collider.rightLimit &&
              collidable.collider.rightLimit > this.collider.leftLimit - (this.speed * this.canvasOnePercentWidth + 1)
            ) {
                this.canMoveLeft = false;
            }

        });
    }
}

class Player extends Wizard {

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints, spellArr, inputArr) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints, spellArr);
        this.healthPoints = 10;
        this.killCount = 0;
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

    removeObject() {
        super.removeObject();
        this.canShoot = false;
    }

    incrementKillCount() {
        this.killCount++;

        console.log(this.killCount);
    }
}

class Enemy extends Wizard {

    constructor(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints, spellArr, shootingArrId, player) {
        super(canvasOnePercentWidth, canvasOnePercentHeight, relativeWidth, widthHeightRatio, positionX, positionY, relatedArrs, healthPoints, spellArr);
        this.setAtributes("class", "enemy");

        //Assign new enemy to the level's enemy array
        this.enemiesArr = relatedArrs[2];
        this.enemiesArr.push(this);

        //to interact with player
        this.player = player;        

        //To make it shoot
        this.originX;
        this.originY;
        this.intervalId;
        this.updateDirection();
        this.startShooting();
        shootingArrId.push(this.intervalId);

        
    }

    startShooting() {
        this.intervalId = setInterval(() => {
            this.updateDirection();
            this.updateWandPosition();
            this.shootSpell();
        }, 2000);
     }

    updateDirection() {
        const directionVector = [];
        const newDirectionVector = [];
        const target = this.getTarget();
        const origin = [this.positionXPix + (this.width / 2), this.positionYPix + (this.height / 2)];
        this.originX = origin[0];
        this.originY = origin[1];

        directionVector[0] = target[0] - origin[0];
        directionVector[1] = target[1] - origin[1];

        newDirectionVector[0] = directionVector[0] / (Math.abs(directionVector[0]) + Math.abs(directionVector[1]));
        newDirectionVector[1] = directionVector[1] / (Math.abs(directionVector[0]) + Math.abs(directionVector[1]));

        this.direction = newDirectionVector;

        this.updateWandPosition();
    }

    getTarget() {
        const target = [];
        target[0] = this.player.positionXPix + (this.player.width / 2);
        target[1] = this.player.positionYPix + (this.player.height / 2);
        return target;
    }

    removeObject() {
        super.removeObject();
        this.player.incrementKillCount();
        clearInterval(this.intervalId);
        this.canShoot = false;
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
        this.coolDown = 0;
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
                this.positionX = (this.positionXPix + (this.direction[0] * 3 * this.width)) / this.canvasOnePercentWidth;
                this.positionY = (this.positionYPix + (this.direction[1] * 3 * this.height)) / this.canvasOnePercentHeight;

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
                this.positionX += this.direction[0] * this.speed;
                this.positionY += this.direction[1] * this.speed * this.verticalSpeed;
        }

        if(this.positionY < 0 || this.positionY > 100){
            this.removeObject(this.collidablesArr, this.spellsArr);
        }
        if(this.positionX < 0 || this.positionX > 100){
            this.removeObject(this.collidablesArr, this.spellsArr);
        }
    }

    manageCollision(otherObject) {
       
        if (otherObject.collider.tag !== "spell") {
            otherObject.takeDamage(this.damage);        
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

//const myLevel = new Level();
const myGame = new GameMenu(0);