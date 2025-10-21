class Personaje {
    pixiApp;
    x;
    y;
    width;
    height;
    color;
    velocidad;
    sprite;
    rangoVision;
    ataque;

    constructor(pixiApp, x, y, width, height, color, velocidad) {
        this.pixiApp = pixiApp;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocidad = velocidad;
        
        this.ataque = false;

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

    constructor(pixiApp, x, y, width, height, color, velocidad) {
        super(pixiApp, x, y, width, height, color, velocidad);
        this.pixiApp.ticker.add(() => (this.gameLoop()));
        this.crearRangoVision();
    }

    gameLoop() {
        this.mover(2, 0)
        this.rangoVision.x = this.sprite.x + 40;
        this.rangoVision.y = this.sprite.y;
    }

    crearRangoVision() {
        this.rangoVision = new PIXI.Graphics();
        this.rangoVision.beginFill(0x00ff00, 0.3);
        this.rangoVision.drawPolygon([
            0, 0, //punto A: posicion (estara en el aliado)
            200, -100, //punto B: esquina superior
            200, 100 //punto C: esquina inferior
        ]);
        this.rangoVision.endFill();
        
        //no es necesario centrar el pivot porque la punta
        //ya esta en 0, 0
        //this.rangoVision.pivot.set(0, 0);

        //posicion inicial
        this.rangoVision.x = this.x;
        this.rangoVision.y = this.y;

        this.pixiApp.stage.addChild(this.rangoVision);
    }
}

class Enemigo extends Personaje {

    constructor(pixiApp, x, y, width, height, color, velocidad) {
        super(pixiApp, x, y, width, height, color, velocidad);
        this.pixiApp.ticker.add(() => (this.gameLoop()));
        this.crearRangoVision();
    }

        crearRangoVision() {
        this.rangoVision = new PIXI.Graphics();
        this.rangoVision.beginFill(0xF4320B, 0.3);
        this.rangoVision.drawPolygon([
            0, 0, //punto A: posicion (estara en el aliado)
            -200, -100, //punto B: esquina superior
            -200, 100 //punto C: esquina inferior
        ]);
        this.rangoVision.endFill();
        
        //no es necesario centrar el pivot porque la punta
        //ya esta en 0, 0
        //this.rangoVision.pivot.set(0, 0);

        //posicion inicial
        this.rangoVision.x = this.x;
        this.rangoVision.y = this.y;

        this.pixiApp.stage.addChild(this.rangoVision);
    }

    gameLoop() {
        this.mover(-2, 0)
        this.rangoVision.x = this.sprite.x - 40;
        this.rangoVision.y = this.sprite.y;
    }
}