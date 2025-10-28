import React, { useState, useEffect } from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNightClear,
  WiDayCloudy,
} from "react-icons/wi";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = "3d123abcab6b52c27fcc3a516a386cfaafbc89";


useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLoading(false);
      }
    );
  }
}, []);

const fetchWeatherByCity = async () => {
  if (!city.trim()) return;
  setLoading(true);
  setError(null);
  setWeather(null);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    console.log("Fetching:", url); // helpful for debugging
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.cod === 200) {
      setWeather(data);
      setError(null);
    } else {
      setError("City not found!");
    }
  } catch (err) {
    setError("Error fetching weather data.");
  } finally {
    setLoading(false);
  }
};
  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny className="text-yellow-300 text-8xl animate-pulse" />;
      case "Clouds":
        return <WiCloud className="text-gray-200 text-8xl animate-float" />;
      case "Rain":
        return <WiRain className="text-blue-400 text-8xl animate-bounce" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-yellow-400 text-8xl animate-pulse" />;
      case "Snow":
        return <WiSnow className="text-blue-100 text-8xl animate-pulse" />;
      case "Fog":
      case "Mist":
      case "Haze":
        return <WiFog className="text-gray-300 text-8xl animate-fade" />;
      default:
        return <WiDayCloudy className="text-white text-8xl" />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-white transition-all duration-700 ${
        weather?.weather[0].main === "Rain"
          ? "bg-gradient-to-br from-gray-700 to-blue-900"
          : weather?.weather[0].main === "Clear"
          ? "bg-gradient-to-br from-yellow-400 to-orange-500"
          : weather?.weather[0].main === "Clouds"
          ? "bg-gradient-to-br from-blue-400 to-gray-500"
          : "bg-gradient-to-br from-blue-500 to-purple-700"
      }`}
    >
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">🌍 Weather Now</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
           onKeyDown={(e) => e.key === "Enter" && fetchWeatherByCity()} 
          className="p-3 rounded-lg text-black"
        />
        <button
          onClick={fetchWeatherByCity}
          className="bg-white text-blue-700 px-5 py-3 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          Get Weather
        </button>
      </div>

      {loading && <p className="text-lg">Fetching weather...</p>}
      {error && <p className="text-red-200">{error}</p>}

      {weather && (
        <div className="bg-white/20 p-6 rounded-2xl text-center backdrop-blur-md shadow-2xl w-80 animate-fadeIn">
          <h2 className="text-3xl font-semibold mb-2">{weather.name}</h2>
          {getWeatherIcon(weather.weather[0].main)}
          <p className="text-lg mt-3 capitalize">{weather.weather[0].description}</p>
          <p className="text-5xl font-bold mt-3">{Math.round(weather.main.temp)}°C</p>
          <p className="mt-2 text-sm">
            Feels like {Math.round(weather.main.feels_like)}°C | Humidity:{" "}
            {weather.main.humidity}%
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
