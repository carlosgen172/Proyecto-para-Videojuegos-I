class BotonMenu extends Boton {
    botonActual;
    texturaDeBotonActual;
    constructor(x, y, juego, width, height) {
        super(x, y, juego, width, height);
        this.spritesDisponibles = this.juego.secuenciaBotonJugar;
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
        this.botonActual.on("pointerdown", () => {this.onClick();});

        // HOVER (significa pasar el mouse por encima)
        this.botonActual.on("pointerover", () => {this.onHover();});

        // LEAVE (significa sacar el mouse de encima)
        this.botonActual.on("pointerout", () => {this.onOut();});
    }

    // MÉTODOS DE INTERACCIÓN
    onClick() {
        
        // ejemplo: cambiar sprite
        this.texturaDeBotonActual = this.spritesDisponibles[1];
        //se genera de vuelta porque se cambió el sprite y hay que actualizar la imagen
        console.log("sprite actual del botón al hacer click:", this.texturaDeBotonActual);
        //una vez apretado el boton y si puedeJugar es false, se cambiara la pantalla y el boton actual
        if(!this.juego.puedeJugar) {
            setTimeout(() => {
                this.botonActual.visible = false;
            }, 500);
            console.log("comenzando el juego... con el boton actual en: ", this.botonActual.visible);
            this.juego.puedeJugar = true;
            this.juego.menu.cambioDePantallas();
        }
    }

    onHover() {
        // ejemplo: efecto visual
        this.sprite.alpha = 0.8;
    }

    onOut() {
        this.sprite.alpha = 1;
    }

}