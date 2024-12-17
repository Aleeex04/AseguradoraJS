// Validación del formulario
const formulario = document.querySelector("form");
formulario.addEventListener("submit", function (event) {
    // Prevenir el envío del formulario para validar primero
    event.preventDefault();

    // Validar los datos
    if (!validateName(document.getElementById("nombre")) || !validateName(document.getElementById("apellidos"))) {
        alert("El nombre y los apellidos solo pueden contener letras y no pueden estar vacíos.");
        return;
    }

    if (!validateDNI(document.getElementById("dni"))) {
        alert("El DNI debe tener el formato válido: ocho dígitos seguidos de una letra mayúscula.");
        return;
    }

    if (!validateBirthdate(document.getElementById("nacimiento"))) {
        alert("Debes ser mayor de 18 años.");
        return;
    }

    if (!validateLicenseDate(document.getElementById("license_date"))) {
        alert("La fecha del carnet de conducir no puede ser posterior a la fecha actual.");
        return;
    }

    if (!validateRegistrationDate(document.getElementById("registration_date"))) {
        alert("La fecha de matriculación no puede ser posterior a la fecha actual.");
        return;
    }

    if (!validateLicensePlate(document.getElementById("matricula"))) {
        alert("La matrícula debe tener el formato válido: 1234-ABC.");
        return;
    }

    if (!validatePostalCode(document.getElementById("postalcode"))) {
        alert("El código postal debe ser un número de 5 dígitos.");
        return;
    }

    // Validar imagen (solo JPG)
    const input = document.getElementById("license_photo");
    if (!input.files || !input.files[0] || input.files[0].type !== 'image/jpeg') {
        alert("La foto del carnet debe ser una imagen en formato JPG.");
        return;
    }

    // Llamar a la función calcularSeguro si todas las validaciones son correctas
    calcularSeguro();
});


function calcularSeguro() {
  const fechaNacimiento = new Date(document.getElementById("nacimiento").value);
  const fechaCarnet = new Date(document.getElementById("license_date").value);
  const tipoVehiculo = document.getElementById("vehicle_type").value;
  const fechaMatriculacion = new Date(document.getElementById("registration_date").value);

  // Calcular edad del conductor
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear() - 
      (hoy.getMonth() < fechaNacimiento.getMonth() ||
      (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate()) ? 1 : 0);

  // Calcular años con el permiso
  const anosConPermiso = hoy.getFullYear() - fechaCarnet.getFullYear() - 
      (hoy.getMonth() < fechaCarnet.getMonth() ||
      (hoy.getMonth() === fechaCarnet.getMonth() && hoy.getDate() < fechaCarnet.getDate()) ? 1 : 0);

  // Calcular antigüedad del coche
  const anosCoche = hoy.getFullYear() - fechaMatriculacion.getFullYear();

  // Precio base según tipo de seguro
  const preciosBase = {
      "terceros": 500, // Tipo 1
      "terceros_ampliado": 650, // Tipo 2
      "franquicia": 750, // Tipo 3
      "todo_riesgo": 1000 // Tipo 4
  };
  
  // Penalizaciones por tipo de vehículo y combustible
  const penalizacionesVehiculo = {
      "diesel": 0.2, // Diesel: 20%
      "gasolina": 0.1, // Gasolina: 10%
      "hibrido": 0.05, // Híbrido: 5%
      "electrico": 0 // Eléctrico: 0%
  };

  const precioBase = preciosBase[document.getElementById("tipo_seguro").value] || 0;
  const penalizacionVehiculo = penalizacionesVehiculo[tipoVehiculo] || 0;


  if (precioBase === 0) {
      alert("Selecciona un tipo de seguro válido.");
      return;
  }

  // Calcular precio final
  let precioFinal = precioBase;

  // Incremento por edad (< 25 años)
  if (edad < 25) {
      precioFinal += precioBase * 0.1;
      console.log("Es menor de 25 por lo tanto x0.1");
  }

  // Descuento por años con permiso (> 5 años)
  if (anosConPermiso > 5) {
      precioFinal -= precioBase * 0.1;
      console.log("Descuento por años con carnet " + anosConPermiso);
  }

  // Incremento por tipo de vehículo
  precioFinal += precioBase * penalizacionVehiculo;
  console.log(`Penalización por tipo de vehículo (${tipoVehiculo}): ${penalizacionVehiculo * 100}%`);

  // Penalización por antigüedad del coche (> 10 años)
  if (anosCoche > 10) {
      precioFinal += precioBase * (0.01 * (anosCoche - 10));
      console.log(`Penalización por antigüedad del coche: ${0.01 * (anosCoche - 10) * 100}%`);
  }

  alert(`El precio del seguro es: €${precioFinal.toFixed(2)}`);
  mostrarResultados(precioBase, penalizacionVehiculo, precioFinal);
}

