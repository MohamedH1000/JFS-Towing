import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { loadStripe } from "@stripe/stripe-js";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { vehicleType } from "../constants/constants";
import { BookingContext } from "../context/BookingContext";
import OTPInput from "../components/OTPInput";

const PickUpLocation = dynamic(() => import("./components/PickUpLocation"), {
  ssr: false,
});
const DropOffLocation = dynamic(() => import("./components/DropOffLocation"), {
  ssr: false,
});

const Bookings = () => {
  const {
    formData,
    setFormData,
    yearOptions,
    isLoading,
    setIsLoading,
    availableServices,
    selectedService,
    selectedVehicleType,
    setSelectedService,
    handleVehicleTypeChange,
    resetFormData,
  } = useContext(BookingContext);
  // const [availableServices, setAvailableServices] = useState([]);
  const [otp, setOtp] = useState("");
  // console.log(formData, "form data");
  // console.log(totalCost, "total cost");
  // console.log(otp, "otp number");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);

  const [isComplete, setIsComplete] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const pickupLocationRef = useRef(null);
  const dropoffLocationRef = useRef(null);
  const dateTimeOptionRef = useRef(null);
  const yearRef = useRef(null);
  const makeRef = useRef(null);
  const modelRef = useRef(null);
  const brokenAxleRef = useRef(null);
  const parkingGarageRef = useRef(null);
  const nameRef = useRef(null);
  const countryCodeRef = useRef(null);
  const phoneRef = useRef(null);
  const selectedServiceRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  // console.log(formData.phone, "phone number");
  // console.log(selectedVehicleType, "selected Vehicle Type");
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  // console.log(selectedService, "selected Service");
  // useEffect(() => {
  //   const currentYear = new Date().getFullYear();
  //   const years = [];
  //   for (let year = currentYear; year >= 1980; year--) {
  //     years.push(year);
  //   }
  //   setYearOptions(years);
  //   setAvailableServices(
  //     services.filter((service) =>
  //       selectedVehicleType.supportedServices.includes(service.value)
  //     )
  //   );
  //   // Initialize geocoder when the component mounts
  // }, []);

  // const handleVehicleTypeChange = (event) => {
  //   const selectedValue = parseInt(event.target.value, 10);
  //   const selectedType = vehicleType.find(
  //     (type) => type.value === selectedValue
  //   );
  //   setSelectedVehicleType(selectedType);
  //   setAvailableServices(
  //     services.filter((service) =>
  //       selectedType?.supportedServices.includes(service.value)
  //     )
  //   );
  //   setFormData((prev) => ({
  //     ...prev,
  //     vehicleType: selectedType?.name || "",
  //     selectedService: formData.selectedService, // Reset service when vehicle type changes
  //   }));
  // };
  useEffect(() => {
    resetFormData();
  }, []);
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
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const calculateCost = async () => {
    try {
      let cost = 100; // تعيين التكلفة الافتراضية بناءً على الخدمة
      let distance = 0; // تعيين متغير المسافة إلى صفر

      // تحديد قائمة بالخدمات التي تعتمد على المسافة
      const distanceBasedServices = [
        "Flatbed Towing",
        "Wheel-Lift Towing",
        "Motorcycle Towing",
      ];

      // التحقق إذا كانت الخدمة المحددة لا تعتمد على المسافة
      if (!distanceBasedServices.includes(selectedService)) {
        cost = 75;
        // إذا لم تكن الخدمة تعتمد على المسافة، نضيف تكلفة الإكسسوارات
        cost +=
          parseFloat(formData.brokenAxle || 0) + // إضافة تكلفة المحور المكسور إذا كان موجودًا
          parseFloat(formData.parkingGarage || 0); // إضافة تكلفة الوقوف في الجراج إذا كانت موجودة
        setTotalCost(cost); // تحديث التكلفة الإجمالية
        return; // العودة فورًا دون حساب المسافة
      }

      // إذا كانت الخدمة تعتمد على المسافة، نقوم بحساب المسافة
      if (
        formData.pickupLocation.geometry &&
        formData.dropoffLocation.geometry
      ) {
        // استدعاء دالة calculateDistance لحساب المسافة بين الموقعين
        distance = await calculateDistance(
          formData.pickupLocation.geometry.location, // موقع الالتقاط
          formData.dropoffLocation.geometry.location // موقع التسليم
        );

        // حساب التكلفة الإضافية بناءً على المسافة (0.5 لكل ميل)
        const additionalCost = distance * 0.5;
        cost = 100 + additionalCost; // إضافة التكلفة الأساسية والتكلفة الإضافية للمسافة

        // إضافة تكلفة الإكسسوارات الأخرى مثل المحور المكسور والجراج
        cost +=
          parseFloat(formData.brokenAxle || 0) +
          parseFloat(formData.parkingGarage || 0);
      }

      // تحديث التكلفة الإجمالية في الواجهة
      setTotalCost(cost);
    } catch (error) {
      console.error("Error calculating cost:", error); // في حالة حدوث خطأ، عرض رسالة الخطأ في الـ console
      setTotalCost(0); // تعيين التكلفة إلى صفر في حالة وجود خطأ
    }
  };

  // دالة حساب المسافة بين الموقعين باستخدام Google Maps Directions API
  const calculateDistance = (pickupLocation, dropoffLocation) => {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService(); // إنشاء خدمة الاتجاهات
      directionsService.route(
        {
          origin: pickupLocation, // الموقع الأول (الالتقاط)
          destination: dropoffLocation, // الموقع الثاني (التسليم)
          travelMode: google.maps.TravelMode.DRIVING, // تحديد وضع السفر: القيادة
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // إذا كانت نتيجة الطلب سليمة، نقوم بحساب المسافة
            const distanceInMeters = result.routes[0].legs[0].distance.value; // الحصول على المسافة بالمتر
            const distanceInMiles = distanceInMeters / 1609.344; // تحويل المسافة من متر إلى ميل
            resolve(distanceInMiles); // إرجاع المسافة المحسوبة
          } else {
            reject("Error fetching directions: " + status); // إذا كانت هناك مشكلة، نعرض رسالة الخطأ
          }
        }
      );
    });
  };

  // دالة حساب المسافة
  const handleOtp = async (e) => {
    const requiredFields = [
      { field: "dateTimeOption", ref: dateTimeOptionRef },
      { field: "year", ref: yearRef },
      { field: "make", ref: makeRef },
      { field: "model", ref: modelRef },
      { field: "brokenAxle", ref: brokenAxleRef },
      { field: "parkingGarage", ref: parkingGarageRef },
      { field: "name", ref: nameRef },
      { field: "countryCode", ref: countryCodeRef },
      { field: "phone", ref: phoneRef },
      { field: "selectedService", ref: selectedServiceRef },
      { field: "vehicleType", ref: vehicleTypeRef },
    ];

    let newErrors = {};

    // Validate required fields
    for (let { field, ref } of requiredFields) {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        newErrors[field] = `${field} is required`;

        // Focus on the first invalid field
        if (ref.current) {
          ref.current.focus();
          break; // Stop after focusing on the first invalid field
        }
      }
    }

    // Validate pickup location
    if (!formData.pickupLocation.address || !formData.pickupLocation.geometry) {
      newErrors.pickupLocation =
        "Pickup location address and geometry are required";
      if (pickupLocationRef.current) {
        pickupLocationRef.current.focus();
      }
    }

    // Validate dropoff location
    if (
      selectedService === "Flatbed Towing" ||
      selectedService === "Wheel-Lift Towing"
    ) {
      if (
        !formData.dropoffLocation.address ||
        !formData.dropoffLocation.geometry
      ) {
        newErrors.dropoffLocation =
          "Dropoff location address and geometry are required";
        if (dropoffLocationRef.current) {
          dropoffLocationRef.current.focus();
        }
      }
    }

    // If there are errors, set them and stop further processing
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    setIsLoadingOTP(true);
    setIsOpen(true);
    try {
      // Your OTP sending logic here
      //   const otpResponse = await fetch("/api/send-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     phone: formData.phone,
      //     countryCode: formData.countryCode,
      //   }),
      // });
      // if (!otpResponse.ok) {
      //   console.error("Failed to send OTP:", await otpResponse.text());
      //   return;
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOTP(false);
    }
  };
  const handleResend = async () => {
    const otpResponse = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: formData.phone,
        countryCode: formData.countryCode,
      }),
    });

    if (!otpResponse.ok) {
      console.error("Failed to send OTP:", await otpResponse.text());
      return;
    }

    return otpResponse;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const verifyOTPResponse = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: formData.countryCode,
          phone: formData.phone,
          otp: otp,
        }),
      });

      if (!verifyOTPResponse.ok) {
        console.error(
          "OTP verification failed:",
          await verifyOTPResponse.text()
        );
        alert("Invalid OTP. Please try again.");
        return;
      }
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
          selectedService: formData.selectedService,
          vehicleType: formData.vehicleType,
          vehicleOther: formData.vehicleOther,
          countryCode: formData.countryCode,
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
          className="space-y-6 w-[350px] sm:w-[700px] border border-orange-500 p-5 rounded-md shadow-md"
          onSubmit={handleSubmit}
        >
          {/* Location Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Type of Vehicle</h2>
            <select
              ref={vehicleTypeRef}
              name="vehicleType"
              value={selectedVehicleType.value}
              onChange={(e) => handleVehicleTypeChange(e)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              {vehicleType?.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.vehicleType && (
              <p className="text-[red] text-sm">{errors.vehicleType}</p>
            )}
            {selectedVehicleType.value === 7 && (
              <>
                <input
                  name="vehicleOther"
                  className="w-full py-2 px-4 rounded-lg outline-[1px] border-[2px] border-orange-500"
                  value={formData.vehicleOther}
                  placeholder="Enter Vehicle Type"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleOther: e.target.value,
                    })
                  }
                />
                {errors.vehicleOther && (
                  <p className="text-[red] text-sm">{errors.vehicleOther}</p>
                )}
              </>
            )}
            <h2 className="text-xl font-semibold">
              How can we help you today ?
            </h2>
            <div
              className="flex items-center justify-start flex-wrap gap-5"
              ref={selectedServiceRef}
            >
              {availableServices.map((service) => (
                <div className="flex flex-col items-center" key={service.name}>
                  <div
                    onClick={() => handleServiceSelection(service.name)}
                    className={` border-[2px] ${
                      selectedService === service.name
                        ? "bg-[#142247] text-[white]"
                        : "border-[#f53855] bg-[white]"
                    } cursor-pointer rounded-full w-[100px] h-[100px] flex flex-col 
                  items-center justify-center gap-3 text-[black] font-bold p-4 overflow-hidden`}
                  >
                    {service.icon}
                  </div>
                  <p className="mt-3">{service.name}</p>
                </div>
              ))}
            </div>
            {errors.selectedService && (
              <p className="text-[red] text-sm">{errors.selectedService}</p>
            )}
            <h2 className="text-xl font-semibold">Location</h2>
            <div className="flex items-center justify-between gap-2 w-full flex-col md:flex-row">
              <div className="w-full">
                <p className="text-[black] mb-2">Pickup Location</p>
                <PickUpLocation
                  formData={formData}
                  setFormData={setFormData}
                  pickupLocationRef={pickupLocationRef}
                />
                {errors.pickupLocation && (
                  <p className="text-[red] text-sm">{errors.pickupLocation}</p>
                )}
              </div>
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
                <p className="text-[black] mb-2">Drop Off Location</p>
                <DropOffLocation
                  formData={formData}
                  setFormData={setFormData}
                  dropoffLocationRef={dropoffLocationRef}
                />
                {errors.dropoffLocation && (
                  <p className="text-[red] text-sm">{errors.dropoffLocation}</p>
                )}
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
                  ref={dateTimeOptionRef}
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
            {errors.dateTimeOption && (
              <p className="text-[red] text-sm">{errors.dateTimeOption}</p>
            )}
            {formData.dateTimeOption === "schedule" && (
              <div className="flex space-x-4">
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md"
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  required
                />
                <input
                  type="time"
                  name="serviceTime"
                  value={formData.serviceTime}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md"
                  min={
                    formData.serviceDate ===
                    new Date().toISOString().split("T")[0]
                      ? new Date().toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : null
                  } // Disable past times only for the current date
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
                  ref={yearRef}
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
                {errors.year && (
                  <p className="text-[red] text-sm">{errors.year}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="make" className="block">
                  Make
                </label>
                <select
                  name="make"
                  ref={makeRef}
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
                {errors.make && (
                  <p className="text-[red] text-sm">{errors.make}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="model" className="block">
                  Model
                </label>
                <select
                  ref={modelRef}
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
                {errors.model && (
                  <p className="text-[red] text-sm">{errors.model}</p>
                )}
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
                  ref={brokenAxleRef}
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
                  ref={brokenAxleRef}
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
            {errors.brokenAxle && (
              <p className="text-[red] text-sm">{errors.brokenAxle}</p>
            )}
            <div className="flex space-x-4">
              <p className="option-label">Vehicle in Parking Garage?</p>
              <label className="flex items-center space-x-2">
                <input
                  ref={parkingGarageRef}
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
                  ref={parkingGarageRef}
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
            {errors.parkingGarage && (
              <p className="text-[red] text-sm">{errors.parkingGarage}</p>
            )}
          </div>
          <h1 className="font-bold text-3xl">
            Total Cost: {totalCost?.toFixed(2)} $
          </h1>
          <hr className="text-gray-500" />
          <h2 className="text-3xl font-bold">Contact Information</h2>
          <div className="flex flex-col items-center w-full gap-5 md:flex-row">
            <div className="w-full">
              <input
                ref={nameRef}
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.name && (
                <p className="text-[red] text-sm">{errors.name}</p>
              )}
            </div>
            <div className="w-full">
              <select
                ref={countryCodeRef}
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
              {errors.countryCode && (
                <p className="text-[red] text-sm">{errors.countryCode}</p>
              )}
            </div>
            <div className="w-full">
              <input
                ref={phoneRef}
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.phone && (
                <p className="text-[red] text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleOtp}
            disabled={isLoadingOTP}
            type="button"
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 text-[white] flex justify-center"
          >
            {isLoadingOTP ? <Loader /> : "Submit"}
          </button>
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-[white] p-6 rounded shadow-xl border-[1px]">
                <h2 className="text-lg font-bold mb-2">Enter OTP Number</h2>
                <OTPInput
                  length={6}
                  onChange={setOtp}
                  setIsComplete={setIsComplete}
                />
                <div className="flex items-center justify-end gap-3  mt-5">
                  <p className="font-bold text-[black]">
                    Don't recieve an OTP number?
                  </p>
                  <p
                    className="font-bold underline text-orange-500 cursor-pointer text-right"
                    onClick={handleResend}
                  >
                    Resend
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mr-2 text-gray-600 shadow-md bg-orange-500 
                    rounded-md text-[white] py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!isComplete || isLoading} // Disable button if OTP is not fully entered
                    type="submit"
                    className={`bg-blue-500 text-white bg-orange-500 
                    rounded-md text-[white] py-2 px-4 disabled:bg-gray-400`}
                  >
                    {isLoading ? <Loader /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Bookings;
