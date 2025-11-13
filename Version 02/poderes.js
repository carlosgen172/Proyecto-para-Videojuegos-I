class Poder extends GameObject{
    width;
    height;
    x;
    y;
    juego;
    sprite;
    estado;

    constructor(width, height, x, y, juego, sprite, estado) {
        super(x, y, juego);
        this.x = x;
        this.y = y;
        // this.posicion = {x: x, y: y};
        this.width = width;
        this.height = height;
        this.juego = juego;
        this.estado = estado;
        this.puedeGenerarAliados = false;
        this.puedeGenerarBombas = false;
        this.puedeGenerarEnemigos = false;
        //console.log(this);
        //console.log("el ancho del boton:", this.width);
        this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        //console.log("lo que entra en generarSpriteDe: ", unSprite)
        this.sprite = new PIXI.Sprite(unSprite);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        //Añadir el sprite dentro del stage:
        console.log(this.sprite);

        this.sprite.zIndex = 1100;
        //console.log(this.juego)
        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    activarPoder() {
        //acá se realiza una acción determinada según el poder el cual se esté activo.
        // if (this.sprite.name = "imagenes/aliados_power_up_hud.png") {
        if (this.estado == "aliados"){
            //this.juego.generarTropas()
            this.puedeGenerarAliados = true
        } else if (this.estado == "bomba") {
            // this.juego.generarAvion()
            // this.puedeGenerarEnemigos = true
            this.puedeGenerarBombas = true
        } else {
            // this.juego.generarTropasEnemigas()
            this.puedeGenerarEnemigos = true
        }
    }

    tick() {
        //this.cambiarSegunEstadoActual();
        this.activarPoder();
    }
}