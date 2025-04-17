const map = L.map('map').setView([48.8566, 2.3522], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let places = JSON.parse(localStorage.getItem('places')) || [];
let routes = JSON.parse(localStorage.getItem('routes')) || [];
let markers = [];
let polylines = [];
let editingPlaceId = null;

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function enableAddingMode() {
  alert("Kliknij na mapie, aby dodać punkt.");
  map.once('click', function(e) {
    const latlng = e.latlng;
    const name = document.getElementById('placeName').value;
    const cost = document.getElementById('placeCost').value;
    const date = document.getElementById('placeDate').value;
    const desc = document.getElementById('placeDesc').value;

    if (!name || !cost || !date) {
      showToast("Uzupełnij wszystkie wymagane pola!");
      return;
    }

    addPlace(latlng.lat, latlng.lng);
  });
}

function addPlace(lat, lng) {
  // Example of error handling
  try {
    const name = document.getElementById('placeName').value;
    const cost = parseFloat(document.getElementById('placeCost').value);
    const date = document.getElementById('placeDate').value;
    const desc = document.getElementById('placeDesc').value;

    const place = { id: Date.now(), name, lat, lng, cost, date, desc };
    places.push(place);
    localStorage.setItem('places', JSON.stringify(places));

    renderPlaces();
    showToast("Miejsce zostało dodane!");
  } catch (error) {
    console.error("Błąd podczas dodawania miejsca:", error);
    showToast("Wystąpił błąd przy dodawaniu miejsca.");
  }
}

function renderPlaces() {
  // Implementation here
}