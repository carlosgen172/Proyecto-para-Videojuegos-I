class Aliado extends ObjetoDinamico {
    sprite;
    enemigo;
    distanciaParaLlegar = 300;
    constructor(x, y, juegoPrincipal, width, height, radioColision, radioVisionX, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;

        //Seteo de visión y detección visual lejana del Aliado (tanto en x como en y):
        // this.radioVision = radioVision;
        this.radioVisionX = radioVisionX;
        this.radioDeteccionLejanaX = radioVisionX + 200;
        this.radioVisionY = this.height + 10;
        this.radioDeteccionLejanaY = this.radioVisionY + 20;

        //Seteo de velocidad y aceleración del pj:
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²

        //Seteo de su escala en X:
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //Seteo de su fuerza:
        this.fuerza = 1;

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        //cargo primero sus spritesheets (antes del fsm ya que este los necesita ya planteados):
        this.cargarSpriteAnimado();

        //FSM:

        //Añado su FSM (máquina de estados finita, siendo ésta una lista vacía - inicialmente - donde se guardan todos sus posibles estados):
        this.fsm = new Fsm(this);

        //A dicha lista le añado sus posibles estados:
        this.fsm.anadir('Jugador_Marchante', new PjMarchante());
        this.fsm.anadir('Jugador_Alerta', new PjAlerta());
        this.fsm.anadir('Jugador_Agresivo', new PjEnojado());

        //Y seteo su estado inicial:
        this.fsm.setear('Jugador_Marchante');

        //(Extra) Se genera un nombre aleatorio para el pj:
        this.generarNombreAleatorio();
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

    update() {
        this.fsm.update();
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