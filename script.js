console.log("API_KEY:", API_KEY);

// DOM Elements - will be initialized after DOM loads
let cityInput, searchBtn, locationBtn, weatherDisplay, loading, errorMessage;
let cityName, currentDate, weatherIcon, temperature, weatherDescription, feelsLike;
let humidity, windSpeed, pressure, visibility, sunrise, sunset;

// Function to initialize DOM elements
function initializeDOMElements() {
    cityInput = document.getElementById('cityInput');
    searchBtn = document.getElementById('searchBtn');
    locationBtn = document.getElementById('locationBtn');
    weatherDisplay = document.getElementById('weatherDisplay');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    
    // Weather data elements
    cityName = document.getElementById('cityName');
    currentDate = document.getElementById('currentDate');
    weatherIcon = document.getElementById('weatherIcon');
    temperature = document.getElementById('temperature');
    weatherDescription = document.getElementById('weatherDescription');
    feelsLike = document.getElementById('feelsLike');
    humidity = document.getElementById('humidity');
    windSpeed = document.getElementById('windSpeed');
    pressure = document.getElementById('pressure');
    visibility = document.getElementById('visibility');
    sunrise = document.getElementById('sunrise');
    sunset = document.getElementById('sunset');
}

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Initialize the app and DOM elements after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Assign DOM elements
    cityInput = document.getElementById('cityInput');
    searchBtn = document.getElementById('searchBtn');
    locationBtn = document.getElementById('locationBtn');
    weatherDisplay = document.getElementById('weatherDisplay');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    cityName = document.getElementById('cityName');
    currentDate = document.getElementById('currentDate');
    weatherIcon = document.getElementById('weatherIcon');
    temperature = document.getElementById('temperature');
    weatherDescription = document.getElementById('weatherDescription');
    feelsLike = document.getElementById('feelsLike');
    humidity = document.getElementById('humidity');
    windSpeed = document.getElementById('windSpeed');
    pressure = document.getElementById('pressure');
    visibility = document.getElementById('visibility');
    sunrise = document.getElementById('sunrise');
    sunset = document.getElementById('sunset');

    // Set current date
    updateCurrentDate();

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    locationBtn.addEventListener('click', getCurrentLocation);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    cityInput.addEventListener('input', function(e) {
        const value = e.target.value;
        if (/\d/.test(value)) {
            e.target.value = value.replace(/\d/g, '');
        }
        e.target.value = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
    });
    cityInput.focus();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            cityInput.focus();
            cityInput.select();
        }
        if (e.key === 'Escape') {
            cityInput.value = '';
            weatherDisplay.classList.remove('show');
            errorMessage.classList.remove('show');
            cityInput.focus();
        }
    });

    // Enhance loading animation
    enhanceLoadingAnimation();
    // Initialize theme
    initializeTheme();
});

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    fetchWeatherData(city);
}

// Get user's current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        },
        function(error) {
            hideLoading();
            let errorMsg = 'Unable to retrieve your location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Location access was denied.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
                default:
                    errorMsg += 'An unknown error occurred.';
                    break;
            }
            
            showError(errorMsg);
        }
    );
}

