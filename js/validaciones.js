// Validación del formulario
const formulario = document.querySelector("form");
formulario.addEventListener("submit", function (event) {
    // Prevenir el envío del formulario para validar primero
    event.preventDefault();

    // Validar los datos
    if (!validarNombre(document.getElementById("nombre")) || !validarNombre(document.getElementById("apellidos"))) {
        alert("El nombre y los apellidos solo pueden contener letras y no pueden estar vacíos.");
        return;
    }

    if (!validarDNI(document.getElementById("dni"))) {
        alert("El DNI debe tener el formato válido: ocho dígitos seguidos de una letra mayúscula.");
        return;
    }

    if (!validarEdad(document.getElementById("nacimiento"))) {
        alert("Debes ser mayor de 18 años.");
        return;
    }

    if (!validarFechaCarnet(document.getElementById("license_date"))) {
        alert("La fecha del carnet de conducir no puede ser posterior a la fecha actual.");
        return;
    }

    if (!validarFechaMatriculacion(document.getElementById("registration_date"))) {
        alert("La fecha de matriculación no puede ser posterior a la fecha actual.");
        return;
    }

    if (!validarMatricula(document.getElementById("matricula"))) {
        alert("La matrícula debe tener el formato válido: 1234-ABC.");
        return;
    }

    if (!validarCP(document.getElementById("postalcode"))) {
        alert("El código postal debe ser un número de 5 dígitos.");
        return;
    }

    // Llamar a la función calcularSeguro si todas las validaciones son correctas
    calcularSeguro();
});


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


// Validar fecha del carnet de conducir (no posterior a la fecha actual)
function validarFechaCarnet(input) {
    const fechaCarnet = new Date(input.value);
    const hoy = new Date();
    return fechaCarnet <= hoy;
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
              previsualizacion.src = e.target.result; // Muestra la imagen
              previsualizacion.style.display = 'block';
              botonCancelar.style.display = 'inline-block';
          };

          lector.readAsDataURL(foto.files[0]);
      } else {
          alert('Por favor, suba solo archivos JPG.');
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

  foto.value = ''; // Limpia el valor del archivo
  preview.style.display = 'none'; // Oculta la previsualización
  cancelButton.style.display = 'none'; // Oculta el botón
}