//GameMenu-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class GameMenu {
    constructor(levelNumber, playerExp, lockedSpells, unlockedSpells, spellsInUse) {
        //DOM elements to manipulate
        this.playerInfo = document.getElementById("player-info");
        this.gameCanvas = document.getElementById("canvas");
        this.statusInfo = document.getElementById("status");

        //Info on the Level to create in this instance
        this.levelNumber = levelNumber;

        //Game and player information
        this.playerExp = playerExp;
        
        //Spells
        this.basic = {name: "basic", power: 20, cooldown: 0.7, image: "./images/basic.png"};
        this.stupefy = {name: "stupefy", power: 25, cooldown: 1.3, cost: 100, image: "./images/stupefy.png"};
        this.expelliarmus = {name: "expelliarmus", power: 35, cooldown: 2, cost: 500, image: "./images/expelliarmus.png"};
        this.reducto = {name: "reducto", power: 50, cooldown: 3, cost: 800, image: "./images/reducto.png"};
        this.avada = {name: "avada", power: 100, cooldown: 5, cost: 3000, image: "./images/avada.png"};

        //Locked, Unlocked, and spells in use
        this.lockedSpells = lockedSpells;
        this.unlockedSpells = unlockedSpells;
        this.spellsInUse = spellsInUse;


        this.start();
    }

    start() {
        //check arguments
        this.levelNumber = this.levelNumber ? this.levelNumber : 1;
        this.playerExp = this.playerExp ? this.playerExp : 0;
        this.unlockedSpells = this.unlockedSpells ? this.unlockedSpells : [this.basic];
        this.lockedSpells = this.lockedSpells ? this.lockedSpells : [this.stupefy, this.expelliarmus, this.reducto, this.avada];
        this.spellsInUse = this.spellsInUse ? this.spellsInUse : [this.basic];



        //Build Main menu
        this.buildMainMenu();        
    }

    buildMainMenu() {

        if(this.levelNumber === 1){
            //Set Game Text
            this.setGameRulesText();

            //Set Controls Text
            this.setControlsText();

        } else {
            this.setPlayerInfo();
            this.setNextLevelInfo();
        }

        //Create and append Play button
        const playButtonElm = document.createElement("button");
        if(this.levelNumber === 1){
            playButtonElm.innerText = "GO!!"
        } else {
            playButtonElm.innerText = `Level ${this.levelNumber}`
        }
        
        playButtonElm.classList += "btn";
        this.gameCanvas.appendChild(playButtonElm);

        if(this.levelNumber > 1) {
             //Create and append Shop button
            const shopButtonElm = document.createElement("button");
            shopButtonElm.innerText = "Diagon Alley"
            shopButtonElm.classList += "btn";
            this.gameCanvas.appendChild(shopButtonElm);

            //Add Shop button Listener
            shopButtonElm.addEventListener("click", () => {
                this.clearCanvas();
                this.buildShopMenu();
            });
             
            //Create and append Spells button
            const spellsButtonElm = document.createElement("button");
            spellsButtonElm.innerText = "Spells"
            spellsButtonElm.classList += "btn";
            this.gameCanvas.appendChild(spellsButtonElm);

            //Add Spells button listener
            spellsButtonElm.addEventListener("click", () => {
                this.clearCanvas();
                this.buildSpellsMenu();
            });
        }

        //Organize content in the canvas
        this.gameCanvas.style.display = "flex";
        this.gameCanvas.style.flexDirection = "column";
        this.gameCanvas.style.alignItems = "center";
        this.gameCanvas.style.justifyContent = "center";

        //Add button listeners
        playButtonElm.addEventListener("click", () => {
            this.clearCanvas();
            const newLevel = new Level(this.levelNumber, this.playerExp, this.lockedSpells, this.unlockedSpells, this.spellsInUse);
        });
        
    }

    buildShopMenu() {

        //Update status and player info containers
        const playerExp = document.getElementById("player-info");
        const exp = document.createElement("p");
        exp.innerText = `EXP: ${this.playerExp}`;
        playerExp.appendChild(exp);

        const titleContainer = document.getElementById("status-header");
        titleContainer.innerText = "Diagon Alley"

        const textContainer = document.getElementById("status-info");
        const text = document.createElement("p");
        text.innerText = `Welcome to the Spells Shop!
        
        - Here you can unlock spells using your earned Exp!
        
        - Click on the spells to get its details in this panel!`;
        textContainer.appendChild(text);

        //create spells container
        const spellDisplayer = document.createElement("div");

        //set its dimensions and display
        spellDisplayer.style.width = "100%";
        spellDisplayer.style.height = "80%";
        spellDisplayer.style.display = "flex";
        spellDisplayer.style.alignItems = "center";
        spellDisplayer.style.justifyContent = "center";
        this.gameCanvas.appendChild(spellDisplayer);

        //get and display the spells
        if(this.lockedSpells.length === 0){
            const text = document.createElement("span");
            text.innerText = "You already got all available spells!";
            spellDisplayer.appendChild(text);
        } else {

            const spells = [];

            this.lockedSpells.forEach((spell) => {                

                const spellElm = document.createElement("div");
                spellElm.style.backgroundImage = `url(${spell.image})`;
                spellElm.style.backgroundSize = "cover";
                spellElm.style.width = "15%";
                spellElm.style.aspectRatio = "1 / 1";
                spellElm.style.margin = "2vw";
                spellElm.style.borderRadius = "50%";
                spellElm.style.boxShadow = "0 0 2vw rgb(176, 167, 0)";

                spellDisplayer.appendChild(spellElm);
                spells.push(spellElm);

                spellElm.addEventListener("click", () => {
                    //set all shadows
                    spells.forEach(spell => {
                        spell.style.boxShadow = "0 0 2vw rgb(176, 167, 0)";
                    });

                    spellElm.style.boxShadow = "0 0 2vw rgb(207, 0, 0)";
                    this.clearStatus();

                    titleContainer.innerText = spell.name.toUpperCase();

                    const text = document.createElement("p");
                    text.innerText = `COST: ${spell.cost}Exp
                    
                    POWER: ${spell.power}HP
                    
                    COOLDOWN: ${spell.cooldown}s`;

                    textContainer.appendChild(text);

                    const buyBtn = document.createElement("button");
                    buyBtn.setAttribute("id", "buy-btn");
                    buyBtn.innerText = "Learn!";
                    textContainer.appendChild(buyBtn);

                    buyBtn.addEventListener("click", () => {
                        this.learnSpell(spell);
                    });

                });

            });
        }

        //Create and append Return button
        const returnButtonElm = document.createElement("button");
        returnButtonElm.innerText = "Finish Shopping!"
        returnButtonElm.classList += "btn";
        this.returnBtn = returnButtonElm;
        this.gameCanvas.appendChild(returnButtonElm);

        //add listener
        this.returnBtn.addEventListener("click", () => {
            this.clearCanvas();
            this.buildMainMenu();
        })

    }

    learnSpell(spell) {
        if(this.playerExp >= spell.cost) {
            this.playerExp -= spell.cost;

            const spellPos = this.lockedSpells.indexOf(spell);
            this.lockedSpells.splice(spellPos, 1);

            this.unlockedSpells.push(spell);

            this.clearCanvas();
            this.buildShopMenu();
        }
    }
    
    buildSpellsMenu() {

        //Update status and player info containers
        const playerExp = document.getElementById("player-info");
        const exp = document.createElement("p");
        exp.innerText = `Choose Wisely!`;
        playerExp.appendChild(exp);

        const titleContainer = document.getElementById("status-header");
        titleContainer.innerText = "Spell Skillset"

        const textContainer = document.getElementById("status-info");
        const text = document.createElement("p");
        text.innerText = `- Here you can choose 2 of the spells you already know!

        - The spell with blue shadow is selected to be your first key spell!
        
        - The spell with green shadow is selected to be your second key spell!
        
        - You can change your selection anytime between levels!`;

        textContainer.appendChild(text);

        //create spells container
        const spellDisplayer = document.createElement("div");

        //set its dimensions and display
        spellDisplayer.style.width = "100%";
        spellDisplayer.style.height = "80%";
        spellDisplayer.style.display = "flex";
        spellDisplayer.style.alignItems = "center";
        spellDisplayer.style.justifyContent = "center";
        this.gameCanvas.appendChild(spellDisplayer);

        //get and display the spells
        const spells = [];

        this.unlockedSpells.forEach((spell) => {
 
            const spellElm = document.createElement("div");
            spellElm.style.backgroundImage = `url(${spell.image})`;
            spellElm.style.backgroundSize = "cover";
            spellElm.style.width = "15%";
            spellElm.style.aspectRatio = "1 / 1";
            spellElm.style.margin = "2vw";
            spellElm.style.borderRadius = "50%";

            
            if(this.spellsInUse.includes(spell)) {
                if(this.spellsInUse.indexOf(spell) === 0){
                    spellElm.style.boxShadow = "0 0 2vw rgb(0, 0, 176)";
                } else {
                    spellElm.style.boxShadow = "0 0 2vw rgb(0, 176, 0)";
                }
            }

            spellDisplayer.appendChild(spellElm);
            
            const spellObj = {spell: spell, spellElm: spellElm};
            spells.push(spellObj);

            spellElm.addEventListener("click", () => {

                spells.forEach(spellObj => {
                    if(this.spellsInUse.includes(spellObj.spell)) {
                        if(this.spellsInUse.indexOf(spellObj.spell) === 0){
                            spellObj.spellElm.style.boxShadow = "0 0 2vw rgb(0, 0, 176)";
                        } else {
                            spellObj.spellElm.style.boxShadow = "0 0 2vw rgb(0, 176, 0)";
                        }
                    } else {
                        spellObj.spellElm.style.boxShadow = "";
                    }
                });

                spellElm.style.boxShadow = "0 0 2vw rgb(207, 0, 0)";
                
                this.clearStatus();

                titleContainer.innerText = spell.name.toUpperCase();

                const text = document.createElement("p");
                text.innerText = `POWER: ${spell.power}HP
                
                COOLDOWN: ${spell.cooldown}s`;

                textContainer.appendChild(text);

                if(!this.spellsInUse.includes(spell)) {
                    const useBtn = document.createElement("button");
                    useBtn.setAttribute("id", "buy-btn");
                    useBtn.innerText = "Use!";
                    textContainer.appendChild(useBtn);

                    useBtn.addEventListener("click", () => {
                        this.useSpell(spell);
                    });
                } else {
                    const unuseBtn = document.createElement("button");
                    unuseBtn.setAttribute("id", "buy-btn");
                    unuseBtn.innerText = "Don't Use!";
                    textContainer.appendChild(unuseBtn);

                    unuseBtn.addEventListener("click", () => {
                        this.unuseSpell(spell);
                    });
                }

            });

        });

        //Create and append Return button
        const returnButtonElm = document.createElement("button");
        returnButtonElm.innerText = "Done!"
        returnButtonElm.classList += "btn";
        this.returnBtn = returnButtonElm;
        this.gameCanvas.appendChild(returnButtonElm);

        //add listener
        this.returnBtn.addEventListener("click", () => {
            this.clearCanvas();
            this.buildMainMenu();
        })

    }

    useSpell(spell) {

        if(this.spellsInUse.length < 2) {
            this.spellsInUse.push(spell);
        } else {
            this.spellsInUse.shift();
            this.spellsInUse.push(spell);
        }

        this.clearCanvas();
        this.buildSpellsMenu();

    }
    
    unuseSpell(spell) {
        if(this.spellsInUse.length > 1) {
            const spellPos = this.spellsInUse.indexOf(spell);
            this.spellsInUse.splice(spellPos, 1);
        }
        this.clearCanvas();
        this.buildSpellsMenu();
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

    setPlayerInfo() {
        const playerTitleElm = document.getElementById("player-header");
        playerTitleElm.innerText = "YOUR AUROR";

        const playerInfoContainer = document.getElementById("player-info");

        const playerExp = document.createElement("p");
        playerExp.innerText = `EXP: ${this.playerExp} points`;
        playerInfoContainer.appendChild(playerExp);

        const primarySpell = this.spellsInUse[0].name.toUpperCase();
        const playerBuild = document.createElement("p");
        playerBuild.innerText = `Primary Spell: ${primarySpell}`;

        if(this.spellsInUse.length === 2) {
            const secondarySpell = this.spellsInUse[1].name.toUpperCase();
            playerBuild.innerText += `

            Secondary Spell: ${secondarySpell}`;
        }

        playerInfoContainer.appendChild(playerBuild);
    }

    setNextLevelInfo() {
        const statusTitleElm = document.getElementById("status-header");
        statusTitleElm.innerText = `LEVEL ${this.levelNumber}`;

        const levelInfoContainer = document.getElementById("status-info");
        const infoText = document.createElement("p");
        infoText.innerText = `IN LEVEL ${this.levelNumber}:

        - Deafeat ${this.levelNumber + 5} enemies to clear!

        - Up to ${this.levelNumber} enemies to fight at a time!

        - If you clear it you will get ${this.levelNumber * 50} Exp Points!`;

        levelInfoContainer.appendChild(infoText);
    }

    clearCanvas() {
        this.gameCanvas.innerHTML = "";
        const rulesTextContainer = document.getElementById("player-info");
        rulesTextContainer.innerHTML = "";
        const controlsTextContainer = document.getElementById("status-info");
        controlsTextContainer.innerHTML = "";
    }

    clearStatus() {
        const controlsTextContainer = document.getElementById("status-info");
        controlsTextContainer.innerHTML = "";
    }
}
//LevelBuilder---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class Level {

    constructor(levelNumber, playerExp, lockedSpells, unlockedSpells, spellsInUse) {
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

        //To set level settings
        this.killGoal;
        this.maxEnemies;
        //To control game stops
        this.enemyShootingId = [];
        this.frameIntervalId;

        //To control level
        this.playerExp = playerExp;
        this.levelNumber = levelNumber;
        this.unlockedSpells = unlockedSpells;
        this.lockedSpells = lockedSpells;
        this.spellsInUse = spellsInUse;

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

        //Calculate level settings
        if(this.levelNumber > 5) {
            this.maxEnemies = 5;
        } else {
            this.maxEnemies = this.levelNumber;
        }

        this.killGoal = this.levelNumber + 4;

        //Set Information panels
        this.setPlayerInfo();
        this.setStatusInfo();
               
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
            if(this.spawnTimer >= 2000 && this.enemiesArr.length < this.maxEnemies) {
                this.placeEnemies(1);
                this.spawnTimer = 0;
            }

            //To update info panels
            this.clearInfoContainers();
            this.setPlayerInfo();
            this.setStatusInfo();

            //Check vistory/defeat conditions
            this.checkStatus();

        }, 16);

    }

    checkStatus() {
        
        //check for victory
        if(this.player.killCount === this.killGoal) {
            this.playerExp += this.levelNumber * 50;
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
            let posX;
            let posY;
            let canDeploy;

            do {
                canDeploy = true;
                posX = Math.random() * 80 + 10;
                posY = Math.random() * 80 + 10;

                this.solidCollidablesArr.forEach(solid => {
                    if((Math.abs(posX - solid.positionX) * this.canvasOnePercentWidth) < (solid.width + 5) && (Math.abs(posY - solid.positionY) * this.canvasOnePercentHeight) < (solid.height + 5)) {
                        canDeploy = false;
                    }
                });

            } while(!canDeploy);

            const newEnemy = new Enemy(this.canvasOnePercentWidth, this.canvasOnePercentHeight, 3, 1, posX, posY, [this.collidablesArr, this.solidCollidablesArr, this.enemiesArr], 20, this.spellsArr, this.enemyShootingId, this.player);
        }

    }

    setPlayerInfo() {
        const playerTitleElm = document.getElementById("player-header");
        playerTitleElm.innerText = "YOUR AUROR";

        const playerInfoContainer = document.getElementById("player-info");
        
        const playerHp = document.createElement("p");
        playerHp.innerText = `HP: ${this.player.healthPoints}`;
        playerInfoContainer.appendChild(playerHp);
        
        const playerBuild = document.createElement("p");
        playerBuild.innerText = `This will show the status of your spells`;
        playerInfoContainer.appendChild(playerBuild);
    }
    
    setStatusInfo() {
        const statusTitleElm = document.getElementById("status-header");
        statusTitleElm.innerText = `LEVEL ${this.levelNumber}`;

        const levelInfoContainer = document.getElementById("status-info");
        const killCountText = document.createElement("p");
        killCountText.innerText = `KILLS LEFT: ${this.killGoal - this.player.killCount}`;
        levelInfoContainer.appendChild(killCountText);
        
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
            this.clearInfoContainers();
            this.clearCanvas();
            const menu = new GameMenu(this.levelNumber, this.playerExp, this.lockedSpells, this.unlockedSpells, this.spellsInUse);
        })
    }

    buildVictoryScreen() {
        //Message
        const messageElm = document.createElement("div");
        messageElm.className = "victory";
        messageElm.innerText = `LEVEL ${this.levelNumber} CLEARED!`;

        this.gameCanvas.appendChild(messageElm);

        //Button
        //Create and append Return button
        const continueButtonElm = document.createElement("button");
        continueButtonElm.innerText = "CONTINUE"
        continueButtonElm.classList += "btn";
        this.gameCanvas.appendChild(continueButtonElm);

        //add listener
        continueButtonElm.addEventListener("click", () => {
            this.clearInfoContainers();
            this.clearCanvas();
            const menu = new GameMenu(this.levelNumber + 1, this.playerExp, this.lockedSpells, this.unlockedSpells, this.spellsInUse); 
        })
    }

    clearInfoContainers() {
        const playerInfoContainer = document.getElementById("player-info");
        playerInfoContainer.innerHTML = "";

        const levelInfoContainer = document.getElementById("status-info");
        levelInfoContainer.innerHTML = "";
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
        
        //Remove Collider from the levels
        this.collider.removeCollider();

        //Remove from the DOM
        this.objectElm.remove();

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
        this.healthPoints = 20;
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
        this.player.incrementKillCount();
        clearInterval(this.intervalId);
        this.canShoot = false;
        super.removeObject();
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
        this.coolDown = 0.7;
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
const myGame = new GameMenu(2, 50);