class HUD {

    constructor(juego) {
        this.juego = juego
        this.fuenteTexto = {
            fontSize: 30,
            fontFamily: "PixelifySans",
            fill: 0xffffff,
            fontWeight: "bold",
            stroke: { color: 0x444444, width: 3 },
            align: "center"
        }
        this.container = new PIXI.Container();
        this.container.name = this.constructor.name;

        this.juego.pixiApp.stage.addChild(this.container);

        this.container.zIndex = 2;
    }

    async generarIcono() {
        const texturaIcono = await PIXI.Assets.load("imagenes/enemigos_eliminados_final.png")
        this.sprite = new PIXI.Sprite(texturaIcono);

        this.sprite.anchor.set(0.5);

        //Ajuste de ubicacion
        this.sprite.x = this.posX;
        this.sprite.y = this.margen;
        this.sprite.zIndex = 1100

        //Ajuste de tamaño
        this.sprite.width = 36;
        this.sprite.height = 36;
        this.sprite.scale.x = 1;

        //Añadir el sprite dentro del stage:
        this.container.addChild(this.sprite);
        // this.juego.pixiApp.stage.addChild(this.sprite);
    }

    //CREACION DE TEXTOS
    async crearTextos() {
        //TEXTO ENEMIGOS ABATIDOS
        //--------------------------------------------
        this.textoEnemigosAbatidos = new PIXI.Text({ text: "", style: this.fuenteTexto });

        //posicionamos el pivot en el centro
        this.textoEnemigosAbatidos.anchor.set(0.5);

        //posicionamos en pantalla
        this.textoEnemigosAbatidos.x = this.juego.width - 50;
        this.textoEnemigosAbatidos.y = this.juego.height - 475;

        this.container.addChild(this.textoEnemigosAbatidos);
        //--------------------------------------------


        //TEXTO PUNTAJE MAS ALTO
        //--------------------------------------------
        this.textoPuntajeMasAlto = new PIXI.Text({ text: "", style: this.fuenteTexto });

        //achicamos el texto para que tenga tamaño decente en GAME OVER
        this.textoPuntajeMasAlto.style.fontSize = 18;

        //posicionamos el pivot en el centro
        this.textoPuntajeMasAlto.anchor.set(0.5);

        //posicionamos en pantalla
        this.textoPuntajeMasAlto.x = this.juego.width - 290;
        this.textoPuntajeMasAlto.y = this.juego.height - 395;

        this.container.addChild(this.textoPuntajeMasAlto);
        //--------------------------------------------
    }

    moverAtras() {
        this.container.zIndex = 2;
        this.textoPuntajeMasAlto.visible = false;
    }

    moverAdelante() {
        this.container.zIndex = 6000;
        this.textoPuntajeMasAlto.visible = true;
    }

    acomodarPosicionYTamañoDeTextoEnemigosAbatidos() {
        this.textoEnemigosAbatidos.style.fontSize = 30;
        this.textoEnemigosAbatidos.x = this.juego.width - 50;
        this.textoEnemigosAbatidos.y = this.juego.height - 475;
    }

    actualizarTextosDuranteLaPartida() {
        //Actualizacion del contador de enemigos muertos (texto, posicion, zIndex)
        //-------------------------------------------------
        this.textoEnemigosAbatidos.text = this.juego.enemigosMuertos.length.toString();
        if (this.juego.menu.pantallaActual.texture == this.juego.pantallas[5]) {
            this.textoEnemigosAbatidos.style.fontSize = 18;

            this.textoEnemigosAbatidos.x = this.juego.width - 300;
            this.textoEnemigosAbatidos.y = this.juego.height - 415;

            this.moverAdelante();
        }
    }

    tick() {
        if (!this.textoEnemigosAbatidos) return;
        if (!this.textoPuntajeMasAlto) return;
        this.actualizarTextosDuranteLaPartida();
    }
}