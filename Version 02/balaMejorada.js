class BalaMejorada extends GameObject {
    radioColision;
    radioVision;
    velocidadMaxima = 3;
    aceleracionMaxima = 1.5;
    constructor (x, y, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, aceleracion, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //se crea el contenedor del sprite
        this.container = new PIXI.Container();

        this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.zIndex = 200

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.scale.x = this.scaleX;

        //añade el sprite dentro del contenedor y no directamente al stage del juego
        //ya que el contenedor se encarga de manejar la posición del sprite
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

    //cada tick se efectua en la clase juego en el método realizarTickPorCadaBala()
    // llamado desde el tick principal del juego
    tick() {
        this.aplicarFisica();
        this.render();
    }
}

