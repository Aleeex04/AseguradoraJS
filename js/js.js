function calcularSeguro() {
    // Obtener valores de entrada
    const fechaNacimiento = new Date(document.getElementById("nacimiento").value);
    const fechaCarnet = new Date(document.getElementById("license_date").value);
    const tipoVehiculo = document.getElementById("vehicle_type").value;
    const fechaMatriculacion = new Date(document.getElementById("registration_date").value);

    // Calcular edad, años con el permiso y antigüedad del coche
    const edad = calcularEdad(fechaNacimiento);
    const anosConPermiso = calcularAnyosCarnet(fechaCarnet);
    const anosCoche = calcularAntiguedadCoche(fechaMatriculacion);

    // Precio base según tipo de seguro
    const preciosBase = {
        "terceros": 500, // Tipo 1
        "terceros_ampliado": 650, // Tipo 2
        "franquicia": 750, // Tipo 3
        "todo_riesgo": 1000 // Tipo 4
    };

    const penalizacionesVehiculo = {
        "diesel": 0.2, // Diesel: 20%
        "gasolina": 0.1, // Gasolina: 10%
        "hibrido": 0.05, // Híbrido: 5%
        "electrico": 0 // Eléctrico: 0%
    };

    const precioBase = preciosBase[document.getElementById("tipo_seguro").value];
    const penalizacionVehiculo = penalizacionesVehiculo[tipoVehiculo] || 0;

    // Calcular precio final
    let precioFinal = precioBase;
    precioFinal = aplicarPenalizacionPorEdad(edad, precioBase, precioFinal);
    precioFinal = descuentoAnyosCarnet(anosConPermiso, precioBase, precioFinal);
    precioFinal = aplicarPenalizacionPorVehiculo(penalizacionVehiculo, precioBase, precioFinal);
    precioFinal = aplicarPenalizacionPorAntiguedadCoche(anosCoche, precioBase, precioFinal);

    alert(`El precio del seguro es: €${precioFinal.toFixed(2)}`);
    mostrarResultados(precioBase, penalizacionVehiculo, precioFinal);
}

// Función para calcular la edad
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    return hoy.getFullYear() - fechaNacimiento.getFullYear() - 
        (hoy.getMonth() < fechaNacimiento.getMonth() || 
        (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate()) ? 1 : 0);
}

// Función para calcular los años con el permiso
function calcularAnyosCarnet(fechaCarnet) {
    const hoy = new Date();
    return hoy.getFullYear() - fechaCarnet.getFullYear() - 
        (hoy.getMonth() < fechaCarnet.getMonth() || 
        (hoy.getMonth() === fechaCarnet.getMonth() && hoy.getDate() < fechaCarnet.getDate()) ? 1 : 0);
}

// Función para calcular la antigüedad del coche
function calcularAntiguedadCoche(fechaMatriculacion) {
    const hoy = new Date();
    return hoy.getFullYear() - fechaMatriculacion.getFullYear();
}

// Función para aplicar incremento por edad
function aplicarPenalizacionPorEdad(edad, precioBase, precioFinal) {
    if (edad < 25) {
        precioFinal += precioBase * 0.1;
        console.log(`Penalización al ser menor de 25 por lo tanto x0.1 == ${precioFinal}`);
    }
    return precioFinal;
}

// Función para aplicar descuento por años con permiso
function descuentoAnyosCarnet(anosConPermiso, precioBase, precioFinal) {
    if (anosConPermiso > 5) {
        precioFinal -= precioBase * 0.1;
        console.log(`Descuento por años con carnet ${anosConPermiso} == ${precioFinal}`);
    }
    return precioFinal;
}

// Función para aplicar penalización por tipo de vehículo
function aplicarPenalizacionPorVehiculo(penalizacionVehiculo, precioBase, precioFinal) {
    precioFinal += precioBase * penalizacionVehiculo;
    console.log(`Penalización por tipo de vehículo: ${penalizacionVehiculo * 100}% == ${precioFinal}`);
    return precioFinal;
}

