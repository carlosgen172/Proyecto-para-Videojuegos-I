class BotonHevilla extends Boton {
    constructor(x, y, juego, width, height, sprite, segundoSprite, direccion) {
        super(x, y, juego, width, height);
        this.direccion = direccion;
        this.segundoSprite = segundoSprite;
        this.sprites = {
            1 : sprite,
            2 : segundoSprite
        }
        this.sprite = this.sprites[1];
        this.generarSpriteDe(this.sprite);
    }

    rolarPoderHacia_(direccion) {
        //if(this.juego.poderActual == this.juego.poderes[0]) return;
        let indicePoderActual = this.juego.poderes.indexOf(this.juego.poderActual) + direccion;
        console.log("índice poder actual antes de ajuste:", indicePoderActual)
        if(indicePoderActual < 0) {
            indicePoderActual = this.juego.poderes.length - 1;
            console.log("dando la vuelta a los poderes:", indicePoderActual)
        }
        else if(indicePoderActual >= this.juego.poderes.length) {
            indicePoderActual = 0;
            console.log("dando la vuelta a los poderes parte 2:", indicePoderActual)
        }
        this.juego.poderActual = this.juego.poderes[indicePoderActual]
        console.log("poderes disponibles: ", this.juego.poderes)
        console.log("poder actual:", this.juego.poderActual)

        this.juego.actualizarVisibilidadDePoderActual();
        if(direccion == 1) {
            this.juego.botonDer.spriteActual = this.juego.botonDer.sprites[2];
            this.juego.botonDer.generarSpriteDe(this.sprite);
        }
        else if(direccion == -1) {
            this.juego.botonIzq.spriteActual = this.juego.botonIzq.sprites[2];
            this.juego.botonIzq.generarSpriteDe(this.sprite);
        }
    }

    tick() {
        //this.cambiarCondicionSiCorresponde();
        //this.cambiarSpriteAInteractuadoPor(unaLetra);
        //this.cambiarSpriteANoInteractuado();
        //this.generarSpriteDe(this.spriteActual);
        //console.log(this.spriteActual);
    }
}