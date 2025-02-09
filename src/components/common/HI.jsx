import { useState } from "react";

export default function LocationSelector({ onLocationSelect }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  // Function to Get User's Current Location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Pass the location to parent component
          if (onLocationSelect) {
            onLocationSelect({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Button to Get Current Location */}
      <button
        onClick={getCurrentLocation}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Use Current Location
      </button>

      {/* Show Selected Location (If Available) */}
      {currentLocation && (
        <p className="mt-2 text-gray-700">
          📍 Location: {currentLocation.lat}, {currentLocation.lng}
        </p>
      )}
    </div>
  );
}
