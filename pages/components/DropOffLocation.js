import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { useState } from "react";
const API_KEY = "AIzaSyB-mfaKrkjifwxSeoVqd32HYBy_Ds2q_dk"; // ضع مفتاح API الخاص بك هنا

const DropOffLocation = ({ formData, setFormData, geocoder }) => {
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const [dropoffMapCenter, setDropoffMapCenter] = useState(null);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const onDropoffLoad = (autocompleteInstance) => {
    // console.log(autocompleteInstance, "autocompleteInstance");
    setDropoffAutocomplete(autocompleteInstance);
  };

  const onDropoffPlaceChanged = () => {
    if (dropoffAutocomplete) {
      const place = dropoffAutocomplete.getPlace();
      // console.log(place, "place");
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Update formData with plain lat and lng values
        setFormData((prev) => ({
          ...prev,
          dropoffLocation: {
            address: place.formatted_address,
            geometry: {
              location: { lat, lng }, // Use plain object for location
            },
          },
        }));

        // Update map center
        setDropoffMapCenter({ lat, lng });
      } else {
        console.error("No geometry available for dropoff location.");
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
          dropoffLocation: {
            address: place.formatted_address,
            geometry: {
              location: { lat, lng },
            },
          },
        }));

        setDropoffMapCenter({ lat, lng });
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
          onLoad={onDropoffLoad}
          onPlaceChanged={onDropoffPlaceChanged}
          className="w-full md:ml-2  md:mt-0"
        >
          <input
            name="dropoffLocation"
            type="text"
            placeholder="Enter Drop Off Location"
            value={formData?.dropoffLocation?.address || ""}
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
            <div className="relative w-full h-1/2 mx-5">
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
                center={dropoffMapCenter || { lat: 31.963158, lng: 35.930359 }}
                zoom={10}
                onClick={(e) => handleMapClick(e)}
              >
                {formData.dropoffLocation?.geometry && (
                  <Marker
                    position={{
                      lat: formData.dropoffLocation?.geometry?.location?.lat,
                      lng: formData.dropoffLocation?.geometry?.location?.lng,
                    }}
                  />
                )}
              </GoogleMap>

              <button
                onClick={() => setIsMapDialogOpen(false)}
                className="absolute top-2 right-20 bg-white text-[white] p-2 rounded-full shadow-md hover:bg-gray-200 bg-orange-500 "
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

export default DropOffLocation;
