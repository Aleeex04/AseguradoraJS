fetch('json/espanya.json').then((response) => response.json()).then((datos) => { // Convertir la respuesta en JSON
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
  fetch('json/vehiculos.json').then(response => response.json()).then(data => {
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