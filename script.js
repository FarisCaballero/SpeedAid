const emergencies = [
  "Heart Attack",
  "Stroke",
  "Severe Allergic Reaction",
  "Asthma Attack",
  "Choking",
  "Severe Bleeding",
  "Head Injury",
  "Seizure",
  "Shock",
  "Fractures",
  "Cardiac Arrest",
  "Chest Pain",
  "Appendicitis",
  "Acute Abdominal Pain",
  "Pulmonary Embolism",
  "Deep Vein Thrombosis",
  "Spinal Injury",
  "Eye Injury",
  "Electric Shock",
  "Animal Bites and Stings",
  "Fainting",
  "Pneumothorax",
  "Eclampsia"
];

document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("emergencySearch");
  const emergencyList = document.getElementById("emergencyList");

  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const searchText = this.value.toLowerCase();
      const matchingEmergencies = emergencies.filter(emergency =>
        emergency.toLowerCase().includes(searchText)
      );

      emergencyList.innerHTML = "";
      matchingEmergencies.forEach(emergency => {
        const option = document.createElement("div");
        option.innerHTML = `<strong>${emergency.substr(0, searchText.length)}</strong>${emergency.substr(searchText.length)}`;
        option.addEventListener("click", function() {
          searchInput.value = emergency;
          emergencyList.innerHTML = "";
        });
        emergencyList.appendChild(option);
      });
    });

    document.getElementById("emergencyForm").addEventListener("submit", function(event) {
      event.preventDefault();
      const selectedEmergency = searchInput.value;
      window.location.href = `second_page.html?emergency=${encodeURIComponent(selectedEmergency)}`;
    });
  }

  if (window.location.pathname.endsWith('second_page.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedEmergency = urlParams.get("emergency");
    const instructionsDiv = document.getElementById("instructions");
    const instructions = getInstructions(selectedEmergency);

    if (instructions) {
      instructionsDiv.innerHTML = instructions;
    } else {
      instructionsDiv.innerHTML = "No instructions available for this emergency.";
    }
  }
});

function getInstructions(emergency) {
  switch (emergency.toLowerCase()) {
    case 'heart attack':
      return `
        <div class="alert alert-danger">
          <i class="fas fa-phone-alt"></i> <strong>Emergency!</strong> This situation requires professional care. Please call <strong>999</strong> immediately.
        </div>
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i> <h5>Steps to take while the ambulance is coming:</h5>
          <div class="instruction-box">Have the person sit or lie down in a comfortable position.</div>
          <div class="instruction-box">Loosen any tight clothing and reassure the person.</div>
          <div class="instruction-box">If the person has been prescribed nitroglycerin and it is within reach, assist them in taking it.</div>
          <div class="instruction-box">Monitor the person's condition while waiting for medical help.</div>
        </div>`;
    case 'stroke':
      return `
        <div class="alert alert-danger">
          <i class="fas fa-phone-alt"></i> <strong>Emergency!</strong> This situation requires professional care. Please call <strong>999</strong> immediately.
        </div>
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i> <h5>Steps to take while the ambulance is coming:</h5>
          <div class="instruction-box">Help the person sit or lie down in a comfortable position.</div>
          <div class="instruction-box">Loosen any tight clothing and reassure the person.</div>
          <div class="instruction-box">Do not give the person anything to eat or drink.</div>
          <div class="instruction-box">Monitor the person's condition while waiting for medical help.</div>
        </div>`;
    // Add more cases as needed for each emergency
    default:
      return null;
  }
}


function goBack() {
  window.history.back();
}

// Initialize the map and find nearby hospitals
function initMap() {
  // Check if the user's browser supports geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 14
      });

      const service = new google.maps.places.PlacesService(map);

      const request = {
        location: userLocation,
        radius: '5000',
        type: ['hospital']
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const hospitalList = document.getElementById('hospitalList');
          hospitalList.innerHTML = "<h3>Nearest Hospitals:</h3><ul>";

          results.forEach(place => {
            createMarker(place);
            const distance = calculateDistance(userLocation, place.geometry.location);
            hospitalList.innerHTML += `<li>${place.name} - ${distance.toFixed(2)} km</li>`;
          });

          hospitalList.innerHTML += "</ul>";
        }
      });

      function createMarker(place) {
        const marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          const infoWindow = new google.maps.InfoWindow({
            content: place.name
          });
          infoWindow.open(map, marker);
        });
      }

      function calculateDistance(origin, destination) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (destination.lat() - origin.lat) * Math.PI / 180;
        const dLng = (destination.lng() - origin.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat() * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
    }, () => {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  const errorMessage = browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.';
  console.error(errorMessage);
}
