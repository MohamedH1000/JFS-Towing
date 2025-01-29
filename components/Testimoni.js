import React, { useState } from "react";

// import react slick
import Slider from "react-slick";
import Image from "next/image";

const Testimoni = ({
  listTestimoni = [
    {
      name: "1",
      image: "/assets/w1.png",
      city: "Warsaw",
      country: "Poland",
      rating: "4.5",
      testimoni:
        "Provide us the information that you need for the vehicle and the services",
    },
    {
      name: "2",
      image: "/assets/w2.png",
      city: "Warsaw",
      country: "Poland",
      rating: "4.5",
      testimoni: "Schedule your roadside service or your tow",
    },
    {
      name: "3",
      image: "/assets/w3.png",
      city: "Warsaw",
      country: "Poland",
      rating: "4.5",
      testimoni: "You can track, rate and pay for the service digitally",
    },
  ],
}) => {
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [sliderRef, setSliderRef] = useState(null);

  return (
    <>
      <Slider
        {...settings}
        arrows={false}
        ref={setSliderRef}
        className="flex items-stretch justify-items-stretch"
      >
        {listTestimoni.map((listTestimonis, index) => (
          <div className="px-3 flex " key={index}>
            <div className=" border-gray-500 hover:border-orange-500 transition-all rounded-full p-8 flex flex-col items-center ">
              {/* <div className="flex flex-col ml-5 text-center">
                <p className="text-3xl capitalize text-orange-500 text-center">
                  {listTestimonis.name}
                </p>
              </div> */}
              <Image
                src={listTestimonis.image}
                height={100}
                width={100}
                alt="Icon People"
                className="rounded-lg"
              />

              <p className="mt-5 text-center text-2xl">
                {listTestimonis.testimoni}.
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Testimoni;
