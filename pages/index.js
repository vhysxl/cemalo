import Header from "./components/Header";
import { motion } from "framer-motion";
import { FlipWords } from "./components/ui/flip-words";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Home() {
    const words = ["Paper", "Article", "Text", "image", "Audio"];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertError, setAlertError] = useState(false);

    const formRef = useRef(null);
    const scriptURL =
        "https://script.google.com/macros/s/AKfycbxVz11agxAuccK1_hCN0Pu8qToRvx4-_7VGha7ZBc7T_uffotV3_m0rOJAHDEi1seNm/exec";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(scriptURL, {
                method: "POST",
                body: new FormData(formRef.current),
            });

            if (response.ok) {
                setAlertSuccess(true);
                setAlertError(false);
                formRef.current.reset();
            }
        } catch (error) {
            console.error("Error!", error.message);
            setAlertError(true);
            setAlertSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };
    // Close alert button
    const closeAlert = (type) => {
        if (type === "success") setAlertSuccess(false);
        if (type === "error") setAlertError(false);
    };

    const scrollRef = useRef(null);

    return (
        <>
            <Header />
            <main className="w-full bg-slate-50 dark:bg-slate-950 overflow-hidden  ">
                {/* Hero */}
                <div>
                    <motion.div
                        initial={{ opacity: 0.0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        viewport={{ once: true, root: scrollRef }}
                        className="container h-screen mx-auto flex justify-center items-center overflow-hidden p-4"
                    >
                        <div className="font-black">
                            <div className="text-6xl text-slate-800 dark:text-slate-200">
                                Let&apos;s{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                                    Summarize
                                </span>{" "}
                                Your{" "}
                                <span className="relative text-6xl pt-20">
                                    <FlipWords words={words} />
                                </span>
                            </div>

                            <div className="py-7 text-center">
                                <Link
                                    href="/summarize"
                                    className="text-lg bg-blue-950  text-slate-200 dark:text-slate-800 dark:bg-blue-50 border px-5 py-3 rounded-3xl"
                                >
                                    Go Summarize
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* About Cemalo AI */}
                <div className="w-full mb-32">
                    <div className="container mx-auto flex justify-center h-fit">
                        {/* How it works */}
                        <motion.div
                            initial={{ opacity: 0.0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            viewport={{ once: true, root: scrollRef }}
                            className="w-full lg:mx-24 flex flex-col justify-center items-center rounded-3xl p-5 text-slate-800 dark:text-slate-200"
                        >
                            <div className="w-full text-center text-4xl font-bold mb-20">
                                <h1>How It Works</h1>
                            </div>
                            <div className="w-full  gap-10 flex flex-row flex-wrap justify-around items-start">
                                {/* Upload File */}
                                <motion.div
                                    initial={{ opacity: 0.0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.4,
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                    viewport={{ once: true, root: scrollRef }}
                                    className="basis-1/3 md:basis-1/5  flex flex-col justify-center items-center space-y-3 "
                                >
                                    <div className="max-w-5 max-h-5 flex justify-center items-center text-xl font-extrabold p-5 bg-slate-200 dark:bg-slate-800 rounded-full">
                                        <span>1</span>
                                    </div>
                                    <div className="text-8xl">
                                        <i className="bi bi-file-earmark-arrow-up-fill"></i>
                                    </div>
                                    <div className="text-lg font-medium">
                                        <p className="text-center mb-2">
                                            Upload Your FIle
                                        </p>
                                        <p className="font-light text-sm text-center text-slate-700 dark:text-slate-300">
                                            Upload your files. Supported file
                                            formats include PDF, JPEG, PNG,
                                            WEBP, HEIC, HEIF, WAV, MP3, AIFF,
                                            AAC and FLAC.
                                        </p>
                                    </div>
                                </motion.div>
                                {/* Text Your Prompt */}
                                <motion.div
                                    initial={{ opacity: 0.0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.5,
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                    viewport={{ once: true, root: scrollRef }}
                                    className="basis-1/3 md:basis-1/5  flex flex-col justify-center items-center space-y-3 "
                                >
                                    <div className="max-w-5 max-h-5 flex justify-center items-center text-xl font-extrabold p-5 bg-slate-200 dark:bg-slate-800 rounded-full">
                                        <span>2</span>
                                    </div>
                                    <div className="text-8xl">
                                        <i className="bi bi-chat-square-text-fill"></i>
                                    </div>
                                    <div className="text-lg font-medium">
                                        <p className="text-center mb-2">
                                            Text Your Prompt
                                        </p>
                                        <p className="font-light text-sm text-center text-slate-700 dark:text-slate-300">
                                            Give the AI a prompt to tell it how
                                            to summarize your file.
                                        </p>
                                    </div>
                                </motion.div>
                                {/* AI Processing */}
                                <motion.div
                                    initial={{ opacity: 0.0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.6,
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                    viewport={{ once: true, root: scrollRef }}
                                    className="basis-1/3 md:basis-1/5  flex flex-col justify-center items-center space-y-3 "
                                >
                                    <div className="max-w-5 max-h-5 flex justify-center items-center text-xl font-extrabold p-5 bg-slate-200 dark:bg-slate-800 rounded-full">
                                        <span>3</span>
                                    </div>
                                    <div className="text-8xl">
                                        <i className="bi bi-gear-fill"></i>
                                    </div>
                                    <div className="text-lg font-medium">
                                        <p className="text-center mb-2">
                                            AI Processing
                                        </p>
                                        <p className="font-light text-sm text-center text-slate-700 dark:text-slate-300">
                                            AI processes the given files to
                                            summarize them based on the given
                                            prompts.
                                        </p>
                                    </div>
                                </motion.div>
                                {/* AI Result */}
                                <motion.div
                                    initial={{ opacity: 0.0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.7,
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                    viewport={{ once: true, root: scrollRef }}
                                    className="basis-1/3 md:basis-1/5  flex flex-col justify-center items-center space-y-3 "
                                >
                                    <div className="max-w-5 max-h-5 flex justify-center items-center text-xl font-extrabold p-5 bg-slate-200 dark:bg-slate-800 rounded-full">
                                        <span>4</span>
                                    </div>
                                    <div className="text-8xl">
                                        <i className="bi bi-file-text-fill"></i>
                                    </div>
                                    <div className="text-lg font-medium break-words text-wrap">
                                        <p className="text-center mb-2">
                                            Get your summarize
                                        </p>
                                        <p className="font-light text-sm text-center text-slate-700 dark:text-slate-300">
                                            You can summarize or get something
                                            by text prompt again.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Feedback Form */}
                <div className="w-full px-4 mb-8 md:max-w-3xl mx-auto text-base text-slate-800 dark:text-slate-200">
                    <div className="w-full text-center text-4xl font-bold mb-20">
                        <h1>Feedback</h1>
                    </div>
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className=" text-slate-800 dark:text-slate-200"
                    >
                        <label htmlFor="name" className="font-semibold">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            id="name"
                            className="w-full bg-slate-200 dark:bg-slate-800  p-3 mb-5 rounded-md focus:outline-none focus:border-sky-500 focus:border-2"
                            required
                        />
                        <label htmlFor="email" className="font-semibold">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            id="email"
                            className="w-full bg-slate-200 dark:bg-slate-800 p-3 mb-5 rounded-md focus:outline-none focus:border-sky-500 focus:border-2"
                            required
                        />
                        <label htmlFor="message" className="font-semibold">
                            Message
                        </label>
                        <textarea
                            name="message"
                            type="text"
                            id="message"
                            className="w-full bg-slate-200 dark:bg-slate-800  p-3 mb-5 rounded-md focus:outline-none focus:border-sky-500 focus:border-2"
                            required
                        ></textarea>
                        {/* Alert Message */}
                        {alertSuccess && (
                            <div id="alert-success">
                                <div
                                    className="flex items-center p-4 mb-5 text-green-500 rounded-lg bg-green-100 dark:bg-gray-800 dark:text-blue-400"
                                    role="alert"
                                >
                                    <div className="text-lg">
                                        <i className="bi bi-info-circle-fill"></i>
                                    </div>
                                    <span className="sr-only">Info</span>
                                    <div className="ms-3 font-semibold">
                                        Thank you, your feedback has been sent.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => closeAlert("success")}
                                        className="ms-auto -mx-1.5 -my-1.5 bg-green-100 text-green-500 rounded-lg focus:ring-2 focus:ring-green-300 p-1.5 hover:bg-green-50 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                                        data-dismiss-target="#alert-1"
                                        aria-label="Close"
                                    >
                                        <span className="sr-only">Close</span>
                                        <div className="text-lg">
                                            <i className="bi bi-x-lg"></i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        {alertError && (
                            <div id="alert-error">
                                <div
                                    className="flex items-center p-4 mb-5 text-red-500 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-blue-400"
                                    role="alert"
                                >
                                    <div className="text-lg">
                                        <i className="bi bi-info-circle-fill"></i>
                                    </div>

                                    <span className="sr-only">Info</span>
                                    <div className="ms-3 font-semibold">
                                        Sorry, your message failed to send.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => closeAlert("error")}
                                        className="ms-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-300 p-1.5 hover:bg-red-50 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                                        data-dismiss-target="#alert-1"
                                        aria-label="Close"
                                    >
                                        <span className="sr-only">Close</span>
                                        <div className="text-lg">
                                            <i className="bi bi-x-lg"></i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        <div
                            id="btn-submit"
                            className={`${isSubmitting ? "hidden" : ""}`}
                        >
                            <button
                                type="submit"
                                className="w-full font-semibold text-slate-800 dark:text-slate-200 bg-blue-950 dark:bg-blue-50 py-3 px-8 rounded-full hover:opacity-80 hover:shadow-lg transition duration-300"
                            >
                                Submit
                            </button>
                        </div>

                        {/* Loading Button */}
                        {isSubmitting && (
                            <div id="btn-loading">
                                <button
                                    type="button"
                                    className="w-full font-semibold text-slate-800 dark:text-slate-200 flex justify-center items-center rounded-full px-8 py-3"
                                    disabled
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5 animate-spin dark:text-gray-600 fill-slate-300 mr-3"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="">Loading...</span>
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </main>

            <footer className="bg-slate-50 dark:bg-slate-950">
                <div className="w-[80%] overflow-hidden mx-auto flex flex-col">
                    <hr className="w-full border-slate-800 dark:border-slate-200" />
                    <span className="w-full text-slate-800 dark:text-slate-200 text-center mt-5 mb-5">
                        © 2024 Cemalo AI. All Rights Reserved.
                    </span>
                </div>
            </footer>
        </>
    );
}
