class Enemigo extends ObjetoDinamico {
    sprite;
    enemigoDeBandoContrario;
    distanciaParaLlegar = 300;
    yaContado;
    // tengoAlgunEnemigoAdelante;
    // enemigoMasCerca;
    constructor(x, y, juegoPrincipal, width, height, radioColision, radioVision, velocidad, aceleracion, scaleX) {
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
        
        //Cargo todos sus sprites animados:
        this.cargarSpriteAnimado();
        
        //PARA LO DEL FSM:

        //Añado su FSM (máquina de estados finita, siendo ésta una lista vacía - inicialmente - donde se guardan todos sus posibles estados):
        this.fsm = new Fsm(this);

        //A dicha lista le añado sus posibles estados:
        this.fsm.anadir('Jugador_Marchante', new PjMarchante());
        this.fsm.anadir('Jugador_Alerta', new PjAlerta());
        this.fsm.anadir('Jugador_Agresivo', new PjEnojado());

        //Y seteo su estado inicial:
        this.fsm.setear('Jugador_Marchante');
        this.generarNombreAleatorio();
        // this.cargarSpriteAnimado();
        // console.log(this.nombreCompleto, "se ha generado.")
        //console.log(this.nombreCompleto, "se ha generado, siendo un ", this.constructor.name, " con un nivel de ira de", this.nivelDeIraReal, ".")
    }

    listaDeSpritessheetsDisponibles() {
        return this.juego.spritesheetsEnemigos;
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

    llevarAlFondo() {
        this.container.zIndex = 1;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto();
    }

    update() {
        this.fsm.update()
    }

    tick() {
        this.verificarSiMori();
        // this.decidirAtacarOAvanzar();
        // for (let bala in this.balas) {
        //     bala.tick();
        // }
        this.update();
        this.aplicarFisica();
        this.render();
    }
}