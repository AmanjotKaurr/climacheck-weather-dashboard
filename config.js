// Configuration file for ClimaCheck Weather Dashboard

const API_KEY = '045796530e544b259ee184117250607'; // WeatherAPI key

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://api.weatherapi.com/v1',
    LANGUAGE: 'en'   // Language code for weather descriptions
};

// App Configuration
const APP_CONFIG = {
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
    MAX_CITY_NAME_LENGTH: 50,
    DEFAULT_CITY: 'London',
    GEOLOCATION_TIMEOUT: 10000, // 10 seconds
    ANIMATION_DURATION: 300 // milliseconds
};

// Validation function to check if API key is set
function validateAPIKey() {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
        console.error('⚠️  API Key not configured!');
        console.log('Please follow these steps:');
        console.log('1. Go to https://openweathermap.org/api');
        console.log('2. Sign up for a free account');
        console.log('3. Get your API key from the dashboard');
        console.log('4. Replace the placeholder in config.js with your actual API key');
        
        // Show error message to user
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorMessage && errorText) {
            errorText.textContent = 'API key not configured. Please check the console for setup instructions.';
            errorMessage.classList.add('show');
        }
        
        return false;
    }
    return true;
}

// Run validation when script loads
document.addEventListener('DOMContentLoaded', function() {
    validateAPIKey();
});

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_KEY,
        API_CONFIG,
        APP_CONFIG
    };
}