fetch('json/espanya.json').then((response) => response.json()) 
  .then((datos) => {
    const selectorComunidad = document.getElementById('region');
    const selectorProvincia = document.getElementById('province');

    // recorremos las comunidades del archivo JSON y se agregan al select
    datos.características.forEach(function (comunidad) {
      const option = document.createElement('option');// crea una option para cada comunidad
      option.value = comunidad.propiedades.nombre; // asignamos el nombre de la comunidad como valor y mostramos el texto
      option.textContent = comunidad.propiedades.nombre; 
      selectorComunidad.appendChild(option); // agregamos la opción al select de comunidades
    });
  

    selectorComunidad.addEventListener('change', function () { //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
      const comunidadSeleccionada = this.value; //almacenamos en una variable la comunidad seleccionada
      selectorProvincia.innerHTML = '<option value="">Seleccione una provincia</option>';
  
      if (comunidadSeleccionada) {
        const comunidad = datos.características.find(function (c) { //se busca la comunidad seleccionada en el JSON
          return c.propiedades.nombre === comunidadSeleccionada; //devuelve la comunidad por su nombre
        });
  
        if (comunidad) {
          comunidad.propiedades.provincias.forEach(function (provincia) {// recorre las provincias de la comunidad seleccionada 
            const option = document.createElement('option');
            option.value = provincia; // asignar la provincia como valor y como texto al select
            option.textContent = provincia; 
            selectorProvincia.appendChild(option); 
          });
        }
      }
    });
    console.log("JSON de Comunidades y Provincias cargado correctamente");
  })
  .catch(error => console.error("Error al cargar el archivo JSON:", error)); 

//El mismo procedimiento para las marcas y modelos de coche 
fetch('json/vehiculos.json').then(response => response.json())
  .then(data => {
    const selectMarca = document.getElementById("brand");
    const selectModelo = document.getElementById("model");
    data.marcas.forEach(marca => {
      const option = document.createElement("option");
      option.value = marca.marca; 
      option.textContent = marca.marca;
      selectMarca.appendChild(option); 
    });
    selectMarca.addEventListener("change", function() {
      const marcaSeleccionada = this.value;  
    selectModelo.innerHTML = '<option value="">Seleccione un modelo</option>';
      if (marcaSeleccionada) {
        const marca = data.marcas.find(m => m.marca === marcaSeleccionada); 
        if (marca) {
          marca.modelos.forEach(modelo => {
            const option = document.createElement("option");
            option.value = modelo; 
            option.textContent = modelo; 
            selectModelo.appendChild(option);
          });
        }
      }
    });
    console.log("JSON de Marcas y modelos de coches cargado correctamente");
  })
  .catch(error => console.error("Error al cargar el archivo JSON:", error));
