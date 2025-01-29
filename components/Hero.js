import React, { useMemo } from "react";
import Image from "next/image";
import ButtonPrimary from "./misc/ButtonPrimary";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";
import Link from "next/link";
import Testimoni from "./Testimoni";

const Hero = ({
  listUser = [
    {
      name: "Users",
      number: "390",
      icon: "/assets/Icon/heroicons_sm-user.svg",
    },
    {
      name: "Locations",
      number: "20",
      icon: "/assets/Icon/gridicons_location.svg",
    },
    {
      name: "Server",
      number: "50",
      icon: "/assets/Icon/bx_bxs-server.svg",
    },
  ],
}) => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto" id="about">
      <ScrollAnimationWrapper>
        <motion.div
          className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16"
          variants={scrollAnimation}
        >
          <div className=" flex flex-col justify-center items-start row-start-2 sm:row-start-1">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal">
              The <span className="text-orange-500">simplest</span> &{" "}
              <span className="text-orange-500">fastest</span> way to tow your
              vehicle
            </h1>
            <p className="text-black-500 mt-4 mb-6">
              No more calls, surprising prices, and hours of waiting.
            </p>
            <Link href={"/bookings"}>
              <a>
                <ButtonPrimary>Request Service</ButtonPrimary>
              </a>
            </Link>
          </div>
          <div className="flex w-full">
            <motion.div className="h-full w-full" variants={scrollAnimation}>
              <Image
                src="/assets/JFS_Towing.jpg"
                alt="JFS Towing"
                quality={100}
                width={612}
                height={383}
                layout="responsive"
              />
            </motion.div>
          </div>
        </motion.div>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <motion.h3
          variants={scrollAnimation}
          className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-normal w-9/12 sm: lg:w-4/12 mx-auto mt-32"
        >
          How it Works{" "}
        </motion.h3>
        {/* <motion.p
              variants={scrollAnimation}
              className="leading-normal mx-auto mb-2 mt-4 w-10/12 sm:w-7/12 lg:w-6/12"
            >
              These are the stories of our customers who have joined us with
              great pleasure when using this crazy feature.
            </motion.p> */}
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper className="w-full flex flex-col py-12 mb-10">
        <motion.div variants={scrollAnimation}>
          <Testimoni />
        </motion.div>
      </ScrollAnimationWrapper>

      {/* <div className="relative w-full flex">
        <ScrollAnimationWrapper className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500 z-10">
          {listUser.map((listUsers, index) => (
            <motion.div
              className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
              key={index}
              custom={{ duration: 2 + index }}
              variants={scrollAnimation}
            >
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                  <img src={listUsers.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-black-600 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-black-500">{listUsers.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollAnimationWrapper>
        <div
          className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
          style={{ filter: "blur(114px)" }}
        ></div>
      </div> */}
    </div>
  );
};

export default Hero;

// {/* <div className="flex flex-col w-full my-16">
// <ScrollAnimationWrapper>
//   <motion.h3
//     variants={scrollAnimation}
//     className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-relaxed w-9/12 sm:w-6/12 lg:w-4/12 mx-auto"
//   >
//     Huge Global Network of Fast VPN{" "}
//   </motion.h3>
//   <motion.p
//     className="leading-normal  mx-auto my-2 w-10/12 sm:w-7/12 lg:w-6/12"
//     variants={scrollAnimation}
//   >
//     See LaslesVPN everywhere to make it easier for you when you move
//     locations.
//   </motion.p>
// </ScrollAnimationWrapper>
// <ScrollAnimationWrapper>
//   <motion.div
//     className="py-12 w-full px-8 mt-16"
//     variants={scrollAnimation}
//   >
//     <Maps className="w-full h-auto" />
//   </motion.div>
// </ScrollAnimationWrapper>
// <ScrollAnimationWrapper>
//   <motion.div
//     className="w-full flex justify-evenly items-center mt-4 flex-wrap lg:flex-nowrap"
//     variants={scrollAnimation}
//   >
//     {/* <Netflix className="h-18 w-auto" /> */}
//     <img
//       src="/assets/Icon/amazon.png"
//       className="h-14 w-auto mt-4 lg:mt-2"
//       alt=""
//     />
//     <img
//       src="/assets/Icon/netflix.png"
//       className="h-14 w-auto mt-2 lg:mt-0"
//       alt=""
//     />
//     <img
//       src="/assets/Icon/reddit.png"
//       className="h-12 w-auto mt-2 lg:mt-0"
//       alt=""
//     />
//     <img
//       src="/assets/Icon/discord.png"
//       className="h-14 w-auto mt-2 lg:mt-0"
//       alt=""
//     />
//     <img
//       src="/assets/Icon/spotify.png"
//       className="h-12 w-auto mt-2 lg:mt-0"
//       alt=""
//     />
//   </motion.div>
// </ScrollAnimationWrapper>
// </div> */}
