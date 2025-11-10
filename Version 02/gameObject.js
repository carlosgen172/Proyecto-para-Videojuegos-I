class GameObject {
    x;
    y;
    sprite;
    radioColision;
    id;
    juego; //el mismo juego, así se puede comunicar de forma más simple con el juego principal. No es necesario el pixiApp así.
    
    constructor(x, y, juego){
        //Se le indica la posición general, creando una variable nueva que guarde posición en ambos ejes.
        this.x = x;
        this.y = y;
        this.posicion = {x: x, y: y};

        //Identificador de juego (canvas para el objeto) y de la instancia del objeto:
        this.juego = juego
        this.id = Math.floor(Math.random() * 99999999);
    }

    calcularZindex() {
        const base = this.juego.BASE_Z_INDEX;

        if (!this.sprite) return this.posicion.y + base;

        if (this.isometric) {
            return this.posicion.y - this.sprite.width * 0.29 + base;
        } else {
            if (this.muerto) {
            //como el dibujo de los chabones cuando mueren es q se caen palante...
            return this.posicion.y - this.sprite.height * 0.66 + base;
            } else {
                return this.posicion.y + base;
            }
        }
    }

    getPosicionCentral() {
        if (!this.sprite) return this.posicion;
        return {
            x: this.posicion.x,
            y: this.posicion.y + this.calcularOffsetY() - this.radio * 0.25,
        };
    }

    calcularOffsetY() {
        if (!this.sprite) return 0;
        return this.isometric ? -this.container.width * 0.29 : 0;
    }

    //render() {
    //}

    /*
    render() {
        if (!this.container) return;

        this.container.x = this.posicion.x;
        this.container.y = this.posicion.y;
        
        try {
            this.container.zIndex = this.calcularZindex();
        } catch (e) {
            console.warn(e);
        }

        try {
            this.cambiarTintParaSimularIluminacion();
        } catch (e) {
            console.warn(e);
        }

        this.actualizarBarritaVida();
    }
    */

    render() {
        if (!this.sprite) return;

        this.sprite.x = this.posicion.x;
        this.sprite.y = this.posicion.y;
        
        try {
            this.sprite.zIndex = this.calcularZindex();
        } catch (e) {
            console.warn(e);
        }

        /*
        try {
            this.cambiarTintParaSimularIluminacion();
        } catch (e) {
            console.warn(e);
        }
        */
    }

    tick() {
        //acciones a repetir cada rato, en el GameObject aún no se plantean
    }
}