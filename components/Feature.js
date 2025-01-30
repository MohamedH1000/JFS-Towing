import Image from "next/image";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const features = [
  "Short arrival time of 60 minutes or less",
  "Friendly and professional service",
  "Honest competitive prices - zero hidden fees",
  "Available 24 hours a day, 7 days a week",
  "More than 30 years of experience",
];

const Feature = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div
      className="max-w-screen-xl mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="feature"
    >
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 p  y-8 my-12">
        <ScrollAnimationWrapper className="flex w-full justify-end">
          <motion.div className="h-full w-full p-4" variants={scrollAnimation}>
            <Image
              src="/assets/whyTowing.jpg"
              alt="Towing Service"
              layout="responsive"
              quality={100}
              height={414}
              width={508}
              className="w-auto rounded-lg"
            />
          </motion.div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <motion.div
            className="flex flex-col items-start justify-center ml-auto w-full lg:w-9/12 gap-4"
            variants={scrollAnimation}
          >
            <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-black-600">
              Why <span className="text-3xl text-orange-500">JFS Towing?</span>
            </h3>
            <p className="my-2 text-black-500">
              Our providers are highly skilled professionals equipped with
              top-of-the-line tools and technology to ensure safe and dependable
              assistance for every customer. With years of experience and a
              commitment to excellence, they deliver reliable solutions tailored
              to your needs.
            </p>
            <ul className="text-black-500 self-start list-inside ml-8 gap-4">
              {features.map((feature, index) => (
                <motion.li
                  className="relative circle-check custom-list"
                  custom={{ duration: 2 + index }}
                  variants={scrollAnimation}
                  key={feature}
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Feature;
