class Jugador extends ObjetoDinamico {
    velocidadMaxima = 1.5;
    aceleracionMaxima = 0.5;
    
    constructor(x, y, juegoPrincipal, width, height, radioColision, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);

        //Sistema de colision
        this.radioColision = radioColision;
        this.factorSeparacion = 0.5;

        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²

        this.scaleX = scaleX || 1; //para hacer más ancho al pj
        
        this.fuerza = 1.5;
    }

    async start() {
        await this.cargarSpriteAnimado();
        this.container.zIndex = 1;
    }

    //-----------------------------------
    //MOVIMIENTO
    movimiento() {
        if (this.juego.keys["w"]) {
            this.aceleracion.y --;
        }
        if (this.juego.keys["a"]) {
            this.aceleracion.x --;
            this.spritesheetsActuales.scale.x = -this.scaleX 
        }
        if (this.juego.keys["s"]) {
            this.aceleracion.y ++;
        }
        if (this.juego.keys["d"]) {
            this.aceleracion.x ++;
            this.spritesheetsActuales.scale.x = this.scaleX;
        }
    }

    //SISTEMA DE SEPARACIÓN:
    separacion() {
        /*
            SISTEMA DE SEPARACIÓN (en base a lógica BOIDS, de Craig Reinolds)

            * Este sistema calcula la separación, tanto individual, como grupal entre entidades dentro 
            de un mismo plano, para que las mismas no se sobrepongan la una a la otra (evitan posibles 
            errores visuales y lógicos de colisión).
            
            PASOS:
            0. Inicializar un contador de entidades cercanas, y un vector que tomará todas las distancias de los elementos cercanos. 
            (Se inicializan con valores en 0, obviamente)
            1. Detectar a todas las entidades (sean del mismo bando o no) con el método de "calcularDistancia(obj1, obj2)".
            2. Calcular la distancia a la que se encuentran con respecto a la nuestra, usando lógica de vectores.
            3. En caso de estar demasiado cerca (radio de colisión más su mitad, osease, radioColisión * 1.5) 
            suma sus valores en x e y a un vector promedial. (es como cuando un circulo se come a otro en agar.io)
            4. En caso de que ninguno esté cerca, corta dicha lógica.
            5. Este vector promedial se divide en base a la cantidad de entidades que la componen (tanto en x como en y).
            6. El valor resultante se pasa a un nuevo vector, el cual se ubica en la posición en la que se encuentre 
            nuestra instancia menos los valores en x e y del vector promedial.
            7. Este vector se normaliza y pasa ser un valor entre 0 y 1, para que sea más sencillo de interpretar.
            8. Y de ahí, se aplica a la aceleración de nuestro personaje para afectar su movilidad de forma momentánea
            (corrigiendo su posición con respecto a las otras entidades).
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

    listaDeSpritessheetsDisponibles() {
        return this.juego.spritesheetsJugador;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    tick() {
        this.movimiento();
        this.separacion();
        this.aplicarFisica();
        this.render();
    }
}