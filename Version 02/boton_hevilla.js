class BotonHevilla extends Boton {
    constructor(x, y, juego, width, height, sprite, segundoSprite, direccion) {
        super(x, y, juego, width, height);
        this.direccion = direccion;
        this.segundoSprite = segundoSprite;
        this.sprites = {
            1: sprite,
            2: segundoSprite
        }
        this.textura = this.sprites[1];
        this.generarSpriteDe(this.textura);
    }

    rolarPoderHacia_(direccion) {
        //if(this.juego.poderActual == this.juego.poderes[0]) return;
        let indicePoderActual = this.juego.poderes.indexOf(this.juego.poderActual) + direccion;

        if (indicePoderActual < 0) {
            indicePoderActual = this.juego.poderes.length - 1;
        }
        else if (indicePoderActual >= this.juego.poderes.length) {
            indicePoderActual = 0;
        }

        this.juego.poderActual = this.juego.poderes[indicePoderActual]
        console.log("poderes disponibles: ", this.juego.poderes)
        console.log("poder actual:", this.juego.poderActual)

        this.juego.actualizarVisibilidadDePoderActual();
    }

    actualizarSpritesSegunDireccionHacia_(direccion, prendido) {
        if (direccion === 1) {
            if (prendido) {
                this.juego.botonDer.sprite.texture = this.juego.botonDer.sprites[2];
            } else {
                this.juego.botonDer.sprite.texture = this.juego.botonDer.sprites[1];
            }
        } else if (direccion === -1) {
            if (prendido) {
                this.juego.botonIzq.sprite.texture = this.juego.botonIzq.sprites[2];
            } else {
                this.juego.botonIzq.sprite.texture = this.juego.botonIzq.sprites[1];
            }
        }

        this.botonDer.sprite.visible = !!this.puedeJugar;
        this.botonIzq.sprite.visible = !!this.puedeJugar;
    }


    tick() {
        //this.cambiarCondicionSiCorresponde();
        //this.cambiarSpriteAInteractuadoPor(unaLetra);
        //this.cambiarSpriteANoInteractuado();
        //this.generarSpriteDe(this.spriteActual);
        //console.log(this.spriteActual);
    }
}