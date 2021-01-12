/// <reference path="Prompts.ts"/>

class Prompt extends Prompts{
    constructor(
        name: string,
        xPos: number,
        yPos: number,
        image: string,
    ) {
        super(name, xPos, yPos, image);
    }
}