class BotonMenu extends Boton {
    botonActual;
    texturaDeBotonActual;
    presionado = false;
    constructor(x, y, juego, width, height, listaDeTexturas, pantallaDestino) {
        super(x, y, juego, width, height);
        this.spritesDisponibles = listaDeTexturas;
        this.pantallaDestino = pantallaDestino;

        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;
    }

    async init() {
        this.texturaDeBotonActual = this.spritesDisponibles[0];
        await this.generarSpriteDe(this.texturaDeBotonActual);

        this.botonActual = this.sprite;

        //activar interactividad
        this.botonActual.interactive = true;
        this.botonActual.buttonMode = true;

        //añadir eventos de interacción
        // CLICK
        this.botonActual.on("pointerdown", () => { this.onClick(); });

        this.botonActual.on("pointerup", () => { this.onClickUp(); });

        // HOVER (significa pasar el mouse por encima)
        this.botonActual.on("pointerover", () => { this.onHover(); });

        // LEAVE (significa sacar el mouse de encima)
        this.botonActual.on("pointerout", () => { this.onOut(); });

        //se guarda el tinte/opacidad original para luego modificarlo
        this.tintOriginal = this.sprite.tint;

        //variable bandera
        //this.cambioRealizado = false;
    }

    generarSpriteDe(unSprite) {
        //este console log sirve para ver cuántos hijos hay en el stage antes y después de agregar el sprite
        //console.log("Stage children antes:", this.juego.pixiApp.stage.children.length);
        this.sprite = new PIXI.Sprite(unSprite);

        this.sprite.anchor.set(0.5);

        //Ajuste de ubicacion
        this.sprite.x = 0;
        this.sprite.y = 0;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;

        this.sprite.zIndex = 1100;
        this.container.addChild(this.sprite);
        this.juego.pixiApp.stage.addChild(this.container);
        //este console log sirve para ver cuántos hijos hay en el stage antes y después de agregar el sprite
        //console.log("Stage children después:", this.juego.pixiApp.stage.children.length);

    }

    onClick() {
        this.botonActual.texture = this.spritesDisponibles[1];
        if (this.pantallaDestino == 0) {
            setTimeout(() => {
                this.juego.menu.cambiarPantalla(1);
                this.ocultarBoton();
            }, 250)

        }
        else if (!this.pantallaDestino == 0 && this.pantallaDestino == 2) {
            setTimeout(() => {
                this.juego.menu.ocultarPantalla();
                this.ocultarTodosLosBotones(this.juego.botones)
                this.juego.puedeJugar = true;
            }, 250)
        }
        else if (this.pantallaDestino == 3) {
            setTimeout(() => {
                this.juego.menu.cambiarPantalla(0);
                this.juego.botonJugar.aparecerBoton();
                // this.spritesDisponibles = this.juego.secuenciaBotonJugar;
                // this.pantallaDestino = this.juego.botonJugar.pantallaDestino;
                //this.juego.botonJugar.botonActual.texture = this.spritesDisponibles[0];
            }, 250)
        }
        // setTimeout(() => {
        //     this.juego.menu.ocultarPantalla();
        // }, 1000)
    }

    onClickUp() {
        this.botonActual.texture = this.spritesDisponibles[0];
    }

    onHover() {
        this.sprite.tint = 0xBBBBBB;
        //cambiar solo a la pantalla asignada a este boton
        if (!this.juego.menu.texturaDePantallaActual == this.juego.pantallas[4]) {
            this.juego.menu.cambiarPantalla(this.pantallaDestino);
        }
    }

    onOut() {
        this.sprite.tint = this.tintOriginal;
    }

    cambiarDeEsteBotonA(unBoton) {
        this.spritesDisponibles = unBoton.listaDeTexturas;
        this.pantallaDestino = unBoton.pantallaDestino;
    }

    ocultarBoton() {
        this.container.visible = false;
    }

    aparecerBoton() {
        this.container.visible = true;
    }

    moverBotonAdelante() {
        this.container.zIndex = 6000;
    }

    ocultarTodosLosBotones(listaDeBotones) {
        for (const boton of listaDeBotones) {
            boton.ocultarBoton();
        }
    }

    aparecerTodosLosBotones(listaDeBotones) {
        for (const boton of listaDeBotones) {
            boton.aparecerBoton();
        }
    }

    moverAdelanteTodosLosBotones(listaDeBotones) {
        for (const boton of listaDeBotones) {
            boton.moverBotonAdelante();
        }
    }
}