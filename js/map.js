// ========================================
// INDIGENOUS VOICES - MAP FUNCTIONALITY
// ========================================

// Coordenadas aproximadas de cada lengua
const languageLocations = [
  {
    name: 'Ayapaneco',
    native: 'Nuumte Oote',
    lat: 18.2258,
    lng: -93.1894,
    status: 'critical',
    speakers: '2 hablantes (fallecidos)',
    region: 'Tabasco'
  },
  {
    name: 'Kiliwa',
    native: "Ko'lew",
    lat: 30.8333,
    lng: -115.3833,
    status: 'critical',
    speakers: '30-50 hablantes',
    region: 'Baja California'
  },
  {
    name: 'Chontal',
    native: "Slijuala Xanuc'",
    lat: 16.2667,
    lng: -95.6833,
    status: 'severely',
    speakers: '3,000-5,000 hablantes',
    region: 'Oaxaca'
  },
  {
    name: 'Huave',
    native: 'Ikoots',
    lat: 16.2,
    lng: -95.0333,
    status: 'severely',
    speakers: '12,000-18,000 hablantes',
    region: 'Oaxaca'
  },
  {
    name: 'Ixcateco',
    native: 'Xwja',
    lat: 18.0333,
    lng: -96.8167,
    status: 'critical',
    speakers: '150-200 hablantes',
    region: 'Oaxaca'
  },
  {
    name: 'Zapoteco',
    native: 'Diidxazá',
    lat: 17.05,
    lng: -96.7167,
    status: 'endangered',
    speakers: '350,000-500,000 hablantes',
    region: 'Oaxaca'
  }
];

// Colores según nivel de peligro
const markerColors = {
  critical: '#C41E3A',
  severely: '#FF6B35',
  endangered: '#F4A261'
};

const statusLabels = {
  critical: 'Críticamente Amenazado',
  severely: 'Severamente Amenazado',
  endangered: 'Definitivamente Amenazado'
};

// Esperar a que todo esté cargado
window.addEventListener('load', function() {
  // Esperar un poco más para asegurar que Leaflet esté disponible
  setTimeout(initMap, 300);
});

function initMap() {
  const mapElement = document.getElementById('map');
  
  if (!mapElement) {
    console.log('No se encontró el elemento del mapa');
    return;
  }

  if (typeof L === 'undefined') {
    console.error('Leaflet no está cargado');
    return;
  }

  try {
    // Crear mapa
    const map = L.map('map').setView([23.6345, -102.5528], 5);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(map);

    // Agregar marcadores
    languageLocations.forEach(location => {
      const color = markerColors[location.status];
      
      // Crear marcador circular
      const circle = L.circleMarker([location.lat, location.lng], {
        radius: 10,
        fillColor: color,
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      // Crear popup
      const popupContent = `
        <div style="font-family: sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 5px 0; color: #D4740F; font-size: 1.1rem;">${location.name}</h3>
          <p style="margin: 0 0 8px 0; color: #888; font-size: 0.85rem; font-style: italic;">${location.native}</p>
          <div style="margin-bottom: 8px;">
            <span style="background: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;">
              ${statusLabels[location.status]}
            </span>
          </div>
          <p style="margin: 5px 0; color: #666; font-size: 0.85rem;">
            📍 ${location.region}
          </p>
          <p style="margin: 5px 0; color: #666; font-size: 0.85rem;">
            👥 ${location.speakers}
          </p>
          <a href="perfiles.html#${location.name.toLowerCase()}" style="display: inline-block; margin-top: 8px; color: #8B5A2B; text-decoration: none; font-size: 0.85rem; font-weight: 500;">
            Ver perfil completo →
          </a>
        </div>
      `;

      circle.bindPopup(popupContent);
      
      // Mostrar popup al pasar el mouse
      circle.on('mouseover', function() {
        this.openPopup();
      });
    });

    console.log('Mapa inicializado correctamente con', languageLocations.length, 'marcadores');
    
  } catch (error) {
    console.error('Error al inicializar el mapa:', error);
  }
}
