class Enemigo extends ObjetoDinamico {
    sprite;
    enemigoDeBandoContrario;
    distanciaParaLlegar = 300;
    constructor(x, y, juego, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, velMaxima, aceleracion, acelMaxima, scaleX) {
        super(x, y, juego, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.velMaxima = velMaxima;
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.acelMaxima = acelMaxima;
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.scale.x = this.scaleX;

        //Añadir el sprite dentro del stage:
        this.juego.stage.addChild(this.sprite);
    }

    actualizarPosDelSpriteSegunPosDelObjeto(){
        this.sprite.x = this.posicion.x;
        this.sprite.y = this.posicion.y;
    }

    aplicarFisicaNueva() {
          /**
            * SISTEMA DE FÍSICA ESTABLE CON DELTATIME
            
            * Limitamos deltaTime para evitar inestabilidad cuando los FPS bajan:
            * - FPS normales (60): deltaTime ≈ 1
            * - FPS bajos (15): deltaTime ≈ 4 → limitado a 3
            * - Esto previene saltos extremos en la simulación física
        */
        const deltaTime = Math.min(this.juego.ticker.deltaTime, 3);

        //Aplicamos y limitamos las fuerzas acumuladas:
        this.limitarAceleracion();
        // Integración de Euler: v = v₀ + a×Δt (para predecir el siguiete punto por el cual el bot se va a mover, prediciendo la velocidad siguiente según la aceleración)
        this.velocidad.x -= this.aceleracion.x * deltaTime;
        //this.velocidad.y += this.aceleracion.y * deltaTime;
        
        // Se resetea la aceleración para el proximo frame:
        this.aceleracion.x = 0;
        this.aceleracion.y = 0;

        // PASO 2: Aplicar modificadores de velocidad
        //this.aplicarFriccion(); // Resistencia al movimiento
        this.limitarVelocidad(); // Velocidad terminal

        // PASO 3: Integrar posición: x = x₀ + v×Δt (se calcula la siguiete posición según la velocidad del objeto)
        this.posicion.x -= this.velocidad.x * deltaTime;
        //this.posicion.y += this.velocidad.y * deltaTime;

         // PASO 4: Calcular ángulo de movimiento usando arctangente
        // atan2(y,x) nos da el ángulo en radianes del vector velocidad
        this.calcularAnguloDeMovimiento();
    }

    asignarTargetA(alguien) {
        this.enemigo = alguien
    }

    detenerAlEncontrarEnemigo() {
        if (!this.enemigo) return ;
        if (!this.enemigo in this.juegoPrincipal.aliados) return ;
        const distanciaDeEnemigo = calcularDistancia(this, this.enemigo)
        if(distanciaDeEnemigo > this.radioVision) return ;

        // Decaimiento exponencial: va de 1 a 0 a medida que se acerca
        let factor = Math.pow(dist / this.distanciaParaLlegar, 3);

        const difX = this.target.posicion.x - this.posicion.x;
        const difY = this.target.posicion.y - this.posicion.y;

        let vectorTemporal = {
            x: -difX,
            y: -difY,
        };
        vectorTemporal = limitarVector(vectorTemporal, 1);

        this.aceleracion.x += -vectorTemporal.x * factor;

        this.aplicarFriccion()
    }

    render() {
        this.actualizarPosDelSpriteSegunPosDelObjeto()
        this.aplicarFisicaNueva();
    }

    tick() {
        this.render();
        this.detenerAlEncontrarEnemigo()
    }
}