// Fetch weather data by city name (WeatherAPI forecast for sunrise/sunset)
async function fetchWeatherData(city) {
    try {
        showLoading();
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=1&lang=${API_CONFIG.LANGUAGE}`
        );
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key is invalid. Please check your configuration.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Fetch weather data by coordinates (WeatherAPI forecast for sunrise/sunset)
async function fetchWeatherByCoords(lat, lon) {
    try {
        showLoading();
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=1&lang=${API_CONFIG.LANGUAGE}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display weather data (WeatherAPI response with sunrise/sunset)
function displayWeatherData(data) {
    hideError();
    // Update city name
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    // Update temperature
    temperature.textContent = Math.round(data.current.temp_c);
    // Update weather icon
    weatherIcon.className = 'fas fa-question weather-icon-main'; // fallback
    if (data.current.condition && data.current.condition.icon) {
        weatherIcon.innerHTML = `<img src='https:${data.current.condition.icon}' alt='icon' style='width:48px;height:48px;'>`;
    }
    // Update weather description
    weatherDescription.textContent = data.current.condition.text;
    feelsLike.textContent = `Feels like: ${Math.round(data.current.feelslike_c)}°C`;
    // Update weather details
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${Math.round(data.current.wind_kph)} km/h`;
    pressure.textContent = `${data.current.pressure_mb} hPa`;
    visibility.textContent = `${data.current.vis_km.toFixed(1)} km`;
    // Update sunrise and sunset from forecast
    if (data.forecast && data.forecast.forecastday && data.forecast.forecastday[0] && data.forecast.forecastday[0].astro) {
        sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
        sunset.textContent = data.forecast.forecastday[0].astro.sunset;
    } else {
        sunrise.textContent = '--:--';
        sunset.textContent = '--:--';
    }
    // Show weather display
    weatherDisplay.classList.add('show');
    // Clear input
    cityInput.value = '';
}

// Update background based on weather conditions
function updateBackground(weatherMain, iconCode) {
    const body = document.body;
    
    // Remove existing weather classes
    body.classList.remove('sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'misty', 'night');
    
    // Add appropriate class based on weather
    switch(weatherMain.toLowerCase()) {
        case 'clear':
            if (iconCode.includes('n')) {
                body.classList.add('night');
            } else {
                body.classList.add('sunny');
            }
            break;
        case 'clouds':
            body.classList.add('cloudy');
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('rainy');
            break;
        case 'thunderstorm':
            body.classList.add('stormy');
            break;
        case 'snow':
            body.classList.add('snowy');
            break;
        case 'mist':
        case 'fog':
        case 'haze':
        case 'smoke':
            body.classList.add('misty');
            break;
        default:
            if (iconCode.includes('n')) {
                body.classList.add('night');
            } else {
                body.classList.add('sunny');
            }
    }
}

// Show loading state
function showLoading() {
    loading.classList.add('show');
    weatherDisplay.classList.remove('show');
    errorMessage.classList.remove('show');
}

// Hide loading state
function hideLoading() {
    loading.classList.remove('show');
}

// Show error message
function showError(message) {
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorMessage.classList.add('show');
    weatherDisplay.classList.remove('show');
    hideLoading();
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Add smooth scrolling to weather display when data loads
function scrollToWeatherDisplay() {
    setTimeout(() => {
        weatherDisplay.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

// Enhance the displayWeatherData function to include scrolling
const originalDisplayWeatherData = displayWeatherData;
displayWeatherData = function(data) {
    originalDisplayWeatherData(data);
    scrollToWeatherDisplay();
};

// Add loading animation enhancements
function enhanceLoadingAnimation() {
    const spinner = document.querySelector('.spinner');
    if (spinner) {
        spinner.style.borderTopColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-blue');
    }
}

// Initialize theme based on time of day
function initializeTheme() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 18 || hour < 6) {
        body.classList.add('night-theme');
    } else {
        body.classList.add('day-theme');
    }
}

// Add weather data caching for better performance
const weatherCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Enhanced fetch function with caching
async function fetchWeatherDataWithCache(city) {
    const cacheKey = city.toLowerCase();
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        displayWeatherData(cachedData.data);
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=1&lang=${API_CONFIG.LANGUAGE}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key is invalid. Please get a valid API key from OpenWeatherMap.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const data = await response.json();
        
        // Cache the data
        weatherCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Replace the original fetch function with the cached version
const originalFetchWeatherData = fetchWeatherData;
fetchWeatherData = fetchWeatherDataWithCache;

// Clean up old cache entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of weatherCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            weatherCache.delete(key);
        }
    }
}, CACHE_DURATION);

// Add service worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // This is optional and would require a separate service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Add error handling for network issues
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    showError('No internet connection. Please check your network and try again.');
});