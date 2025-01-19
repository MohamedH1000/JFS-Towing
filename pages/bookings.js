import React from "react";
import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { loadStripe } from "@stripe/stripe-js";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { services } from "../constants/constants";
import { vehicleType } from "../constants/constants";

const PickUpLocation = dynamic(() => import("./components/PickUpLocation"), {
  ssr: false,
});
const DropOffLocation = dynamic(() => import("./components/DropOffLocation"), {
  ssr: false,
});
const Bookings = () => {
  const [yearOptions, setYearOptions] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("Flatbed Towing");
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(
    vehicleType[0]
  );

  const [formData, setFormData] = useState({
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
    selectedService: "",
    vehicleType: "",
  });
  console.log(formData);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

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
  }, []);

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
      selectedService: "", // Reset service when vehicle type changes
    }));
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    setFormData((prev) => ({
      ...prev,
      selectedService: service,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateCost = () => {
    let cost = 100;
    if (
      selectedService !== "Flatbed Towing" &&
      selectedService !== "Wheel-Lift Towing" &&
      selectedService !== "Motorcycle Towing"
    ) {
      cost = 75;
      cost +=
        parseFloat(formData.brokenAxle) + parseFloat(formData.parkingGarage);
      setTotalCost(cost);
      return;
    }
    if (formData.pickupLocation.geometry && formData.dropoffLocation.geometry) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        formData.pickupLocation.geometry.location,
        formData.dropoffLocation.geometry.location
      );
      cost = 100; // Base cost
      const distanceInKm = distance / 1000; // Convert to km
      const additionalCost = distanceInKm * 0.5; // Cost per km
      cost += additionalCost;
      cost +=
        parseFloat(formData.brokenAxle) + parseFloat(formData.parkingGarage);
    }
    setTotalCost(cost);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const stripe = await stripePromise;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalCost,
          currency: "usd",
          name: formData.name,
          phone: formData.phone,
          description: "Booking Service Payment",
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          dateTimeOption: formData.dateTimeOption,
          serviceDate: formData.serviceDate,
          serviceTime: formData.serviceTime,
          year: formData.year,
          make: formData.make,
          model: formData.model,
          brokenAxle: formData.brokenAxle,
          parkingGarage: formData.parkingGarage,
          pictures: formData.pictures,
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to create checkout session:",
          await response.text()
        );
        return;
      }

      const session = await response.json();
      if (session.id) {
        const { id } = session;
        const result = await stripe.redirectToCheckout({ sessionId: id });

        if (result.error) {
          console.error(result.error.message);
        }
      } else {
        console.error("No session ID returned from the server");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateCost();
  }, [
    formData.pickupLocation,
    formData.dropoffLocation,
    formData.brokenAxle,
    formData.parkingGarage,
    selectedService,
  ]);

  return (
    <Layout>
      <div className="w-full h-[100px] mt-[90px] bg-orange-500 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-[white]">Service Request</h2>
      </div>
      <div className="px-4 py-6 bg-white shadow-md rounded-lg flex items-center flex-col border-gray-100 border-[1px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-[350px] sm:w-[700px] border border-orange-500 p-5 rounded-md shadow-md"
        >
          {/* Location Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Type of Vehicle</h2>
            <select
              name="vehicleType"
              value={selectedVehicleType.value}
              onChange={handleVehicleTypeChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              {vehicleType.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
            <h2 className="text-xl font-semibold">
              How can we help you today ?
            </h2>
            <div className="flex items-center justify-start flex-wrap gap-5">
              {availableServices.map((service) => (
                <div className="flex flex-col items-center" key={service.name}>
                  <div
                    onClick={() => handleServiceSelection(service.name)}
                    className={`bg-[white] border-[2px] ${
                      selectedService === service.name
                        ? "bg-[#142247] text-[white]"
                        : "border-[#f53855]"
                    } cursor-pointer rounded-full w-[100px] h-[100px] flex flex-col 
                  items-center justify-center gap-3 text-[black] font-bold`}
                  >
                    {service.icon}
                  </div>
                  <p className="mt-3">{service.name}</p>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold">Location</h2>
            <div className="flex items-center justify-between gap-2 w-full flex-col md:flex-row">
              <PickUpLocation formData={formData} setFormData={setFormData} />
              <div
                style={{
                  display:
                    selectedService === "Flatbed Towing" ||
                    selectedService === "Wheel-Lift Towing" ||
                    selectedService === "Motorcycle Towing"
                      ? "block"
                      : "none",
                }}
                className="w-full"
              >
                <DropOffLocation
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Date & Time</h2>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="dateTimeOption"
                  value="asap"
                  checked={formData.dateTimeOption === "asap"}
                  onChange={handleChange}
                  className="text-orange-500"
                />
                <span>As Soon As Possible</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="dateTimeOption"
                  value="schedule"
                  onChange={handleChange}
                  className="text-orange-500"
                />
                <span>Schedule</span>
              </label>
            </div>
            {formData.dateTimeOption === "schedule" && (
              <div className="flex space-x-4">
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="time"
                  name="serviceTime"
                  value={formData.serviceTime}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            )}
          </div>

          {/* Vehicle Details Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Vehicle Details</h2>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="year" className="block">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="make" className="block">
                  Make
                </label>
                <select
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="model" className="block">
                  Model
                </label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Model</option>
                  <option value="3 Series">3 Series</option>
                  <option value="Civic">Civic</option>
                  <option value="Camry">Camry</option>
                  <option value="E-Class">E-Class</option>
                  <option value="F-150">F-150</option>
                </select>
              </div>
            </div>
            <label htmlFor="pictures" className="block">
              Add Pictures (Optional)
            </label>
            <input
              type="file"
              id="pictures"
              name="pictures"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Additional Info Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Additional Information</h2>
            <div className="flex space-x-4">
              <p className="option-label">Missing or Broken Axle or Wheel?</p>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="brokenAxle"
                  value="50"
                  checked={formData.brokenAxle === "50"}
                  onChange={handleChange}
                  className="text-orange-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="brokenAxle"
                  value="0"
                  checked={formData.brokenAxle === "0"}
                  onChange={handleChange}
                  className="text-orange-500"
                />
                <span>No</span>
              </label>
            </div>
            <div className="flex space-x-4">
              <p className="option-label">Vehicle in Parking Garage?</p>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="parkingGarage"
                  value="40"
                  checked={formData.parkingGarage === "40"}
                  onChange={handleChange}
                  className="text-orange-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="parkingGarage"
                  value="0"
                  checked={formData.parkingGarage === "0"}
                  onChange={handleChange}
                  className="text-orange-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          <h1 className="font-bold text-3xl">
            Total Cost: {totalCost?.toFixed(2)} $
          </h1>
          <hr className="text-gray-500" />
          <h2 className="text-3xl font-bold">Contact Information</h2>
          <div className="flex flex-col items-center w-full gap-5 md:flex-row">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <select
              id="countryCode"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+971">+971 (UAE)</option>
              <option value="+962">+962 (Jordan)</option>
              <option value="+20">+20 (Egypt)</option>
              <option value="+91">+91 (India)</option>
              <option value="+81">+81 (Japan)</option>
              <option value="+61">+61 (Australia)</option>
            </select>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 text-[white] flex justify-center"
          >
            {isLoading ? <Loader /> : "Submit"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Bookings;
