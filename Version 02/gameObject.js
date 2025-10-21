class GameObject {
    x;
    y;
    sprite;
    radioColision;
    id;
    juego; //el mismo juego, así se puede comunicar de forma más simple con el juego principal. No es necesario el pixiApp así.
    
    constructor(x, y, juego){
        //Se le indica la posición general, creando una variable nueva que guarde posición en ambos ejes.
        this.posicion = {x: x, y: y};

        //Identificador de juego (canvas para el objeto) y de la instancia del objeto:
        this.juego = juego
        this.id = Math.floor(Math.random() * 99999999);
    }

    tick() {
        //acciones a repetir cada rato, en el GameObject aún no se plantean
    }
}