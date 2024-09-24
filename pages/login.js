import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter()

    const { data: session, status } = useSession();

    const handleSubmit = async function (e) {
        e.preventDefault();
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password
        });
        if (res.error) {
            setError(res.error)
        } else {
            router.push("/");
        }
    }

    useEffect(() => {
        if (session || status === "authenticated") {
            router.push('/summarize')
        }

    }, [status, router])


    return (
        <>
            <main className="bg-slate-50 dark:bg-slate-950 min-h-screen overflow-hidden">
                <div className="min-h-screen w-full flex justify-center items-center ">
                    <div className="flex">
                        <div
                            id="back-div"
                            className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-[26px] m-4"
                        >
                            <div className="border-[20px] border-transparent rounded-[20px] text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950 shadow-lg p-2 md:p-10 m-2">
                                <h1 className="pt-8 pb-1 font-bold text-5xl text-center cursor-default">
                                    CEMALO AI
                                </h1>
                                <p className="pt-1 pb-6 font-bold text-xl text-center cursor-default">
                                    Welcome Back!
                                </p>
                                <form
                                    action="#"
                                    method="post"
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="text-lg"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="border border-sky-500 focus:border-sky-500 focus:border-2 focus:outline-none p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out transition duration-200 rounded-lg w-full "
                                            type="email"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className=" text-lg"
                                        >
                                            Password
                                        </label>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            id="password"
                                            className="border border-sky-500 focus:border-sky-500 focus:border-2 focus:outline-none p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out transition duration-200 rounded-lg w-full"
                                            type="password"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <a
                                        className="group text-blue-400 "
                                        href="#"
                                    >
                                        <span className="bg-left-bottom text-sm bg-gradient-to-r  from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                            Forget your password?
                                        </span>
                                    </a>
                                    <button
                                        className="h-12 bg-gradient-to-r dark:text-gray-300 from-blue-500 to-teal-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-teal-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                        type="submit"
                                    >
                                        LOG IN
                                    </button>
                                </form>
                                {error && (
                                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 w-fit rounded-lg mx-auto mt-4 break-words">
                                        {error}
                                    </div>
                                )}
                                <div className="flex mt-4 items-center justify-center text-sm">
                                    <h3 className="opacity-90">
                                        Don&apos;t have an account?
                                        <Link
                                            className=" text-blue-400 transition-all duration-500 ease-in-out ml-1 bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] "
                                            href="/signup"
                                        >
                                            Sign Up
                                        </Link>
                                    </h3>
                                </div>

                                <div className="flex relative justify-center items-center mt-5">
                                    <hr className="w-full border-slate-900 dark:border-slate-200" />
                                    <p className="absolute px-2 bg-white dark:bg-slate-950">
                                        Or
                                    </p>
                                </div>
                                <div
                                    id="third-party-auth"
                                    className="flex items-center justify-center mt-5 flex-wrap"
                                >
                                    <button
                                        onClick={() => signIn('google')}
                                        className="w-full relative h-12 text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-all ease-in-out duration-300 shadow-lg p-5 rounded-lg m-1 flex items-center text-base"
                                    >
                                        <div className="max-w-6 md:max-w-8">
                                            <Image
                                                src="/google.png"
                                                width={500}
                                                height={500}
                                                alt="Google"
                                            />
                                        </div>
                                        <div
                                            className="w-full 
                                        "
                                        >
                                            <p>Sign in with Google</p>
                                        </div>
                                    </button>
                                </div>

                                <div className="text-gray-500 flex text-center mt-4 items-center text-sm">
                                    <p className="cursor-default">
                                        By signing in, you agree to our
                                        <a
                                            className="group text-blue-400 transition-all duration-100 ease-in-out mx-1"
                                            href="#"
                                        >
                                            <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                                Terms
                                            </span>
                                        </a>
                                        and
                                        <a
                                            className="group text-blue-400 transition-all duration-100 ease-in-out ml-1"
                                            href="#"
                                        >
                                            <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                                Privacy Policy
                                            </span>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;