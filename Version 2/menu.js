class Menu extends GameObject {
    x;
    y;
    juego;
    width;
    height;
    sprite;
    pantallaActual;
    puedeCambiarPasandoMousePorArriba = true;

    constructor(x, y, juego) {
        super(x, y, juego);
        this.x = x;
        this.y = y;
        this.juego = juego;
        this.posicion = { x: x, y: y };
    }

    async init() {
        //se hace textura para poder manejar la visibilidad de las pantallas
        this.sprite = this.juego.pantallas[0];

        await this.generarSpriteDe(this.sprite);

        this.pantallaActual = this.sprite;

        this.indiceActual = 0;
    }


    async generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);

        this.sprite.anchor.set(0.5);

        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    cambiarPantalla(indiceDestino) {
        this.indiceActual = indiceDestino; // con esto vamos a la pantalla deseada
        const nuevaPantalla = this.juego.pantallas[indiceDestino]; // guardamos la nueva pantalla a ir
        this.pantallaActual.texture = nuevaPantalla; //cambiamos la textura de la pantalla actual
    }

    ocultarPantalla() {
        this.pantallaActual.visible = false;
    }

    mostrarPantalla() {
        this.pantallaActual.visible = true;
    }

    moverPantallaAdelante() {
        this.pantallaActual.zIndex = 5500;
    }

    tick() {

    }
}