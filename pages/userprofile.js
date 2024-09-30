import UserAvatar from "./components/UserAvatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const avatar = session?.user?.image || session?.user?.avatar;
    const avatarGoogle = avatar?.includes("https://lh3");

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please upload an image first.");
            return;
        }

        if (!session) {
            toast.warn("Session invalid! Please login first.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", session?.user?._id);

        try {
            const response = await fetch("/api/uploadavatar", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                toast.success("Avatar uploaded successfully!");

               
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        avatar: data.url,
                    },
                });

                
                setUrl(data.url);
            } else {
                toast.error(data.msg || "Failed to upload avatar");
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("An error occurred while uploading the avatar");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        console.log(url);
        setUrl(url);
    };

    return (
        <main className="w-screen min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
            <div className="w-[90%] md:w-[75%] lg:w-[60%] h-fit flex flex-col border drop-shadow-lg rounded-3xl overflow-hidden text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-800 dark:border-slate-700 ">
                <div className="w-full">
                    <button
                        type="button"
                        onClick={router.back}
                        className="w-fit h-fit text-3xl rounded-br-3xl hover:opacity-75 transition ease-in duration-150 bg-blue-950 dark:bg-blue-50 text-slate-200 dark:text-slate-800 px-3 py-2"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </div>
                <div className="w-full flex flex-col gap-4 items-center justify-center mb-3">
                    <div className="w-40 h-40 border border-slate-800 dark:border-slate-700 rounded-full overflow-hidden relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : url || avatar ? (
                            <img
                                src={url || avatar}
                                alt="User Avatar"
                                width={500}
                                height={500}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <UserAvatar session={session} />
                        )}
                    </div>
                    <div className="text-xl font-semibold">
                        <span>{session?.user?.name}</span>
                    </div>
                    <div className="text-lg font-medium">
                        <span>{session?.user?.email}</span>
                    </div>
                    {!avatarGoogle && (
                        <>
                            <div className="mt-3">
                                <span>Change Profile Picture</span>
                            </div>
                            <label
                                htmlFor="userProfile"
                                className="flex flex-col justify-center items-center rounded-full cursor-pointer border px-3 py-2 text-2xl"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </label>
                            <form
                                onSubmit={handleSubmitAvatar}
                                className="flex flex-col items-center"
                            >
                                <input
                                    accept=".jpeg,.png,"
                                    id="userProfile"
                                    onChange={handleChange}
                                    type="file"
                                    className="hidden"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Uploading..." : "Done"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
