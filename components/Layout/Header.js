import React, { useState, useEffect } from "react";
import Link from "next/link";
import ButtonOutline from "../misc/ButtonOutline.";
import { X } from "lucide-react";

const Header = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [scrollActive, setScrollActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  return (
    <>
      <header
        className={
          "fixed top-0 w-full z-30 bg-white-500 transition-all py-3" +
          (scrollActive ? " shadow-md pt-0" : " ")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto flex items-center justify-between">
          <div className="col-start-1 col-end-2 flex items-center text-3xl">
            <Link href="/" passHref>
              <img
                src="/assets/Logo.png"
                alt="Logo"
                className="cursor-pointer w-[100px]"
              />
            </Link>
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500 items-center">
            <Link href="/" passHref>
              <a
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "home"
                    ? " text-orange-500 animation-active "
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("home")}
              >
                Home
              </a>
            </Link>
            <Link href="/services" passHref>
              <a
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "services"
                    ? " text-orange-500 animation-active "
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("services")}
              >
                Services
              </a>
            </Link>
            <Link href="/about" passHref>
              <a
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "about"
                    ? " text-orange-500 animation-active "
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("about")}
              >
                About
              </a>
            </Link>
            <Link href="/contactus" passHref>
              <a
                className={
                  "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "contact"
                    ? " text-orange-500 animation-active "
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("contact")}
              >
                Contact Us
              </a>
            </Link>
          </ul>
          {/* Hamburger Icon */}
          <button
            onClick={toggleMobileMenu}
            className="p-4 focus:outline-none lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          {/* <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link href="/signin" passHref>
              <a className="text-black-600 mx-2 sm:mx-4 capitalize tracking-wide hover:text-orange-500 transition-all">
                Sign In
              </a>
            </Link>
            <ButtonOutline>Sign Up</ButtonOutline>
          </div> */}
        </nav>
        {/* Mobile Menu (hidden by default on desktop, shown on mobile) */}
        <div className="lg:hidden">
          {/* Mobile Menu Links */}
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } bg-white p-4 space-y-4 flex flex-col items-center`}
          >
            <Link href="/" passHref>
              <a
                className={
                  "block py-2" +
                  (activeLink === "home"
                    ? " text-orange-500"
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("home")}
              >
                Home
              </a>
            </Link>
            <Link href="/services" passHref>
              <a
                className={
                  "block py-2" +
                  (activeLink === "services"
                    ? " text-orange-500"
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("services")}
              >
                Services
              </a>
            </Link>
            <Link href="/about" passHref>
              <a
                className={
                  "block py-2" +
                  (activeLink === "about"
                    ? " text-orange-500"
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("about")}
              >
                About
              </a>
            </Link>
            <Link href="/contactus" passHref>
              <a
                className={
                  "block py-2" +
                  (activeLink === "contact"
                    ? " text-orange-500"
                    : " text-black-500 hover:text-orange-500 ")
                }
                onClick={() => setActiveLink("contact")}
              >
                Contact Us
              </a>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