function mostrarResultados(precioBase, penalizacionVehiculo, precioFinal) {
  const tiposSeguros = ["terceros", "terceros_ampliado", "franquicia", "todo_riesgo"];
  const preciosBase = {
    "terceros": 500,
    "terceros_ampliado": 650,
    "franquicia": 750,
    "todo_riesgo": 1000
  };

  const contenedorResultados = document.getElementById("resultados-container");
  // Limpiar resultados previos
  contenedorResultados.innerHTML = '';

  tiposSeguros.forEach((tipo) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("col-12", "col-md-3", "mb-4");

      // Si el seguro es el elegido, agregar una clase especial
      if (tipo === document.getElementById("tipo_seguro").value) {
          tarjeta.classList.add("bg-primary");
      } else {
          tarjeta.classList.add("bg-light");
      }

      tarjeta.innerHTML = `
          <div class="card text-center">
              <div class="card-body">
                  <h5 class="card-title">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h5>
                  <p class="card-text">Precio: €${(precioFinal + precioBase * penalizacionVehiculo).toFixed(2)}</p>
                  <button class="btn btn-danger descartar" onclick="descartarTarjeta(this)">Descartar</button>
                  <button class="btn btn-success contratar" onclick="contratarSeguro()">Contratar</button>
              </div>
          </div>
      `;

      contenedorResultados.appendChild(tarjeta);
  });

  // Mostrar sección de resultados
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


// Validar solo letras y no vacío en Nombre y Apellidos
function validateName(input) {
    const value = input.value.trim(); //quitamos los espacios
    //^ y $: Aseguran que toda la cadena cumpla con el patrón (no solo una parte de ella).
    return /^[A-Za-záéíóúÁÉÍÓÚÑñ\s]+$/.test(value) && value.length <= 30 && value !== ""; 
    //mayusculas y minusculas de la a-z con la ñ, acentos, espacios en blanco, max 30 caracteres, y asegura que no este vacia despues de eliminar espacios.
}

// Validar formato del DNI
function validateDNI(input) {
    const value = input.value.trim();
    return /^[0-9]{8}[A-Z]$/.test(value); //8 numeros y 1 letra mayuscula
}

// Validar fecha de nacimiento (mayor de 18 años)
function validateBirthdate(input) {
  const cumpleanyos = new Date(input.value); //obtiene el valor del formulario
  const hoy = new Date(); //otro obj date de la fecha de hoy
  let edad = hoy.getFullYear() - cumpleanyos.getFullYear(); //año actual-año de la fecha del input

  const hapasado = hoy.getMonth() > cumpleanyos.getMonth() || //Si el mes actual es mayor que el mes de nacimiento el cumpleaños ya ha pasado
    //Si están en el mismo mes, verifica si el día actual es igual o mayor al dia de nacimiento
      (hoy.getMonth() === cumpleanyos.getMonth() && hoy.getDate() >= cumpleanyos.getDate());

  if (!hapasado) {
      edad--; //si no ha pasado se resta la edad
  }

  return edad >= 18; //devuelve true o false si es mayor o menor
}


// Validar fecha del carnet de conducir (no posterior a la fecha actual)
function validateLicenseDate(input) {
    const licenseDate = new Date(input.value);
    const today = new Date();
    return licenseDate <= today;
}

// Validar fecha de matriculación (no posterior a la fecha actual)
function validateRegistrationDate(input) {
    const registrationDate = new Date(input.value);
    const today = new Date();
    return registrationDate <= today;
}

// Validar matrícula (formato válido: 1111ABC, 1111-ABC, 1111 ABC)
function validateLicensePlate(input) {
    const value = input.value.trim();
    // Validar que el formato sea 4 dígitos seguidos de 3 letras, con o sin guion o espacio
    return /^[0-9]{4}[-\s]?[A-Za-z]{3}$/.test(value);
}


// Validar código postal (5 dígitos numéricos)
function validatePostalCode(input) {
    const value = input.value.trim();
    return /^[0-9]{5}$/.test(value);
}

