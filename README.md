# ClimaCheck - Real-Time Weather Dashboard

ClimaCheck is a modern, responsive weather dashboard web app that provides real-time weather information for any city worldwide. It features a beautiful UI, animated backgrounds, and detailed weather metrics including temperature, humidity, wind speed, pressure, visibility, sunrise, and sunset times.

## 🌐 Live Demo
[View ClimaCheck on GitHub Pages](https://YOUR_GITHUB_USERNAME.github.io/climacheck-weather-dashboard/)

## ✨ Features
- Search weather by city name or use your current location
- Real-time weather data (powered by [WeatherAPI](https://www.weatherapi.com/))
- Animated and responsive UI
- Displays:
  - Temperature & weather condition
  - Feels like temperature
  - Humidity, wind speed, pressure, visibility
  - Sunrise & sunset times
- Mobile-friendly design

## 🚀 Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/climacheck-weather-dashboard.git
cd climacheck-weather-dashboard
```

### 2. **Get a WeatherAPI Key**
- Sign up at [WeatherAPI](https://www.weatherapi.com/)
- Get your free API key from the dashboard

### 3. **Configure the API Key**
- Open `config.js`
- Replace the value of `API_KEY` with your WeatherAPI key:
  ```js
  const API_KEY = 'YOUR_WEATHERAPI_KEY';
  ```

### 4. **Run Locally**
You can use any static server. For example, with Python:
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

## 🛠️ Project Structure
```
climacheck-weather-dashboard/
  ├── index.html
  ├── style.css
  ├── script.js
  ├── config.js
  └── README.md
```

## 🖼️ Screenshots
| Search & Main Card | Weather Details |
|-------------------|----------------|
| ![](./screenshots/main.png) | ![](./screenshots/details.png) |

## 🌍 Credits
- Weather data by [WeatherAPI](https://www.weatherapi.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
- UI inspired by modern weather dashboards

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy using ClimaCheck!**