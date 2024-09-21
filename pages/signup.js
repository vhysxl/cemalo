import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName || !email || !password || !confirmPassword) {
            setStatusMessage({ type: 'error', message: "Semua input harus diisi 😒" });
            return;
        }

        if (password !== confirmPassword) {
            setStatusMessage({ type: 'error', message: "Password dan konfirmasi Password tidak sesuai! 🤦‍♂️" });
            return;
        }

        try {
            const res = await fetch("api/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userName,
                    email,
                    password
                })
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                setStatusMessage({ type: 'success', message: "Sign Up berhasil, silakan login 😎👍" });
            } else {
                const data = await res.json();
                setStatusMessage({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', message: "Terjadi kesalahan pada sistem" });
            console.log(error);

        }
    }

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
                                    Sign Up For An Account
                                </p>
                                {statusMessage.message && (
                                    <div className={`px-4 py-3 rounded relative mb-4 ${statusMessage.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
                                        }`} role="alert">
                                        <span className="block sm:inline">{statusMessage.message}</span>
                                    </div>
                                )}
                                <form
                                    action="#"
                                    method="post"
                                    className="space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <label
                                            htmlFor="userName"
                                            className="text-lg"
                                        >
                                            Username
                                        </label>
                                        <input
                                            onChange={(e) => setUserName(e.target.value)}
                                            id="email"
                                            name="userName"
                                            className="border border-sky-500 focus:border-sky-500 focus:border-2 focus:outline-none p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out transition duration-200 rounded-lg w-full"
                                            type="text"
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className=" text-lg">
                                            Email
                                        </label>
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            id="email"
                                            name="email"
                                            className="border border-sky-500 focus:border-sky-500 focus:border-2 focus:outline-none p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out transition duration-200 rounded-lg w-full"
                                            type="email"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="text-lg"
                                        >
                                            Password
                                        </label>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            id="password"
                                            name="password"
                                            className="border border-sky-500 focus:border-sky-500 focus:border-2 focus:outline-none p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out transition duration-200 rounded-lg w-full"
                                            type="password"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="confirmpassword"
                                            className="text-lg"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            id="confirmpassword"
                                            className="border border-sky-500 focus:border-sky-500 focus:border-2 focus:outline-none p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out transition duration-200 rounded-lg w-full"
                                            type="password"
                                            placeholder="Confirm Password"
                                            required
                                        />
                                    </div>

                                    <button
                                        className="h-12 dark:text-gray-300 from-blue-500 bg-gradient-to-r to-teal-500 shadow-lg text-white rounded-lg w-full hover:scale-105 hover:from-teal-500 hover:to-blue-500 transition duration-300 ease-in-out "
                                        type="submit"
                                    >
                                        Sign Up
                                    </button>
                                </form>
                                <div className="flex mt-4 items-center justify-center text-sm">
                                    <h3 className="opacity-90">
                                        Already have an account?
                                        <Link
                                            className=" text-blue-400 transition-all duration-500 ease-in-out ml-1 bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] "
                                            href="/login"
                                        >
                                            Log In
                                        </Link>
                                    </h3>
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