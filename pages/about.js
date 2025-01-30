import React, { useMemo, useState } from "react";
import Layout from "../components/Layout/Layout";
import ScrollAnimationWrapper from "../components/Layout/ScrollAnimationWrapper";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import Testimoni from "../components/Testimoni";
import { services } from "../constants/constants";
import Image from "next/image";
import Slider from "react-slick";
const features = [
  "Short arrival time of 60 minutes or less",
  "Friendly and professional service",
  "Honest competitive prices - zero hidden fees",
  "Available 24 hours a day, 7 days a week",
  "More than 30 years of experience",
];

const about = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  const settings = {
    dots: true,
    customPaging: function (i) {
      return (
        <a className="">
          <span className="mx-2 rounded-l-full rounded-r-full h-4 w-4 block cursor-pointer transition-all "></span>
        </a>
      );
    },
    dotsClass: "slick-dots w-max absolute mt-20  ",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const [sliderRef, setSliderRef] = useState(null);
  return (
    <>
      <Layout>
        <div className="w-full h-[100px] mt-[90px] bg-orange-500 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-[white] ">About</h2>
        </div>
        <section className="w-full mt-10">
          <div
            className="w-full flex flex-col justify-center items-center 
          gap-10 px-5 lg:px-[170px] lg:flex-row lg:items-start"
          >
            <img src="/assets/who-we-are.png" alt="who we are" />
            <div className="flex flex-col items-start gap-3">
              <h1 className="font-bold text-3xl">
                Who We <span className="text-orange-500">Are</span>
              </h1>
              <p>
                JFS Towing is a top-tier, on-demand towing and auto repair
                dispatch service operating in key cities across Texas, including
                Dallas-Fort Worth, Austin, Houston, and San Antonio. We connect
                customers with trusted towing and auto service providers,
                offering solutions for both everyday needs and urgent
                emergencies. Our 24/7 service platform, rapid dispatch system,
                and team of skilled professionals ensure your vehicle is taken
                care of quickly and efficiently, no matter the situation. Don’t
                wait—get the help you need right away with JFS Towing!
              </p>
            </div>
          </div>
          <div className="mt-10 w-full mb-20">
            <ScrollAnimationWrapper>
              <motion.h3
                variants={scrollAnimation}
                className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 
                leading-normal w-9/12 lg:w-4/12 mx-auto mt-32 text-center"
              >
                How it Works{" "}
              </motion.h3>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper className="w-full flex flex-col py-12">
              <motion.div variants={scrollAnimation}>
                <Testimoni />
              </motion.div>
            </ScrollAnimationWrapper>
          </div>
          <div className="mt-15 w-full bg-[url(/assets/we_are_ready.jpg)] bg-cover bg-center py-10">
            <h1 className="text-4xl font-bold text-[black] text-center">
              We are Ready
            </h1>
            <h1 className="text-5xl font-bold text-[black] mt-4 text-center">
              <span className="text-orange-500">24 hours</span> to help you
            </h1>
            <p className="mt-[50px] text-[black] px-[5px] md:px-[150px] text-center">
              At JFS Towing, our goal is to revolutionize the towing and
              roadside assistance industry by harnessing the power of modern
              technology. We aim to build a seamless platform that connects tow
              trucks with drivers in need—whether it’s a stranded motorist, a
              car dealership, a repair shop, or anyone requiring towing
              services. By intelligently matching available resources with those
              in need, we strive to make the process faster, more efficient, and
              more reliable for everyone involved.
            </p>
            <div className="flex justify-center mt-10">
              <button
                className="font-bold text-[white] bg-orange-500 shadow-md
            p-4 rounded-lg hover:border-[2px] hover:border-orange-500 shadow-orange-500
            hover:bg-transparent hover:text-orange-500 transition duration-700"
              >
                Contact Us
              </button>
            </div>
          </div>
          <div className="mt-15 w-full bg-[url(/assets/service_provide_bg.png)] bg-cover bg-center py-10">
            <h1 className="font-bold text-5xl text-center text-[black]">
              Services we <span className="text-orange-500">Provide</span>
            </h1>
            <p className="text-[black] text-center text-md mt-10">
              Select from the services we offer and get back on the road
            </p>
            <ScrollAnimationWrapper className=" flex flex-col py-12 mb-10 px-[10px] lg:px-[150px]">
              <motion.div variants={scrollAnimation}>
                <Slider
                  {...settings}
                  arrows={false}
                  ref={setSliderRef}
                  className="flex items-center justify-center"
                >
                  {services.map((service, i) => (
                    <div className="flex flex-col items-center" key={i}>
                      <div
                        className={`bg-[white] border-[2px]
                        border-[#f53855] cursor-pointer rounded-full
                        w-[100px] h-[100px] flex flex-col p-4
                  items-center justify-center gap-3 text-[black] font-bold`}
                      >
                        {service.icon}
                      </div>
                      <p className="mt-3 text-[black]">{service.name}</p>
                    </div>
                  ))}
                </Slider>
              </motion.div>
            </ScrollAnimationWrapper>
            {/* <div className=" mt-10 flex justify-center items-center gap-20 flex-wrap px-[5px] lg:px-[150px]">
              {services.map((service) => (
                <div className="flex flex-col items-center" key={service.name}>
                  <div
                    className={`bg-[white] border-[2px]
                        border-[#f53855] cursor-pointer rounded-full
                        w-[100px] h-[100px] flex flex-col
                  items-center justify-center gap-3 text-[black] font-bold`}
                  >
                    {service.icon}
                  </div>
                  <p className="mt-3 text-[white]">{service.name}</p>
                </div>
              ))}
            </div> */}
          </div>
          <div
            className="mt-10 w-full flex flex-col items-center justify-center 
          gap-10 lg:flex-row lg:items-start px-[20px] lg:px-[150px]"
          >
            <ScrollAnimationWrapper className="flex w-full justify-end">
              <motion.div
                className="h-full w-full p-4"
                variants={scrollAnimation}
              >
                <Image
                  src="/assets/whyTowing.jpg"
                  alt="offer right"
                  quality={100}
                  height={414}
                  width={508}
                />
              </motion.div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
              <motion.div
                className="flex flex-col items-start justify-center ml-auto w-full lg:w-9/12 gap-4"
                variants={scrollAnimation}
              >
                <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-black-600">
                  Why{" "}
                  <span className="text-3xl text-orange-500">JFS Towing?</span>
                </h3>
                <p className="my-2 text-black-500">
                  Our providers are highly skilled professionals equipped with
                  top-of-the-line tools and technology to ensure safe and
                  dependable assistance for every customer. With years of
                  experience and a commitment to excellence, they deliver
                  reliable solutions tailored to your needs.
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
        </section>
      </Layout>
    </>
  );
};

export default about;
