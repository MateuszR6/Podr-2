// Inicjalizacja mapy
const map = L.map('map').setView([48.8566, 2.3522], 5); // Domyślne współrzędne (Paryż)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Zmienne globalne
let places = JSON.parse(localStorage.getItem('places')) || [];
let routes = JSON.parse(localStorage.getItem('routes')) || [];
let markers = [];
let polylines = [];
let editingPlaceId = null;

// Funkcja dodawania miejsca
function enableAddingMode() {
  alert("Kliknij na mapie, aby dodać punkt.");
  map.once('click', function (e) {
    const latlng = e.latlng;
    const name = document.getElementById('placeName').value || "Brak nazwy";
    const cost = parseFloat(document.getElementById('placeCost').value) || 0;
    const date = document.getElementById('placeDate').value || "Brak daty";
    const desc = document.getElementById('placeDesc').value || "Brak opisu";

    addPlace(name, cost, date, desc, latlng.lat, latlng.lng);
  });
}

// Funkcja dodawania miejsca do pamięci lokalnej i na mapę
function addPlace(name, cost, date, desc, lat, lng) {
  const place = { id: Date.now(), name, cost, date, desc, lat, lng };
  places.push(place);

  localStorage.setItem('places', JSON.stringify(places));
  clearForm();
  renderPlaces();
}

// Funkcja czyszczenia formularza
function clearForm() {
  document.getElementById('placeName').value = '';
  document.getElementById('placeCost').value = '';
  document.getElementById('placeDate').value = '';
  document.getElementById('placeDesc').value = '';
}

// Funkcja renderowania miejsc na mapie i w liście
function renderPlaces() {
  const list = document.getElementById('placesList');
  list.innerHTML = ''; // Czyszczenie listy
  markers.forEach(marker => map.removeLayer(marker)); // Usuwanie starych markerów
  markers = [];

  places.forEach(place => {
    // Dodanie miejsca do listy
    const item = document.createElement('div');
    item.className = 'place';
    item.innerHTML = `<b>${place.name}</b> - €${place.cost}<br>${place.date}<br>${place.desc}`;
    list.appendChild(item);

    // Dodanie markera na mapę
    const marker = L.marker([place.lat, place.lng]).addTo(map);
    marker.bindPopup(`<b>${place.name}</b><br>${place.date}<br>€${place.cost}<br>${place.desc}`);
    markers.push(marker);
  });
}

// Funkcja dodawania trasy między dwoma punktami
function enableRouteAddingMode() {
  alert("Kliknij dwa miejsca na mapie, aby zaznaczyć trasę.");
  let points = [];
  map.on('click', function (e) {
    points.push(e.latlng);
    if (points.length === 2) {
      map.off('click');
      addRoute(points);
    }
  });
}

// Funkcja dodawania trasy do pamięci lokalnej i na mapę
function addRoute(points) {
  const start = document.getElementById('routeStart').value || "Brak nazwy";
  const end = document.getElementById('routeEnd').value || "Brak nazwy";
  const cost = parseFloat(document.getElementById('routeCost').value) || 0;

  const route = { start, end, cost, points };
  routes.push(route);

  localStorage.setItem('routes', JSON.stringify(routes));
  renderRoutes();
}

// Funkcja renderowania tras na mapie
function renderRoutes() {
  polylines.forEach(polyline => map.removeLayer(polyline)); // Usuwanie starych tras
  polylines = [];

  routes.forEach(route => {
    const polyline = L.polyline(route.points, { color: 'blue' }).addTo(map);
    polylines.push(polyline);
  });
}

// Wywołania renderowania przy pierwszym załadowaniu
renderPlaces();
renderRoutes();
