class Game {
    private rockets: Rocket[];
    private player: Player;
    private canvas: HTMLCanvasElement;
    private score: number;
    private ctx: CanvasRenderingContext2D;
    private counter: number;
    private keyBoard: KeyboardListener;
    private hengel: Hengel;
    private catchedFish: Rocket;
    private netherPortal: Portal;
    private endPortal: Portal;
    private level: number;
    private shop: boolean;
    private Prompts: Prompts[];
    private speedPopup: boolean;
    private twoXPopup: boolean;
    private autoFishPopup: boolean;

    public constructor(canvasId: HTMLCanvasElement) {
        // Construct all of the canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        this.rockets = [];
        this.Prompts = [];
        this.speedPopup = false;
        this.twoXPopup = false;
        this.autoFishPopup = false;
        this.shop = false;
        this.keyBoard = new KeyboardListener
        document.addEventListener("click", this.mouseHandler);

        console.log(this.rockets);

        this.player = new Player('Me',
            this.canvas.width / 2.25,
            this.canvas.height / 2 - 80,
            5,
            "./assets/Images/mcboot.png");
        console.log(this.player);

        this.hengel = new Hengel(this.canvas.height / 2 - 60, 3, "./assets/Images/hook.png")

        this.netherPortal = new NetherPortal("./assets/Images/nether_portal.png");

        this.endPortal = new EndPortal("./assets/Images/end_portal.png");

        // this.soundEffect("./assets/Sounds/Background_music.mp3", 0.5, 0.05);

        this.score = 0;
        this.level = 0;
        this.loop();
        this.counter = 0;
    }
    /**
     * Method for the Game Loop
     */
    public loop = () => {
        if (this.shop === false){
            this.newLevel();
            this.score++;
            this.counter++;
            if (this.counter === 60) {
                this.makeFish()
                this.counter = 0;
            }
            // console.log(this.level)
            this.move();
            this.draw();
            this.drawHengel(this.ctx)
            this.drawPortal(this.ctx)
            this.hengel.move(this.canvas)
            this.hengel.hengelCollidesWithFish(this.rockets, this.player);
            this.player.move(this.canvas);
            if (this.keyBoard.isKeyDown(KeyboardListener.KEY_F11)) {
                location.reload()
            }
            if (this.keyBoard.isKeyDown(KeyboardListener.KEY_F5)) {
                window.location.href = 'https://lucvanwesten2003.github.io/ICTHuts/';
            }
        }
        
        requestAnimationFrame(this.loop);
    };

    private mouseHandler = (event: MouseEvent) => {
        console.log(`xPos ${event.clientX}, yPos ${event.clientY}`);

        let X = event.clientX / window.innerWidth;
        let Y = event.clientY / window.innerHeight;

        console.log(X);
        
        if(X > 0 && X < 0.135 && Y > 0.138 && Y < 0.416){
            this.shop = true;
            document.body.style.background = `url("./assets/Images/The Shop.png") no-repeat center center fixed`;
            document.body.style.backgroundSize = 'cover'
        }
        if (this.shop === true){
            if(this.twoXPopup === false && this.autoFishPopup === false && X > 0.32 && X < 0.429 && Y > 0.583 && Y < 0.66 || this.speedPopup === true){
                this.Prompts.splice(1, 1);
                this.Prompts.push(
                    new Prompt(
                        "Potion prompt",
                        0,
                        -200,
                        "./assets/Images/SpeedPrompt.png"
                    )
                );
                this.speedPopup = true;
                if(event.clientX > 760 && event.clientX < 905 && event.clientY > 410 && event.clientY < 555){
                    console.log("yes");
                    this.Prompts.splice(1, 1);
                    this.speedPopup = false;
                } 
                if(event.clientX > 1050 && event.clientX < 1180 && event.clientY > 415 && event.clientY < 550){
                    console.log("no");
                    this.Prompts.splice(1, 1);
                    this.speedPopup = false;
                }
            } 
            if(this.speedPopup === false && this.autoFishPopup === false && event.clientX > 930 && event.clientX < 1010 && event.clientY > 725 && event.clientY < 810 || this.twoXPopup === true){
                this.Prompts.splice(1, 1);
                this.Prompts.push(
                    new Prompt(
                        "two X Prompt",
                        0,
                        -200,
                        "./assets/Images/DoublePrompt.png"
                    )
                )
                this.twoXPopup = true;
                if(event.clientX > 760 && event.clientX < 905 && event.clientY > 410 && event.clientY < 555){
                    console.log("yes");
                    this.Prompts.splice(1, 1);
                    this.twoXPopup = false;
                } 
                if(event.clientX > 1050 && event.clientX < 1180 && event.clientY > 415 && event.clientY < 550){
                    console.log("no");
                    this.Prompts.splice(1, 1);
                    this.twoXPopup = false;
                } 
            } 
            if(this.speedPopup === false && this.twoXPopup === false && event.clientX > 1165 && event.clientX < 1260 && event.clientY > 750 && event.clientY < 800 || this.autoFishPopup === true){
                this.Prompts.splice(1, 1);
                this.Prompts.push(
                    new Prompt(
                        "Autofishing Prompt",
                        0,
                        -200,
                        "./assets/Images/SpecialPrompt.png"
                    )
                )
                this.autoFishPopup = true;
                if(event.clientX > 760 && event.clientX < 905 && event.clientY > 410 && event.clientY < 555){
                    console.log("yes");
                    this.Prompts.splice(1, 1);
                    this.autoFishPopup = false;
                } 
                if(event.clientX > 1050 && event.clientX < 1180 && event.clientY > 415 && event.clientY < 550){
                    console.log("no");
                    this.Prompts.splice(1, 1);
                    this.autoFishPopup = false;
                }
            } 
        }
        this.draw();
    }

