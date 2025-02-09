import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import HI from "@/components/common/HI"
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
import { useState } from "react";
const defaultCenter = { lat: 30.033, lng: 31.233 }; // Cairo, Egypt

export default function GoogleMapsWithLocation() {
  const [userLocation, setUserLocation] = useState(defaultCenter);

  return (
    <div>
      {/* Location Button */}
      <HI onLocationSelect={setUserLocation} />

      {/* Google Map */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={userLocation}>
          <Marker position={userLocation} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
