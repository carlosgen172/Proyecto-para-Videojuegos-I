class BateriaVida extends GameObject {
    width;
    height;
    x;
    y;
    juego;
    sprite;
    estado;
    spriteActual; 

    constructor(width, height, x, y, juego, sprite, segundoSprite, tercerSprite, cuartoSprite) {
        super(x, y, juego);
        this.x = x;
        this.y = y;
        // this.posicion = {x: x, y: y};
        this.width = width;
        this.height = height;
        this.juego = juego;
        
        this.sprites = {
            1 : sprite, //full vida
            2 : segundoSprite,
            3 : tercerSprite,
            4 : cuartoSprite //vida vacía
        }
        this.spriteActual = this.sprites[1];
        this.generarSpriteDe(this.spriteActual);
    }

    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        
        //Ajustes de anchura
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.zIndex = 1100;

        //Añadir el sprite dentro del stage:
        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    actualizarSpriteSegunSaludDelJugador() { //modificar esta lógica según la vida del jugador (no del último aliado)
        if (!this.juego.aliados) return;
        this.jugadorActual = this.juego.aliados[this.juego.aliados.length - 1]
        // console.log(this.juego.aliados)
        // console.log("jugador Actual: ", this.jugadorActual)
        //La salud del jugador debe poder dividirse por 3 (o 9 o algún otro valor relativamente alto)
        if (!this.jugadorActual) return; //si el jugador llega a ser vacío (No queda jugador) no va a tirar error, simplemente se quedará con el último sprite que haya conseguido agregar
        
        if (this.jugadorActual.vida >= 7) {
            this.spriteActual = this.sprites[1]
        }
        else if (esEntre(this.jugadorActual.vida, 4, 6)) {
            this.spriteActual = this.sprites[2]
        } 
        else if(esEntre(this.jugadorActual.vida, 1, 3)) {
            this.spriteActual = this.sprites[3]
        } 
        else {
            this.spriteActual = this.sprites[4]
        }
        this.generarSpriteDe(this.spriteActual)
        //console.log("la bateria ha cambiado a: ", this.spriteActual)
        
    }

    tick() {
        this.actualizarSpriteSegunSaludDelJugador();
    }
}