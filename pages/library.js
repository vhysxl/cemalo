import { useState } from "react";
import Header from "./components/Header";
import { useSession } from "next-auth/react";


const historyData = [
    {
        id: 1,
        title: "Absen bang",
        summarize:
            "Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO",
    },
    {
        id: 2,
        title: "Absen bang",
        summarize:
            "Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO",
    },
    {
        id: 3,
        title: "Absen bang",
        summarize:
            "Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO",
    },
    {
        id: 4,
        title: "Absen bang",
        summarize:
            "Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO Ada AA II UU EE OO",
    },
];

export default function Library() {
    const [historys] = useState(historyData);

    const { data: session } = useSession();

    if (!session) {
        return (
            <>
                <Header />
                <main className="bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto flex justify-center min-h-screen">
                        <div className="mt-16 w-full flex justify-center">
                            <div className="w-[90%] sm:w-[70%] lg:w-[50%] flex justify-center">
                                {/* History Media */}
                                <div className="w-full min-h-screen p-5 flex flex-col gap-y-5 text-slate-900 dark:text-slate-200 break-words items-center justify-center">
                                    <p className="text-2xl">Login terlebih dahulu untuk melihat history</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto flex justify-center min-h-screen">
                    <div className="mt-16 w-full flex justify-center">
                        <div className="w-[90%] sm:w-[70%] lg:w-[50%] flex justify-center">
                            
                            <div className="w-full min-h-screen p-5 flex flex-col gap-y-5 text-slate-900 dark:text-slate-200 break-words">
                                <p className="text-xl">Halo <span className="text-cyan-600 font-bold">{session.user.name} 👋</span> </p>
                                <History historys={historys} session={session} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

    function History({ historys }) {


        return (
            <>
                {historys.map((history) => (
                    <div
                        key={history.id}
                        className="w-full text-justify max-h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl p-5 cursor-pointer overflow-hidden "
                    >
                        <div className="mb-1 font-bold">{history.title}</div>
                        <div className="line-clamp-2">{history.summarize}</div>
                    </div>
                ))}
            </>
        );
    }
}
