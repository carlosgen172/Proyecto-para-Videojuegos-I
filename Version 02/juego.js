class Juego {
    pixiApp;
    width;
    height;
    fondo;
    hud;
    jugador;
    aliados = [];
    enemigos = [];
    
    constructor(){
        this.width = 500;
        this.height = 350;
        
        this.mouse = {posicion: {x: 0, y: 0}};
        this.initPIXI();
    }

    async initPIXI() {
        const preconfiguraciones = {
            background: "#043100ff",
            width: this.width,
            height: this.height
        }

        this.pixiApp = new PIXI.Application(preconfiguraciones);
        await this.pixiApp.init(preconfiguraciones);

        this.pixiApp.renderer.canvas.style.position = "absolute";

        document.body.appendChild(this.pixiApp.canvas);
        
        this.pixiApp.stage.interactive = true;
        await this.cargarBackground();
        await this.generarMouse();
        this.generarTropas();
        await this.cargarFondoHUD();
        await this.generarBotonesDelHUD();
        this.containerPrincipal = new PIXI.Container();
        this.agregarInteractividadDelMouse();
        this.pixiApp.ticker.add(this.gameLoop.bind(this));
        
    }

    async generarMouse() {
        //aquí se genera el mouse.
        //this.mouse = new Mouse { ancho, alto, x, y, color}
        const texture = await PIXI.Assets.load("imagenes/posible_puntero.png");
        this.mouse = new Mouse(
            32,
            32,
            this.mouse.posicion.x,
            this.mouse.posicion.y,
            this.pixiApp,
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
    }
    }

    convertirCoordenadaDelMouse(mouseX, mouseY) {
    // Convertir coordenadas del mouse del viewport a coordenadas del mundo
    // teniendo en cuenta la posición y escala del containerPrincipal
        return {
            //x: (mouseX - this.juego.canvas.data.global.x) / this.zoom,
            //y: (mouseY - this.juego.canvas.data.global.y) / this.zoom,
            x: (mouseX - this.juego.containerPrincipal.x) / this.zoom,
            y: (mouseY - this.juego.containerPrincipal.y) / this.zoom,
        };
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

    async generarTropas() {
        const texture = await PIXI.Assets.load("imagenes/posible_puntero_2.png");
        //console.log(texture)
        for(let i = 0; i < 20; i++){
            const posXRandom = Math.floor(Math.random() * this.width)
            const posYRandom = Math.floor(Math.random() * this.height) 
            const aliadoNuevo = new Aliado(
                posXRandom, //posición x
                posYRandom, //posición y
                this.pixiApp, //juego
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
        const texturaDer = await PIXI.Assets.load("imagenes/hevilla_der.png");
        const texturaDerPres = await PIXI.Assets.load("imagenes/hevilla_der_pres.png");
        const texturaIzq = await PIXI.Assets.load("imagenes/hevilla_izq.png");
        const texturaIzqPres = await PIXI.Assets.load("imagenes/hevilla_izq_pres.png");
        this.botonDer = new BotonHevilla(
            50, //ancho
            50, //alto
            150, //x
            25, //y
            texturaDer, //sprite
            texturaDerPres, //textura
            "der", //direccion
            this.pixiApp //juego
        )
        this.botonIzq = new BotonHevilla(
            50, //ancho
            50, //alto
            175, //x
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

    async cargarFondoHUD() {
        // Carga la imagen usando Assets.load()
        // Esto devuelve una Promise que resuelve la Textura de la imagen
        const texture = await PIXI.Assets.load('imagenes/hud_1.png'); // Reemplaza con la ruta de tu imagen

        // Crea un Sprite a partir de la Textura cargada
        this.hud = new PIXI.TilingSprite(texture);

        //Ajuste de punto central
        this.hud.anchor.set(0.5);


        //Ajuste de ubicacion
        this.hud.x = 250
        this.hud.y = 25

        //Ajuste de tamaño
        this.hud.width = this.width;
        this.hud.height = 50;

        // Añade el Sprite al escenario para que se muestre en pantalla
        this.pixiApp.stage.addChild(this.hud);
    }

    realizarTickPorCadaAliado() {
        for (let unAliado of this.aliados) {
            unAliado.tick()
        }
    }

    gameLoop(time) {
        this.mouse.tick();
        this.realizarTickPorCadaAliado()
        //Acciones a repetirse cada frame.
        //this.botonDer.tick();
        //this.botonIzq.tick();
    }
}

const juego = new Juego();