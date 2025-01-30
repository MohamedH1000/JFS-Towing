import { createContext, useEffect, useState } from "react";
import { vehicleType } from "../constants/constants";
import { services } from "../constants/constants";

export const BookingContext = createContext();
const initialFormData = {
  pickupLocation: { address: "", geometry: null },
  dropoffLocation: { address: "", geometry: null },
  dateTimeOption: "asap",
  serviceDate: "",
  serviceTime: "",
  year: "",
  make: "",
  model: "",
  brokenAxle: "0",
  parkingGarage: "0",
  pictures: [],
  name: "",
  countryCode: "+1",
  phone: "",
  selectedService: "Flatbed Towing",
  vehicleType: "Car/SUV/Minivan",
  vehicleOther: "",
};
export const BookingProvider = ({ children }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(
    vehicleType[0]
  );
  const [formData, setFormData] = useState(initialFormData);

  const [selectedService, setSelectedService] = useState(
    formData.selectedService
  );

  const handleVehicleTypeChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    const selectedType = vehicleType.find(
      (type) => type.value === selectedValue
    );
    setSelectedVehicleType(selectedType);

    setAvailableServices(
      services.filter((service) =>
        selectedType?.supportedServices.includes(service.value)
      )
    );
    setFormData((prev) => ({
      ...prev,
      vehicleType: selectedType?.name || "",
      selectedService: formData.selectedService, // Reset service when vehicle type changes
    }));
  };
  const resetFormData = () => {
    setFormData(initialFormData);
  };
  // const handleServiceSelection = (service) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     selectedService: service,
  //   }));
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1980; year--) {
      years.push(year);
    }
    setYearOptions(years);
    setAvailableServices(
      services.filter((service) =>
        selectedVehicleType.supportedServices.includes(service.value)
      )
    );
    // Initialize geocoder when the component mounts
  }, [selectedVehicleType]);

  return (
    <BookingContext.Provider
      value={{
        formData,
        setFormData,
        selectedService,
        setSelectedService,
        yearOptions,
        availableServices,
        setAvailableServices,
        isLoading,
        setSelectedVehicleType,
        setIsLoading,
        handleVehicleTypeChange,
        selectedVehicleType,
        resetFormData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
