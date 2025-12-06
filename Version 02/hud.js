class HUD {

    constructor(juego, x, y) {
        this.margen = 8
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

        this.container.x = x;
        this.container.y = y;

        this.juego.pixiApp.stage.addChild(this.container);

        this.resize();
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
    //---------------------------------------
    async crearTextoEnemigosAbatidos() {
        this.textoEnemigosAbatidos = new PIXI.Text({ text: "", style: this.fuenteTexto });
        this.textoEnemigosAbatidos.anchor.set(0.5);
        this.container.addChild(this.textoEnemigosAbatidos);
    }

    // async crearTextoDePuntajeMasAlto() {
    //     this.textoPuntajeMasAlto = new PIXI.Text({ text: "", style: this.fuenteTexto });
    //     this.textoPuntajeMasAlto.style.fontSize = 18;
    //     this.textoPuntajeMasAlto.anchor.set(0.5);

    //     this.container.x = this.juego.width - 300;
    //     this.container.y = this.juego.height - 415;
    //     this.container.zIndex = 6000;

    //     this.container.addChild(this.textoPuntajeMasAlto);
    // }
    //---------------------------------------

    resize() {
        this.container.zIndex = 1100;
    }

    actualizarContadorDeEnemigosMuertos() {
        this.textoEnemigosAbatidos.text = this.juego.enemigosMuertos.length.toString();
        this.actualizarTamPosYZindexSiPerdio();
    }

    // actualizarPuntajeMasAlto() {
    //     this.textoPuntajeMasAlto.text = this.juego.enemigosMuertos.length.toString(); //para probar
    // }

    //actualizar tamaño, posicion y zindex del texto enemigos muertos.
    actualizarTamPosYZindexSiPerdio() {
        if (this.juego.menu.pantallaActual.texture == this.juego.pantallas[5]) {
            this.textoEnemigosAbatidos.style.fontSize = 18;

            this.container.x = this.juego.width - 300;
            this.container.y = this.juego.height - 415;
            this.container.zIndex = 6000;
        }
        else {
            this.fuenteTexto = {
                fontSize: 30,
                fontFamily: "PixelifySans",
                fill: 0xffffff,
                fontWeight: "bold",
                stroke: { color: 0x444444, width: 3 },
                align: "center"
            }

            this.container.x = this.juego.width - 50;
            this.container.y = this.juego.height - 475;
            this.container.zIndex = 1100;
        }
    }

    tick() {
        if (!this.textoEnemigosAbatidos) return;
        // this.actualizarPuntajeMasAlto();
        this.actualizarContadorDeEnemigosMuertos();
        
    }
}