class Fsm {
    constructor(dueño) {
        this.dueño = dueño; //se le pasa el dueño de esta desición de estados.
        this.estados = {};
        this.estadoActual = null;
    }

    anadir(nombre, nombreInstancia) { //se le añaden los estados correspondientes
        this.estados[nombre] = nombreInstancia; //Esto, basicamente le dice que el nombre de estado que se le setee, "jugadorEnojado", es un objeto del estado correspondiente (Pj_Enojado)
        nombreInstancia.fsm = this; //Se le igualan a la clase estado la fsm general.
        nombreInstancia.dueño = this.dueño; //El dueño de la instancia es el mismo que el que se le pasa generalmente.
    }

    setear(nombre) { //se le setea el estado actual, indicando su estado nuevo y anterior al mismo.
        if (!this.estados [nombre]) { //Si dicho estado no existe, arroja un mensaje con error
            throw newError('El Estado con nombre ${nombre}' + " no existe")
        }
        const estadoAnterior = this.estadoActual; //El estado anterior pasa a ser el que era el actual.
        if (estadoAnterior === nombre) return; //Si el anterior es el mismo que se quiere setear, entonces no hace nada.
        if (estadoAnterior && this.estados[estadoAnterior] && this.estados[estadoAnterior].exit === "function") { //Condicional para eliminar el estado anterior.
            this.estados[estadoAnterior].exit(nombre)
        }
        this.estadoActual = nombre; //Se setea el nuevo estado
        
        const estadoNuevo = this.estados[this.estadoActual]; //El estado nuevo pasa a formar parte de los estados en general.
        if (estadoNuevo && typeof estadoNuevo.enter === "function") { //Y entra al enter del estado nuevo.
            estadoNuevo.enter(estadoAnterior);
        }
    }

    update() { //Se rechequea constanemente las condiciones en las qe se encuentra el estado actual para decidir lo que tiene que hacer (si quedarse en el estado que está o salir a uno nuevo).
        const estado = this.estados[this.estadoActual]
        if (estado && typeof estado.update === "function") {
            estado.update();
        }
    }
}