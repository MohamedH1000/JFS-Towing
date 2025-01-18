import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
  Rectangle,
} from "@react-google-maps/api";
import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

  // const dallasCenter = {
  //   lat: 32.7767, // Center of Dallas
  //   lng: -96.797, // Center of Dallas
  // };

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

  const handleDialogClose = (e) => {
    // Close dialog if clicked outside of the map area
    if (e.target === e.currentTarget) {
      setIsMapDialogOpen(false);
    }
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleDialogClose} // Close on outside click
          >
            <div className="relative w-full h-1/2 mx-5 rounded-lg">
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
                center={pickupMapCenter}
                zoom={10}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
                onClick={(e) => handleMapClick(e)}
              >
                <Rectangle
                  bounds={{
                    north: 85, // Top of the map
                    south: dallasBounds.north,
                    east: 180, // Right of the map
                    west: -180, // Left of the map
                  }}
                  options={{
                    strokeColor: "transparent",
                    fillColor: "rgba(0, 0, 0, 0.5)",
                    fillOpacity: 0.5,
                  }}
                />
                <Rectangle
                  bounds={{
                    north: dallasBounds.south,
                    south: -85, // Bottom of the map
                    east: 180,
                    west: -180,
                  }}
                  options={{
                    strokeColor: "transparent",
                    fillColor: "rgba(0, 0, 0, 0.5)",
                    fillOpacity: 0.5,
                  }}
                />
                <Rectangle
                  bounds={{
                    north: dallasBounds.north,
                    south: dallasBounds.south,
                    east: 180,
                    west: dallasBounds.east,
                  }}
                  options={{
                    strokeColor: "transparent",
                    fillColor: "rgba(0, 0, 0, 0.5)",
                    fillOpacity: 0.5,
                  }}
                />
                <Rectangle
                  bounds={{
                    north: dallasBounds.north,
                    south: dallasBounds.south,
                    east: dallasBounds.west,
                    west: -180,
                  }}
                  options={{
                    strokeColor: "transparent",
                    fillColor: "rgba(0, 0, 0, 0.5)",
                    fillOpacity: 0.5,
                  }}
                />
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
