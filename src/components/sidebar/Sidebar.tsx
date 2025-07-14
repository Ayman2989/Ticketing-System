"use client";
import React, { useContext, useState } from "react";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import { SidebarData } from "@/data/data";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";
import { UserContext } from "../../../context";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isMobileOpen: boolean; // Control visibility on small screens
  onClose: () => void; // Callback for closing the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfo } = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      {/* Sidebar for Large Screens */}

      <div
        className={`hidden lg:flex flex-col bg-etuwaCustom-wb text-white h-full fixed left-0 top-0 transition-all duration-500 ${
          isLocked || isExpanded ? "w-48" : "w-16"
        } mt-5 z-20`}
        onMouseEnter={() => !isLocked && setIsExpanded(true)}
        onMouseLeave={() => !isLocked && setIsExpanded(false)}
      >
        <div className=" pl-3">
          <Image
            onClick={() => router.push}
            src={Logo}
            alt="logo"
            className="max-h-5 max-w-14"
          />
        </div>

        <div className="p-4 flex items-center justify-between">
          <span
            className={`${
              isExpanded ? "block" : "hidden"
            } font-bold text-violet-500 overflow-hidden`}
          ></span>
          <button
            className={` p-1 rounded ${isExpanded ? "block" : "hidden"}`}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? (
              <svg
                className="h-7 w-6 text-etuwaCustom-db animate-moveRight"
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
                <line x1="20" y1="4" x2="20" y2="20" />{" "}
                <rect x="4" y="9" width="12" height="6" rx="2" />
              </svg>
            ) : (
              <svg
                className="h-7 w-6 text-etuwaCustom-db animate-pulse"
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
                <line x1="20" y1="4" x2="20" y2="20" />{" "}
                <rect x="4" y="9" width="12" height="6" rx="2" />
              </svg>
            )}
          </button>
        </div>
        <nav className={`flex flex-col space-y-2 ${!isExpanded && "mt-8"}`}>
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
            <span
              className={`${
                isExpanded ? "block ml-4" : "hidden"
              } text-gray-200 `}
            >
              Tickets
            </span>
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
                    className={`${
                      isExpanded ? "block ml-4" : "hidden"
                    } text-gray-200 group-hover:text-white`}
                  >
                    Settings
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  } ${
                    isExpanded ? "block ml-4" : "hidden"
                  } text-gray-400 group-hover:text-white`}
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
                  <ul
                    className={`space-y-2 mt-2 pl-4 text-sm ${
                      isExpanded ? "block" : "hidden"
                    }`}
                  >
                    {SidebarData.map((item, index) => {
                      return (
                        <Link
                          href={item.href}
                          className="bg-gradient-to-r transition-all duration-500  from-etuwaCustom-lb to-etuwaCustom-sb rounded-xl  hover:scale-90 group flex items-center px-4 py-2 "
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
                <span
                  className={`${
                    isExpanded ? "block ml-4" : "hidden"
                  } text-gray-200 `}
                >
                  Users
                </span>
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
                <span
                  className={`${
                    isExpanded ? "block ml-4" : "hidden"
                  } text-gray-200 `}
                >
                  Statistics
                </span>
              </Link>
              <Link
                href="/reports"
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
                  className={`${
                    isExpanded ? "block ml-4" : "hidden"
                  } text-gray-200 `}
                >
                  Reports
                </span>
              </Link>
            </>
          )}
          <Link
            href="/faqs"
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
              className={`${
                isExpanded ? "block ml-4" : "hidden"
              } text-gray-200 `}
            >
              FAQs
            </span>
          </Link>
        </nav>
      </div>

      {/* Sidebar for Small Screens */}
      {isMobileOpen && (
        <>
          <MobileSidebar
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            onClose={onClose}
          />
        </>
      )}
    </>
  );
};

export default Sidebar;
