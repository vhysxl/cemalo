import UserAvatar, { UserEmail } from "./components/UserAvatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function UserProfile() {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <>
            <main className=" ">
                <div className="w-screen min-h-screen flex justify-center items-center">
                    <div className="w-[90%] md:w-[75%] lg:w-[60%] h-fit flex flex-col border-2 shadow-lg rounded-3xl overflow-hidden text-slate-800 dark:text-slate-200 ">
                        <div className="w-full">
                            <button type="button" onClick={router.back} className="w-fit h-fit text-3xl rounded-br-3xl bg-blue-50 px-3 py-2">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                        </div>
                        <div className="w-full flex flex-col gap-4 items-center justify-center mb-3">
                            <div className="w-40 border-2 rounded-full overflow-hidden">
                                <UserAvatar session={session} />
                            </div>
                            <div className="text-xl font-semibold">
                                <span>{session?.user?.name}</span>
                            </div>
                            <div className="text-lg font-medium">
                                <span>{session?.user?.email}</span>
                            </div>
                            <div className="mt-3">
                                <span>Change Profile Picture</span>
                            </div>
                            <form className="">
                                <label htmlFor="userProfile" className="flex flex-col justify-center items-center rounded-full cursor-pointer border px-3 py-2 text-2xl"><i class="bi bi-plus-lg"></i></label>
                                <input id="userProfile" type='file'  className="hidden"></input>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
