class Game {
    constructor(canvasId) {
        this.loop = () => {
            this.draw();
            this.counter++;
            for (let i = 0; i < this.fruits.length; i++) {
                if (this.counter >= this.fruits[i].alive) {
                    this.fruits.splice(i, 1);
                }
            }
            requestAnimationFrame(this.loop);
        };
        this.mouseHandler = (event) => {
            console.log(`xPos ${event.clientX}, yPos ${event.clientY}`);
            this.fruits.forEach(fruit => {
                if (event.clientX >= fruit.xPos &&
                    event.clientX < fruit.xPos + fruit.image.width &&
                    event.clientY >= fruit.yPos &&
                    event.clientY <= fruit.yPos + fruit.image.height) {
                    if (fruit.name == 'kiwi') {
                        this.score++;
                    }
                    else if (fruit.name == 'apple') {
                        this.score--;
                    }
                }
            });
        };
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.fruits = [];
        for (let index = 0; index < this.randomNumber(3, 10); index++) {
            this.fruits.push(this.fruitFactory("./assets/kiwi-sm.png", 'kiwi'));
        }
        this.fruits.push(this.fruitFactory("./assets/apple-sm.png", 'apple'));
        document.addEventListener("click", this.mouseHandler);
        this.counter = 0;
        this.score = 0;
        this.loop();
    }
    fruitFactory(source, name) {
        return {
            name: name,
            alive: this.randomNumber(0, 350),
            xPos: this.randomNumber(0, this.canvas.width - 200),
            yPos: this.randomNumber(0, this.canvas.height - 200),
            image: this.loadNewImage(source)
        };
    }
    loadNewImage(source) {
        const img = new Image();
        img.src = source;
        return img;
    }
    draw() {
        const ctx = this.canvas.getContext("2d");
        if (this.fruits.length != 0) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.fruits.forEach(element => {
                ctx.drawImage(element.image, element.xPos, element.yPos);
            });
            this.writeTextToCanvas(ctx, `Score is: ${this.score}`, 40, 100, 40);
        }
        else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.writeTextToCanvas(ctx, "Game over", 60, this.canvas.width / 2, this.canvas.height / 2);
            this.writeTextToCanvas(ctx, `Your score is: ${this.score}`, 40, this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }
    writeTextToCanvas(ctx, text, fontSize = 20, xCoordinate, yCoordinate, alignment = "center", color = "red") {
        ctx.font = `${fontSize}px Minecraft`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.fillText(text, xCoordinate, yCoordinate);
    }
    randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
let init = () => {
    const KiwiWars = new Game(document.getElementById("canvas"));
};
window.addEventListener("load", init);
//# sourceMappingURL=app.js.map