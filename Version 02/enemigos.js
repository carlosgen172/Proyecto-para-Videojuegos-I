//const { Children } = require("react");

class Enemigo extends ObjetoDinamico {
    sprite;
    enemigoDeBandoContrario;
    distanciaParaLlegar = 300;
    constructor(x, y, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, velMaxima, aceleracion, acelMaxima, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.velMaxima = velMaxima;
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²
        this.acelMaxima = acelMaxima;
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;
        this.fuerza = 5;




        this.generarNombreAleatorio();
        this.cargarSpriteAnimado();
        // console.log(this.nombreCompleto, "se ha generado.")
        console.log(this.nombreCompleto, "se ha generado, siendo un ", this.constructor.name, " con un nivel de ira de", this.nivelDeIraReal, ".")
    }

    async cargarSpriteAnimado() {
        const animacionesPersonaje1 = await PIXI.Assets.load("imagenes/Enemigos/Scarab/texture.json");
        console.log("animaciones personaje 1:", animacionesPersonaje1);
        this.spritesAnimados = {};
        this.cargarSpritesAnimados(animacionesPersonaje1);
        this.cambiarAnimacion("correr");
    }

    cambiarAnimacion(cual) {
        //hacemos todos invisibles
        for (let key of Object.keys(this.spritesAnimados)) {
            this.spritesAnimados[key].visible = false;
        }
        //y despues hacemos visible el q queremos
        this.spritesAnimados[cual].visible = true;
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

    // generarSpriteDe(unSprite) {
    //     this.sprite = new PIXI.Sprite(unSprite);

    //     this.sprite.anchor.set(0.5);

    //     //Ajuste de ubicacion
    //     this.sprite.x = this.x;
    //     this.sprite.y = this.y;

    //     //Ajuste de tamaño
    //     this.sprite.width = this.width;
    //     this.sprite.height = this.height;
    //     this.sprite.scale.x = this.scaleX;

    //     //Añadir el sprite dentro del stage:
    //     this.juego.pixiApp.stage.addChild(this.sprite);
    // }

    // aplicarFisicaNueva() {
    //     /**
    //         * SISTEMA DE FÍSICA ESTABLE CON DELTATIME

    //         * Limitamos deltaTime para evitar inestabilidad cuando los FPS bajan:
    //         * - FPS normales (60): deltaTime ≈ 1
    //         * - FPS bajos (15): deltaTime ≈ 4 → limitado a 3
    //         * - Esto previene saltos extremos en la simulación física
    //     */
    //     const deltaTime = Math.min(this.juego.pixiApp.ticker.deltaTime, 3);

    //     //Aplicamos y limitamos las fuerzas acumuladas:
    //     this.limitarAceleracion();
    //     // Integración de Euler: v = v₀ + a×Δt (para predecir el siguiete punto por el cual el bot se va a mover, prediciendo la velocidad siguiente según la aceleración)
    //     this.velocidad.x -= this.aceleracion.x * deltaTime;
    //     //this.velocidad.y += this.aceleracion.y * deltaTime;

    //     // Se resetea la aceleración para el proximo frame:
    //     this.aceleracion.x = 0;
    //     this.aceleracion.y = 0;

    //     // PASO 2: Aplicar modificadores de velocidad
    //     //this.aplicarFriccion(); // Resistencia al movimiento
    //     this.limitarVelocidad(); // Velocidad terminal

    //     // PASO 3: Integrar posición: x = x₀ + v×Δt (se calcula la siguiete posición según la velocidad del objeto)
    //     this.posicion.x -= this.velocidad.x * deltaTime;
    //     //this.posicion.y += this.velocidad.y * deltaTime;

    //      // PASO 4: Calcular ángulo de movimiento usando arctangente
    //     // atan2(y,x) nos da el ángulo en radianes del vector velocidad
    //     this.calcularAnguloDeMovimiento();
    // }

    asignarTargetA(alguien) {
        this.enemigo = alguien
    }

    // detenerAlEncontrarEnemigo() {
    //     if (!this.enemigo) return ;
    //     if (!this.enemigo in this.juegoPrincipal.aliados) return ;
    //     const distanciaDeEnemigo = calcularDistancia(this, this.enemigo)
    //     if(distanciaDeEnemigo > this.radioVision) return ;

    //     // Decaimiento exponencial: va de 1 a 0 a medida que se acerca
    //     let factor = Math.pow(dist / this.distanciaParaLlegar, 3);

    //     const difX = this.target.posicion.x - this.posicion.x;
    //     const difY = this.target.posicion.y - this.posicion.y;

    //     let vectorTemporal = {
    //         x: -difX,
    //         y: -difY,
    //     };
    //     vectorTemporal = limitarVector(vectorTemporal, 1);

    //     this.aceleracion.x += -vectorTemporal.x * factor;

    //     this.aplicarFriccion()
    // }

    mensajeDeMuerte() {
        return console.log("El enemigo ", this.nombreCompleto, " ha muerto")
    }

    obtenerLista() {
        return this.juego.enemigos;
    }

    // morir() {
    //     if (this.estoyMuerto) return;
    //     console.log("El enemigo ", this.nombreCompleto," ha muerto")
    //     this.juego.enemigos = this.juego.enemigos.filter((p) => p !== this);
    //     //deshabilitar la visibilidad del sprite
    //     this.sprite.visible = false;

    //     //remover el sprite del contenedor
    //     this.sprite.parent.removeChild(this.sprite);

    //     //destruir el sprite para liberar memoria
    //     this.sprite.destroy({
    //         children: true,
    //         texture: false,
    //         baseTexture: false
    //     });

    //     //eliminar la referencia al sprite
    //     this.sprite = null;

    //     this.estoyMuerto = true
    // }

    render() {
        this.actualizarPosDelSpriteSegunPosDelObjeto()
    }

    tick() {
        if (this.estoyMuerto) return;
        this.verificarSiMori();

        let tengoAlgunEnemigoAdelante = false;
        let enemigoMasCerca = null;
        for (const aliado of this.juego.aliados) {
            const distanciaDeEnemigo = calcularDistancia(this.posicion, aliado.posicion)
            if (distanciaDeEnemigo < Math.random() * 300) {
                tengoAlgunEnemigoAdelante = true;
                enemigoMasCerca = aliado;
                break;
            }
        }
        if (!tengoAlgunEnemigoAdelante) {
            this.aceleracion.x = -1;
        }
        // else if (this.puedeGolpear()) {
        else {
            this.pegar(enemigoMasCerca);
        }

        this.aplicarFisica();
        this.render();
    }
}