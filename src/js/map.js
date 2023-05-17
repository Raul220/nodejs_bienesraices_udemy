(function() {

    const lat = 40.446924;
    const lng = -3.6525412;
    const map = L.map('map').setView([lat, lng ], 16);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


})()