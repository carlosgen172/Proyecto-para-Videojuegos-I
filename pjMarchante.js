class PjMarchante extends Estado {
    enter() { //setea la animación de ataque y resetea el cooldown
        if (!this.dueño) return;
        if (this.dueño.estoyMuerto) return;

        //Obtengo al dueño
        const dueño = this.dueño;

        //Guardo su tinte original:
        this.tintOriginal = 0xFFFFFF;

        //Al verificar que existe dueño y la funcion de cambiar animacion, seteo su animación actual a la de "correr":
        if (dueño?.cambiarAnimacion) dueño.cambiarAnimacion("correr", true)

        //Extra: Le cambio cualquier tinte que tenga a su tinte original:
        dueño.container.tint = this.tintOriginal;

        // console.log("Estoy marchante!");
        // dueño.delayAtaque = 0;
        // this.velocidadOriginal = dueño.velocidad.x
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

        //Si está cerca (pero no tanto para atacarlo):
        if (dueño.distanciaDeEnemigoEnX < dueño.radioDeteccionLejanaX && dueño.distanciaDeEnemigoEnY < dueño.radioDeteccionLejanaY) {
            this.fsm.setear('Jugador_Alerta');
            return;
        }

        //Si esta en su rango de ataque, calcula el cooldown.
        if (dueño.tengoAlgunEnemigoAdelante && !dueño.estoyMuerto) {
            dueño.fsm.setear('Jugador_Agresivo');
            return;
        }
    }

    update() { //actualiza el estado del pj

        //obtengo al pj
        const dueño = this.dueño;
        if (!dueño) return;
        if (this.dueño.estoyMuerto) return;

        this.evaluarCambioDeEstado();

        dueño.aceleracion.x = dueño.direccionDeAvance();

    }
}