class Mouse extends GameObject {
    width;
    height;
    x;
    y;
    sprite;
    juego;
    default = 1; 
    bomba = 2;
    valorMouse = 1;

    constructor(width, height, x, y, juego, sprite) {
        super();
        this.width = width;
        this.height = height;
        this.posicion = {x: x, y: y};

        this.juego = juego;

        this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        this.sprite.anchor.set(0.5);
        //Ajuste de ubicacion
        //this.sprite.x = this.juego.mouse.posicion.x;
        //this.sprite.y = this.juego.mouse.posicion.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.zIndex = 3000;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;


        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    cambiarSpriteSegunAccion() {
        //agregar cositas epicas :>
        //condicionBomba = 
        //if ()
    }
    
    render() {
        //if (this.juego.containerPrincipal.x == undefined) return console.warn("error inutil");
        //else if (this.juego.containerPrincipal.y == undefined) return;
        
        this.juego.pixiApp.stage.on('pointermove', (event) => {
            this.sprite.position.x = event.data.global.x;
            this.sprite.position.y = event.data.global.y;
            this.posicion.x = this.sprite.position.x;
            this.posicion.y = this.sprite.position.y;
        });

        /*
        this.juego.canvas.onmousemove = (event) => {
            this.mouse.posicion = this.convertirCoordenadaDelMouse(event.x, event.y);
        };

        this.juego.canvas.onmousedown = (event) => {
            this.mouse.down = this.convertirCoordenadaDelMouse(event.x, event.y);
            this.mouse.apretado = true;
        };
        this.juego.canvas.onmouseup = (event) => {
            this.mouse.up = this.convertirCoordenadaDelMouse(event.x, event.y);
            this.mouse.apretado = false;
        }
        */
    }

    tick() {
        this.render() 
    }
}