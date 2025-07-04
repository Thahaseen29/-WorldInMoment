const apiKey = "e844f9bce3b7e6d8f033745c858940c4";

const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

let marker;

map.on('click', async function (e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lon]).addTo(map);

  getWeather(lat, lon);
});

async function getWeather(lat, lon) {
  const output = document.getElementById("output");
  output.innerHTML = "Loading weather data...";
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) {
      output.innerHTML = "Location not found.";
      return;
    }

    const timezoneOffset = data.timezone;
    const localTime = new Date(Date.now() + (timezoneOffset * 1000));
    const hour = localTime.getUTCHours();

    // Theme based on time
    if (hour >= 6 && hour < 18) {
      document.body.style.backgroundColor = "#eef";
      document.body.style.color = "#000";
    } else {
      document.body.style.backgroundColor = "#2c3e50";
      document.body.style.color = "#fff";
    }

    const weatherDesc = data.weather[0].description;
    const emoji = getEmoji(weatherDesc);

    marker.bindPopup(`${data.name}, ${data.sys.country}`).openPopup();

    output.innerHTML = `
      <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
      <p><strong>Local Time:</strong> ${localTime.toUTCString()}</p>
      <p><strong>Temperature:</strong> ${data.main.temp.toFixed(1)} °C</p>
      <p><strong>Weather:</strong> ${weatherDesc} ${emoji}</p>
    `;
  } catch (err) {
    output.innerHTML = "Error retrieving weather data.";
  }
}

function getEmoji(description) {
  const desc = description.toLowerCase();

  if (desc.includes("clear sky")) return "☀️";
  if (desc.includes("few clouds")) return "🌤️";
  if (desc.includes("scattered clouds")) return "🌥️";
  if (desc.includes("broken clouds")) return "☁️";
  if (desc.includes("overcast clouds")) return "☁️";
  if (desc.includes("light rain")) return "🌦️";
  if (desc.includes("moderate rain")) return "🌧️";
  if (desc.includes("heavy intensity rain")) return "🌧️";
  if (desc.includes("very heavy rain")) return "🌧️";
  if (desc.includes("extreme rain")) return "🌧️💦";
  if (desc.includes("freezing rain")) return "🌧️❄️";
  if (desc.includes("light intensity shower rain")) return "🌦️";
  if (desc.includes("shower rain")) return "🌧️";
  if (desc.includes("heavy intensity shower rain")) return "🌧️💧";
  if (desc.includes("ragged shower rain")) return "🌧️🌬️";
  if (desc.includes("thunderstorm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("light snow")) return "🌨️";
  if (desc.includes("heavy snow")) return "❄️❄️";
  if (desc.includes("sleet")) return "🌨️";
  if (desc.includes("mist")) return "🌫️";
  if (desc.includes("smoke")) return "💨";
  if (desc.includes("haze")) return "🌫️";
  if (desc.includes("fog")) return "🌁";
  if (desc.includes("sand") || desc.includes("dust")) return "🌪️";
  if (desc.includes("volcanic ash")) return "🌋";
  if (desc.includes("squalls")) return "🌬️";
  if (desc.includes("tornado")) return "🌪️";

  return "🌈";
}

document.getElementById("modeToggle").addEventListener("change", function () {
  document.body.style.backgroundColor = this.checked ? "#fff" : "#222";
  document.body.style.color = this.checked ? "#000" : "#fff";
});
