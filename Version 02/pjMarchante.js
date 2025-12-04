class PjMarchante extends Estado {
    enter() { //setea la animación de ataque y resetea el cooldown
        if (!this.dueño) return;
        //Obtengo al dueño
        const dueño = this.dueño;

        //Guardo su tinte original:
        this.tintOriginal = 0xFFFFFF;

        //Y seteo su animación actual a la de "correr":
        if (dueño?.cambiarAnimacion) dueño.cambiarAnimacion("correr", true)
        
        //Extra: Le cambio cualquier tinte que tenga a su tinte original:
        //dueño.container.tint = this.tintOriginal;
        
        // console.log("Estoy marchante!");
        // dueño.delayAtaque = 0;
        // this.velocidadOriginal = dueño.velocidad.x
    }

    evaluarCambioDeEstado() {
        const dueño = this.dueño;

        //este for busca el enemigo más cercano y lo asigna como target (si es que existe):
        for (const objetoDeLista of dueño.obtenerLista()) {
            dueño.distanciaDeEnemigoEnX = calcularDistanciaEnX(dueño.posicion, objetoDeLista.posicion)
            dueño.distanciaDeEnemigoEnY = calcularDistanciaEnY(dueño.posicion, objetoDeLista.posicion)
            if (dueño.distanciaDeEnemigoEnX < dueño.radioVision && dueño.distanciaDeEnemigoEnY < 75) {
                dueño.tengoAlgunEnemigoAdelante = true;
                dueño.enemigoMasCerca = objetoDeLista;
                break;
            }
        }

        //Si está cerca (pero no tanto para atacarlo):
        if (dueño.distanciaDeEnemigoEnX < dueño.radioVision + 50 && dueño.distanciaDeEnemigoEnY < 75) {
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
        
        this.evaluarCambioDeEstado();

        //este for busca el enemigo más cercano y lo asigna como target
        // for (const objetoDeLista of dueño.obtenerLista()) {
        //     dueño.distanciaDeEnemigoEnX = calcularDistanciaEnX(dueño.posicion, objetoDeLista.posicion)
        //     dueño.distanciaDeEnemigoEnY = calcularDistanciaEnY(dueño.posicion, objetoDeLista.posicion)
        //     //if (dueño.distanciaDeEnemigoEnX < Math.random() * 300 && dueño.distanciaDeEnemigoEnY < 50) {
        //     if (dueño.distanciaDeEnemigoEnX < dueño.radioVision && dueño.distanciaDeEnemigoEnY < 50) {
        //         dueño.tengoAlgunEnemigoAdelante = true;
        //         dueño.enemigoMasCerca = objetoDeLista;
        //         break;
        //     }
        // }
        
        //Estos condicionales sirve para decidir si avanzar o atacar:

        //Si no tengo a ningún enemigo cerca, actúo normal.
        // if (!dueño.tengoAlgunEnemigoAdelante && !dueño.estoyMuerto) {
            //Su aceleración será igual a su dirección de avance:
            dueño.aceleracion.x = dueño.direccionDeAvance();
        // }

    }
}