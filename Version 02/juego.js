//import {baseNombres, baseApellidos} from 'baseNombresYApellidos.js'; (No funciona)
class Juego {
    pixiApp;
    width;
    height;
    fondo;
    hud;
    jugador;
    aliados = [];
    enemigos = [];
    aviones = [];
    keys = {}; //para generar las tropas (aliadas o enemigas) y para generar las bombas
    //poderes = [1, 2, 3];
    //poderActual = poderes[0]
    nombres = ["Angel", "Arturo", "Ariel", "Elian", "Federico", "Juan", "Jose", "Joseías", "Marcos", "Mauricio", "Lionel", "Omar"]
    apellidos = ["Aguiar", "Bautista", "Jose", "Potter", "Rodriguez", "Villalva", "Zapata"]

    constructor(){
        this.width = 700;
        this.height = 500;
        
        this.mouse = {posicion: {x: 0, y: 0}};
        
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
        this.generarTropas();
        //await this.generarAvion();
        await this.cargarFondoHUD();
        await this.generarBotonesDelHUD();
        this.containerPrincipal = new PIXI.Container();
        this.agregarInteractividadDelMouse();
        this.pixiApp.ticker.add(this.gameLoop.bind(this));
        
    }

    async crearGenerador() {
        this.generadorPrincipal = new Generador(
            0,
            0,
            this.pixiApp,
            this
        )
    }

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

    async generarTropas() {
        const texture = await PIXI.Assets.load("imagenes/posible_puntero_2.png");
        //console.log(texture)
        for(let i = 0; i < 5; i++){
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = -10
            const posYRandom = Math.floor(Math.random() * this.height) 
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
                5, //velocidad
                10, //velocidad máxima
                3, //aceleración
                5, //aceleración máxima
                1 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
            )
            this.aliados.push(aliadoNuevo)
        }
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
            50, //ancho (es NaN, hace falta revisar porque :o )
            50, //alto
            (this.width / 2) + 45, //x
            25, //y
            texturaDer, //sprite
            texturaDerPres, //textura
            "der", //direccion
            this.pixiApp //juego
        )
        this.botonIzq = new BotonHevilla(
            50, //ancho
            50, //alto
            (this.width / 2) - 45, //x
            25, //y
            texturaIzq, //sprite
            texturaIzqPres, //textura
            "izq", //direccion
            this.pixiApp //juego
        )
        //this.pixiApp.stage.addChild(this.botonDer);
        //this.pixiApp.stage.addChild(this.botonIzq);
    }

    async cargarBackground() {
        // Carga la imagen usando Assets.load()
        // Esto devuelve una Promise que resuelve la Textura de la imagen
        const texture = await PIXI.Assets.load('imagenes/boton_flecha_hud_der.png'); // Reemplaza con la ruta de tu imagen

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

    keysDown(letra){
        this.keys[letra.key.toLowerCase()] = true;
    }

    keysUp(letra){
        this.keys[letra.key.toLowerCase()] = false;
        this.generarTropasEnemigasCon(letra)
        this.generarAvionesCon(letra)
        this.generarTropasAliadasCon(letra)
    }

    async generarTropasEnemigas() {
        const texture = await PIXI.Assets.load("imagenes/enemigos_eliminados.png");
        //console.log(texture)
        for(let i = 0; i < 5; i++){
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = this.width - 10
            const posYRandom = Math.floor(Math.random() * this.height) 
            const enemigoNuevo = new Enemigo(
                //posXRandom, //posición x
                posX, //posición x
                posYRandom, //posición y
                this, //juego Principal
                32, //ancho
                32, //alto
                texture, //textura
                15, //radio de colisión
                20, //radio de visión
                5, //velocidad
                10, //velocidad máxima
                3, //aceleración
                5, //aceleración máxima
                1 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
            )
            this.enemigos.push(enemigoNuevo)
        }
    }

    async generarMenu() {
        const texturaMenu = await PIXI.Assets.load("imagenes/ejemplo1.png")
        // Crea un Sprite a partir de la Textura cargada
        
        let configMenu = {
            "alto" : 500,
            "ancho": 500,
            "posX": this.width/2,
            "posY": this.height/2,
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
        if (!this.aviones || ((this.aviones.length >= 1) && (this.ultimoAvion.terminoViaje()))) {
            this.generarAvion(); //no genera ningun avión :c
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
    
    generarTropasAliadasCon(unaTecla) {
        if(unaTecla.key.toLowerCase() === "1") {
            this.generarTropas()
        }
    }

    generarAvionesCon(unaTecla) {
        if(unaTecla.key.toLowerCase() === "2") {
            //this.generadorPrincipal.generarAvion()
            //this.generarAvionSiCorresponde()
            this.generarAvion()
            //console.log("esta funcionando?")
        }
        
    }

    generarTropasEnemigasCon(unaTecla) {
        if(unaTecla.key.toLowerCase() === "3") {
            this.generarTropasEnemigas()
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
            unEnemigo.tick()
        }
    }

    //FUNCIONES DE BÚSQUEDA Y ELIMINACIÓN DE ELEMENTOS (NO funciona correctamente):
    existeElElemento_EnLaLista_(unElemento, unaLista){
        return(unaLista.includes(unElemento))
    }

    indiceDeElemento_EnLaLista_(unElemento, unaLista) {
        let indice = null;
        if(this.existeElElemento_EnLaLista_(unElemento, unaLista)) {
            indice = unaLista.indexOf(unElemento);
        }
        return indice;
    }

    eliminarElElemento_DeLaLista_(unElemento, unaLista) {
        if(this.existeElElemento_EnLaLista_(unElemento, unaLista)) {
            unaLista.splice(this.indiceDeElemento_EnLaLista_(unElemento, unaLista), 1)
        }
    }

    seleccionarElementoAleatorioDe_(unaLista) {
        const indiceAleatorio = Math.floor(Math.random() * unaLista.length);
        return unaLista[indiceAleatorio];
    }

    //No funciona, reemplazado por otro código:
    verificacionDeVidaAliados() {
        for (let aliado of this.aliados) {
            if (aliado.estoyMuerto()) {
                aliado.morir();
            }
        }
    }

    verificacionDeVidaEnemigos() {
        for (let enemigo of this.enemigos) {
            if (enemigo.estoyMuerto()) {
                enemigo.morir();
            }
        }
    }

    gameLoop(time) {
        this.mouse.tick()
        //console.log(this.menu)
        this.menu.tick()
        this.realizarTickPorCadaAliado()
        this.realizarTickPorCadaEnemigo()
        this.realizarTickPorCadaAvion()
        //this.verificacionDeVidaAliados()
        //this.verificacionDeVidaEnemigos()
        //Acciones a repetirse cada frame.
        //this.botonDer.tick();
        //this.botonIzq.tick();
    }
}

const juego = new Juego();