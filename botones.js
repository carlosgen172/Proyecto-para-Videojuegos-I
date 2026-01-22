class Boton extends GameObject {
    x;
    y;
    width;
    height;
    juego;
    sprite;
    haSidoInteractuado = false;

    constructor(x, y, juego, width, height) {
        super(x, y, juego);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.juego = juego;
        this.posicion = { x: x, y: y };
        // this.container = new PIXI.Container();
        // this.container.name = this.constructor.name;
        // this.juego.pixiApp.stage.addChild(this.container);
        //console.log(this);
        //console.log("el ancho del boton:", this.width);
        //this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        //este console log sirve para ver cuántos hijos hay en el stage antes y después de agregar el sprite
        //console.log("Stage children antes:", this.juego.pixiApp.stage.children.length);
        this.sprite = new PIXI.Sprite(unSprite);

        this.sprite.anchor.set(0.5);

        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        
        this.sprite.zIndex = 1100;

        // this.container.addChild(this.sprite);
        this.juego.pixiApp.stage.addChild(this.sprite);
        // this.juego.pixiApp.stage.addChild(this.container);
        //este console log sirve para ver cuántos hijos hay en el stage antes y después de agregar el sprite
        //console.log("Stage children después:", this.juego.pixiApp.stage.children.length);
    }

    cambiarSegunEstadoActual() {
        //if(this.haSidoInteractuado) {
        //this.sprite = 
        //}
    }

    tick() {
        //this.cambiarSegunEstadoActual();
    }
}