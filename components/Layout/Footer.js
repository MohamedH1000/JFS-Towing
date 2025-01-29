import React from "react";
import Facebook from "../../public/assets/Icon/facebook.svg";
import Twitter from "../../public/assets/Icon/twitter.svg";
import Instagram from "../../public/assets/Icon/instagram.svg";
import Link from "next/link";
const Footer = () => {
  return (
    <>
      <div className="bg-white-300 pt-44 pb-24">
        <div
          className="flex flex-col items-center justify-center gap-4 
        md:gap-10 md:flex-row px-5 md:px-[150px] md:justify-between"
        >
          <div className=" flex flex-col items-center w-[350px] md:items-start md:w-[500px]">
            <img
              src="/assets/Logo.png"
              alt="logo"
              width={150}
              className="mb-5"
            />
            <p className="mb-4 text-center md:text-start">
              <strong className="font-medium">JFS Towing</strong> is an
              innovative, on-demand towing and roadside assistance service
              designed to help drivers request tow trucks quickly and
              efficiently. Operating across the United States, our platform
              ensures that help arrives in minutes, not hours, whenever you need
              it. Whether you're stranded on the road or require immediate
              assistance, JFS Towing is here to provide fast, reliable support
              wherever you are.
            </p>
            <div className="flex w-full mt-2 mb-8 -mx-2 justify-center md:justify-start">
              <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
                <Facebook className="h-6 w-6 cursor-pointer" />
              </div>
              <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
                <Twitter className="h-6 w-6 cursor-pointer" />
              </div>
              <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
                <Instagram className="h-6 w-6 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className=" flex flex-col items-center md:items-start mt-10 md:mt-0">
            <p className="text-black-600 mb-4 font-medium text-lg">
              Useful links
            </p>
            <ul className="text-black-500 ">
              <Link href={"/"}>
                <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                  Home{" "}
                </li>
              </Link>
              <Link href={"/about"}>
                <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                  About us{" "}
                </li>
              </Link>
              <Link href={"/services"}>
                <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                  Services{" "}
                </li>
              </Link>
              <Link href={"/contactus"}>
                <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                  Contact Us{" "}
                </li>
              </Link>
            </ul>
          </div>
          <div className=" flex flex-col items-center md:items-start mt-10 md:mt-0">
            <p className="text-black-600 mb-4 font-medium text-lg">
              Connect with us
            </p>
            <ul className="text-black-500 flex flex-col items-center justify-center gap-3 w-full">
              <li className="flex  items-center gap-3 w-full">
                <img src="/assets/f1.png" alt="location" />
                <p>R4RW+9V Dallas, TX, USA</p>
              </li>
              <li className="flex  items-start gap-3 w-full">
                <img src="/assets/f2.png" alt="email" />
                <p>info@nashamatech.tech</p>
              </li>
              <li className="flex  items-start gap-3 w-full">
                <img src="/assets/f3.png" alt="phone number" />
                <p>+1 (888) 713-5401</p>
              </li>
              <li className="flex  items-start gap-3 w-full">
                <img src="/assets/f4.png" alt="24/7 availability" />
                <p>24/7 hours available</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full bg-orange-500 text-[white] flex justify-center items-center p-4">
        Copyright ©{new Date().getFullYear()} - JFS Towing. All Rights Reserved
      </div>
    </>
  );
};

export default Footer;
