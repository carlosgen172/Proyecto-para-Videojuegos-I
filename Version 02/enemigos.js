class Enemigo extends ObjetoDinamico {
    sprite;
    enemigoDeBandoContrario;
    distanciaParaLlegar = 300;
    yaContado;
    // tengoAlgunEnemigoAdelante;
    // enemigoMasCerca;
    constructor(x, y, juegoPrincipal, width, height, radioColision, radioVisionX, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.factorSeparacion = 0.5;

        //Seteo de visión y detección visual lejana del Enemigo (tanto en x como en y):
        // this.radioVision = radioVision;
        this.radioVisionX = radioVisionX;
        this.radioDeteccionLejanaX = radioVisionX + 100;
        this.radioVisionY = this.height + 20;
        this.radioDeteccionLejanaY = this.radioVisionY + 20;

        //Seteo de velocidad y aceleración del pj:
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²

        //Seteo de su escala en X:
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        //Seteo de su fuerza:
        this.fuerza = 0.5;


        //this.cantEnemigosMuertos = 0;
        // this.tengoAlgunEnemigoAdelante = false;
        // this.enemigoMasCerca = null;
        
        //Cargo todos sus sprites animados (antes del fsm ya que este los necesita ya planteados):
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

        // console.log(this.nombreCompleto, "se ha generado.")
        //console.log(this.nombreCompleto, "se ha generado, siendo un ", this.constructor.name, " con un nivel de ira de", this.nivelDeIraReal, ".")
    }

    listaDeSpritessheetsDisponibles() {
        return this.juego.spritesheetsEnemigos;
    }

    // generarAreaDeColision() {
        
    //     this.areaDeColision = new PIXI.Graphics();

    //     //se crea un area invisible:
    //     this.areaColision = new PIXI.Graphics();

    //     //linea de color negro
    //     this.areaColision.lineStyle(1, 0x000000);

    //     // color rojo transparente
    //     this.areaColision.beginFill(0xFF0000, 0.0);

    //     // Dibujar un círculo en la posición (100, 100) con un radio de 50
    //     this.areaColision.drawCircle(this.x, this.y - 2, this.radioColision);

    //     // Finalizar el relleno
    //     this.areaColision.endFill();

    //     //Y lo añade al container:
    //     //this.juegoPrincipal.pixiApp.stage.addChild(this.areaColision);
    //     this.container.addChild(this.areaColision);
    //     this.areaColision.visible = false;
    // }

    separacion() {
        /**
         * ALGORITMO DE SEPARACIÓN (BOIDS - Craig Reynolds)
         *
         * Objetivo: Evitar colisiones manteniendo distancia mínima entre agentes
         *
         * Proceso:
         * 1. Detectar TODAS las personas (amigos y enemigos) muy cercanas
         * 2. Zona crítica: radio * 1.5 (zona de colisión inminente)
         * 3. Calcular centro de masa de los agentes cercanos
         * 4. Generar fuerza de repulsión: fuerza = posición_actual - CM_cercanos
         *
         * Características:
         * - Prioridad máxima (se ejecuta primero en tick())
         * - Afecta a todos los agentes sin distinción de bando
         * - Previene superposición y aglomeración excesiva
        
         */

        let cont = 0; //Contador de personas que se encuentran demasiado cerca.
        let vectorPromedioDePosiciones = { x: 0, y: 0 }; //Se inicializa un vector el cual nos servirá para indicar a la entidad en que sentido evitar a su/s allegado/s.

        // Detectar TODOS los agentes cercanos (sin importar equipo)
        for (const persona of this.juego.personas) {
            if (persona !== this) {
            const distanciaEntrePersona = calcularDistancia(this.posicion, persona.posicion); //Se calcula la distancia de la instancia contra la allegada, para ver si es necesario repelerla.
            // Zona crítica de separación
            if (distanciaEntrePersona < this.radioColision * 1.5) {
                cont++; //Suma 1 al contador de gente cercana.
                vectorPromedioDePosiciones.x += persona.posicion.x; //Hace que dicho vector sume la posición de la persona
                vectorPromedioDePosiciones.y += persona.posicion.y; //Lo mismo, pero en este caso para el eje y.
            }
            }
        }
        if (cont == 0) return; // No hay agentes demasiado cerca, entonces corta el código.

        // Centro de masa de los agentes cercanos (se divide según la cantidad de personas, para sacar un promedial entre ellas)
        vectorPromedioDePosiciones.x /= cont;
        vectorPromedioDePosiciones.y /= cont;

        // Vector de repulsión (vector que ayuda a repeler el centro de masa de cada objeto)
        let vectorRepulsivo = { //Inicializado en base a la posición de la instancia menos el punto promedial de las entidades cercanas.
            x: this.posicion.x - vectorPromedioDePosiciones.x,
            y: this.posicion.y - vectorPromedioDePosiciones.y,
        };

        // Normalizar y aplicar factor de separación
        vectorRepulsivo = limitarVector(vectorRepulsivo, 1);
        this.aceleracion.x += this.factorSeparacion * vectorRepulsivo.x;
        this.aceleracion.y += this.factorSeparacion * vectorRepulsivo.y;
        
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

    obtenerPosicionXParaBala() {
        return this.x - 20;
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
        if (this.verificacionDeLimites()) {
            this.separacion();
        }
        this.realizarTickPorCadaBala();
        this.update();
        this.aplicarFisica();
        this.render();
    }
}