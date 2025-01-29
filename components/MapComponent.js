import React, { useCallback } from "react";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

const API_KEY = "AIzaSyB-mfaKrkjifwxSeoVqd32HYBy_Ds2q_dk"; // ضع مفتاح API الخاص بك هنا

const MapComponent = () => {
  const onLoad = useCallback((autocomplete) => {
    console.log("Autocomplete Loaded:", autocomplete);
  }, []);

  const onPlaceChanged = () => {
    console.log("Place Changed");
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places", "geometry"]}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: 31.963158, lng: 35.930359 }} // إحداثيات المركز
        zoom={10}
      >
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search Location"
            style={{
              boxSizing: border - box,
              border: "1px solid transparent",
              width: "240px",
              height: "32px",
              padding: "0 12px",
              borderRadius: "3px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              fontSize: "14px",
              outline: "none",
              position: "absolute",
              left: "50%",
              top: "10px",
              transform: "translateX(-50%)",
            }}
          />
        </Autocomplete>
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
