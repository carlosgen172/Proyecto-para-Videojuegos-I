class BalaMejorada extends GameObject {
    radioColision;
    radioVision;
    velocidadMaxima = 0.9;
    aceleracionMaxima = 0.2;
    constructor (x, y, juego, width, height, velocidad, aceleracion, scaleX, personaQueEfectuoDisparo) {
        super(x, y, juego, width, height);
        
        //Idea para reposicionamiento descartada:
        // this.x = x;
        // this.y = y;
        // this.reposicionarElementoSegunDisparador();
        // this.posicion = {x: this.x, y: this.y};

        this.posicion = {x: x, y: y};

        this.width = width;
        this.height = height;
        this.vida = 1;
        this.estoyMuerto = false;

        //this.radioColision = radioColision;
        //this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.scaleX = scaleX || 1; //para hacer más ancho al pj
        this.personaQueEfectuoDisparo = personaQueEfectuoDisparo;

        //se crea el contenedor del sprite
        this.container = new PIXI.Container();
        this.container.name = this.constructor.name;
        this.generarAreaDeColision();

        this.nombreDelDisparador = this.personaQueEfectuoDisparo.constructor.name
        this.seleccionarColorSegunEquipo();
        this.generarSprite();
        // this.juego.pixiApp.stage.addChild(this.container);
        // this.juego.containerPrincipal.addChild(this.container);
        // console.log(this.container);
        this.salirPropulsado();
        this.juego.containerPrincipal.addChild(this.container);
    } 

    seleccionarColorSegunEquipo() {
        if (this.nombreDelDisparador == "Aliado") {
            this.color = "green";
        } else if (this.nombreDelDisparador == "Jugador") {
            this.color = "blue";
        } else {
            this.color = "red";
        }
    }

    // reposicionarElementoSegunDisparador() {
    //     /*
    //         REPOSICIONAMIENTO: Debido al hecho de que la función se encuentra en un nivel de abstracción alto 
    //         para seleccionar correctamnte su posición (y para evitar la reiteración de código innecesario). 
    //         se ejecuta en el constructor esta función que delega al mismo objeto para que decida a donde tiene 
    //         que ir ubicado según el "nombre" (la clase) de la persona que lo disparo.
    //     */
    //     if (this.nombreDelDisparador == "Aliado" || this.nombreDelDisparador == "Jugador") {
    //         this.x = this.nombreDelDisparador.x + 20;
    //     } else {
    //         this.x = this.nombreDelDisparador.x - 20;
    //     }

    //     this.y = this.nombreDelDisparador;
    // }

    // seleccionarDireccionDeAvance() {
        // if(nombreDelDisparador == "Aliado" || "Jugador") {
        //     this.direccionDeAvance = 1;
        // }
        // else {
        //     this.direccionDeAvance = -1;
        // }
    // }

    generarAreaDeColision() {
        //se le asigna el radio de colisión según el ancho indicado 
        //debugger;
        this.radioColision = this.width / 2;

        //se crea un area invisible:
        this.areaColision = new PIXI.Graphics();

        //linea de color negro
        this.areaColision.lineStyle(1, 0x000000);

        // color rojo transparente
        this.areaColision.beginFill(0xFF0000, 0.0);

        // Dibujar un círculo en la posición (100, 100) con un radio de 50
        this.areaColision.drawCircle(this.x, this.y, this.radioColision);

        // Finalizar el relleno
        this.areaColision.endFill();

        //Y lo añade al container:
        //this.juegoPrincipal.pixiApp.stage.addChild(this.areaColision);
        this.container.addChild(this.areaColision);
        this.areaColision.visible = false;
    }

    haColisionadoConAlguien() {
        if (this.estoyMuerto) return ;
        this.tengoAlgunEnemigoAdelante = false;
        const listaObjetivos = this.personaQueEfectuoDisparo.obtenerLista();
        // console.log("la bala pertenece a: ", this.personaQueEfectuoDisparo)
        // console.log("y la misma tiene a estos posibles objetivos", this.personaQueEfectuoDisparo.obtenerLista());
        // console.log("posicion actual en x", this.x);
        //debugger;
        for (let posibleObjetivo of listaObjetivos) {
            const distanciaDeEnemigoEnX = calcularDistanciaEnX(this.posicion, posibleObjetivo.posicion)
            const distanciaDeEnemigoEnY = calcularDistanciaEnY(this.posicion, posibleObjetivo.posicion)
            if (distanciaDeEnemigoEnX < this.areaColision.x && distanciaDeEnemigoEnY < this.areaColision.y) {
                this.tengoAlgunEnemigoAdelante = true;
                break;
            }
        }
        return this.tengoAlgunEnemigoAdelante;
    }

    seFueDePantalla() { //condición para que se vea también de eliminar el objeto al llegarse a salir de pantalla.
        return( ( (this.posicion.x >= (this.juego.width + 10) ) && (this.nombreDelDisparador == "Aliado") ) 
        || 
        ( (this.posicion.x <= (this.juego.width - 710) ) && (this.nombreDelDisparador == "Enemigo") ) );
    }

    salirPropulsado() {
        // if (!this.estoyMuerto) {
        if (this.estoyMuerto) return ;
        // this.aceleracion.x = this.personaQueEfectuoDisparo.direccionDeAvance();
        if (this.nombreDelDisparador == "Aliado") {
            this.aceleracion.x = 1
            // this.container.x += 1
            // this.posicion.x += 1
        } else {
            this.aceleracion.x = -1
            // this.container.x -= 1
            // this.posicion.x -= 1
        }
        // console.log("la aceleracion del objeto", this.aceleracion.x);
        // }
    }

    generarSprite() {
        // this.sprite = new PIXI.Graphics();

        // this.sprite.beginFill(this.color);
        // this.sprite.drawRect(0, 0, this.width, this.height);
        // this.sprite.endFill();
        
        // // centramos el sprite en (x,y)
        // this.sprite.pivot.set(this.width / 2, this.height / 2);
        
        // //ajustes de ubicación
        // this.sprite.x = this.x;
        // this.sprite.y = this.y;
        // this.sprite.zIndex = this.personaQueEfectuoDisparo.zIndex;
        // console.log(this.sprite)

        // // this.pixiApp.stage.addChild(this.sprite);
        
        // // this.container.addChild(this.sprite);

        // //añade el sprite dentro del contenedor y no directamente al stage del juego
        // //ya que el contenedor se encarga de manejar la posición del sprite
        // this.container.addChild(this.sprite);

        //se crea un area invisible:
        this.sprite = new PIXI.Graphics();

        //linea de color negro
        this.sprite.lineStyle(1, 0x000000);

        // color rojo transparente
        this.sprite.beginFill(this.color, 0.5);

        // Dibujar un círculo en la 
        this.sprite.drawCircle(this.x, this.y, this.radioColision);

        // Finalizar el relleno
        this.sprite.endFill();

        //Y lo añade al container:
        //this.juegoPrincipal.pixiApp.stage.addChild(this.areaColision);
        this.container.addChild(this.sprite);
    }

    //se actualiza la posición del contenedor según la posición del objeto (se usa en el render)
    actualizarPosDelContainerSegunPosDelObjeto(){
        this.container.x = this.posicion.x;
        this.container.y = this.posicion.y;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    //SISTEMA DE MUERTE:

    verificarSiMori() {
        // if (this.vida <= 0 || this.seFueDePantalla() || this.personaQueEfectuoDisparo.puedeDisparar() || this.haColisionadoConAlguien()) {
        // if (this.vida <= 0 || this.seFueDePantalla() || this.haColisionadoConAlguien()) {
        // if (this.haColisionadoConAlguien()) {
        //     console.log("he impactado con alguien");
        // }
        // if (this.vida <= 0 || this.seFueDePantalla() || this.haColisionadoConAlguien()) {
        if (this.seFueDePantalla() || this.haColisionadoConAlguien()) {
            this.morir();
        }
    }

    mensajeDeMuerte() {
        return "Una entidad ha muerto."
    }

    morir() {
        //PARA ELIMINAR CORRECTAMENTE UN ELEMENTO EN PANTALLA:
        
        //Haces la vida igual a 0;
        // this.vida = 0;
        
        //1. hacer invisible el sprite:
        this.sprite.visible = false;
        
        //2. remover el sprite del contenedor:
        this.sprite.parent.removeChild(this.sprite);

        //3. destruir el sprite para liberar memoria:
        this.sprite.destroy({
            texture: false,
            baseTexture: false
        });

        //4. eliminar la referencia al sprite:
        this.sprite = null;
        eliminarElElemento_DeLaLista_(this, this.personaQueEfectuoDisparo.balas);

        //5. Cambia su estado a "muerto", para que ya no responda a ninguna acción del ticker:
        this.estoyMuerto = true;

        // console.log("la bala ha dejado de existir.")
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
    

    //cada tick se efectua en la clase juego en el método realizarTickPorCadaBala()
    // llamado desde el tick principal del objeto.
    tick() {
        this.verificarSiMori();
        this.salirPropulsado();
        
        this.aplicarFisica();
        this.render();
    }
}

