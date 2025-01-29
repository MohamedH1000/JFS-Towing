import React, { useContext } from "react";
import Layout from "../components/Layout/Layout";
import { services as serv, vehicleType } from "../constants/constants";
import { useRouter } from "next/router";
import { BookingContext } from "../context/BookingContext";

const services = () => {
  const router = useRouter();
  const { setSelectedService, setSelectedVehicleType } =
    useContext(BookingContext);
  const handleBooking = (serviceName) => {
    router.push("/bookings");
    setSelectedService(serviceName);
    if (serviceName === "Motorcycle Towing") {
      setSelectedVehicleType(vehicleType[1]);
    } else {
      setSelectedVehicleType(vehicleType[0]);
    }
  };
  return (
    <Layout>
      <div className="w-full h-[100px] mt-[90px] bg-orange-500 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-[white]">Services</h2>
      </div>
      <section className="flex flex-col items-center justify-center gap-5 my-10">
        {serv.map((service) => (
          <div className="border-[2px] border-orange-500 shadow-md rounded-lg cursor-pointer p-4 md:w-[500px] w-[300px]">
            <img
              src={service.img}
              alt={service.name}
              className="w-full h-auto"
            />
            <h1 className="font-bold text-lg mt-2">{service.name}</h1>
            <p className="mt-3">{service.description}</p>
            <div className="w-full mx-2 my-3 flex-col items-center justify-center gap-3">
              {service.price.car ? (
                <>
                  <div className="w-full flex justify-between items-start gap-2">
                    <p>Car</p>
                    <p>{service.price.car}</p>
                  </div>
                  <div className="w-full flex justify-between items-start">
                    <p>Truck</p>
                    <p>{service.price.truck}</p>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-between items-center">
                  <p>Price</p>
                  <p>{service.price}</p>
                </div>
              )}
            </div>
            <button
              className="bg-orange-500 text-[white] p-2 font-bold 
              text-xl w-full rounded-lg hover:shadow-md"
              onClick={() => handleBooking(service.name)}
            >
              Book
            </button>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default services;
