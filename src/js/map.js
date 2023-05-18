(function () {
  const lat = 40.446924;
  const lng = -3.6525412;
  const map = L.map("map").setView([lat, lng], 16);
  let marker;

  //Utilizar provider y geocode
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //El pin
  marker = new L.marker([lat, lng], {
    draggable: true, //que se pueda mover el pin
    autoPan: true, //centrar el mapa respecto al pin
  }).addTo(map);

  //detectar movimiento del pin
  marker.on("moveend", function (event) {
    marker = event.target;
    const position = marker.getLatLng();
    map.panTo(new L.LatLng(position.lat, position.lng));

    //Obtener informacion de las calles al soltar el pin
    geocodeService
      .reverse()
      .latlng(position, 13)
      .run(function (error, result) {
        console.log(result);

        marker.bindPopup(result.address.LongLabel);

        //Llenar los campos
        document.querySelector(".street").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#street").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#lat").textContent =
          result?.latlng?.lat ?? "";
        document.querySelector("#lng").textContent =
          result?.latlng?.lng ?? "";
      });
  });
})();
