import React from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";

const ContactUs = () => {
  return (
    <Layout>
      <div className="w-full h-[150px] mt-[90px] bg-orange-500 flex items-center justify-center">
        <h2 className="text-5xl font-bold text-[white]">Contact Us</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-20 w-full px-[5px] md:px-[150px]">
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src={"/assets/f1.svg"}
            alt={"location"}
            width={80}
            height={80}
            quality={100}
          />
          <h2 className="font-bold">Location</h2>
          <p>R4RW+9V Dallas, TX, USA</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src={"/assets/f3.svg"}
            alt={"location"}
            width={80}
            height={80}
            quality={100}
          />
          <h2 className="font-bold">Phone</h2>
          <p>+1 (888) 713-5401</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src={"/assets/f2.svg"}
            alt={"location"}
            width={80}
            height={80}
            quality={100}
          />
          <h2 className="font-bold">Email ID</h2>
          <p>info@nashamatech.tech</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src={"/assets/f4.svg"}
            alt={"location"}
            width={80}
            height={80}
            quality={100}
          />
          <h2 className="font-bold">Service Hours</h2>
          <p>24/7 hours available</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  px-[5px] md:px-[150px] my-5">
        <iframe
          width="550"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          className="rounded-md  w-full h-full"
          src={`https://www.google.com/maps?q=0,0&hl=es;z=14&output=embed`}
        ></iframe>
        <div className="flex flex-col items-center justify-center gap-5 md:mt-0 mt-10">
          <h1 className="font-bold text-5xl text-center">
            Get In <span className="text-orange-500">Touch</span>
          </h1>
          <form className="flex flex-col justify-center items-center gap-2 w-full px-[5px] md:px-[50px]">
            <div className="flex flex-col items-start justify-center gap-5 w-full">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 text-gray-700 bg-white   rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label htmlFor="name">Email Address</label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 text-gray-700 bg-white   rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label htmlFor="name">Message</label>
              <textarea
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 text-gray-700 bg-white  rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
              />
            </div>
            <button className="bg-orange-500 text-[white] p-4 mt-20 rounded-md shadow-md w-[50%] max-md:w-full">
              Contact Us
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
