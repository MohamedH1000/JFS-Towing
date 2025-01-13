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
  const [pickupMapCenter, setPickupMapCenter] = useState(null);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  const onPickupLoad = (autocompleteInstance) => {
    setPickupAutocomplete(autocompleteInstance);
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
        >
          <input
            name="pickupLocation"
            type="text"
            placeholder="Enter Pickup Location"
            value={formData.pickupLocation.address}
            onClick={() => setIsMapDialogOpen(true)} // Open map dialog
            readOnly
            className="p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </Autocomplete>

        {isMapDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full h-full">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={pickupMapCenter || { lat: 31.963158, lng: 35.930359 }}
                zoom={10}
                onClick={(e) => handleMapClick(e)}
              >
                {formData.pickupLocation.geometry && (
                  <Marker
                    position={{
                      lat: formData.pickupLocation.geometry.location?.lat,
                      lng: formData.pickupLocation.geometry.location?.lng,
                    }}
                  />
                )}
              </GoogleMap>

              <button
                onClick={() => setIsMapDialogOpen(false)}
                className="absolute top-4 right-20 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-200 bg-orange-500 text-[white]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default PickUpLocation;
