class Boton extends GameObject{
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
        this.posicion = {x: x, y: y};
        //console.log(this);
        //console.log("el ancho del boton:", this.width);
        //this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        //console.log("lo que entra en generarSpriteDe: ", unSprite)
        this.sprite = new PIXI.Sprite(unSprite);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        //this.sprite.scale.x = this.scaleX;
        //Añadir el sprite dentro del stage:
        //console.log(this.sprite);

        this.sprite.zIndex = 1100;
        this.juego.pixiApp.stage.addChild(this.sprite);
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