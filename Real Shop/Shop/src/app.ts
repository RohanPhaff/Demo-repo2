class Game {
    private fruits: any[];
    private canvas: HTMLCanvasElement;
    private counter: number;
    private score: number;

    public constructor(canvasId: HTMLCanvasElement) {
        // Construct all of the canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.fruits = [];

        // add some kiwis
        for (let index = 0; index < this.randomNumber(3, 10); index++) {
            this.fruits.push(this.fruitFactory("./assets/kiwi-sm.png", 'kiwi'));
        }

        // add an apple
        this.fruits.push(this.fruitFactory("./assets/apple-sm.png", 'apple'));

        // add an mouse event
        document.addEventListener("click", this.mouseHandler);

        // set the counter to 0
        this.counter = 0;
        this.score = 0;
        this.loop();
    }
    /**
     * Method for the Game Loop
     */
    public loop = () => {
        this.draw();
        this.counter++;

        // for loop to delete an element from the fruit array if it is not alive anymore
        for (let i = 0; i < this.fruits.length; i++) {
            if (this.counter >= this.fruits[i].alive) {
                this.fruits.splice(i, 1); // remove an element from the kiwi array
            }
        }

        // in the first loop no images are loaded
        requestAnimationFrame(this.loop);
    };

    /**
     * Method to create a Fruit object
     * @param source - string for image url
     * @return Fruit - returns a fruit object
     *
     * The fruit object has the following attributes:
     * - name of the fuit object
     * - alive: amount of seconds a fruit object is visible on the screen (based on counter and frame per seconds)
     * - xPos: x position on the canvas
     * - yPos: y position on the canvas
     * - image: an HTMLimageElement of the kiwi or apple
     */
    public fruitFactory(source: string, name: string): any {
        return {
            name: name,
            alive: this.randomNumber(0, 350),
            xPos: this.randomNumber(0, this.canvas.width - 200),
            yPos: this.randomNumber(0, this.canvas.height - 200),
            image: this.loadNewImage(source)
        };
    }

    /**
     * Method to handle the mouse event
     * @param {MouseEvent} event - mouse event
     */
    public mouseHandler = (event: MouseEvent) => {
        console.log(`xPos ${event.clientX}, yPos ${event.clientY}`);

        // simple click detection
        this.fruits.forEach(fruit => {
            if (
                event.clientX >= fruit.xPos &&
                event.clientX < fruit.xPos + fruit.image.width &&
                event.clientY >= fruit.yPos &&
                event.clientY <= fruit.yPos + fruit.image.height
            ) {
                //check to see if element is an apple or an kiwi
                if (fruit.name == 'kiwi') {
                    this.score++;
                }
                else if (fruit.name == 'apple') {
                    this.score--;
                }
            }
        });
    };

    /**
     * Loads an image so it doesn't flicker
     * @param {HTMLImageElement} source
     * @return HTMLImageElement - returns an image
     */
    public loadNewImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }

    /**
     * Draws all the necessary elements to the canvas
     */
    public draw() {
        const ctx = this.canvas.getContext("2d");
        // when there are elements in the fruit array
        if (this.fruits.length != 0) {
            // clear the canvas
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // draw each fruit
            this.fruits.forEach(element => {
                ctx.drawImage(
                    element.image,
                    element.xPos,
                    element.yPos
                );
            });

            //write the current score
            this.writeTextToCanvas(
                ctx,
                `Score is: ${this.score}`,
                40,
                100,
                40
            );
        } else {
            // if there are no elements in the fruit array left draw game over.
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.writeTextToCanvas(
                ctx,
                "Game over",
                60,
                this.canvas.width / 2,
                this.canvas.height / 2
            );

            // draw the end score
            this.writeTextToCanvas(
                ctx,
                `Your score is: ${this.score}`,
                40,
                this.canvas.width / 2,
                this.canvas.height / 2 + 50
            );
        }
    }

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
        color: string = "red"
    ) {
        ctx.font = `${fontSize}px Minecraft`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.fillText(text, xCoordinate, yCoordinate);
    }

    /**
     * Renders a random number between min and max
     * @param {number} min - minimal time
     * @param {number} max - maximal time
     */
    public randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}

// Initialize the game after the DOM is loaded.
let init = () => {
    const KiwiWars = new Game(
        document.getElementById("canvas") as HTMLCanvasElement
    );
};

// Add EventListener to load the game whenever the browser is ready
window.addEventListener("load", init);
