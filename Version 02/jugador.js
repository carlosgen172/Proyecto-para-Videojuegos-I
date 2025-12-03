class Jugador extends ObjetoDinamico {
    velocidadMaxima = 1.5;
    aceleracionMaxima = 0.5;
    sprite;
    enemigo;
    distanciaParaLlegar = 300;
    constructor(x, y, juegoPrincipal, width, height, radioColision, radioVision, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²
        this.scaleX = scaleX || 1; //para hacer más ancho al pj
        this.fuerza = 1.5;

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        this.generarNombreAleatorio();
    }

    async start() {
        await this.cargarSpriteAnimado();
    }

    //-----------------------------------
    //MOVIMIENTO
    movimiento() {
        if (this.juego.keys["w"]) {
            this.aceleracion.y --;
        }
        if (this.juego.keys["a"]) {
            this.aceleracion.x --;
        }
        if (this.juego.keys["s"]) {
            this.aceleracion.y ++;
        }
        if (this.juego.keys["d"]) {
            this.aceleracion.x ++;
        }
    }

    listaDeSpritessheetsDisponibles() {
        return this.juego.spritesheetsJugador;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    tick() {
        this.movimiento();
        this.aplicarFisica();
        this.render();
    }
}