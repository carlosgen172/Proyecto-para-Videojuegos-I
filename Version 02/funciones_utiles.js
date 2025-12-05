//Funciones de Listas:

//Función para serciorarse de que existe un elemento en una lista:
function existeElElemento_EnLaLista_(unElemento, unaLista) {
    return (unaLista.includes(unElemento))
}

//Función para Encontrar el índice de un elemento en una lista:
function indiceDeElemento_EnLaLista_(unElemento, unaLista) {
    let indice = null;
    if (this.existeElElemento_EnLaLista_(unElemento, unaLista)) {
        indice = unaLista.indexOf(unElemento);
    }
    return indice;
}

//Función para selcccionar un elemeno aleatorio de una lista:
function seleccionarElementoAleatorioDe_(unaLista) {
    const indiceAleatorio = Math.floor(Math.random() * unaLista.length);
    return unaLista[indiceAleatorio];
}

//función para eliminar un elemento de una lista (no funca bien :I):
function eliminarElElemento_DeLaLista_(unElemento, unaLista) {
    if (existeElElemento_EnLaLista_(unElemento, unaLista)) {
        unaLista.splice(indiceDeElemento_EnLaLista_(unElemento, unaLista), 1)
    }
}