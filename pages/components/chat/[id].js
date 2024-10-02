import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../Header";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import {
    ToastContainer,
    toast,
    Slide,
    Zoom,
    Flip,
    Bounce,
} from "react-toastify";

export default function Chats() {
    const router = useRouter();
    const { id } = router.query;
    const [fileUri, setFileUri] = useState("");
    const [fileName, setFileName] = useState("");
    const [mimeType, setMimeType] = useState("");
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const { data: session } = useSession();
    const bottomRef = useRef(null);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const res = await fetch(`/api/chats/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch chats");
                }
                const chatData = await res.json();
                setFileUri(chatData.fileUri);
                setFileName(chatData.fileName);
                setMimeType(chatData.mimeType);
                setMessages(
                    chatData.conversations.map((conv) => ({
                        type: conv.prompt ? "user" : "ai",
                        content: conv.prompt || conv.result,
                    }))
                );
            } catch (error) {
                console.log("error fetching chats", error);
            }
        };

        if (id) {
            fetchChat();
        }
    }, [id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // const extendChats = async (e) => {
    //     e.preventDefault()
    //     if (!prompt) {
    //         return toast.warn('Tolong masukan prompt!')
    //     }

    //     const formData = new FormData();
    //     formData.append("uri", fileUri);
    //     formData.append("mimeType", mimeType);
    //     formData.append("prompt", prompt);

    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { type: "user", content: prompt },
    //         { type: "ai", content: "Loading...", isLoading: true },
    //     ]);

    //     setPrompt("");

    //     try {
    //         const response = await fetch("/api/file-handler", {
    //             method: 'POST',
    //             body: formData,
    //         })

    //         const data = await response.json();

    //         if (response.ok) {
    //             setMessages((prevMessages) =>
    //                 prevMessages.map((msg, index) =>
    //                     index === prevMessages.length - 1
    //                         ? { type: "ai", content: data.result }
    //                         : msg
    //                 )
    //             );
    //         } else {
    //             throw new Error(data.error || "An error occurred");
    //         }

    //     } catch (error) {
    //         console.error("ya error")
    //     }
    // }

    return (
        <>
            <Header />
            <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="container mx-auto flex justify-center">
                    <div className="w-full flex justify-center text-sm md:text-base">
                        <div className="mt-16  w-full sm:w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-center justify-center mb-16">
                            {fileName && (
                                <div className="max-w-full px-2 overflow-hidden">
                                    <p className=" bg-blue-950 text-slate-200 p-3 mb-2 mx-2 rounded-lg break-words">
                                        {fileName}
                                    </p>
                                </div>
                            )}
                            <div className="w-full p-5 flex flex-col text-slate-900 dark:text-slate-200 break-words">
                                {messages.map((message, index) => (
                                    <div
                                        className={`${
                                            message.type === "user"
                                                ? "flex-row-reverse "
                                                : ""
                                        } w-full flex gap-4 my-4`}
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
                                            className={`${
                                                message.type === "user"
                                                    ? "bg-blue-100 dark:bg-indigo-700 ml-auto"
                                                    : "bg-gray-200 dark:bg-slate-800 mr-auto"
                                            } w-fit h-fit max-w-[80%]  break-words rounded-3xl p-4 shadow-md`}
                                        >
                                            {message.isLoading ? (
                                                <p>Loading...</p>
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
                        {/* <div className="fixed bottom-0 w-full flex justify-center bg-slate-50 dark:bg-slate-950">
                            <form
                                onSubmit={extendChats}
                                className="w-[90%] sm:w-[70%] lg:w-[50%] mb-3 flex items-center h-fit px-6 text-slate-800 dark:text-slate-200 py-3 rounded-3xl bg-slate-200 dark:bg-slate-800"
                            >
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            extendChats(e);
                                        }
                                    }}
                                    rows="1"
                                    placeholder="Prompt Input"
                                    className="w-full bg-transparent max-h-52 resize-none focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 px-3 text-base py-2 cursor-pointer text-slate-50 bg-slate-900 rounded-full self-end"
                                >
                                    <i className="bi bi-send"></i>
                                </button>
                            </form>
                        </div> */}
                    </div>
                </div>
            </main>
        </>
    );
}
