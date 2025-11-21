class Enemigo extends ObjetoDinamico {
    sprite;
    enemigoDeBandoContrario;
    distanciaParaLlegar = 300;
    // tengoAlgunEnemigoAdelante;
    // enemigoMasCerca;
    constructor(x, y, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;
        this.fuerza = 0.5;
        //this.cantEnemigosMuertos = 0;
        // this.tengoAlgunEnemigoAdelante = false;
        // this.enemigoMasCerca = null;


        this.generarNombreAleatorio();
        this.cargarSpriteAnimado();
        // console.log(this.nombreCompleto, "se ha generado.")
        //console.log(this.nombreCompleto, "se ha generado, siendo un ", this.constructor.name, " con un nivel de ira de", this.nivelDeIraReal, ".")
    }


    asignarTargetA(alguien) {
        this.enemigo = alguien
    }

    mensajeDeMuerte() {
        return console.log("El enemigo ", this.nombreCompleto, " ha muerto")
    }

    direccionDeAvance() {
        return -1;
    }

    obtenerLista() {
        return this.juego.aliados;
    }

    render() {
        this.actualizarPosDelSpriteSegunPosDelObjeto()
    }

    tick() {
        this.verificarSiMori();
        this.decidirAtacarOAvanzar();
        this.aplicarFisica();
        this.render();
    }
}