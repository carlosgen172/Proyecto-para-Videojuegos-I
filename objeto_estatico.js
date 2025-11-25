class ObjetoEstatico extends gameObject {
    radioColision;
    radioAcercamiento; //este puede ser el radio por el cual el bot/pj principal va a empezar a lentearse, o, que cuando entre a esta area, vaya disminuyendo la velocidad.

    constructor(x, y, juego, width, height) {
        super(x, y, juego)
        this.width = width;
        this.height = height;
    }
    
    render() {
        //no va nada, por ahora.
    }

    tick() {
        this.render()
    }
}