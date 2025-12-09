class ObjetoDinamico extends GameObject {
    limiteSuperior = this.juego.height - 300;
    limiteInferior = this.juego.height - 100;
    radioColision;
    radioVision;
    velocidadMaxima = 0.8;
    aceleracionMaxima = 0.2;
    vida;
    fuerza;
    tengoAlgunEnemigoAdelante;
    enemigoMasCerca;
    

    //CONSTRUCTOR/INICIADOR:

    constructor(x, y, juegoPrincipal, width, height) {
        super(x, y, juegoPrincipal);
        this.posicion = { x: x, y: y };
        this.width = width;
        this.height = height;
        this.vida = 100;
        //this.fuerza = 10;
        // this.delayAtaque = 100;
        this.delayAtaque = 1000;
        this.nivelesDeIra = [1, 2, 3, 4, 5]
        this.nivelDeIraReal = seleccionarElementoAleatorioDe_(this.nivelesDeIra)
        this.estoyMuerto = false;
        // this.ultimoGolpe = 0;
        this.ultimoDisparo = 0;
        this.tengoAlgunEnemigoAdelante = false;
        this.enemigoMasCerca = null;

        this.container = new PIXI.Container();
        this.container.name = this.constructor.name;
        // this.juego.pixiApp.stage.addChild(this.container);
        this.juego.containerPrincipal.addChild(this.container);
    }

    //SISTEMA DE CARGA/GENERACIÓN DE SPRITESHEETS:
    async cargarSpriteAnimado() {
        if (this.constructor.name == "Jugador") {
            this.animacionesPersonaje = await PIXI.Assets.load("imagenes/Jugador/json/texture.json")
        }
        else if (this.constructor.name == "Enemigo") {
            this.animacionesPersonaje = this.elegirSpritesheetAleatorio();
        }
        else if (this.constructor.name == "Aliado") {
            this.animacionesPersonaje = this.elegirSpritesheetAleatorio();
        }

        else {
            console.log("error: no existe spritesheet para este objeto")
        }
        this.spritesAnimados = {};
        this.cargarSpritesAnimados(this.animacionesPersonaje);
        this.cambiarAnimacion("correr", true);
    }

    //se cambia la animacion y se determina si se repite o no
    cambiarAnimacion(cual, loop) {
        //hacemos todos invisibles
        for (let key of Object.keys(this.spritesAnimados)) {
            this.spritesAnimados[key].visible = false;
        }
        //y despues hacemos visible el q queremos
        this.spritesAnimados[cual].visible = true;
        this.spritesAnimados[cual].loop = loop;

        this.animacionActual = cual; //para debuggin, te dice el nombre de la animación actual del pj que selecciones
        this.spritesheetsActuales = this.spritesAnimados[cual]; //En caso de querer referirse más fácilmente a la animación actual.
    }

    cargarSpritesAnimados(textureData) {
        for (let key of Object.keys(textureData.animations)) {
            this.spritesAnimados[key] = new PIXI.AnimatedSprite(
                textureData.animations[key]
            );
            this.spritesAnimados[key].play();
            this.spritesAnimados[key].loop = true;
            this.spritesAnimados[key].animationSpeed = 0.1;
            this.spritesAnimados[key].scale.set(2);
            this.spritesAnimados[key].anchor.set(0.5, 1);

            this.container.addChild(this.spritesAnimados[key]);
        }
    }

    listaDeSpritessheetsDisponibles() {
        //elegir entre los spritesheets disponibles segun la subclase
    }

    elegirSpritesheetAleatorio() {
        const sheet = seleccionarElementoAleatorioDe_(this.listaDeSpritessheetsDisponibles());
        return sheet;
    }

    /*
    generarSpriteDe(unSprite) {
        //Aún no se genera un sprite
    }
    */

    // generarAreaDeColision() {
    //     //Aun no se genera nada.
    // }

    separacion() {
        //Aún no se genera ninguna lógica.
    }

    //SISTEMA DE PELEA:

    puedeGolpear() {
        return (performance.now() > this.delayAtaque + this.ultimoGolpe)
    }

    pegar(unEnemigo) {
        if (!this.puedeGolpear()) return;
        // this.cambiarAnimacion("atacar", true);
        unEnemigo.vida = Math.max(unEnemigo.vida - this.verCuantaFuerzaTengo(), 0);
        this.ultimoGolpe = performance.now();
    }

    verCuantaFuerzaTengo() {
        return this.fuerza * this.nivelDeIraReal;
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

    recibirDaño() {
        if (this.estoyMuerto) return;
        this.vida -= 25;
    }

    puedoDisparar() {
        return (performance.now() > this.delayAtaque + this.ultimoDisparo);
    }

    // dispararA(unEnemigo) {
    dispararAEnemigo() {
        if (!this.puedoDisparar()) return;
        // this.cambiarAnimacion("atacar",  true);

        this.juego.realizarDisparo(this);
        // if (this.balaActual.haColisionadoConAlguien()) {
        //     unEnemigo.vida = Math.max(unEnemigo.vida - this.verCuantaFuerzaTengo(), 0);
        // }
        this.ultimoDisparo = performance.now();
    }

    obtenerPosicionXParaBala() {
        console.log("Hay que poner esto dentro de las subclases.");
    }

    // realizarDisparo() {
    //     let balaActual = new BalaMejorada(
    //         (this.posicion.x /2), //posición en x
    //         (this.posicion.y /2) - (this.width/2), //posición en y
    //         this.juego, //juego.
    //         8, //ancho.
    //         8, //alto.
    //         0.7, //velocidad.
    //         1, //escala en x.
    //         this //persona que efectuo el disparo.
    //     );
    //     // this.balas.push(this.balaActual);
    //     this.balas.push(balaActual);
    // }

    // realizarTickPorCadaBala() {
    //     for (let bala of this.balas) {
    //         bala.tick();
    //     }
    // }

    direccionDeAvance() {
        console.log("Debe poner la dirección de avance en la subclase.");
    }

    obtenerLista() {
        throw new Error("Poner una lista a usar en el método obtenerLista() de la subclase.");
    }

    //esta funcion elige si avanzar o atacar segun si hay un enemigo cerca
    decidirAtacarOAvanzar() {
        //este for busca el enemigo más cercano y lo asigna como target
        for (const objetoDeLista of this.obtenerLista()) {
            const distanciaDeEnemigoEnX = calcularDistanciaEnX(this.posicion, objetoDeLista.posicion)
            const distanciaDeEnemigoEnY = calcularDistanciaEnY(this.posicion, objetoDeLista.posicion)
            if (distanciaDeEnemigoEnX < this.radioVision && distanciaDeEnemigoEnY < 50) {
                this.tengoAlgunEnemigoAdelante = true;
                this.enemigoMasCerca = objetoDeLista;
                break;
            }
        }

        //este condicional sirve para decidir si avanzar o atacar
        if (!this.tengoAlgunEnemigoAdelante && !this.estoyMuerto) {
            this.aceleracion.x = this.direccionDeAvance();
        }
        else if (this.tengoAlgunEnemigoAdelante && !this.estoyMuerto) {
            //if(enemigoMasCerca.verificarSiMori()) return;
            //this.cambiarAnimacion("atacar") //ataca, pero se queda colgado con un error en la visibilidad del sprite.

            this.aceleracion.x = 0;
            this.pegar(this.enemigoMasCerca);
            this.dispararA(this.enemigoMasCerca);

            this.cambiarAnimacion("atacar", false)
            this.cambiarAnimacion("correr", true);

            //la entidad golpea hasta que el enemigo muere, luego vuelve a avanzar
            this.tengoAlgunEnemigoAdelante = false;
            this.enemigoMasCerca = null;
        }
    }

    //ACTUALIZACION DE LA POSICION:

    //actualiza la posicion del contenedor segun la posicion del objeto dinamico
    actualizarPosDelContainerSegunPosDelObjeto() {
        if (!this.container) return;
        this.container.x = this.posicion.x;
        this.container.y = this.posicion.y;
    }

    //GENERACION DE NOMBRE ALEATORIO:   

    generarNombreAleatorio() {
        const nombreAleatorio = seleccionarElementoAleatorioDe_(this.juego.nombres)
        const apellidoAleatorio = seleccionarElementoAleatorioDe_(this.juego.apellidos)
        this.nombreCompleto = nombreAleatorio.toString() + " " + apellidoAleatorio.toString()
    }

    //SISTEMA DE MUERTE:

    verificarSiMori() {
        if (this.vida <= 0) {
            this.morir();
        }
        else if (this.container.x < -50 && this.constructor.name == "Enemigo") {
            this.morir();
        }
    }

    mensajeDeMuerte() {
        return "Una entidad ha muerto."
    }

    morir() {
        //este condicional previene que se ejecute más de una vez el código de muerte
        if (this.estoyMuerto) return;
        this.container.tint = 0xFFFFFF;

        //este condicional maneja la muerte según el tipo de entidad
        if (this.container.x < - 50 && this.constructor.name == "Enemigo") {
            this.cambiarAnimacion("morir", false);
            eliminarElElemento_DeLaLista_(this, this.juego.enemigos);

            //aca no pasan dos segundos porque sino hay un error en la animacion de la bateria
            this.container.visible = false;
            this.container.parent.removeChild(this.container);
            //console.log("se ha removido el contenedor", this.container);
            this.container.destroy({
                texture: false,
                baseTexture: false
            });
            this.container = null;
        }
        else if (this.constructor.name == "Enemigo") {
            this.juego.enemigosMuertos.push(this);
            this.cambiarAnimacion("morir", false);
            eliminarElElemento_DeLaLista_(this, this.juego.enemigos);

            //después de 2 segundos, remover el contenedor y destruirlo para liberar memoria
            setTimeout(() => {
                this.container.visible = false;
                this.container.parent.removeChild(this.container);
                //console.log("se ha removido el contenedor", this.container);
                this.container.destroy({
                    texture: false,
                    baseTexture: false
                });
                this.container = null;
            }, 2000);
        }
        else if (this.constructor.name == "Aliado") {
            this.cambiarAnimacion("morir", false);
            eliminarElElemento_DeLaLista_(this, this.juego.aliados);

            //después de 2 segundos, remover el contenedor y destruirlo para liberar memoria
            setTimeout(() => {
                this.container.visible = false;
                this.container.parent.removeChild(this.container);
                //console.log("se ha removido el contenedor", this.container);
                this.container.destroy({
                    texture: false,
                    baseTexture: false
                });
                this.container = null;
            }, 2000);
        }
        else if (this.constructor.name == "Jugador") {
            this.cambiarAnimacion("morir", false);
        }

        else if (this.constructor.name == "Avion") {
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
            this.juego.eliminarElElemento_DeLaLista_(this, this.juego.aviones);
        }
        else {
            console.log("no se pudo cargar el sprite/spritesheet, favor de verificar que el mismo se haya vinculado bien.")
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

    //LIMITES DE PANTALLA
    verificacionDeLimites() {
        if (this.estoyMuerto) return;
    
        let puedeSepararse = false;

        if(esEntre(this.posicion.y, this.limiteSuperior, this.limiteInferior)) {
            puedeSepararse = true;
        }
        else {
            puedeSepararse = false;
        }

        return puedeSepararse;
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