class Aliado extends ObjetoDinamico {
    sprite;
    enemigo;
    // distanciaParaLlegar = 300;
    constructor(x, y, juegoPrincipal, width, height, radioColision, radioVisionX, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.factorSeparacion = 0.5;

        //Seteo de visión y detección visual lejana del Aliado (tanto en x como en y):
        // this.radioVision = radioVision;
        this.radioVisionX = radioVisionX;
        this.radioDeteccionLejanaX = radioVisionX + 200;
        this.radioVisionY = this.height + 10;
        this.radioDeteccionLejanaY = this.radioVisionY + 20;


        //planteo de radios para el seguimiento al líder:

        //radio resultante entre la visión cercana en x e y (usado para el sistema de seguimiento al lider):
        this.radioPromedialDeVisionCercana = (this.radioVisionX + this.radioVisionY) / 2;

        this.radioDeLlegadaAlLider = 30; //Radio que se usará para empezar a desacelerar al pj cuando esté llegando al lider.
        this.radioParaBajarLaVelocidad = this.radioPromedialDeVisionCercana * 0.5; //Radio intermedio en donde el aliado va a empezar a bajar la velocidad, ya que se está acercando al lider.
        this.factorSeguirAlLider = 0.63;

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

    separacion() {
        /**
            ALGORITMO DE SEPARACIÓN (BOIDS - Craig Reynolds)
        
            Objetivo: Evitar colisiones manteniendo distancia mínima entre agentes
            
            Proceso:
                1. Detectar TODAS las personas (amigos y enemigos) muy cercanas
                2. Zona crítica: radio * 1.5 (zona de colisión inminente)
                3. Calcular centro de masa de los agentes cercanos
                4. Generar fuerza de repulsión: fuerza = posición_actual - CM_cercanos
            
            Características:
                - Prioridad máxima (se ejecuta primero en tick())
                - Afecta a todos los agentes sin distinción de bando
                - Previene superposición y aglomeración excesiva
        
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

    seguirAlLider() {

        /*
            SISTEMA DE SEGUIMIENTO AL LÍDER:
            Sistema similar al de cohesión para BOIDS, con el cambio de que, en este caso, no se tratan 
            de seguir a sí mismos prediciendo su centro de masa promedial futuro sino que todos siguen a un mismo 
            personaje, el líder.

            PASOS:
            0. Consultar la existencia del jugador para evitar errores.
            1. Calcular la distancia para llegar al líder, así pudiendo tener un panorama sobre cómo 
            seguir.
            2. Si este está demasiado lejos, no lo siguen y corta ahí la ejecución.
            3. Si no pasa ese corte, se toma la diferencia entre posiciones de la instancia actual con la 
            del líder. (Tanto en x como en y)
            4. Se genera un vector de espacio personal con el lider, el cual decide que tan cerca o lejos 
            quiere a su escuadrón (guardando, obviamente, los valores anteriormente recabados).
            5. Se normaliza dicho vector para una mayor facilidad de comprensión.
            6. Si están muy cerca, este vector se ve afectado por el radio de llegada y la distancia para 
            llegar al lider (tanto en x como en y).
            7. Si está en un punto intermedio, corta la ejecución del código (gracias al return, igual 
            probar comentando el return);
            8. Si está lejos, no pasa nada.
            9. Y, por último, este vector de espacio personal con el lider se suma, junto al factor de interés, 
            a la aceleración de la instancia actual. (Para mayor dinamismo, se podría poner alguna condición o 
            clase extra que, cuando tenga poca vida el pj, sume 0.1 factor extra, osease, que cuando tenga 
            menos vida, quiera estar más al lado del jugador/líder).
        */
        if (!this.juego.jugador) return;

        const distanciaParaLlegarAlLider = calcularDistancia(this.posicion, this.juego.jugador.posicion);

        if (distanciaParaLlegarAlLider > this.radioPromedialDeVisionCercana) return; //en caso de estar demasiado lejos, no lo siguen.

        const difX = this.juego.jugador.posicion.x - this.posicion.x;
        const difY = this.juego.jugador.posicion.y - this.posicion.y;

        let vectorDeEspacioPersonalConLider = {
            x: difX,
            y: difY
        }

        vectorDeEspacioPersonalConLider = limitarVector(vectorDeEspacioPersonalConLider, 1);

        if (distanciaParaLlegarAlLider < this.radioDeLlegadaAlLider) {
            //esta muy cerca, se aleja
            vectorDeEspacioPersonalConLider.x *= -this.radioDeLlegadaAlLider / distanciaParaLlegarAlLider;
            vectorDeEspacioPersonalConLider.y *= -this.radioDeLlegadaAlLider / distanciaParaLlegarAlLider;
        } else if (distanciaParaLlegarAlLider < this.radioParaBajarLaVelocidad && distanciaParaLlegarAlLider > this.radioDeLlegadaAlLider) {
            //si estoy a una distancia intermedia (onda, q no es al lao pero tampoco taan lejos).
            return;

            // Reducción más pronunciada cuando están muy cerca
            const factor = (distanciaParaLlegarAlLider / this.radioParaBajarLaVelocidad) ** 3;

            vectorDeEspacioPersonalConLider.x *= factor;
            vectorDeEspacioPersonalConLider.y *= factor;
        } else if (distanciaParaLlegarAlLider < this.radioPromedialDeVisionCercana && distanciaParaLlegarAlLider > this.radioParaBajarLaVelocidad) {
            //esta lejos, va de una (nos re vimos locooo)
        }

        this.aceleracion.x += vectorDeEspacioPersonalConLider.x * this.factorSeguirAlLider;
        this.aceleracion.y += vectorDeEspacioPersonalConLider.y * this.factorSeguirAlLider;
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

    // obtenerPosicionXParaBala() {
    //     return this.x + 10;
    // }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    update() {
        this.fsm.update();
    }

    tick() {
        this.verificarSiMori();
        if (this.verificacionDeLimites()) {
            this.separacion();
        }
        this.seguirAlLider();
        this.update();
        this.aplicarFisica();
        this.render();
    }
}