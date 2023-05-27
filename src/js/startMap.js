(function () {
  const lat = 40.446924;
  const lng = -3.6525412;
  const map = L.map("start-map").setView([lat, lng], 12);

  let markers = new L.FeatureGroup().addTo(map);

  let properties = [];

  //Filtros
  const filters = {
    category: "",
    price: "",
  };

  const selectCategory = document.querySelector("#categories");
  const selectPrice = document.querySelector("#prices");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //Filtrado de categorias y precios
  selectCategory.addEventListener("change", (e) => {
    // console.log(e.target.value)
    filters.category = e.target.value;
    filterProps();
  });
  selectPrice.addEventListener("change", (e) => {
    filters.price = e.target.value;
    filterProps();
  });

  const getProps = async () => {
    try {
      const url = "/api/properties";
      const response = await fetch(url);
      properties = await response.json();

      console.log(properties)
      showProperties(properties);
    } catch (error) {
      console.log(error);
    }
  };

  const showProperties = (properties) => {
    //Limpiar los markers previos
    markers.clearLayers()

    properties.forEach((element) => {
      //agregar los pines
      const marker = new L.marker([element?.lat, element?.lng], {
        autoPan: true,
      }).addTo(map).bindPopup(`
          <p class="text-indigo-600 font-bold">${element?.category.name}</p>
          <h1 class="text-xl font-extrabold uppercase my-2">${element?.title}</h1>
          <img src="/uploads/${element?.image}" alt="Imagen de la propiedad ${element.title}" />
          <p class="text-gray-600 font-bold">${element?.price.name}</p>
          <a href="/property/${element.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
        `);

      markers.addLayer(marker);
    });
  };

  const filterProps = () => {
    const result = properties.filter(catFilter).filter(priceFilter);
    console.log(result)

    showProperties(result)
  };

  const catFilter = prop => {
    // console.log(parseInt(filters.category))
    return !!filters.category ? prop.categoryId == filters.category : prop
  };
  const priceFilter = price => filters.price ? price.priceId == filters.price : price;

  getProps();
})();
