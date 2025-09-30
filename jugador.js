class Jugador extends Personaje {
    keys = {};
    aliados;
    enemigos;

    constructor(pixiApp, x, y) {
        super(pixiApp, x, y, 30, 50, 0x0000ff, 5);

        window.addEventListener("keydown", this.keysDown.bind(this));
        window.addEventListener("keyup", this.keysUp.bind(this));

        //cantidad de aliados/enemigos
        this.aliados = 0;
        this.enemigos = 0;

        this.pixiApp.ticker.add(() => (this.gameLoop()));
    }


    //se pone .toLowerCase() para mostrar la letra,
    //con el .keyCode se muestra el codigo.
    keysDown(letra){
        this.keys[letra.key.toLowerCase()] = true;

        this.dispararCon(letra);
        this.llamarPersonajes(letra);
    }

    keysUp(letra){
        this.keys[letra.key.toLowerCase()] = false;
    }

    dispararCon(letra){
        if (letra.key.toLowerCase() === "j") {
            new Bala(
                this.pixiApp,
                this.sprite.x + 20, this.sprite.y,
                1, 0,
                8, 4,
                0xED6040,
                7
            );
        }
    }

    //funcion general para llamar aliados/enemigos
    llamarPersonajes(letra){
        if(this.aliados < 16) {
            this.llamarAliado(letra);
        }
        if(this.enemigos < 16) {
            this.llamarEnemigo(letra);
        }
    }

    //Aliados
    llamarAliado(letra){
        if (letra.key.toLowerCase() === "q") {
            this.crearAliado()
            this.aliados ++;
        }
    }
    crearAliado(){
        //numero random entero ( el Math.floor() es para tener
        //numeros enteros) con Math.random().
        const numRandom = Math.floor(Math.random() * 500) + 75

        //creacion de posicion para corroborar donde esta
        const aX = this.sprite.x - 300;
        const aY = 540 + numRandom;

        new Aliado(
            this.pixiApp,
            this.sprite.x - 300,
            numRandom,
            30, 50, 
            0x3ADE3A, 1
        );
        console.log("se creo en ", aX, aY)
    }

    //Enemigos
    llamarEnemigo(letra){
        if (letra.key.toLowerCase() === "e") {
            this.crearEnemigo()
            this.enemigos ++;
        }
    }
    crearEnemigo(){
        //numero random entero ( el Math.floor() es para tener
        //numeros enteros) con Math.random().
        const numRandom = Math.floor(Math.random() * 500) + 75
        new Enemigo(
            this.pixiApp,
            this.sprite.x + 600,
            numRandom,
            30, 50, 
            0xC71818, 1
        );
    }


    gameLoop() {
        let dx = 0;
        let dy = 0;

        if (this.keys["w"]) dy -= 1;
        if (this.keys["a"]) dx -= 1;
        if (this.keys["s"]) dy += 1;
        if (this.keys["d"]) dx += 1;

        
        // normalizar vector
        let length = Math.hypot(dx, dy);
        if (length > 0) {
            dx /= length;
            dy /= length;

            // usar la función del padre
            this.mover(dx, dy);
        }
        
    }
}

class Bala {
    pixiApp;
    x;
    y;
    dx;
    dy;
    width;
    height;
    color;
    velocidad;
    sprite;
    constructor(pixiApp, x, y, dx, dy, width, height, color, velocidad) {
        this.pixiApp = pixiApp;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocidad = velocidad;

        this.crearSprite();

        this.pixiApp.ticker.add(() => (this.gameLoop()));
        console.log("posicion: ", this.sprite.x, this.sprite.y);
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

    gameLoop(){
        this.sprite.x += this.dx * this.velocidad;
        this.sprite.y += this.dy * this.velocidad;
    }
}