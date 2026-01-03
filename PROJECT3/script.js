// 1. Initialize the Map
const map = L.map('map').setView([20, 0], 2);

// 2. Add the Map Tiles (Dark Mode via CSS)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Custom Cyber Icon
const cyberIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/929/929426.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -32],
    className: 'custom-icon'
});

let currentMarker = null;

// UI Elements
const ipDisplay = document.getElementById('ipDisplay');
const locationDisplay = document.getElementById('locationDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const ispDisplay = document.getElementById('ispDisplay');
const ipInput = document.getElementById('ipInput');

// 3. The Main Function: Fetch Data (Secure HTTPS Version)
async function getIPDetails(ipAddress = '') {
    try {
        ipDisplay.innerText = "Scanning Signal...";
        
        // USE HTTPS HERE (ipwho.is)
        const url = ipAddress ? `https://ipwho.is/${ipAddress}` : `https://ipwho.is/`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
            alert("Error: " + data.message);
            ipDisplay.innerText = "INVALID TARGET";
            return;
        }

        // 4. Update Dashboard UI
        ipDisplay.innerText = data.ip;
        locationDisplay.innerText = `${data.city}, ${data.country}`;
        timeDisplay.innerText = `UTC ${data.timezone.utc}`;
        ispDisplay.innerText = data.connection.org || data.connection.isp;

        // 5. Update Map
        const { latitude, longitude } = data;
        
        map.setView([latitude, longitude], 13);

        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        currentMarker = L.marker([latitude, longitude], {icon: cyberIcon})
            .addTo(map)
            .bindPopup(`<b>TARGET DETECTED</b><br>${data.city}`)
            .openPopup();

    } catch (error) {
        console.error("Error fetching IP data:", error);
        ipDisplay.innerText = "CONNECTION FAILED";
    }
}

// Search Button Handler
function searchIP() {
    const ip = ipInput.value;
    if(ip) {
        getIPDetails(ip);
    }
}

// Allow "Enter" key to search
ipInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchIP();
    }
});

// Run on Load
getIPDetails();