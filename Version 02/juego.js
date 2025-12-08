class Juego {
    pixiApp;
    width;
    height;
    fondo;
    hud;
    jugador;
    aliados = [];
    enemigos = [];
    enemigosMuertos = [];
    personas = [];
    aviones = [];
    poderes = [];
    spritesheetsAliados = [];
    spritesheetsEnemigos = [];
    pantallas = [];
    botones = [];
    puedeJugar = false;
    juegoPerdido = false;
    cantEnemigosMinimaEnPantalla = 20;
    poderActual;
    keys = {}; //para generar las tropas (aliadas o enemigas) y para generar las bombas
    //poderes = [1, 2, 3];
    nombres = ["Angel", "Arturo", "Ariel", "Elian", "Federico", "Juan", "Jose", "Joseías", "Marcos", "Mauricio", "Lionel", "Omar"]
    apellidos = ["Aguiar", "Bautista", "Jose", "Potter", "Rodriguez", "Villalva", "Zapata"]
    anchoFondo = 5000;
    altoFondo = 2000;

    constructor() {
        this.width = 700;
        this.height = 500;

        this.mouse = { posicion: { x: 0, y: 0 } };

        this.initPIXI();
    }

    async initPIXI() {
        const preconfiguraciones = {
            background: "#043100ff",
            width: this.width,
            height: this.height,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true,
        }

        this.pixiApp = new PIXI.Application();
        globalThis.__PIXI_APP__ = this.pixiApp; //para extension de navegador
        await this.pixiApp.init(preconfiguraciones);

        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.margin = "0";

        this.pixiApp.renderer.canvas.style.position = "absolute";

        document.body.appendChild(this.pixiApp.canvas);

        this.pixiApp.stage.eventMode = "static";


        //Generación de container:
        this.containerPrincipal = new PIXI.Container();
        this.containerPrincipal.name = this.constructor.name;
        this.pixiApp.stage.addChild(this.containerPrincipal);

        await this.cargarBackground();
        await this.crearGenerador();
        //await this.generarMouse();

        await this.cargarSprites();



        //this.poderes = [];
        //await this.generarAvion();
        await this.generarBotonesDelHUD();
        await this.generarFondoHUD();
        await this.generarMenu();
        await this.generarPoderAliados();
        await this.generarPoderBombas();
        await this.generarPoderEnemigos();
        await this.generarBarraSalud();
        await this.generarTextoEnemigosMuertosYPuntaje();


        //await this.generarFondoMenu();
        this.poderActual = this.poderes[0];

        this.agregarInteractividadDelMouse();
        this.pixiApp.ticker.add(this.gameLoop.bind(this));

        window.addEventListener("keydown", this.keysDown.bind(this));
        window.addEventListener("keyup", this.keysUp.bind(this));
    }

    async start() {
        await this.generarJugador();
        // this.asignarJugadorComoTargetDeCamara();
        if (this.jugador !== null) {
            await this.jugador.start();
            // this.asignarJugadorComoTargetDeCamara();
            this.personas.push(this.jugador);
        }

    }

    //GENERADOR (AÚN EXPERIMENTAL):
    async crearGenerador() {
        this.generadorPrincipal = new Generador(
            0,
            0,
            this.pixiApp,
            this
        )
    }

    //FUNCIONES DEL MOUSE:

    async generarMouse() {
        //aquí se genera el mouse.
        //this.mouse = new Mouse { ancho, alto, x, y, color}
        const texture = await PIXI.Assets.load("imagenes/posible_puntero.png");
        //this.textureMouse2 = await PIX.Assets.load("imagenes/posible_puntero_2.png")
        this.mouse = new Mouse(
            32,
            32,
            this.mouse.posicion.x,
            this.mouse.posicion.y,
            this,
            texture
        )
    }

    agregarInteractividadDelMouse() {
        // Escuchar el evento mousemove
        this.pixiApp.canvas.onmousemove = (event) => {
            this.mouse.posicion = this.convertirCoordenadaDelMouse(event.x, event.y);
        };

        this.pixiApp.canvas.onmousedown = (event) => {
            this.mouse.down = this.convertirCoordenadaDelMouse(event.x, event.y);
            this.mouse.apretado = true;
        };
        this.pixiApp.canvas.onmouseup = (event) => {
            this.mouse.up = this.convertirCoordenadaDelMouse(event.x, event.y);
            this.mouse.apretado = false;
            //this.menu.realizarPresentacion()
        }
    }

    convertirCoordenadaDelMouse(mouseX, mouseY) {
        // Convertir coordenadas del mouse del viewport a coordenadas del mundo
        // teniendo en cuenta la posición y escala del containerPrincipal
        return {
            //x: (mouseX - this.juego.canvas.data.global.x) / this.zoom,
            //y: (mouseY - this.juego.canvas.data.global.y) / this.zoom,
            x: (mouseX - this.containerPrincipal.x) / this.zoom,
            y: (mouseY - this.containerPrincipal.y) / this.zoom,
        };
    }

    //FUNCIONES GENERADORAS DE LA INTERFAZ DE USUARIO:

    async cargarBackground() {
        // Carga la imagen usando Assets.load()
        // Esto devuelve una Promise que resuelve la Textura de la imagen
        const texture = await PIXI.Assets.load('imagenes/menu/tileMapLiberty_v4.png'); // Reemplaza con la ruta de tu imagen

        // Crea un Sprite a partir de la Textura cargada
        this.fondo = new PIXI.TilingSprite(texture);

        //Ajuste de punto central
        this.fondo.anchor.set(0.5);

        //Ajuste de ubicacion
        // this.fondo.x = this.width / 2
        // this.fondo.y = this.height / 2

        //Ajuste de tamaño
        // this.fondo.width = this.width;
        // this.fondo.height = this.height;
        this.fondo.width = this.anchoFondo;
        this.fondo.height = this.altoFondo;
        this.fondo.tileScale.set(1);

        // Añade el Sprite al escenario para que se muestre en pantalla
        // this.pixiApp.stage.addChild(this.fondo);

        /*
            MUY IMPORTANTE:
            ¿Cómo saber si tengo que añadir la instancia al stage o al containerPrincipal?:

            Simple, cuando uno requiere que un objeto sea estático, osease, que este mismo 
            se quede fijo en pantalla sin sufrir movimiento por la cámara, entonces ahí el 
            mismo será añaddido al stage (elementos del HUD irán acá seguramente); En cambio, 
            cuando uno quiera que el objeto se vea influenciado por el movimiento de la cámara, 
            haciendo capaz de, si es que el jugador se mueve a una distancia muy lejana del 
            mismo, no se vea en pantalla, entonces se le agregará al containerPrincipal (en 
            este caso son los elementos in game, como por ejemplo los npcs, los objetos estáticos, 
            el tilemap, etc.)

            Gracias por leer (by sebas :P)
        */
        this.containerPrincipal.addChild(this.fondo);

    }

    async generarMenu() {
        //TEXTURAS
        //Pantallas

        //Botones

        this.menu = new Menu(
            this.width / 2,
            this.height / 2,
            this,
        );
        await this.menu.init();

        this.botonJugar = new BotonMenu(
            (this.width / 2), //x
            (this.height / 2) + 105, //y
            this,
            180,
            64,
            this.secuenciaBotonJugar,
            0
        )
        await this.botonJugar.init();

        this.botonSeguir = new BotonMenu(
            this.width - 515, //x
            this.height - 215, //y
            this,
            180,
            64,
            this.secuenciaBotonSeguir,
            1
        )
        await this.botonSeguir.init();

        this.botonNueva = new BotonMenu(
            this.width - 515, //x
            this.height - 153, //y
            this,
            180,
            64,
            this.secuenciaBotonNueva,
            2
        )
        await this.botonNueva.init();

        this.botonVolver = new BotonMenu(
            this.width - 515, //x
            this.height - 90, //y
            this,
            180,
            64,
            this.secuenciaBotonVolver,
            3
        )
        await this.botonVolver.init();

        const listaBotonesMenu = [
            this.botonSeguir,
            this.botonNueva,
            this.botonVolver
        ]

        this.botones = listaBotonesMenu;
    }



    async generarFondoHUD() {
        // Carga la imagen usando Assets.load()
        // Esto devuelve una Promise que resuelve la Textura de la imagen
        const texture = await PIXI.Assets.load('imagenes/hud_1.png'); // Reemplaza con la ruta de tu imagen

        // Crea un Sprite a partir de la Textura cargada
        this.hud = new PIXI.Sprite(texture);

        //Ajuste de punto central
        this.hud.anchor.set(0.5);


        //Ajuste de ubicacion
        this.hud.x = this.width / 2
        this.hud.y = 25

        //Ajuste de tamaño
        this.hud.width = 700;
        this.hud.height = 50;

        this.hud.zIndex = 1;

        // Añade el Sprite al escenario para que se muestre en pantalla
        this.pixiApp.stage.addChild(this.hud);
    }

    async generarPoderAliados() {
        const texturaPoderAliados = await PIXI.Assets.load("imagenes/aliados_power_up_hud_corregido.png");

        const poderAliados = new Poder(
            //configPoder
            50,
            50,
            this.width / 2,
            25,
            this,
            texturaPoderAliados,
            "aliados"
        )
        this.poderes.push(poderAliados)
        this.poderActual = this.poderes[0];

        if (this.puedeJugar) {
            poderAliados.sprite.visible = true;
        }
        else {
            poderAliados.sprite.visible = false;
        }

    }

    async generarPoderBombas() {
        const texturaPoderBombas = await PIXI.Assets.load("imagenes/bombita_power_up_hud_corregido.png");

        const poderBombas = new Poder(
            // configPoder
            50,
            50,
            this.width / 2,
            25,
            this,
            texturaPoderBombas,
            "bombas"
        )
        //poderBombas.sprite.visible = false;
        this.poderes.push(poderBombas)

        if (this.puedeJugar) {
            poderBombas.sprite.visible = true;
        }
        else {
            poderBombas.sprite.visible = false;
        }
    }

    async generarPoderEnemigos() {
        const texturaPoderEnemigos = await PIXI.Assets.load("imagenes/exterminio_o_desolacion_power_up.png");

        const poderEnemigos = new Poder(
            // configPoder
            50,
            50,
            this.width / 2,
            25,
            this,
            texturaPoderEnemigos,
            "enemigos"
        )
        //poderEnemigos.sprite.visible = false;
        this.poderes.push(poderEnemigos)
        if (this.puedeJugar) {
            poderEnemigos.sprite.visible = true;
        }
        else {
            poderEnemigos.sprite.visible = false;
        }
    }

    async generarBotonesDelHUD() {
        const texturaDer = await PIXI.Assets.load("imagenes/hevilla_der_final_real.png");
        const texturaDerPres = await PIXI.Assets.load("imagenes/hevilla_der_pres_final_real.png");
        const texturaIzq = await PIXI.Assets.load("imagenes/hevilla_izq_final_real.png");
        const texturaIzqPres = await PIXI.Assets.load("imagenes/hevilla_izq_pres_final_real.png");

        this.botonDer = new BotonHevilla(
            (this.width / 2) + 60, //x
            25, //y
            this,
            35,
            30,
            texturaDer, //sprite
            texturaDerPres, //segundoSprite
            "der"
        )
        this.botonIzq = new BotonHevilla(
            (this.width / 2) - 60, //x
            25, //y
            this,
            35,
            30,
            texturaIzq, //sprite
            texturaIzqPres, //segundoSprite
            "izq", //direccion
        )

        //estas lineas fuerzan el visible del boton a un booleano
        //si hay algun bug, da null o lo que sea, termina dando false
        this.botonDer.sprite.visible = !!this.puedeJugar;
        this.botonIzq.sprite.visible = !!this.puedeJugar;
    }

    async generarBarraSalud() { //funcional!
        const texturaSaludFull = await PIXI.Assets.load("imagenes/bateria_hud_3_hit_final.png")
        const texturaSalud2Hit = await PIXI.Assets.load("imagenes/bateria_hud_2_hit_final.png")
        const texturaSalud1Hit = await PIXI.Assets.load("imagenes/bateria_hud_1_hit_final.png")
        const texturaSaludVacia = await PIXI.Assets.load("imagenes/bateria_hud_vacia_final.png")

        const posX = this.width - 600;
        const posY = this.height - 475;

        this.bateriaVida = new BateriaVida(
            50, //ancho
            50, //alto
            posX, //x
            posY, //y
            this, //Juego
            texturaSaludFull, //sprite1
            texturaSalud2Hit, //sprite2
            texturaSalud1Hit, //sprite3
            texturaSaludVacia //sprite4
        )
        this.bateriaVida.zIndex = 2;
        await this.bateriaVida.init();
    }
    async generarTextoEnemigosMuertosYPuntaje() {
        this.textos = new HUD(this);
        await this.textos.crearTextos();
    }

    //FUNCIONES RESPECTIVAS A LA CÁMARA:

    asignarJugadorComoTargetDeCamara() {
        if (!this.jugador) return;
        // if (!this.fondo) return;
        this.targetCamara = this.jugador;
    }

    hacerQueLaCamaraSigaAlTarget() {
        //Consultamos la existencia del target de la cámara. (Para evitar posibles errores de carga).
        if (!this.targetCamara) return;
        if (!this.puedeJugar) return; //Condicional extra para que la cámara no se pueda mover cuando se pone pausa o se sale de la partida.

        //constantes para delimitar los límites de la cámara:
        const maxPosCamaraXDer = (this.anchoFondo / 2 - this.width / 2);
        const maxPosCamaraXIzq = this.width / 2;

        //En caso de ser una u otra, la cámara se detiene:
        if (this.targetCamara.posicion.x > maxPosCamaraXDer || this.targetCamara.posicion.x < maxPosCamaraXIzq) return;

        //Ajustamos la cámara según la posición de la cámara según la del jugador:
        let posTargetX = -this.targetCamara.posicion.x + this.width / 2; //esto traduce la ubicación del jugador a la misma (en negativo para que inicie que esta misma  siempre se encontrará más atras de la mitad de la posición central) según la posición total de la pantalla más la mitad de la misma, dejándolo justo en el centro de la misma.
        // let posTargetY = -this.targetCamara.posicion.x + this.width / 2; //lo mismo, pero en el punto y, eso si, ya que la cámara no se podrá mover de arriba a abajo se ve innceserario esta adición.

        //Por último, se iguala y pasa la posición recabada del target a la del container principal/cámara:
        const x = (posTargetX - this.containerPrincipal.x) * 0.1;
        // const y = (posTargetY - this.containerPrincipal.y) * 0.1;


        //Pasa dichos valores para el container principal, el cual pregunta su valor actual más la suma de este en x, mientras que en y no lo hace (siempre va a ser el mismo).
        this.moverContainerPrincipalA(
            this.containerPrincipal.x + x,
            this.containerPrincipal.y //se pone el mismo valor del container ya que este no va a ser modificado por ningún factor externo (pos del jugador, variable, etc.) excepto por sí mismo (osease, nunca va a cambiar.
        );

        //Función resumida (funciona igual que la de arriba, si se quiere se puede probar para ver cambios/diferencias más detalladas):
        // this.containerPrincipal.x = -this.targetCamara.posicion.x + this.width / 2;
        // this.containerPrincipal.y = -this.targetCamara.posicion.y + this.height / 2;

        // console.log(this.containerPrincipal.x);
        // console.log(this.containerPrincipal.y);
    }

    moverContainerPrincipalA(x, y) {
        this.containerPrincipal.x = x;
        this.containerPrincipal.y = y;
        //this.fondo.x = x;
        //this.fondo.y = y;
        // this.fondo.x = x; //para que el tilemap tmb se mueva (a verificar) 
        // this.fondo.y = y; //x2.
    }




    //FUNCIONES GENERADORAS DE NPCS Y ELEMENTOS RESPONSIVOS:

    async cargarSprites() {
        this.spritesheetsAliados = await Promise.all([
            PIXI.Assets.load("imagenes/Aliados/antiTank/json/texture.json"),
            PIXI.Assets.load("imagenes/Aliados/machineGunner/Json/texture.json"),
            PIXI.Assets.load("imagenes/Aliados/radioOperator/json/texture.json"),
            PIXI.Assets.load("imagenes/Aliados/sniper/json/texture.json")
        ])

        this.spritesheetsEnemigos = await Promise.all([
            PIXI.Assets.load("imagenes/Enemigos/hornet/json/texture.json"),
            PIXI.Assets.load("imagenes/Enemigos/Scarab/json/texture.json"),
            PIXI.Assets.load("imagenes/Enemigos/spider/json/texture.json"),
            PIXI.Assets.load("imagenes/Enemigos/wasp/json/texture.json")
        ])

        this.spritesheetsJugador = await Promise.all([
            PIXI.Assets.load("imagenes/Jugador/json/texture.json")
        ]);

        this.pantallas = await Promise.all([
            PIXI.Assets.load("imagenes/menu/menu_fondo_liberty.png"),
            PIXI.Assets.load("imagenes/menu/menu_opciones_liberty_1.png"),
            PIXI.Assets.load("imagenes/menu/menu_opciones_liberty_2.png"),
            PIXI.Assets.load("imagenes/menu/menu_opciones_liberty_3.png"),
            PIXI.Assets.load("imagenes/menu/menu_pausa_liberty_v3.png"),
            PIXI.Assets.load("imagenes/menu/menu_game_over_liberty_1.png")
        ])

        this.secuenciaBotonJugar = await Promise.all([
            PIXI.Assets.load("imagenes/menu/boton_jugar.png"),
            PIXI.Assets.load("imagenes/menu/boton_jugar_pres.png")
        ])

        this.secuenciaBotonSeguir = await Promise.all([
            PIXI.Assets.load("imagenes/menu/boton_seguir.png"),
            PIXI.Assets.load("imagenes/menu/boton_seguir_pres.png")
        ])

        this.secuenciaBotonNueva = await Promise.all([
            PIXI.Assets.load("imagenes/menu/boton_partida_Nueva.png"),
            PIXI.Assets.load("imagenes/menu/boton_partida_nueva_pres.png")
        ])

        this.secuenciaBotonVolver = await Promise.all([
            PIXI.Assets.load("imagenes/menu/boton_volver.png"),
            PIXI.Assets.load("imagenes/menu/boton_volver_pres.png")
        ])
    }

    async generarJugador() {
        const posX = this.width / 2;
        const posY = this.height / 2;
        this.jugador = new Jugador(
            //posXRandom, //posición x
            posX, //posición x
            posY, //posición y
            this, //juego
            32, //ancho
            32, //alto
            15, //radio de colisión
            20, //radio de visión
            0.5, //velocidad
            0.1, //aceleración
            2, //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
        )
        this.jugador.container.zIndex = 1;
        console.log("el jugador es visible ", this.jugador.container.visible, "tiene su zIndex en ", this.jugador.container.zIndex)
    }

    async generarTropas() {
        for (let i = 0; i < 5; i++) {
            const visionRandom = Math.floor(Math.random() * 100 + 150)
            const posX = -10
            // const posX = this.containerPrincipal.x - (10 + (this.width / 2));
            const posYRandom = Math.floor(Math.random() * (this.height - 230)) + 150
            const aliadoNuevo = new Aliado(
                //posXRandom, //posición x
                posX, //posición x
                posYRandom, //posición y
                this, //juego
                32, //ancho
                32, //alto
                18, //radio de colisión
                visionRandom, //radio de visión
                0.5, //velocidad
                0.1, //aceleración
                2 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
            )
            this.aliados.push(aliadoNuevo)
            this.personas.push(aliadoNuevo)
        }
    }

    async generarAliadosSiCorresponde() {
        if (this.poderActual.estado == "aliados") {
            this.generarTropas();
        }
        else {
            console.log("No se puede generar aliados con el poder actual, favor de cambiar al poder correspondiente usando la q y la e para recorrer los poderes disponibles.")
        }
    }

    async generarTropasEnemigas() {
        for (let i = 0; i < 1; i++) {
            //se suma +100  
            const visionRandom = Math.floor(Math.random() * 100 + 150)
            const posX = this.width - 10
            //la posicion en Y es un random entre 0 y el alto del juego + 100 para que no se superpongan con el HUD
            const posYRandom = Math.floor(Math.random() * (this.height - 230)) + 150
            const enemigoNuevo = new Enemigo(
                posX, //posición x
                posYRandom, //posición y
                this, //juego Principal
                32, //ancho
                32, //alto
                18, //radio de colisión
                visionRandom, //radio de visión
                0.5, //velocidad
                0.1, //aceleración
                2.25 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
            )
            this.enemigos.push(enemigoNuevo)
            this.personas.push(enemigoNuevo)
        }
    }


    async eliminarEnemigosEnPantallaOGenerarMas() {
        if (this.poderActual.estado == "enemigos") {
            //Planteo las 2 posibles opciones a ejecutarse
            const posiblesOpciones = ["suerte", "desgracia"];

            //Espero a que se elija una de forma aleatoria:
            let opcionElegida = await seleccionarElementoAleatorioDe_(posiblesOpciones);

            //Y según esto, ejecuto la correspondiente:
            if (opcionElegida == "suerte") {
                this.eliminarATodosLosEnemigosEnPantalla()
            } else {
                this.generarTropasEnemigas();
            }
        }

    }

    async eliminarATodosLosEnemigosEnPantalla() {
        if (!this.enemigos) return;
        console.log("SKIDUSH Bj");
        for (let enemigoEnPantalla of this.enemigos) {
            enemigoEnPantalla.morir()
        }
    }

    async generarEnemigosSiCorresponde() {
        if (this.poderActual.estado == "enemigos") {
            this.generarTropasEnemigas();
        }
        else {
            console.log("No se puede generar enemigos con el poder actual, favor de cambiar al poder correspondiente usando la q y la e para recorrer los poderes disponibles.")
        }
    }

    async generarAvion() {
        const texturaAvion = await PIXI.Assets.load("imagenes/avion_bombardero.png");

        //for(let i = 0; i < 1; i++){
        //const posXRandom = Math.floor(Math.random() * this.width)
        const posX = -10
        const posYRandom = Math.floor(Math.random() * this.height)
        const avionNuevo = new Avion(
            //posXRandom, //posición x
            posX, //posición x
            posYRandom, //posición y
            this, //juego Principal
            64, //ancho
            64, //alto
            texturaAvion, //textura
            64, //radio de colisión
            64, //radio de visión
            5, //velocidad
            10, //velocidad máxima
            3, //aceleración
            5, //aceleración máxima
            1 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
        )
        this.ultimoAvion = avionNuevo
        this.aviones.push(avionNuevo)

        //}

    }

    async generarAvionSiCorresponde() {

        //if (!this.aviones || ((this.aviones.length >= 1) && (this.ultimoAvion.terminoViaje()))) {
        //if (!this.aviones || ((this.aviones.length >= 1) && (this.ultimoAvion.terminoViaje()))) {
        if ((this.aviones.length >= 1) && (this.ultimoAvion.terminoViaje()) && (this.poderActual.estado == "bombas")) {
            this.generarAvion();
        }
        else {
            console.log("aún no se puede generar ningun avión, esto puede ser debido a que el último avión aún no terminó su recorrido, o porque no seleccionó el poder correspondiente, favor de cambiar al poder correspondiente usando la q y la e para recorrer los poderes disponibles.")
        }

        /*
        if (!this.aviones) {
            if (this.ultimoAvion.terminoViaje()) {
                this.generarAvion()
            }
        }
        */
        //if (!this.ultimoAvion.terminoViaje()) return;
        //this.generarAvion()
    }

    //RESPONSIVIDAD DE GENERADORES:

    keysDown(letra) {
        const key = letra.key.toLowerCase();

        this.generarMenuDePausa(key, true)

        if (this.puedeJugar) {
            this.presionarHebillaCon_(key, true);
        }
    }

    keysUp(letra) {
        const key = letra.key.toLowerCase();
        if (this.puedeJugar) {
            this.presionarHebillaCon_(key, false);
            this.generarPoderesCon(key)
        }
    }

    presionarHebillaCon_(unaTecla, estaPresionada) {
        this.keys[unaTecla] = estaPresionada;

        //Si se presiona
        if (estaPresionada) {
            if (unaTecla === "e" && this.botonDer) {
                this.botonDer.rolarPoderHacia_(1);
                this.botonDer.actualizarSpritesSegunDireccionHacia_(1, true);
            }
            if (unaTecla === "q" && this.botonIzq) {
                this.botonIzq.rolarPoderHacia_(-1);
                this.botonIzq.actualizarSpritesSegunDireccionHacia_(-1, true);
            }
        }

        //Si se suelta
        else {
            if (unaTecla === "e" && this.botonDer) this.botonDer.actualizarSpritesSegunDireccionHacia_(1, false);
            if (unaTecla === "q" && this.botonIzq) this.botonIzq.actualizarSpritesSegunDireccionHacia_(-1, false);
        }
    }

    generarPoderesCon(unaTecla) {
        if (unaTecla == "f" && this.poderActual.estado == "aliados") {
            this.generarAliadosSiCorresponde();
        }
        if (unaTecla == "f" && this.poderActual.estado == "bombas") {
            if (this.aviones == []) {
                this.generarAvion();
            } else {
                this.generarAvionSiCorresponde();
            }
        }
        if (unaTecla == "f" && this.poderActual.estado == "enemigos") {
            // this.generarEnemigosSiCorresponde()
            this.eliminarEnemigosEnPantallaOGenerarMas();
        }
    }

    generarMenuDePausa(unaTecla, estaPresionada) {
        if (unaTecla !== "escape" || !estaPresionada) return;

        if (this.puedeJugar) {
            this.menu.mostrarPantalla();
            this.menu.cambiarPantalla(4);
            this.menu.pantallaActual.zIndex = 5000;
            this.puedeJugar = false;
        }
    }


    // generarMenuDePausa(unaTecla, estaPresionada) {
    //     this.keys[unaTecla] = estaPresionada;

    //     if(estaPresionada) {
    //         if(unaTecla === "escape" && this.puedeJugar) {
    //             this.menu.mostrarPantalla();
    //             this.menu.cambiarPantalla(4);
    //             this.menu.pantallaActual.zIndex = 5000;
    //             this.puedeJugar = false;
    //         }
    //         else if(unaTecla === "escape" && !this.puedeJugar) {
    //             this.menu.ocultarPantalla();
    //             this.puedeJugar = true;
    //         }
    //     }
    // }

    aparicionDeEnemigo() {
        setTimeout(() => {
            if (this.enemigos.length < this.cantEnemigosMinimaEnPantalla && this.puedeJugar) {
                this.generarTropasEnemigas() * this.aliados.length;
            }
        }, 2000);
    }

    /*
    realizarClick() {
        this.menu.on('pointerdown', () => {
            this.menu.realizarPresentacion()
        })
    }
    */

    //SISTEMA DE TICK PARA LISTAS DE OBJETOS:

    realizarTickPorCadaAvion() {
        for (let unAvion of this.aviones) {
            unAvion.tick();
        }
    }

    realizarTickPorCadaAliado() {
        for (let unAliado of this.aliados) {
            unAliado.tick();
        }
    }

    realizarTickDelJugador() {
        this.jugador.tick();
    }

    realizarTickPorCadaEnemigo() {
        for (let unEnemigo of this.enemigos) {
            unEnemigo.tick();
        }
    }

    realizarTickPorCadaPoder() {
        for (let unPoder of this.poderes) {
            unPoder.tick();
        }
    }




    //VISIBILIDAD SEGUN PANTALLA ACTUAL
    //------------------------------------------------------------
    //se cambia la visibilidad o se eliminan los elementos necesarios segun la pantalla que se muestre al jugador
    visibilidadDeElementosSegunPantalla() {
        if (!this.menu.pantallaActual.visible) {  //si el menu no es visible, ocultar
            this.botonSeguir.ocultarTodosLosBotones(this.botones);
        }
        /*  NOTA IMPORTANTE: la jerarquia de los else if importa mucho
            porque si no se verifica que la pantalla es visible
            hay un bug con fijarse PRIMERO si la pantalla es la del
            menu de pausa. Probar para verificar intercambiando de
            lugar el else if de abajo con el de arriba de esta nota.
        */
        else if (this.menu.pantallaActual.texture == this.pantallas[0]) { //si la pantalla actual es el 1er menu, ocultar
            this.botonSeguir.ocultarTodosLosBotones(this.botones);
            this.matarATodosLosAliadosYEnemigos();
            this.resetearPuntaje();
            this.textos.moverAtras();
            this.textos.acomodarPosicionYTamañoDeTextoEnemigosAbatidos();
        }
        else if (this.menu.pantallaActual.texture == this.pantallas[1]) {
            this.botonSeguir.aparecerTodosLosBotones(this.botones);
            this.botones[0].container.x = this.width - 515;
            this.botones[2].container.x = this.width - 515;
            this.botones[2].container.y = this.height - 90;
        }
        else if (this.menu.pantallaActual.texture == this.pantallas[4]) { //si la pantalla es el menu de PAUSA
            //se configuran los botones a aparecer y sus posiciones tanto en el eje x, y como su zIndex
            this.botonSeguir.aparecerTodosLosBotones(this.botones);
            this.botones[1].ocultarBoton();
            this.botonSeguir.moverAdelanteTodosLosBotones(this.botones);
            this.botones[0].container.x = this.width / 2;
            this.botones[2].container.x = this.width / 2;
            this.botones[2].container.y = (this.height / 2) + 100;

            //llevar al fondo a todos los enemigos
            for (const enemigo of this.enemigos) {
                enemigo.llevarAlFondo();
            }
        }
        else if (this.menu.pantallaActual.texture == this.pantallas[5]) { //si la pantalla es GAME OVER
            //se configuran los botones a aparecer
            this.botonSeguir.aparecerTodosLosBotones(this.botones);
            this.botones[0].ocultarBoton();
            this.botones[1].ocultarBoton();

            //para mover adelante todos los botones, fijarse lógica de ésto cuando sea posible
            this.botonSeguir.moverAdelanteTodosLosBotones(this.botones);

            //se configura el único botón a aparecer
            this.botones[2].moverBotonAdelante();
            this.botones[2].container.x = this.width / 2;
            this.botones[2].container.y = (this.height / 2) + 100;

            //llevar al fondo a todos los enemigos
            for (const enemigo of this.enemigos) {
                enemigo.llevarAlFondo();
            }
        }
        else { //sino, aparecer todos los botones en las demas pantallas del menu
            this.botonSeguir.aparecerTodosLosBotones(this.botones);
        }
    }

    matarATodosLosAliadosYEnemigos() {
        for (const aliado of this.aliados) {
            aliado.morir();
        }

        for (const enemigo of this.enemigos) {
            enemigo.morir();
        }
    }

    resetearPuntaje() {
        this.bateriaVida.contadorEnemigos = 0;
        for (const enemigo of this.enemigosMuertos) {
            eliminarElElemento_DeLaLista_(enemigo, this.enemigosMuertos);
        }
    }
    //------------------------------------------------------------




    //PANTALLA DERROTA
    //------------------------------------------------------
    gameOver() {
        this.actualizarPuntaje();
        //si perdio el juego, éste se detiene y se cambia a la pantalla GAME OVER
        if (this.juegoPerdido) {
            this.puedeJugar = false;
            this.menu.cambiarPantalla(5);
            this.menu.mostrarPantalla();
            this.menu.moverPantallaAdelante();
        }
        this.juegoPerdido = false;
    }

    actualizarPuntaje() {
        this.textos.textoPuntajeMasAlto.text = traerPuntajeMasAlto().toString();
        compararPuntajeYGuardarSiEsMayor(this.enemigosMuertos.length);
    }
    //------------------------------------------------------

    actualizarVisibilidadDePoderActual() {
        this.poderesNoActuales = this.poderes.filter((p) => p != this.poderActual)
        this.poderesNoActuales.forEach(p => {
            p.sprite.visible = false
        });
        this.poderActual.sprite.visible = true;
    }

    gameLoop() {
        //this.mouse.tick()
        this.menu.tick()
        this.visibilidadDeElementosSegunPantalla()

        if (this.hud) {
            this.hud.visible = this.puedeJugar;
        }

        if (this.botonDer && this.botonDer.sprite) {
            this.botonDer.sprite.visible = this.puedeJugar;
        }

        if (this.botonIzq && this.botonIzq.sprite) {
            this.botonIzq.sprite.visible = this.puedeJugar;
        }

        if (this.puedeJugar) {
            this.realizarTickDelJugador();
            this.realizarTickPorCadaAliado();
            this.realizarTickPorCadaEnemigo();
            this.realizarTickPorCadaAvion();
            this.realizarTickPorCadaPoder();
            this.aparicionDeEnemigo();
            this.bateriaVida.tick();
            this.textos.tick();
            this.actualizarVisibilidadDePoderActual();
            this.asignarJugadorComoTargetDeCamara();
            this.hacerQueLaCamaraSigaAlTarget();
        }
    }
}

const juego = new Juego();