// Función para aplicar penalización por antigüedad del coche
function aplicarPenalizacionPorAntiguedadCoche(anosCoche, precioBase, precioFinal) {
    if (anosCoche > 10) {
        precioFinal += precioBase * (0.01 * (anosCoche - 10));
        console.log(`Penalización por antigüedad del coche: ${(0.01 * (anosCoche - 10)) * 100}% == ${precioFinal}`);
    }
    return precioFinal;
}

function mostrarResultados(precioBaseSeleccionado, penalizacionVehiculo, precioFinalSeleccionado) {
    const tiposSeguros = ["terceros", "terceros_ampliado", "franquicia", "todo_riesgo"];
    const preciosBase = {
        "terceros": 500,
        "terceros_ampliado": 650,
        "franquicia": 750,
        "todo_riesgo": 1000
    };

    const contenedorResultados = document.getElementById("resultados-container");
    contenedorResultados.innerHTML = ''; // limpiamos resultados previos por si el usuario le vuelve a dar al boton calcular seguro

    tiposSeguros.forEach((tipo) => {
        const precioBaseTipo = preciosBase[tipo];
        let precioFinalTipo = precioBaseTipo;

        // Recalcular valores para cada tipo de seguro
        const fechaNacimiento = new Date(document.getElementById("nacimiento").value);
        const edad = calcularEdad(fechaNacimiento);
        precioFinalTipo = aplicarPenalizacionPorEdad(edad, precioBaseTipo, precioFinalTipo);

        const fechaCarnet = new Date(document.getElementById("license_date").value);
        const anosConPermiso = calcularAnyosCarnet(fechaCarnet);
        precioFinalTipo = descuentoAnyosCarnet(anosConPermiso, precioBaseTipo, precioFinalTipo);

        precioFinalTipo = aplicarPenalizacionPorVehiculo(penalizacionVehiculo, precioBaseTipo, precioFinalTipo);

        const fechaMatriculacion = new Date(document.getElementById("registration_date").value);
        const anosCoche = calcularAntiguedadCoche(fechaMatriculacion);
        precioFinalTipo = aplicarPenalizacionPorAntiguedadCoche(anosCoche, precioBaseTipo, precioFinalTipo);

        // Crear tarjeta
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("col-12", "col-md-3", "mb-4", tipo === document.getElementById("tipo_seguro").value ? "bg-primary" : "bg-light");

        tarjeta.innerHTML = `
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h5>
                    <p class="card-text">Precio: €${precioFinalTipo.toFixed(2)}</p>
                    <button class="btn btn-danger descartar" onclick="descartarTarjeta(this)">Descartar</button>
                    <button class="btn btn-success contratar" onclick="contratarSeguro()">Contratar</button>
                </div>
            </div>
        `;
        contenedorResultados.appendChild(tarjeta);
    });

    // Mostrar sección completa y título
    document.getElementById("resultados").classList.remove("d-none");
    document.querySelector("#resultados h2").classList.remove("d-none");
}

function descartarTarjeta(button) {
  const tarjeta = button.closest(".col-12");
  tarjeta.remove();
}

function contratarSeguro() {
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  alert(`Gracias por contratar. Atentamente tu asesor de seguros ${nombre} ${apellidos}`);
}

// Cambio de estilo al pasar el ratón sobre el botón "Contratar"
document.addEventListener("mouseover", function (e) {
  if (e.target && e.target.classList.contains("contratar")) {
      e.target.style.backgroundColor = "#28a745";
      e.target.style.transform = "scale(1.1)";
  }
});

document.addEventListener("mouseout", function (e) {
  if (e.target && e.target.classList.contains("contratar")) {
      e.target.style.backgroundColor = "";
      e.target.style.transform = "";
  }
});
