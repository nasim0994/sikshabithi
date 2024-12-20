import { Link } from "react-router-dom";
import React from "react";
import * as FaIcons from "react-icons/fa";

import { useGetLogoQuery } from "../../Redux/api/logoApi";
import { useGetContactQuery } from "../../Redux/api/contactApi";
import { useGetFeatureQuery } from "../../Redux/api/featureApi";

export default function Footer() {
  const { data, isLoading } = useGetLogoQuery();
  const { data: contact } = useGetContactQuery();

  const { data: fetaure } = useGetFeatureQuery();
  let features = fetaure?.data;

  return (
    <footer className="bg-[#13263C] pt-10 pb-5">
      <div className="container">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10 pb-14">
          <div className="md:col-span-2">
            {isLoading ? (
              "Shiksha Bithi"
            ) : (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/logo/${
                  data?.data?.logo
                }`}
                alt="logo"
                className="w-32 sm:w-48"
              />
            )}

            <p className="text-sm text-gray-300 mt-2">
              <strong>শিক্ষা বীথি</strong> একটি সমন্বিত শিক্ষা প্ল্যাটফর্ম,
              যেখানে শিক্ষার্থীদের জন্য রয়েছে আধুনিক এবং প্রয়োজনীয় সব শিক্ষামূলক
              উপকরণ। আমরা বিশ্বাস করি, শিক্ষা জীবন গঠনের মৌলিক ভিত্তি। তাই ক্লাস
              ১ থেকে বিসিএস পর্যন্ত প্রতিটি ধাপে শিক্ষার্থীদের জন্য পরীক্ষা
              প্রস্তুতি, শিক্ষামূলক ব্লগ, নোটস, এবং চাকরির বিজ্ঞপ্তি নিয়ে আমরা
              আছি আপনার পাশে।
            </p>
          </div>

          <div>
            <h2 className="text-gray-200 text-xl font-medium">Features</h2>
            <ul className="text-gray-300 font-light mt-2 flex flex-col gap-1 text-[15px]">
              {features?.map((feature) => (
                <li key={feature?._id}>
                  <Link to="/about-us" className="hover:underline">
                    {feature?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-gray-200 text-xl font-medium">Quick Link</h2>
            <ul className="text-gray-300 font-light mt-2 flex flex-col gap-1 text-[15px]">
              <li>
                <Link to="/about-us" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:underline">
                  FAQ
                </Link>
              </li>

              <li>
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-gray-200 text-xl font-medium">Contact</h2>

            <ul className="mt-2 text-[15px] text-gray-300">
              <li>
                <p>{contact?.data[0]?.phone}</p>
              </li>
              <li className="my-1">
                <p>{contact?.data[0]?.email}</p>
              </li>
              <li>
                <p className="italic">{contact?.data[0]?.address}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-content pt-5">
          <div className="sm:flex justify-between items-center">
            <p className="text-gray-300 text-sm font-light">
              Copyright © 2024 Shiksha Bithi, All rights reserved. develop by{" "}
              <Link
                to="https://nasimuddin.me"
                target="_blank"
                className="underline"
              >
                Nasim
              </Link>
            </p>

            <ul className="flex items-center gap-2">
              {contact?.data[0]?.socials?.map((social, i) => (
                <Link
                  to={social?.url}
                  target="_blank"
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary flex justify-center items-center text-base-100 hover:-translate-y-1 duration-200"
                >
                  {React.createElement(FaIcons[social?.icon])}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
