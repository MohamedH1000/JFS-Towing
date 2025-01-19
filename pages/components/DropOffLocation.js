import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const DropOffLocation = ({ formData, setFormData }) => {
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const [dropoffMapCenter, setDropoffMapCenter] = useState({
    lat: 32.7767,
    lng: -96.797, // Default to Dallas, TX
  });

  useEffect(() => {
    return () => {
      setDropoffAutocomplete(null); // Clear autocomplete instance
    };
  }, []);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  // Create a ref to track mounted state
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true; // Set mounted state to true
    return () => {
      isMountedRef.current = false; // Set to false when unmounting
    };
  }, []);

  const onDropoffLoad = (autocompleteInstance) => {
    setDropoffAutocomplete(autocompleteInstance);
  };

  const onDropoffPlaceChanged = () => {
    if (dropoffAutocomplete) {
      const place = dropoffAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        if (isMountedRef.current) {
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
        }
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (isMountedRef.current && status === "OK" && results[0]) {
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
      }
    });
  };

  const handleDialogClose = (e) => {
    if (e.target === e.currentTarget) {
      setDropoffAutocomplete(null); // Clear autocomplete reference
      setIsMapDialogOpen(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places", "geometry"]}>
      <div className="flex flex-col w-full">
        <Autocomplete
          onLoad={onDropoffLoad}
          onPlaceChanged={onDropoffPlaceChanged}
        >
          <input
            type="text"
            placeholder="Enter Drop Off Location"
            value={formData?.dropoffLocation?.address || ""}
            onClick={() => setIsMapDialogOpen(true)}
            readOnly
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </Autocomplete>

        {isMapDialogOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleDialogClose}
          >
            <div className="relative w-full h-1/2 mx-5">
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
                center={dropoffMapCenter}
                zoom={10}
                onClick={handleMapClick}
              >
                {formData.dropoffLocation?.geometry && (
                  <Marker
                    position={formData.dropoffLocation.geometry.location}
                  />
                )}
              </GoogleMap>
              <button
                onClick={() => setIsMapDialogOpen(false)}
                className="absolute top-2 right-20 bg-orange-500 text-[white] p-2 rounded-full shadow-md hover:bg-gray-200"
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
