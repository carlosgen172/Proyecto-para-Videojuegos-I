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
    cantEnemigosMinimaEnPantalla = 20;
    poderActual;
    keys = {}; //para generar las tropas (aliadas o enemigas) y para generar las bombas
    //poderes = [1, 2, 3];
    nombres = ["Angel", "Arturo", "Ariel", "Elian", "Federico", "Juan", "Jose", "Joseías", "Marcos", "Mauricio", "Lionel", "Omar"]
    apellidos = ["Aguiar", "Bautista", "Jose", "Potter", "Rodriguez", "Villalva", "Zapata"]

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
        await this.pixiApp.init(preconfiguraciones);

        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.margin = "0";

        this.pixiApp.renderer.canvas.style.position = "absolute";

        document.body.appendChild(this.pixiApp.canvas);

        this.pixiApp.stage.eventMode = "static";



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
        await this.generarTextoEnemigosMuertos();
        await this.startJugador();

        //await this.generarFondoMenu();
        this.poderActual = this.poderes[0];
        this.containerPrincipal = new PIXI.Container();
        this.agregarInteractividadDelMouse();
        this.pixiApp.ticker.add(this.gameLoop.bind(this));
        this.jugadorPuedeGenerarse = true;

        window.addEventListener("keydown", this.keysDown.bind(this));
        window.addEventListener("keyup", this.keysUp.bind(this));
    }

    async startJugador() {
        await this.generarJugador();
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
        this.fondo.x = this.width / 2
        this.fondo.y = this.height / 2

        //Ajuste de tamaño
        this.fondo.width = this.width;
        this.fondo.height = this.height;

        // Añade el Sprite al escenario para que se muestre en pantalla
        this.pixiApp.stage.addChild(this.fondo);

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

    visibilidadDeBotonesSegunPantalla() {
        if (this.menu.pantallaActual.texture == this.pantallas[0]) {
            this.botonSeguir.ocultarTodosLosBotones(this.botones);
        }
        // else if (this.menu.ocultarPantalla()){
        //     this.botonSeguir.ocultarTodosLosBotones(this.botones);
        // }
        else if (!this.menu.pantallaActual.visible) {
            this.botonSeguir.ocultarTodosLosBotones(this.botones);
        }
        else {
            this.botonSeguir.aparecerTodosLosBotones(this.botones);
        }
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

        this.hud.zIndex = 1000;

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

    generarMenuYBotones() {

    }

    async generarBarraSalud() { //funcional!
        const texturaSaludFull = await PIXI.Assets.load("imagenes/bateria_hud_3_hit_final.png")
        const texturaSalud2Hit = await PIXI.Assets.load("imagenes/bateria_hud_2_hit_final.png")
        const texturaSalud1Hit = await PIXI.Assets.load("imagenes/bateria_hud_1_hit_final.png")
        const texturaSaludVacia = await PIXI.Assets.load("imagenes/bateria_hud_vacia_final.png")


        this.bateriaVida = new BateriaVida(
            50, //ancho
            50, //alto
            (this.width / 5) + 10, //x
            25, //y
            this, //Juego
            texturaSaludFull, //sprite1
            texturaSalud2Hit, //sprite2
            texturaSalud1Hit, //sprite3
            texturaSaludVacia //sprite4
        )

        //esta linea convierte el visible del boton en un booleano
        //si hay algun bug, da null o lo que sea, termina dando false
        this.bateriaVida.sprite.visible = !!this.puedeJugar;
    }

    async generarTextoEnemigosMuertos() {
        this.textoEnemigosMuertos = new HUD(
            this
        )
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
            PIXI.Assets.load("imagenes/menu/menu_pausa_liberty_v3.png")
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
        const posX = 100;
        const posY = 100;
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
            2 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
        )
        console.log("se genero el jugador: ", this.jugador, "en la posicion ", this.jugador.x, this.jugador.y)
    }

    async generarTropas() {
        //const texture = this.seleccionarElementoAleatorioDe_(this.listaDeSpritesheetsAliados());
        for (let i = 0; i < 5; i++) {
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = -10
            const posYRandom = Math.floor(Math.random() * (this.height - 230)) + 150
            const aliadoNuevo = new Aliado(
                //posXRandom, //posición x
                posX, //posición x
                posYRandom, //posición y
                this, //juego
                32, //ancho
                32, //alto
                15, //radio de colisión
                20, //radio de visión
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
        //const texture = this.seleccionarElementoAleatorioDe_(this.listaDeSpritesheetsEnemigos());
        for (let i = 0; i < 1; i++) {
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = this.width - 10
            //la posicion en Y es un random entre 0 y el alto del juego + 100 para que no se superpongan con el HUD
            const posYRandom = Math.floor(Math.random() * (this.height - 230)) + 150
            const enemigoNuevo = new Enemigo(
                posX, //posición x
                posYRandom, //posición y
                this, //juego Principal
                32, //ancho
                32, //alto
                15, //radio de colisión
                20, //radio de visión
                0.5, //velocidad
                0.1, //aceleración
                2.25 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
            )
            this.enemigos.push(enemigoNuevo)
            this.personas.push(enemigoNuevo)
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
            this.generarEnemigosSiCorresponde()
        }
    }

    generarMenuDePausa(unaTecla, estaPresionada) {
        if (unaTecla !== "escape" || !estaPresionada) return;

        if (this.puedeJugar) {
            this.menu.mostrarPantalla();
            this.menu.cambiarPantalla(4);
            this.menu.pantallaActual.zIndex = 5000;
            this.puedeJugar = false;
        } else {
            this.menu.ocultarPantalla();
            this.puedeJugar = true;
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

    //FUNCIONES DE BÚSQUEDA Y ELIMINACIÓN DE ELEMENTOS (NO funciona correctamente):
    existeElElemento_EnLaLista_(unElemento, unaLista) {
        return (unaLista.includes(unElemento))
    }

    indiceDeElemento_EnLaLista_(unElemento, unaLista) {
        let indice = null;
        if (this.existeElElemento_EnLaLista_(unElemento, unaLista)) {
            indice = unaLista.indexOf(unElemento);
        }
        return indice;
    }

    eliminarElElemento_DeLaLista_(unElemento, unaLista) {
        if (this.existeElElemento_EnLaLista_(unElemento, unaLista)) {
            unaLista.splice(this.indiceDeElemento_EnLaLista_(unElemento, unaLista), 1)
        }
    }

    seleccionarElementoAleatorioDe_(unaLista) {
        const indiceAleatorio = Math.floor(Math.random() * unaLista.length);
        return unaLista[indiceAleatorio];
    }

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
        this.visibilidadDeBotonesSegunPantalla()
        if (this.bateriaVida) {
            this.bateriaVida.sprite.visible = this.puedeJugar;
        }

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
            this.realizarTickPorCadaAliado()
            this.realizarTickPorCadaEnemigo()
            this.realizarTickPorCadaAvion()
            this.realizarTickPorCadaPoder()
            this.aparicionDeEnemigo()
            this.bateriaVida.tick()
            this.textoEnemigosMuertos.tick()
            this.actualizarVisibilidadDePoderActual()
        }
        //Acciones a repetirse cada frame.
        //this.botonDer.tick();
        //this.botonIzq.tick();


    }
}

const juego = new Juego();

