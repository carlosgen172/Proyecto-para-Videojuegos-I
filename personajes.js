class Personaje {
    pixiApp;
    x;
    y;
    width;
    height;
    color;
    velocidad;
    sprite;

    constructor(pixiApp, x, y, width = 30, height = 50, color = 0x00ff00, velocidad = 2) {
        this.pixiApp = pixiApp;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocidad = velocidad;

        this.crearSprite();
    }

    crearSprite(){
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(this.color);
        this.sprite.drawRect(0, 0, this.width, this.height);
        this.sprite.endFill();

        
        // centramos el sprite en (x,y)
        this.sprite.pivot.set(this.width / 2, this.height / 2);
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.pixiApp.stage.addChild(this.sprite);
    }

    mover(dx, dy) {
        this.sprite.x += dx * this.velocidad;
        this.sprite.y += dy * this.velocidad;
    }
}

class Aliado extends Personaje {

    constructor(pixiApp, x, y, width = 30, height = 50, color = 0x3ADE3A, velocidad = 2) {
        super(pixiApp, x, y, width, height, color, velocidad);
        this.crearSprite();
        this.pixiApp.ticker.add(() => (this.gameLoop()));
    }

    gameLoop() {
        this.mover(2, 0)
    }
}