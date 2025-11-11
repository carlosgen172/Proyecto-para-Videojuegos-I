class ObjetoDinamico extends GameObject {
    radioColision;
    radioVision;
    velocidadMaxima;
    aceleracionMaxima;

    constructor(x, y, juego, width, height) {
        super(x, y, juego);
        this.width = width;
        this.height = height;
    }
    /*
    generarSpriteDe(unSprite) {
        //Aún no se genera un sprite
    }
    */
    aplicarFisica() {
            /**
            * SISTEMA DE FÍSICA ESTABLE CON DELTATIME
            
            * Limitamos deltaTime para evitar inestabilidad cuando los FPS bajan:
            * - FPS normales (60): deltaTime ≈ 1
            * - FPS bajos (15): deltaTime ≈ 4 → limitado a 3
            * - Esto previene saltos extremos en la simulación física
        */
        const deltaTime = Math.min(this.juego.pixiApp.ticker.deltaTime, 3);

        //Aplicamos y limitamos las fuerzas acumuladas:
        this.limitarAceleracion();
        // Integración de Euler: v = v₀ + a×Δt (para predecir el siguiete punto por el cual el bot se va a mover, prediciendo la velocidad siguiente según la aceleración)
        this.velocidad.x += this.aceleracion.x * deltaTime;
        this.velocidad.y += this.aceleracion.y * deltaTime;
        
        // Se resetea la aceleración para el proximo frame:
        this.aceleracion.x = 0;
        this.aceleracion.y = 0;

        // PASO 2: Aplicar modificadores de velocidad
        this.aplicarFriccion(); // Resistencia al movimiento
        this.limitarVelocidad(); // Velocidad terminal

        // PASO 3: Integrar posición: x = x₀ + v×Δt (se calcula la siguiete posición según la velocidad del objeto)
        this.posicion.x += this.velocidad.x * deltaTime;
        this.posicion.y += this.velocidad.y * deltaTime;

         // PASO 4: Calcular ángulo de movimiento usando arctangente
        // atan2(y,x) nos da el ángulo en radianes del vector velocidad
        this.calcularAnguloDeMovimiento();
    }

    calcularAnguloDeMovimiento() {
        this.angulo = radianesAGrados(
            Math.atan2(this.velocidad.y, this.velocidad.x)
        );
    }

    limitarAceleracion() {
        /*
            * LIMITACIÓN DE ACELERACIÓN

            * Aplica el límite usando la magnitud del vector:
            * Si |a| > aₘₐₓ, entonces a = (a/|a|) × aₘₐₓ
            
            * Esto mantiene la dirección pero limita la intensidad
        */
        this.aceleracion = limitarVector(this.aceleracion, this.aceleracionMaxima);
    }

    limitarVelocidad() {
        this.velocidad = limitarVector(this.velocidad, this.velocidadMaxima);
    }

    aplicarFriccion() {
        /*
            * FRICCIÓN INDEPENDIENTE DEL FRAMERATE
            
            * Problema: La fricción simple (v *= 0.93) depende del FPS
            * - A 60 FPS: se aplica 60 veces por segundo
            * - A 30 FPS: se aplica 30 veces por segundo → fricción diferente
            
            * Solución: Convertir fricción por frame a fricción por tiempo
            
            * Fórmula: fricción_aplicada = fricción_base^(deltaTime/60)
            
            * Donde:
            * - fricción_base = 0.93^60 ≈ 0.122 (fricción por segundo a 60 FPS)
            * - deltaTime/60 = fracción de segundo transcurrido
            
            * Esto garantiza que la fricción sea consistente sin importar el FPS
        */
        const friccionPorFrame = 0.85;
        const friccionPorSegundo = Math.pow(friccionPorFrame, 60);
        const deltaTime = Math.min(this.juego.pixiApp.ticker.deltaTime, 3);
        const friccionAplicada = Math.pow(friccionPorSegundo, deltaTime / 60);

        this.velocidad.x *= friccionAplicada;
        this.velocidad.y *= friccionAplicada;
    }

    render() {
        //aún no se hace nada
    }

    tick() {
        this.render();
    }
}