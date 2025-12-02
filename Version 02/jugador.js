class Jugador extends ObjetoDinamico {
    sprite;
    enemigo;
    distanciaParaLlegar = 300;
    constructor(x, y, juegoPrincipal, width, height, radioColision, radioVision, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion }; // Aceleración en píxeles/frame²
        this.scaleX = scaleX || 1; //para hacer más ancho al pj
        this.fuerza = 1.5;

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        this.generarNombreAleatorio();
    }

    async start() {
        await this.cargarSpriteAnimado();
    }

    // generarSpriteDe(unSprite) {
    //     //este console log sirve para ver cuántos hijos hay en el stage antes y después de agregar el sprite
    //     //console.log("Stage children antes:", this.juego.pixiApp.stage.children.length);
    //     this.sprite = new PIXI.Sprite(unSprite);

    //     this.sprite.anchor.set(0.5);

    //     //Ajuste de ubicacion
    //     this.sprite.x = this.x;
    //     this.sprite.y = this.y;

    //     //Ajuste de tamaño
    //     this.sprite.width = this.width;
    //     this.sprite.height = this.height;

    //     this.sprite.zIndex = 1100;
    //     this.juego.pixiApp.stage.addChild(this.sprite);
    //     //este console log sirve para ver cuántos hijos hay en el stage antes y después de agregar el sprite
    //     //console.log("Stage children después:", this.juego.pixiApp.stage.children.length);
    // }

    listaDeSpritessheetsDisponibles() {
        return this.juego.spritesheetsJugador;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    tick() {
        if(this.juego.keys["w"]) {
            this.aceleracion.x 
        }
        this.aplicarFisica();
        this.render();
    }
}