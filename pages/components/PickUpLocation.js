import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const API_KEY = "AIzaSyB-mfaKrkjifwxSeoVqd32HYBy_Ds2q_dk"; // Replace with your API key

const PickUpLocation = ({ formData, setFormData }) => {
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [pickupMapCenter, setPickupMapCenter] = useState({
    lat: 32.7767,
    lng: -96.797, // Default to Dallas, TX
  });
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  const onPickupLoad = (autocompleteInstance) => {
    setPickupAutocomplete(autocompleteInstance);
  };

  const dallasBounds = {
    north: 33.0235, // Approximate northern latitude of Dallas
    south: 32.62, // Approximate southern latitude of Dallas
    east: -96.563, // Approximate eastern longitude of Dallas
    west: -97.019, // Approximate western longitude of Dallas
  };

  const onPickupPlaceChanged = () => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setFormData((prev) => ({
          ...prev,
          pickupLocation: {
            address: place.formatted_address,
            geometry: {
              location: { lat, lng },
            },
          },
        }));

        setPickupMapCenter({ lat, lng });
      } else {
        console.error("No geometry available for pickup location.");
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0];
        setFormData((prev) => ({
          ...prev,
          pickupLocation: {
            address: place.formatted_address,
            geometry: {
              location: { lat, lng },
            },
          },
        }));

        setPickupMapCenter({ lat, lng });
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places", "geometry"]}>
      <div className="flex flex-col w-full">
        <Autocomplete
          onLoad={onPickupLoad}
          onPlaceChanged={onPickupPlaceChanged}
          options={{
            componentRestrictions: { country: "us" },
            bounds: {
              north: 33.0235, // Approximate northern latitude of Dallas
              south: 32.62, // Approximate southern latitude of Dallas
              east: -96.563, // Approximate eastern longitude of Dallas
              west: -97.019, // Approximate western longitude of Dallas
            },
            strictBounds: true,
          }}
        >
          <input
            name="pickupLocation"
            type="text"
            placeholder="Enter Pickup Location"
            value={formData?.pickupLocation?.address || ""}
            onClick={() => setIsMapDialogOpen(true)} // Open map dialog
            readOnly
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </Autocomplete>
        {isMapDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ">
            <div className="relative w-full h-1/2 mx-5 rounded-lg">
              {" "}
              {/* Half screen height */}
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
                center={pickupMapCenter}
                zoom={10}
                options={{
                  restriction: {
                    latLngBounds: dallasBounds,
                    strictBounds: true,
                  },
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
                onClick={(e) => handleMapClick(e)}
              >
                {formData.pickupLocation?.geometry && (
                  <Marker
                    position={{
                      lat: formData.pickupLocation?.geometry.location?.lat,
                      lng: formData.pickupLocation?.geometry.location?.lng,
                    }}
                  />
                )}
              </GoogleMap>
              <button
                onClick={() => setIsMapDialogOpen(false)}
                className="absolute top-2 right-20 bg-orange-500 text-[white] p-2 rounded-full shadow-md hover:bg-orange-600"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default PickUpLocation;
