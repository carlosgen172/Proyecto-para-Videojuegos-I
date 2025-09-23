class Juego {
    pixiApp;
    width;
    height;

    constructor() {
        this.width = innerWidth;
        this.height = innerHeight;
        this.initPIXI();
    }

    async initPIXI() {
        const preconfiguraciones = {
            background: "#4158daff",
            width: this.width,
            height: this.height,
        };

        //creamos la aplicacion de pixi y la guardamos en el atributo pixiApp
        this.pixiApp = new PIXI.Application(preconfiguraciones);
        await this.pixiApp.init(preconfiguraciones);

        //poner el canvas en absoluto, esto hace que se adecue al tamaño de la ventana.
        //siempre que se cambia el tamaño, hay que actualizar la pestaña.
        this.pixiApp.renderer.canvas.style.position = "absolute";

        document.body.appendChild(this.pixiApp.canvas);

        //crear jugador
        const jugador = new Jugador(this.pixiApp, 200, 300)
    }
}

new Juego();