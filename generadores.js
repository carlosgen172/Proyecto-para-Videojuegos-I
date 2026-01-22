class Generador extends GameObject {
    constructor(x, y, juego, juegoPrincipal) {
        super(x, y, juego)
        this.juegoPrincipal = juegoPrincipal
    }

    async generarTodo() {
        this.generarAvion()
    }
    async generarAvion() {
        const texturaAvion = await PIXI.Assets.load("imagenes/avion_bombardero.png");

        for(let i = 0; i < 5; i++){
            //const posXRandom = Math.floor(Math.random() * this.width)
            const posX = this.width + 10
            const posYRandom = Math.floor(Math.random() * this.height) 
            const avionNuevo = new Avion(
                //posXRandom, //posición x
                posX, //posición x
                posYRandom, //posición y
                this.juego, //juego
                this.juegoPrincipal, //juego Principal
                64, //ancho
                64, //alto
                texturaAvion, //textura
                15, //radio de colisión
                20, //radio de visión
                5, //velocidad
                10, //velocidad máxima
                3, //aceleración
                5, //aceleración máxima
                1 //escala en x (puede eliminarse si se quiere, no cambia ni agrega mucho)
            )
            this.juegoPrincipal.aviones.push(avionNuevo)
        }
        this.ultimoAvion = avionNuevo
        
    }

    async generarAvionSiCorresponde() {
        //if (!this.juegoPrincipal.aviones) return;
        //if (!this.ultimoAvion.terminoViaje()) return;
        this.generarAvion()
    }
}