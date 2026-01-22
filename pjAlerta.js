class PjAlerta extends Estado { 
    enter() { //setea la animación de ataque y resetea el cooldown
        if (!this.dueño) return;
        if (this.dueño.estoyMuerto) return;

        //Obtengo al dueño
        const dueño = this.dueño;

        //Guardo su tinte original:
        this.tintOriginal = 0xFFFFFF;

        //Extra: Le cambio cualquier tinte que tenga a su tinte original:
        dueño.container.tint = dueño.tintOriginal;

        //Le agrego un tinte morado al pj:
        dueño.container.tint = 'purple';

        //Su animación será la misma, no hace falta cambiarla.

        //Guardo su velocidad original para su boost de velocidad.

        this.velocidadOriginal = dueño.velocidad.x
    }

    evaluarCambioDeEstado() {
        const dueño = this.dueño;
        dueño.tengoAlgunEnemigoAdelante = false;
        //este for busca el enemigo más cercano y lo asigna como target (si es que existe):
        for (const objetoDeLista of dueño.obtenerLista()) {
            dueño.distanciaDeEnemigoEnX = calcularDistanciaEnX(dueño.posicion, objetoDeLista.posicion)
            dueño.distanciaDeEnemigoEnY = calcularDistanciaEnY(dueño.posicion, objetoDeLista.posicion)
            if (dueño.distanciaDeEnemigoEnX < dueño.radioVisionX && dueño.distanciaDeEnemigoEnY < dueño.radioVisionY) {
                dueño.tengoAlgunEnemigoAdelante = true;
                dueño.enemigoMasCerca = objetoDeLista;
                break;
            }
        }

        //Si existe y esta en su rango de ataque, seteo su estado a "Agresivo".
        if (dueño.tengoAlgunEnemigoAdelante && !dueño.estoyMuerto) {
            dueño.fsm.setear('Jugador_Agresivo');
            return;
        }

        //Si no tengo a ningún enemigo cerca, cambio de estado a "Marchante":
        if (!dueño.tengoAlgunEnemigoAdelante && !dueño.estoyMuerto) {
            dueño.fsm.setear("Jugador_Marchante");
            return;
        }
    }

    update() { //actualiza el estado del pj

        //obtengo al pj
        const dueño = this.dueño;
        if (!dueño) return;
        if (this.dueño.estoyMuerto) return;

        this.evaluarCambioDeEstado();

        //dueño.aceleracion.x = dueño.direccionDeAvance();

        //le agrego un boost de velocidad al enemigo actual
        let boostVelocidad = 0;

        //variando según si es aliado o enemigo:
        if (dueño.constructor.name == "Enemigo") {
            boostVelocidad = boostVelocidad - 0.1
        }
        else {
            boostVelocidad = boostVelocidad + 0.1
        }

        //Y verifico de agregarle dicho boost cuando tenga la velocidad inicial:
        if (this.velocidadOriginal == dueño.velocidad.x) {
            dueño.velocidad.x = dueño.velocidad.x + boostVelocidad;
        }
    }
}