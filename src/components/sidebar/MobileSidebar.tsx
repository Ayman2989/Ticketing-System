"use client";

import React, { useContext } from "react";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { SidebarData } from "@/data/data";
import { UserContext } from "../../../context";
import { useRouter } from "next/navigation";

interface MobileSidebarProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (arg: boolean) => void;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  onClose,
}) => {
  const router = useRouter();
  const { userInfo } = useContext(UserContext);
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-etuwaCustom-wb text-white z-50 transition-transform">
      <div className="p-4 flex justify-between items-center">
        <div className=" pl-3">
          <Image
            onClick={() => router.push}
            src={Logo}
            alt="logo"
            className="max-h-5 max-w-14"
          />
        </div>
        <button
          className="bg-white p-2 rounded-md w-10 text-etuwaCustom-db
    "
          onClick={onClose}
        >
          <svg
            className="h-4 w-4 text-etuwaCustom-db"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="18" y1="6" x2="6" y2="18" />{" "}
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <nav className={`flex flex-col space-y-2 mt-8`}>
        <Link
          href="/tickets"
          className="flex items-center p-2 bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
        >
          <i className={`material-icons text-xl `}>
            <svg
              className="h-7 w-7 text-gray-200 pl-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />{" "}
              <line x1="8" y1="21" x2="16" y2="21" />{" "}
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </i>
          <span className={`block ml-4 text-gray-200 `}>Tickets</span>
        </Link>
        {userInfo.role === "Admin" && (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center justify-between p-2  bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
            >
              <div className="flex items-center">
                <svg
                  className="h-7 w-7 text-gray-200 pl-2 group-hover:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span
                  className={`block ml-4 
       text-gray-200 group-hover:text-white`}
                >
                  Settings
                </span>
              </div>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                } block ml-4 text-gray-400 group-hover:text-white`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden `}
              >
                <ul className={`space-y-2 mt-2 pl-4 text-sm block`}>
                  {SidebarData.map((item, index) => {
                    return (
                      <Link
                        href={item.href}
                        className="bg-gradient-to-r transition-all duration-500  from-etuwaCustom-lb to-etuwaCustom-sb rounded-xl  hover:scale-90 group flex items-center px-4 mr-2 py-2 "
                        key={index}
                      >
                        <svg
                          className="h-3 w-3 text-etuwaCustom-db "
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <line x1="3" y1="12" x2="3" y2="12.01" />
                          <line x1="7" y1="12" x2="17" y2="12" />
                          <line x1="21" y1="12" x2="21" y2="12.01" />
                        </svg>
                        <p className="text-etuwaCustom-db ">{item.title}</p>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            )}
            <Link
              href="/users"
              className="flex items-center p-2 bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
            >
              <i className={`material-icons text-xl `}>
                <svg
                  className="h-7 w-7 text-gray-200 pl-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </i>
              <span className={`block ml-4 text-gray-200 `}>Users</span>
            </Link>
            <Link
              href="/statistics"
              className="flex items-center p-2 bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
            >
              <i>
                <svg
                  className="h-7 w-7 text-gray-200 pl-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />{" "}
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </i>
              <span className={`block ml-4 text-gray-200 `}>Statistics</span>
            </Link>
            <Link
              href="/tickets"
              className="flex items-center p-2 bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
            >
              <i>
                <svg
                  className="h-7 w-7 text-gray-200 pl-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </i>
              <span
                className={`block ml-4
                   text-gray-200 `}
              >
                FAQs
              </span>
            </Link>
            <Link
              href="/tickets"
              className="flex items-center p-2 bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
            >
              <i>
                <svg
                  className="h-7 w-7 text-gray-200 pl-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </i>
              <span
                className={`block ml-4
                   text-gray-200 `}
              >
                Report
              </span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );

  {
    /* Background Overlay */
  }
  <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
    onClick={onClose}
  />;
};

export default MobileSidebar;
