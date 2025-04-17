const map = L.map('map').setView([48.8566, 2.3522], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let places = JSON.parse(localStorage.getItem('places')) || [];
let routes = JSON.parse(localStorage.getItem('routes')) || [];
let markers = [];
let polylines = [];
let editingPlaceId = null;

function enableAddingMode() {
  alert("Kliknij na mapie, aby dodać punkt.");
  map.once('click', function (e) {
    showTypeDialog(e);
  });
}

function showTypeDialog(e) {
  const latlng = e.latlng;
  const type = prompt("Podaj typ miejsca (nocleg, atrakcja, jedzenie):");
  if (type) {
    addPlace(type, latlng.lat, latlng.lng);
  }
}

function addPlace(type, lat, lng) {
  const name = document.getElementById('placeName').value || "Brak nazwy";
  const cost = parseFloat(document.getElementById('placeCost').value) || 0;
  const date = document.getElementById('placeDate').value || "Brak daty";
  const desc = document.getElementById('placeDesc').value || "Brak opisu";

  const id = editingPlaceId || Date.now();
  const place = { id, name, type, cost, date, desc, lat, lng };

  if (editingPlaceId) {
    const index = places.findIndex(p => p.id === editingPlaceId);
    places[index] = place;
    editingPlaceId = null;
  } else {
    places.push(place);
  }

  localStorage.setItem('places', JSON.stringify(places));
  clearForm();
  renderPlaces();
}

function clearForm() {
  document.getElementById('placeName').value = '';
  document.getElementById('placeCost').value = '';
  document.getElementById('placeDate').value = '';
  document.getElementById('placeDesc').value = '';
}

function renderPlaces() {
  const list = document.getElementById('placesList');
  list.innerHTML = '';
  places.forEach(place => {
    const item = document.createElement('div');
    item.className = 'place';
    item.innerHTML = `<b>${place.name}</b> (${place.type}) - €${place.cost}<br>${place.date}<br>${place.desc}`;
    list.appendChild(item);
  });
}

renderPlaces();
