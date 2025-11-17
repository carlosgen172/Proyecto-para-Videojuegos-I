class ObjetoDinamico extends GameObject {
    radioColision;
    radioVision;
    velocidadMaxima;
    aceleracionMaxima;
    vida;
    fuerza;

    //CONSTRUCTOR/INICIADOR:

    constructor(x, y, juegoPrincipal, width, height) {
        super(x, y, juegoPrincipal);
        this.width = width;
        this.height = height;
        this.vida = 100;
        //this.fuerza = 10;
        this.delayAtaque = 500;
        this.nivelesDeIra = [1, 2, 3, 4, 5]
        this.nivelDeIraReal = this.juego.seleccionarElementoAleatorioDe_(this.nivelesDeIra)
        this.estoyMuerto = false;
        this.ultimoGolpe = 0;

        this.container = new PIXI.Container();
        this.juego.pixiApp.stage.addChild(this.container);
    }
    /*
    generarSpriteDe(unSprite) {
        //Aún no se genera un sprite
    }
    */

    //SISTEMA DE PELEA:

    puedeGolpear() {
        return (performance.now > this.delayAtaque + this.ultimoGolpe)
    }

    pegar(unEnemigo) {
        //unEnemigo.vida -= this.verCuantaFuerzaTengo();
        //if(unEnemigo.verificarSiMori()) return;
        //if(unEnemigo.vida == 0) return;
        //if (!this.puedeGolpear()) return;
        unEnemigo.vida = Math.max(unEnemigo.vida - this.verCuantaFuerzaTengo(), 0);
        // console.log("Le di una piña a", unEnemigo.nombreCompleto, ", sacándole", this.verCuantaFuerzaTengo(), "de vida, y dejándolo a", unEnemigo.vida, "de vida.");
        // console.log("y quedó con", unEnemigo.vida, "de vida.");
        if (unEnemigo.vida == 0) {
            //console.log("Yo,", this.nombreCompleto, "di de baja exitósamente a", unEnemigo.nombreCompleto, ".")
        }
        this.ultimoGolpe = performance.now();
    }

    verCuantaFuerzaTengo() {
        //return 10;
        return this.fuerza * this.nivelDeIraReal
    }

    recibirDañoDe(unEnemigo) {
        // if (!this.verificarSiEstoyMuerto()) {
        //if (!this.estoyMuerto()) {
        if (this.estoyMuerto) return;
        // this.vida -= unEnemigo.verCuantaFuerzaTengo()
        //this.vida = (this.vida - unEnemigo.verCuantaFuerzaTengo()).max(0)
        this.vida = Math.max(this.vida - unEnemigo.verCuantaFuerzaTengo(), 0)
        //}
    }

    actualizarPosDelSpriteSegunPosDelObjeto() {
        if (!this.container) return;
        this.container.x = this.posicion.x;
        this.container.y = this.posicion.y;
    }

    generarNombreAleatorio() {
        const nombreAleatorio = this.juego.seleccionarElementoAleatorioDe_(this.juego.nombres)
        const apellidoAleatorio = this.juego.seleccionarElementoAleatorioDe_(this.juego.apellidos)
        this.nombreCompleto = nombreAleatorio.toString() + " " + apellidoAleatorio.toString()
    }


    //SISTEMA DE VERIFICACIÓN DE MUERTE:

    verificarSiMori() {
        if (this.vida <= 0) {
            this.morir();
        }
    }

    mensajeDeMuerte() {
        return "Una entidad ha muerto."
    }

    obtenerLista() {
        throw new Error("Poner una lista a usar en el método obtenerLista() de la subclase.");
    }

    morir() {
        if (this.estoyMuerto) return;
        console.log(this.mensajeDeMuerte())

        let lista = this.obtenerLista();
        lista = lista.filter((p) => p !== this);
        //deshabilitar la visibilidad del sprite
        //if (lista = this.juego.enemigos) {
        if (this.constructor.name == "Enemigo") {
            //this.spritesAnimados.loop = false
            // this.juego.enemigos.filter((p) => p !== this)

            this.juego.enemigosMuertos.push(this);
            this.cambiarAnimacion("morir", false);

            setTimeout(() => {
                this.container.visible = false;
                this.container.parent.removeChild(this.container);
                this.container.destroy({
                    texture: false,
                    baseTexture: false
                });
                this.container = null;
                this.juego.eliminarElElemento_DeLaLista_(this, this.juego.enemigosMuertos); 
            }, 2000);

            //this.cantEnemigosMuertos += 1
            //this.spritesAnimados.visible = false
            //this.spritesAnimados.parent.removeChild(this.spritesAnimados);
            //this.spritesAnimados = null;
        } else {
            this.sprite.visible = false;
            //remover el sprite del contenedor
            this.sprite.parent.removeChild(this.sprite);

            //destruir el sprite para liberar memoria
            this.sprite.destroy({
                texture: false,
                baseTexture: false
            });

            //eliminar la referencia al sprite
            this.sprite = null;
        }

        this.estoyMuerto = true
    }

    //SISTEMA DE FÍSICA:

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

    //SISTEMA DE RENDERIZADO:

    render() {
        //aún no se hace nada
    }

    //SISTEMA DE ACTUALIZACIÓN DE PROPIEDADES Y ACCIONARES DE LA INSTANCIA.
    tick() {
        this.render();
    }
}