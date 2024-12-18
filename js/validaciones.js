// Validación del formulario
const formulario = document.querySelector("form");

// Validaciones dinámicas para cada campo
formulario.addEventListener("input", function (event) {
    const input = event.target;
    switch (input.id) {
        case "nombre":
        case "apellidos":
            actualizarEstado(input, validarNombre(input));
            break;
        case "dni":
            actualizarEstado(input, validarDNI(input));
            break;
        case "nacimiento":
            actualizarEstado(input, validarEdad(input));
            break;
        case "fecha_carnet":
            actualizarEstado(input, validarFechaCarnet(input));
            break;
        case "registration_date":
            actualizarEstado(input, validarFechaMatriculacion(input));
            break;
        case "matricula":
            actualizarEstado(input, validarMatricula(input));
            break;
        case "postalcode":
            actualizarEstado(input, validarCP(input));
            break;
        case "email": 
            actualizarEstado(input, validarCorreo(input));
            break;
        default:
            break;
    }
});


formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir envío si hay errores
    let valido = true;

    // Validar todos los campos
    formulario.querySelectorAll("input, select").forEach((input) => {
        const esValido = validarCampo(input);
        actualizarEstado(input, esValido);
        if (!esValido) valido = false;
    });

    if (valido) {
        calcularSeguro(); // Llamar a la función de cálculo si todo está bien
    } else {
        alert("Por favor, corrige los campos erroneos");
    }
});

function validarCampo(input) { // funcion para validar campos llamando a las funciones
    switch (input.id) {
        case "nombre":
        case "apellidos":
            return validarNombre(input);
        case "dni":
            return validarDNI(input);
        case "nacimiento":
            return validarEdad(input);
        case "fecha_carnet":
            return validarFechaCarnet(input);
        case "registration_date":
            return validarFechaMatriculacion(input);
        case "matricula":
            return validarMatricula(input);
        case "postalcode":
            return validarCP(input);
        case "email":
            return validarCorreo(input);
        default:
            return true; // por defecto no valida campos desconocidos
    }
}

function actualizarEstado(input, esValido) { //cambia el class del elemento (bootstrap)
    if (esValido) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }
}


// Validar solo letras y no vacío en Nombre y Apellidos
function validarNombre(input) {
    const value = input.value.trim(); //quitamos los espacios
    //^ y $: Aseguran que toda la cadena cumpla con el patrón (no solo una parte de ella).
    return /^[A-Za-záéíóúÁÉÍÓÚÑñ\s]+$/.test(value) && value.length <= 30 && value !== ""; 
    //mayusculas y minusculas de la a-z con la ñ, acentos, espacios en blanco, max 30 caracteres, y asegura que no este vacia despues de eliminar espacios.
}

// Validar formato del DNI
function validarDNI(input) {
    const value = input.value.trim();
    return /^[0-9]{8}[A-Z]$/.test(value); //8 numeros y 1 letra mayuscula
}

// Validar formato del correo electrónico
function validarCorreo(input) {
    const value = input.value.trim(); // Elimina espacios en blanco
    // Validar formato de correo con expresión regular
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value); 
    //el usuario puede tener letras,numeros..., debe tener @ y debe acabar en .es o .com (almenos 2 letras)
}

// Validar fecha de nacimiento (mayor de 18 años)
function validarEdad(input) {
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

function validarFechaCarnet(input) {
    const fechaCarnet = new Date(input.value); 
    const hoy = new Date(); 

    if (fechaCarnet > hoy) {
        return false;
    }

    // Validar si la persona tiene al menos 18 años en la fecha del carnet
    const fechaNacimientoInput = document.getElementById("nacimiento"); // ID del campo de nacimiento
    if (!fechaNacimientoInput || !fechaNacimientoInput.value) {
        return false; // No se puede validar si no hay fecha de nacimiento
    }

    const fechaNacimiento = new Date(fechaNacimientoInput.value); // Fecha de nacimiento
    const fechaMayorEdad = new Date(fechaNacimiento);
    fechaMayorEdad.setFullYear(fechaMayorEdad.getFullYear() + 18); // Fecha en que cumple 18 años

    // La fecha del carnet debe ser posterior o igual a la fecha en que cumple 18 años
    return fechaCarnet >= fechaMayorEdad;
}


// Validar fecha de matriculación (no posterior a la fecha actual)
function validarFechaMatriculacion(input) {
    const fechaMatriculacion = new Date(input.value);
    const hoy = new Date();
    return fechaMatriculacion <= hoy;
}

// Validar matrícula (formato válido: 1111ABC, 1111-ABC, 1111 ABC)
function validarMatricula(input) {
    const value = input.value.trim();
    // Validar que el formato sea 4 dígitos seguidos de 3 letras, con o sin guion o espacio
    return /^[0-9]{4}[-\s]?[A-Za-z]{3}$/.test(value);
}


// Validar código postal (5 dígitos numéricos)
function validarCP(input) {
    const value = input.value.trim();
    return /^[0-9]{5}$/.test(value);
}

function previewImage() {
  const foto = document.getElementById("foto_carnet"); 
  const previsualizacion = document.getElementById('foto_preview');
  const botonCancelar = document.getElementById('cancel_button');

  // Validar imagen (solo JPG)
  if (foto.files && foto.files[0]) {
      if (foto.files[0].type === 'image/jpeg') {
          const lector = new FileReader();

          lector.onload = function (e) {
              previsualizacion.src = e.target.result; // muestra la imagen
              previsualizacion.style.display = 'block';
              botonCancelar.style.display = 'inline-block';
          };

          lector.readAsDataURL(foto.files[0]);
      } else {
          alert('Por favor, suba se admiten archivos JPG.');
          foto.value = ''; 
          previsualizacion.style.display = 'none';
          botonCancelar.style.display = 'none';
      }
  }
}

function cancelImage() {
  const foto = document.getElementById('foto_carnet');
  const preview = document.getElementById('foto_preview');
  const cancelButton = document.getElementById('cancel_button');

  foto.value = ''; // limpia el valor del archivo
  preview.style.display = 'none'; // oculta la previsualización y el boton de cancelar
  cancelButton.style.display = 'none'; 
}