function previewImage(event) {
  const input = event.target; // Captura el input desde el evento
  const preview = document.getElementById('photo_preview');
  const cancelButton = document.getElementById('cancel_button');

  if (input.files && input.files[0]) {
      const file = input.files[0];

      if (file.type === 'image/jpeg') {
          const reader = new FileReader();

          reader.onload = function (e) {
              preview.src = e.target.result; // Muestra la imagen
              preview.style.display = 'block';
              cancelButton.style.display = 'inline-block';
          };

          reader.readAsDataURL(file);
      } else {
          alert('Por favor, suba solo archivos JPG.');
          input.value = ''; // Limpia el input
          preview.style.display = 'none';
          cancelButton.style.display = 'none';
      }
  }
}

function cancelImage() {
  const input = document.getElementById('license_photo');
  const preview = document.getElementById('photo_preview');
  const cancelButton = document.getElementById('cancel_button');

  input.value = ''; // Limpia el valor del archivo
  preview.style.display = 'none'; // Oculta la previsualización
  cancelButton.style.display = 'none'; // Oculta el botón
}


fetch('json/espanya.json')
.then((response) => response.json()) // Convertir la respuesta en JSON
.then((datos) => {
  const selectorComunidad = document.getElementById('region');
  
  // Recorrer las comunidades y agregar las opciones al select de comunidades
  datos.características.forEach(function (comunidad) {
    const option = document.createElement('option');
    option.value = comunidad.propiedades.nombre;
    option.textContent = comunidad.propiedades.nombre;
    selectorComunidad.appendChild(option);
  });

  // Evento de cambio para cargar las provincias correspondientes
  selectorComunidad.addEventListener('change', function () {
    const comunidadSeleccionada = this.value;
    const selectorProvincia = document.getElementById('province');

    // Limpiar las provincias previas
    selectorProvincia.innerHTML = '<option value="">Seleccione una provincia</option>';

    if (comunidadSeleccionada) {
      // Buscar las provincias correspondientes a la comunidad seleccionada
      const comunidad = datos.características.find(function (c) {
        return c.propiedades.nombre === comunidadSeleccionada;
      });

      if (comunidad) {
        comunidad.propiedades.provincias.forEach(function (provincia) {
          const option = document.createElement('option');
          option.value = provincia;
          option.textContent = provincia;
          selectorProvincia.appendChild(option);
        });
      }
    }
  });
})
.catch((error) => {
  console.error('Error al cargar el archivo JSON:', error);
});

// Obtener las referencias a los selects de marca y modelo
const selectMarca = document.getElementById("brand");
const selectModelo = document.getElementById("model");

// Cargar el JSON con las marcas y modelos
fetch('json/vehiculos.json')
  .then(response => response.json())
  .then(data => {
    // Cargar las marcas en el select de Marca
    data.marcas.forEach(marca => {
      const option = document.createElement("option");
      option.value = marca.marca; // Asignamos el nombre de la marca como valor
      option.textContent = marca.marca; // Asignamos el nombre de la marca como texto visible
      selectMarca.appendChild(option);
    });

    // Evento para cargar los modelos cuando se selecciona una marca
    selectMarca.addEventListener("change", function() {
      const marcaSeleccionada = this.value;
      
      // Limpiar las opciones de modelo previas
      selectModelo.innerHTML = '<option value="">Seleccione un modelo</option>';

      if (marcaSeleccionada) {
        // Buscar la marca seleccionada en el JSON
        const marca = data.marcas.find(m => m.marca === marcaSeleccionada);
        
        if (marca) {
          // Cargar los modelos de la marca seleccionada
          marca.modelos.forEach(modelo => {
            const option = document.createElement("option");
            option.value = modelo; // Asignamos el modelo como valor
            option.textContent = modelo; // Asignamos el modelo como texto visible
            selectModelo.appendChild(option);
          });
        }
      }
    });
  })
  .catch(error => console.error("Error al cargar el archivo JSON:", error));


document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    // Añadir un evento cuando se abre el menú
    navbarCollapse.addEventListener('shown.bs.collapse', function () {
        //el botón del menu por la x 
        navbarToggler.innerHTML = '<button type="button" class="btn-close" aria-label="Close"></button>';
    });

    // Añadir un evento cuando se cierra el menú
    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
        navbarToggler.innerHTML = '<span class="navbar-toggler-icon"></span>';
    });
});
