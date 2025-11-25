class Aliado extends ObjetoDinamico {
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
        this.fuerza = 1;

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        this.generarNombreAleatorio();
        this.cargarSpriteAnimado();
    }

    listaDeSpritessheetsDisponibles() {
        return this.juego.spritesheetsAliados;
    }

    asignarTargetA(alguien) {
        this.enemigo = alguien
    }

    mensajeDeMuerte() {
        return console.log("El aliado ", this.nombreCompleto, " ha muerto")
    }

    direccionDeAvance() {
        return 1;
    }

    obtenerLista() {
        return this.juego.enemigos;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    tick() {
        this.verificarSiMori();
        this.decidirAtacarOAvanzar();
        this.aplicarFisica();
        this.render();
    }
}