    private makeFish() {
        for (let index = 0; index < 1; index++) {
            let randomFish = ['alive', 'dead']
            const randomElement = randomFish[Math.floor(Math.random() * randomFish.length)];
            if (randomElement === 'alive') {
                this.rockets.push(new Rocket('aliveFish',
                    Game.randomNumber(0, this.canvas.width - 200),
                    Game.randomNumber(this.player.yPosition + 200, this.canvas.height - 50),
                    Game.randomNumber(2, 5), "aliveFish", "./assets/Images/aliveFish.png"));
                console.log("alvieFish");
            } else {
                this.rockets.push(new Rocket('deadFish',
                    Game.randomNumber(0, this.canvas.width - 200),
                    Game.randomNumber(this.player.yPosition + 200, this.canvas.height - 50),
                    Game.randomNumber(2, 5), "deadFish", "./assets/Images/deadFish.png"));
            }
        }
    }

    /**
     * Method to move the rockets
     */
    public move() {
        this.rockets.forEach((rocket) => {
            rocket.move()
        });
    }

    /**
* 
* @param ctx 
* draws the rocket
*/
    public drawHengel(ctx: CanvasRenderingContext2D) {
        //ctx.drawImage(this.hengel._catchedFish.image, this.hengel._catchedFish.xPosition, this.hengel._catchedFish.yPosition)
        ctx.drawImage(this.hengel.image, this.player.xPosition + this.player.image.width - 50, this.hengel.yPosition)
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.player.xPosition + this.player.image.width, this.player.yPosition + 25)
        ctx.lineTo(this.player.xPosition + this.player.image.width - 10, this.hengel.yPosition + 10)
        ctx.stroke()
    }

    public drawPortal(ctx: CanvasRenderingContext2D) {
        if (this.level == 1) {
            if (this.hengel._score > 2) {
                ctx.drawImage(this.netherPortal.image, this.canvas.width - this.netherPortal.image.width, this.player.yPosition - 100)
                this.portalCollision();
            }
        }
        if (this.level == 2) {
            if (this.hengel._score > 7) {
                ctx.drawImage(this.endPortal.image, this.canvas.width - this.endPortal.image.width, this.player.yPosition - 120)
                this.portalCollision();
            }
        }
    }


    /**
     * Draws all the necessary elements to the canvas
     */
    public draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.Prompts.forEach((element) => {
            element.draw(this.ctx)
        });
        if (this.shop === false){
            this.player.draw(this.ctx);

            // when there are elements in the rocket array
            if (this.rockets.length != 0) {
                // clear the canvas

                // draw each rocket
                this.rockets.forEach((rocket) => {
                    rocket.draw(this.ctx)
                });

                //write the current score
                this.writeTextToCanvas(
                    this.ctx,
                    `Score is: ${this.hengel._score}`,
                    40,
                    this.canvas.width / 2,
                    40,
                );
            }
        }
    }

    private newLevel() {
        if (this.hengel._score < 3) {
            this.level = 1;
            document.body.style.background = `url("./assets/Images/achtergrond_level_1.png") no-repeat center center fixed`;
            document.body.style.backgroundSize = 'cover'
        }
    }

    private portalCollision() {
        if (this.player.xPosition >= this.canvas.width - this.netherPortal.image.width - this.player.image.width) {
            // this.soundEffect("./assets/Sounds/Nether_portal.mp3", 0.5, 0.1);
            this.player.image = GameItem.loadNewImage('./assets/Images/mcboot2.png');
            this.level = 2;
            document.body.style.background = `url("./assets/Images/achtergrond_level_2.png") no-repeat center center fixed`;
            document.body.style.backgroundSize = 'cover'
            this.player.xPosition = 0;
            console.log("next level");
        }
        if (this.player.xPosition >= this.canvas.width - this.endPortal.image.width - this.player.image.width && this.level == 2) {
            // this.soundEffect("./assets/Sounds/End_portal.mp3", 0.5, 0.3);
            this.level = 3;
            document.body.style.background = `url("./assets/Images/achtergrond_level_3.png") no-repeat center center fixed`;
            document.body.style.backgroundSize = 'cover'
            this.player.xPosition = 0;
            console.log("next level");
        }
    } 

    // private soundEffect(url: string, time: number, volume: number) { 
    //     let audio = new Audio(url);
    //     audio.currentTime = time;
    //     audio.volume = volume;
    //     audio.play();
    // } 

    /**
     * Writes text to the canvas
     * @param {string} text - Text to write
     * @param {number} fontSize - Font size in pixels
     * @param {number} xCoordinate - Horizontal coordinate in pixels
     * @param {number} yCoordinate - Vertical coordinate in pixels
     * @param {string} alignment - Where to align the text
     * @param {string} color - The color of the text
     */
    public writeTextToCanvas(
        ctx: CanvasRenderingContext2D,
        text: string,
        fontSize: number = 20,
        xCoordinate: number,
        yCoordinate: number,
        alignment: CanvasTextAlign = "center",
        color: string = "white"
    ) {
        ctx.font = `${fontSize}px Minecraft`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.fillText(text, xCoordinate, yCoordinate);
    }

    /**
     * Renders a random number between min and max
     * @param {number} min - minimum number
     * @param {number} max - maximum number
     */
    public static randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}
