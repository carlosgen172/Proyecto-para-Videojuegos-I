class BotonMenu extends Boton {
    botonActual;
    texturaDeBotonActual;
    presionado = false;
    constructor(x, y, juego, width, height, listaDeTexturas, pantallaDestino) {
        super(x, y, juego, width, height);
        this.spritesDisponibles = listaDeTexturas;
        this.pantallaDestino = pantallaDestino;
        this.container = new PIXI.Container();
        this.container.name = this.constructor.name;
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

    async generarSpriteDe(unSprite) {
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

    //IMPORTANTE: leer para entender el funcionamiento de los botones

    /*
        La textura del boton cambiará dependiendo de la listaDeTexturas.
        A ésta se la pasara como parametro una lista de sprites para
        que éste pueda tener una animación de PRESIONADO.

        this.spritesDisponibles[0] = boton NO está presionado.
        this.spritesDisponibles[1] = el boton SI está presionado.

        --------------------------------------------

        La pantallaDestino es un parámetro que se le pasa un número y
        ese número es la posición de una de las pantallas a la cual
        se deberá dirigir con el cambiarPantalla(unNumero) de la clase
        MENU. La lista de pantallas se verá reflejada en la clase JUEGO
        con el atributo this.juego.pantallas.

        Acá dejo una lista de posiciones manejadas de la misma forma
        tanto para this.juego.pantallas como para
        this.juego.menu.cambiarPantalla(unNumero):

        0 = menu SÓLO con boton JUGAR
        1 = menu con botones SEGUIR, NUEVA, VOLVER con CAMBIO DE MENSAJE refiriendo a SEGUIR
        2 = menu con los 3 botones pero con CAMBIO DE MENSAJE refiriendo a NUEVA
        3 = menu con los 3 botones pero con CAMBIO DE MENSAJE refiriendo a VOLVER
        4 = menu de PAUSA con botones SEGUIR, VOLVER

        CAMBIO DE MENSAJE: proporcionamos un mensaje en la esquina
        inferior derecha que cambiará según el botón que el mouse
        pase por encima.

    */
    onClick() {
        this.botonActual.texture = this.spritesDisponibles[1];
        if (this.pantallaDestino == 0) {
            setTimeout(() => {
                this.juego.menu.cambiarPantalla(1);
                this.ocultarBoton();
            }, 250)
        }
        else if (this.pantallaDestino == 2) {
            setTimeout(() => {
                this.juego.menu.ocultarPantalla();
                this.ocultarTodosLosBotones(this.juego.botones)
                this.juego.puedeJugar = true;
                this.juego.start();
            }, 250)
        }
        else if (this.pantallaDestino == 3) {
            setTimeout(() => {
                this.juego.botonJugar.aparecerBoton();
                this.juego.botonJugar.moverBotonAdelante();
                this.juego.menu.cambiarPantalla(0);
            }, 250)
        }
        else if (this.pantallaDestino == 1 && this.juego.menu.pantallaActual.texture == this.juego.pantallas[4]) {
            setTimeout(() => {
                this.juego.menu.ocultarPantalla();
                this.ocultarTodosLosBotones(this.juego.botones)
                this.juego.puedeJugar = true;
            }, 250)
        }
        else if (this.juego.menu.pantallaActual.texture == this.juego.pantallas[5] && this.pantallaDestino == 3) {
            this.juego.botonJugar.aparecerBoton();
            this.juego.botonJugar.moverBotonAdelante();
            this.juego.menu.cambiarPantalla(0);
        }
    }

    onClickUp() {
        this.botonActual.texture = this.spritesDisponibles[0];
    }

    onHover() {
        this.sprite.tint = 0xBBBBBB;
        // this.style.cursor = 'pointer';
        //cambiar solo a la pantalla asignada a este boton (CAMBIO DE MENSAJE)
        // if (this.juego.menu.pantallaActual.texture !== this.juego.pantallas[4]) {
        //     this.juego.menu.cambiarPantalla(this.pantallaDestino);
        // }
        // else if (this.juego.menu.pantallaActual.texture !== this.juego.pantallas[5]) {
        //     this.juego.menu.cambiarPantalla(this.pantallaDestino);
        // }
        if (this.juego.menu.puedeCambiarPasandoMousePorArriba) {
            this.juego.menu.cambiarPantalla(this.pantallaDestino);
        }
    }

    onOut() {
        this.sprite.tint = this.tintOriginal;
        // this.style.cursor = 'auto';
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