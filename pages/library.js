import { Suspense, useEffect, useState } from "react";
import Header from "./components/Header";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Library() {
    const [history, setHistory] = useState([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchChat = async () => {
            if (status === "authenticated" && session?.user?._id) {
                try {
                    const response = await fetch(
                        `/api/savechats?userId=${session.user._id}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch chats");
                    }
                    const data = await response.json();
                    setHistory(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching chats:", error);
                }
            }
        };

        fetchChat();
    }, [status, session]);

    return (
        <>
            <Header />
            <main className="bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto flex justify-center min-h-screen">
                    <div className="mt-16 w-full flex justify-center">
                        <div className="w-[90%] sm:w-[70%] lg:w-[50%] flex justify-center">
                            {/* History Media */}
                            {session ? (
                                <div className="w-full p-5 flex flex-col gap-y-5 text-slate-900 dark:text-slate-200 break-words">
                                    <p className="text-xl">
                                        Hello{" "}
                                        <span className="text-cyan-600 font-bold">
                                            {session?.user?.name} 👋
                                        </span>{" "}
                                    </p>
                                    <p>
                                        <History history={history} />
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full p-5 flex flex-col gap-y-5 text-slate-900 dark:text-slate-200 break-words items-center justify-center">
                                    <p className="text-2xl">
                                        Please login first to access this
                                        feature.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

    function History({ history }) {
        return (
            <>
                {history.map((item) => (
                    <Link href={`/components/chat/${item._id}`} key={item._id}>
                        <div className="w-full text-justify max-h-28 transition ease-in duration-200 hover:scale-105 hover:border border-slate-800 dark:border-white bg-slate-200 dark:bg-slate-800 rounded-3xl p-5 cursor-pointer overflow-hidden">
                            <div className="mb-1 font-bold">
                                {item.fileName || "No filename available"}
                            </div>
                            <div className="line-clamp-2">
                                {item.conversations?.[0]?.prompt ||
                                    "No prompt available"}
                            </div>
                        </div>
                    </Link>
                ))}
            </>
        );
    }
}
