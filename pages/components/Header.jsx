import Link from "next/link";
import { useState, useRef } from "react";
import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DarkModeBtn from "./DarkModeBtn";
import UserAvatar, { UserEmail } from "./UserAvatar";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
    const link = [
        { id: "/", name: "Home" },
        { id: "/summarize", name: "Summarize" },
        { id: "/library", name: "Library" },
    ];
    const headerRef = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            const header = headerRef.current;
            if (header) {
                const fixed = header.offsetTop;
                if (window.scrollY || window.pageYOffSet > fixed) {
                    header.classList.add("navbar-color");
                } else {
                    header.classList.remove("navbar-color");
                }
            }
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
    });

    const [nav] = useState(link);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const handleNavbar = () => {
        setIsNavOpen(!isNavOpen);
    };
    const profileVisibility = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const { data: session } = useSession();

    return (
        <header
            ref={headerRef}
            className="fixed w-full z-50 border-slate-200 dark:border-slate-900"
        >
            <div className="relative container mx-auto flex items-center justify-center px-10 h-16">
                <div className="md:hidden text-slate-900 dark:text-slate-50">
                    <a className="text-xl font-bold ">CEMALO AI</a>
                </div>

                <button
                    id="hamburger"
                    name="hamburger"
                    onClick={handleNavbar}
                    className={`${
                        isNavOpen ? "hamburger-active" : ""
                    } absolute block right-4 md:hidden z-20 `}
                >
                    <span className="hamburger-line origin-top-left transition duration-300 ease-in-out bg-slate-900 dark:bg-slate-50"></span>
                    <span className="hamburger-line transition duration-300 ease-in-out bg-slate-900 dark:bg-slate-50"></span>
                    <span className="hamburger-line origin-bottom-left transition duration-300 ease-in-out bg-slate-900 dark:bg-slate-50"></span>
                </button>
                <nav
                    className={`${
                        isNavOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    } w-screen h-screen  bottom-0 top-0 bg-blue-100 dark:bg-sky-950 md:bg-transparent dark:md:bg-transparent mx-auto absolute transition duration-300 ease-in-out md:h-full md:static `}
                >
                    <div className="w-full h-full flex flex-col md:flex-row items-center justify-around md:justify-between">
                        <div href="" className="md:w-[30%]">
                            <a
                                href=""
                                className="text-xl font-bold text-slate-900 dark:text-slate-50"
                            >
                                CEMALO AI
                            </a>
                        </div>
                        <div className="md:w-[40%] flex justify-center items-center text-base font-semibold">
                            <div className="w-fit flex flex-col md:flex-row">
                                <Navigation nav={nav} />
                            </div>
                        </div>
                        <div className="md:w-[30%] flex text-base font-semibold justify-end items-center ">
                            <DarkModeBtn />
                            {session ? (
                                <div className="relative z-10 flex flex-col items-center px-5 ">
                                    <div
                                        onClick={profileVisibility}
                                        className="w-10 h-10 rounded-full overflow-hidden hover:opacity-85 transition ease-in duration-150 cursor-pointer"
                                    >
                                        <UserAvatar session={session} />
                                    </div>
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{
                                                    y: 7,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    y: 0,
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    y: 7,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                }}
                                                className="absolute w-64 justify-center shadow-md bottom-0 mb-12 md:bottom-auto md:top-0 md:right-0 md:mt-12 rounded-3xl hover:opacity-80 text-slate-800 dark:text-slate-200  bg-slate-200 dark:bg-slate-800 p-5 flex flex-col gap-2"
                                            >
                                                <div className="w-full text-xs text-center ">
                                                    <span>
                                                        {session.user.email}
                                                    </span>
                                                </div>
                                                <hr className="border-slate-800 dark:border-slate-200" />
                                                <div className="w-full flex">
                                                    <Link
                                                        className="w-full px-2 py-3 flex items-center"
                                                        href="/userprofile"
                                                    >
                                                        <i className="bi bi-person-fill text-2xl"></i>
                                                        <span className="pl-5">
                                                            Profile
                                                        </span>
                                                    </Link>
                                                </div>

                                                <div className="w-full flex ">
                                                    <div
                                                        className="w-full px-2 py-3 cursor-pointer flex items-center"
                                                        onClick={() =>
                                                            signOut("google")
                                                        }
                                                    >
                                                        <i className="bi bi-box-arrow-right text-2xl"></i>
                                                        <span className="pl-5">
                                                            Logout
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    className="relative z-10 px-5 py-2 text-slate-50 dark:text-slate-900 bg-blue-950 dark:bg-blue-50 mx-2 rounded-3xl hover:opacity-85 transition ease-in duration-150"
                                    href="/login"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

function Navigation({ nav }) {
    const router = useRouter();
    const { pathname } = router;
    const [activeNav] = useState(pathname);

    return (
        <>
            {nav.map((navs) => (
                <Link
                    className={`${
                        activeNav === navs.id
                            ? "text-slate-50 dark:text-slate-950 bg-blue-950 dark:bg-blue-50"
                            : " text-slate-900 dark:text-slate-50"
                    }  relative px-5 py-2 mx-2 rounded-3xl hover:opacity-75 transition ease-in duration-150 `}
                    key={navs.id}
                    href={navs.id}
                >
                    {navs.name}
                </Link>
            ))}
        </>
    );
}
