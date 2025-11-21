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

        // this.nombres = baseNombres
        // this.apellidos = baseApellidos
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

        this.pixiApp = new PIXI.Application(preconfiguraciones);
        await this.pixiApp.init(preconfiguraciones);

        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.margin = "0";

        this.pixiApp.renderer.canvas.style.position = "absolute";

        document.body.appendChild(this.pixiApp.canvas);

        this.pixiApp.stage.interactive = true;
        window.addEventListener("keydown", this.keysDown.bind(this));
        window.addEventListener("keyup", this.keysUp.bind(this));


        await this.cargarBackground();
        await this.crearGenerador();
        await this.generarMouse();
        await this.generarMenu();
        await this.cargarSprites();

        //this.poderes = [];
        //await this.generarAvion();
        await this.cargarFondoHUD();
        await this.generarPoderAliados();
        await this.generarPoderBombas();
        await this.generarPoderEnemigos();
        await this.generarBotonesDelHUD();
        await this.generarBarraSalud();
        await this.generarTextoEnemigosMuertos();
        this.poderActual = this.poderes[0];
        this.containerPrincipal = new PIXI.Container();
        this.agregarInteractividadDelMouse();
        this.pixiApp.ticker.add(this.gameLoop.bind(this));

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
            //this.pixiApp,
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
            this.menu.realizarPresentacion()
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
        const texture = await PIXI.Assets.load('imagenes/Tileset/Piso_provisorio/Secuencia/226.png'); // Reemplaza con la ruta de tu imagen

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

    /*
    generarFondoCon(unaTextura) {
        //aquí se genera el fondo.
        //this.fondo = new Fondo {ancho, alto, x, y, color}
        this.fondo = new PIXI.TilingSprite({
            unaTextura,
            width: this.pixiApp.screen.width,
            height: this.pixiApp.screen.height
        });
        this.pixiApp.stage.addChild(this.fondo);
    }
    */

    async generarMenu() {
        const texturaMenu = await PIXI.Assets.load("imagenes/ejemplo1.png")
        // Crea un Sprite a partir de la Textura cargada

        let configMenu = {
            "alto": 500,
            "ancho": 500,
            "posX": this.width / 2,
            "posY": this.height / 2,
            "pixiApp": this.pixiApp,
            "juegoPrincipal": this,
            "texturaDefault": texturaMenu
        }


        this.menu = new Menu(
            500,
            500,
            0,
            0,
            this.pixiApp,
            this,
            texturaMenu
        );

        /*
        this.menu = new Menu(
            configMenu
        );
        */
    }

    async cargarFondoHUD() {
        // Carga la imagen usando Assets.load()
        // Esto devuelve una Promise que resuelve la Textura de la imagen
        const texture = await PIXI.Assets.load('imagenes/hud_1.png'); // Reemplaza con la ruta de tu imagen

        // Crea un Sprite a partir de la Textura cargada
        this.hud = new PIXI.TilingSprite(texture);

        //Ajuste de punto central
        this.hud.anchor.set(0.5);


        //Ajuste de ubicacion
        this.hud.x = this.width / 2
        this.hud.y = 25

        //Ajuste de tamaño
        this.hud.width = 500;
        this.hud.height = 50;

        this.hud.zIndex = 1000;

        // Añade el Sprite al escenario para que se muestre en pantalla
        this.pixiApp.stage.addChild(this.hud);
    }

    async generarPoderAliados() {
        const texturaPoderAliados = await PIXI.Assets.load("imagenes/aliados_power_up_hud_corregido.png");
        // let configPoder = {
        //     "alto": 50,
        //     "ancho": 50,
        //     "posicion en X": this.width,
        //     "posicion en Y": 50,
        //     "juego": this,
        //     "sprite": texturaPoderAliados,
        //     "estado": "aliados"
        // }

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
    }

    async generarPoderBombas() {
        const texturaPoderBombas = await PIXI.Assets.load("imagenes/bombita_power_up_hud_corregido.png");
        // let configPoder = {
        //     "alto": 50,
        //     "ancho": 50,
        //     "posicion en X": this.width,
        //     "posicion en Y": 50,
        //     "juego": this,
        //     "sprite": texturaPoderAliados,
        //     "estado": "bombas"
        // }

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
    }

    async generarPoderEnemigos() {
        const texturaPoderEnemigos = await PIXI.Assets.load("imagenes/exterminio_o_desolacion_power_up.png");
        // let configPoder = {
        //     "alto": 50,
        //     "ancho": 50,
        //     "posicion en X": this.width,
        //     "posicion en Y": 50,
        //     "juego": this,
        //     "sprite": texturaPoderAliados,
        //     "estado": "enemigos"
        // }

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
    }

    async generarBotonesDelHUD() {
        const texturaDer = await PIXI.Assets.load("imagenes/hevilla_der_final_real.png");
        const texturaDerPres = await PIXI.Assets.load("imagenes/hevilla_der_pres_final_real.png");
        const texturaIzq = await PIXI.Assets.load("imagenes/hevilla_izq_final_real.png");
        const texturaIzqPres = await PIXI.Assets.load("imagenes/hevilla_izq_pres_final_real.png");
        let configBotones = { //hace falta configurar
            //"width": 50, 
            //"height": 50,

        }
        this.botonDer = new BotonHevilla(
            50, //ancho
            50, //alto
            (this.width / 2) + 45, //x
            25, //y
            texturaDer, //sprite
            texturaDerPres, //textura
            "der", //direccion
            //this.pixiApp //juego
            this //juego
        )
        this.botonIzq = new BotonHevilla(
            50, //ancho
            50, //alto
            (this.width / 2) - 45, //x
            25, //y
            texturaIzq, //sprite
            texturaIzqPres, //textura
            "izq", //direccion
            //this.pixiApp //juego
            this //juego
        )
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
    }

    async generarTextoEnemigosMuertos() {
        this.textoEnemigosMuertos = new HUD(
            this
        )
    }


    //FUNCIONES GENERADORAS DE NPCS Y ELEMENTOS RESPONSIVOS:

    async cargarSprites() {
        this.texturasAliados = await Promise.all([
            PIXI.Assets.load("imagenes/aliados/ensalada/antitank.png"),
            PIXI.Assets.load("imagenes/aliados/ensalada/assault.png"),
            PIXI.Assets.load("imagenes/aliados/ensalada/radiooperator.png"),
            PIXI.Assets.load("imagenes/aliados/ensalada/sniper.png")
        ]);

        this.spritesheetsAliados = await Promise.all([
            PIXI.Assets.load("imagenes/Aliados/antiTank/json/texture.json")
            //PIXI.Assets.load("imagenes/Aliados/MachineGunner/Json/texture.json"),
        ])

        this.texturasEnemigos = await Promise.all([
            PIXI.Assets.load("imagenes/enemigos/ensalada/centipede.png"),
            PIXI.Assets.load("imagenes/enemigos/ensalada/hornet.png"),
            PIXI.Assets.load("imagenes/Enemigos/Scarab/texture.json")
        ]);
    }

    listaDeSpritesAliados() {
        return this.texturasAliados;
    }
    listaDeSpritesheetsAliados() {
        return this.spritesheetsAliados;
    }
    listaDeSpritesEnemigos() {
        return this.texturasEnemigos;
    }

    async generarTropas() {
        //const texture = this.seleccionarElementoAleatorioDe_(this.listaDeSpritesAliados());
        const texture = this.seleccionarElementoAleatorioDe_(this.listaDeSpritesheetsAliados());

        for (let i = 0; i < 5; i++) {
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = -10
            const posYRandom = Math.floor(Math.random() * (this.height - 100)) + 100
            const aliadoNuevo = new Aliado(
                //posXRandom, //posición x
                posX, //posición x
                posYRandom, //posición y
                this, //juego
                32, //ancho
                32, //alto
                texture, //textura
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
        const texture = this.seleccionarElementoAleatorioDe_(this.listaDeSpritesEnemigos());
        for (let i = 0; i < 1; i++) {
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = this.width - 10
            //la posicion en Y es un random entre 0 y el alto del juego + 100 para que no se superpongan con el HUD
            const posYRandom = Math.floor(Math.random() * (this.height - 100)) + 100
            const enemigoNuevo = new Enemigo(
                //posXRandom, //posición x
                posX, //posición x
                posYRandom, //posición y
                this, //juego Principal
                16, //ancho
                16, //alto
                texture, //textura
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
        this.presionarHebillaCon_(key, true);
    }

    keysUp(letra) {
        const key = letra.key.toLowerCase();
        this.presionarHebillaCon_(key, false);
        this.generarPoderesCon(key)
    }

    presionarHebillaCon_(unaTecla, estaPresionada) {
        this.keys[unaTecla] = estaPresionada;

        //Si se presiona
        if (estaPresionada) {
            if (unaTecla === "e") this.botonDer.rolarPoderHacia_(1);
            if (unaTecla === "q") this.botonIzq.rolarPoderHacia_(-1);
        }

        //Si se suelta
        else {
            if (unaTecla === "e") {
                this.botonDer.spriteActual = this.botonDer.sprites[1];
                this.botonDer.generarSpriteDe(this.botonDer.spriteActual);
            }
            if (unaTecla === "q") {
                this.botonIzq.spriteActual = this.botonIzq.sprites[1];
                this.botonIzq.generarSpriteDe(this.botonIzq.spriteActual);
            }
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

    aparicionDeEnemigo() {
        if(this.enemigos.length < this.cantEnemigosMinimaEnPantalla) {
            this.generarTropasEnemigas() * this.aliados.length;
        }
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
        this.mouse.tick()
        this.menu.tick()
        this.realizarTickPorCadaAliado()
        this.realizarTickPorCadaEnemigo()
        this.realizarTickPorCadaAvion()
        this.realizarTickPorCadaPoder()
        this.aparicionDeEnemigo()
        this.bateriaVida.tick()
        this.textoEnemigosMuertos.tick()
        this.actualizarVisibilidadDePoderActual()
        //Acciones a repetirse cada frame.
        //this.botonDer.tick();
        //this.botonIzq.tick();
    }
}

const juego = new Juego();