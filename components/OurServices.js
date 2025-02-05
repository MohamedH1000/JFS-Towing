import Image from "next/image";
import { motion } from "framer-motion";
import { services } from "../constants/constants";

const ServicesSection = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h1 className="font-bold text-3xl text-orange-500">
        Explore Our Services
      </h1>

      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-5 md:px-10">
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src={service.img}
              alt={service.name}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800">
                {service.name}
              </h3>
              <p className="text-gray-600 mt-2">{service.homeDesc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
