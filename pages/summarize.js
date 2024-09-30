import Header from "./components/Header";
import { useRef, useEffect, useState, useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FaInfoCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Summarize() {
    const [isVisible, setIsVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [fileUri, setFileUri] = useState("");
    const [fileName, setFileName] = useState("");
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [mimeType, setMimeType] = useState("");
    const [conversations, setConversations] = useState([]);

    const { data: session } = useSession();

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    console.log(session);

    const bottomRef = useRef(null);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    // To close when click outside selected area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsVisible(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // To make textarea auto adjust the height
    useEffect(() => {
        const tx = document.getElementsByTagName("textarea");
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute(
                "style",
                "height:" + tx[i].scrollHeight + "px;overflow-y:visible;"
            );
            tx[i].addEventListener("input", OnInput, false);
        }
    });

    // To make chat auto view in last view
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const truncateText = (text, maxLength = 4) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    function OnInput() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    }
    //submit handler
    const handleSubmitFile = async (e) => {
        e.preventDefault();
        if (!prompt) {
            return toast.warn("Please enter the prompt!");
        }

        if (!file && !fileUri) {
            return toast.warn("Please put the file on the first delivery!");
        }

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
            setMessages([]);
        } else if (fileUri) {
            formData.append("uri", fileUri);
            formData.append("mimeType", mimeType);
        }
        formData.append("prompt", prompt);

        setMessages((prevMessages) => [
            ...prevMessages,
            { type: "user", content: prompt },
            { type: "ai", content: "Loading...", isLoading: true },
        ]);

        setPrompt("");

        try {
            const response = await fetch("/api/file-handler", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg, index) =>
                        index === prevMessages.length - 1
                            ? { type: "ai", content: data.result }
                            : msg
                    )
                );

                if (data.uri) {
                    setFileUri(data.uri);
                    setMimeType(data.mimeType);
                    setFile(null);
                }
            } else {
                throw new Error(data.error || "An error occurred");
            }
        } catch (error) {
            console.error("Upload failed, Error :  ", error);
            setMessages((prevMessages) =>
                prevMessages.map((msg, index) =>
                    index === prevMessages.length - 1
                        ? {
                              type: "ai",
                              content: `Error: ${`Error when reading files, please do not password your documents and make sure to use the appropriate formatting!`}`,
                          }
                        : msg
                )
            );
        }
    };

    //handle savechats
    const saveChats = async (e) => {
        e.preventDefault();
        if (!messages) {
            return toast.error("Cannot save chat!");
        }

        if (!session) {
            return toast.error("Login to save chats");
        }

        try {
            const response = await fetch("/api/savechats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session.user._id,
                    fileUri,
                    fileName,
                    mimeType,
                    conversations: messages
                        .map((msg) => ({
                            prompt: msg.type === "user" ? msg.content : null,
                            result: msg.type === "ai" ? msg.content : null,
                        }))
                        .filter((msg) => msg.prompt || msg.result),
                }),
            });

            if (response.ok) {
                toast.success("Successfully saved");
            } else {
                toast.warn("Start chat to save 👌");
            }
        } catch (error) {
            console.error("Error saving chats: ", error);
            toast.error("Failed to save chats");
        }
    };

    return (
        <>
            <Header />
            <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="container mx-auto flex justify-center">
                    <div className=" w-full flex justify-center">
                        {/* Text Output */}
                        <div className="mt-16 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-center justify-center mb-16">
                            {fileName && (
                                <div className="w-fit bg-blue-950 text-white p-2 mb-2 rounded-lg">
                                    {fileName}
                                </div>
                            )}
                            {/* Output Media */}
                            <div className="w-full p-5 flex flex-col text-slate-800 dark:text-slate-200 break-words">
                                {messages.map((message, index) => (
                                    <div
                                        className={` ${
                                            message.type === "user"
                                                ? "flex-row-reverse "
                                                : ""
                                        } w-full  flex gap-4 my-4`}
                                        key={index}
                                    >
                                        <div className="w-11 h-11 md:w-14 md:h-14 overflow-hidden rounded-full bg-red-50">
                                            <Image
                                                src={
                                                    message.type === "user"
                                                        ? session?.user
                                                              ?.image ??
                                                          "/kucing2.png"
                                                        : "/kucing2.png"
                                                }
                                                alt="Photo Profile"
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div
                                            className={` ${
                                                message.type === "user"
                                                    ? "bg-blue-100 dark:bg-indigo-700 ml-auto"
                                                    : "bg-gray-200 dark:bg-slate-800 mr-auto"
                                            } w-fit h-fit max-w-[80%] sm:text-sm md:text-lg lg:text-base break-words rounded-3xl  p-4 shadow-md`}
                                        >
                                            {message.isLoading ? (
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
                                                        <span className="">
                                                            Loading...
                                                        </span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <ReactMarkdown className="promptResult">
                                                    {message.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                        </div>
                        {/* Text or Media to Input */}
                        <div className="fixed bottom-0 w-full px-2 sm:px-0 flex justify-center bg-slate-50 dark:bg-slate-950">
                            {/* <form> */}
                            <form
                                onSubmit={handleSubmitFile}
                                className="w-[80%] sm:w-[70%] lg:w-[50%] mb-3 flex items-center h-fit px-6 text-slate-800 dark:text-slate-200 py-3 rounded-3xl bg-slate-200 dark:bg-slate-800"
                            >
                                <div className=" mr-2 flex justify-center ">
                                    <div
                                        onClick={toggleVisibility}
                                        ref={buttonRef}
                                        className="px-3 text-base py-2 cursor-pointer text-slate-50 bg-slate-900 rounded-full"
                                    >
                                        <i className="bi bi-upload"></i>
                                    </div>
                                    <AnimatePresence>
                                        {isVisible && (
                                            <motion.div
                                                initial={{
                                                    y: 10,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    y: 0,
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    y: 10,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                }}
                                                ref={dropdownRef}
                                                className="ml-6 absolute -top-32 min-w-fit max-w-[200px] flex flex-col p-5 rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-lg"
                                            >
                                                <div className="flex items-center mb-2 justify-center">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="block text-sm font-medium mr-2"
                                                    >
                                                        info
                                                    </label>
                                                    <div className="relative group">
                                                        <FaInfoCircle className="text-blue-500 cursor-help" />
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 invisible group-hover:visible transition-opacity duration-300 w-36 text-center">
                                                            Only accepts PDF,
                                                            JPEG, PNG, WEBP,
                                                            HEIC, HEIF, WAV,
                                                            MP3, AIFF, AAC, dan
                                                            FLAC
                                                        </div>
                                                    </div>
                                                </div>
                                                <label
                                                    htmlFor="file-upload"
                                                    className="mb-1 p-2 bg-slate-200 dark:bg-slate-800 cursor-pointer flex items-center space-x-2 w-full hover:text-neutral-600 whitespace-nowrap overflow-hidden"
                                                >
                                                    <i className="bi bi-file-earmark-arrow-up-fill"></i>
                                                    <div>
                                                        {truncateText(
                                                            fileName
                                                        ) || "File"}
                                                    </div>
                                                </label>
                                                <input
                                                    id="file-upload"
                                                    accept=".pdf,.jpeg,.jpg,.png,.webp,.heic,.heif,.wav,.mp3,.aiff,.aac,.flac"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        setFile(
                                                            e.target.files[0]
                                                        );
                                                        setFileName(
                                                            e.target.files[0]
                                                                ? e.target
                                                                      .files[0]
                                                                      .name
                                                                : ""
                                                        );
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            handleSubmitFile(e);
                                        }
                                    }}
                                    rows="1"
                                    type="text"
                                    placeholder="Prompt Input"
                                    className=" w-full bg-transparent max-h-52 resize-none focus:outline-none "
                                ></textarea>

                                <button
                                    type="submit"
                                    className="ml-2 px-3 text-base py-2 cursor-pointer text-slate-50 bg-slate-900 rounded-full self-end"
                                >
                                    <i className="bi bi-send"></i>
                                </button>
                            </form>
                            <button
                                onClick={saveChats}
                                className="border-2 border-cyan-500 ml-2 hover:bg-cyan-500 active:bg-cyan-500 px-3 text-base py-2 cursor-pointer text-slate-50 bg-slate-900 rounded-lg self-end mb-4 h-16"
                            >
                                save
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
