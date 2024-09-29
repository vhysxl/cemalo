import UserAvatar from "./components/UserAvatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function UserProfile() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');

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

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", session?.user?._id);

        try {
            const response = await fetch("/api/uploadavatar", {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                toast.success("Avatar uploaded successfully!");

                // Update the session with the new avatar URL
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        avatar: data.url
                    }
                });

                // Update the local URL state
                setUrl(data.url);
            } else {
                toast.error(data.msg || "Failed to upload avatar");
            }

        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("An error occurred while uploading the avatar");
        }
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        console.log(url);
        setUrl(url);
    }

    return (
        <main className="w-screen min-h-screen flex justify-center items-center">
            <div className="w-[90%] md:w-[75%] lg:w-[60%] h-fit flex flex-col border-2 shadow-lg rounded-3xl overflow-hidden text-slate-800 dark:text-slate-200">
                <div className="w-full">
                    <button type="button" onClick={router.back} className="w-fit h-fit text-3xl rounded-br-3xl bg-blue-50 px-3 py-2">
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </div>
                <div className="w-full flex flex-col gap-4 items-center justify-center mb-3">
                    <div className="w-40 h-40 border-2 rounded-full overflow-hidden">
                        {url || avatar ? (
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
                            <label htmlFor="userProfile" className="flex flex-col justify-center items-center rounded-full cursor-pointer border px-3 py-2 text-2xl">
                                <i className="bi bi-plus-lg"></i>
                            </label>
                            <form onSubmit={handleSubmitAvatar}>
                                <input accept=".jpeg,.png," id="userProfile" onChange={handleChange} type='file' className="hidden" />
                                <button type="submit" className="bg-gray-600 text-white px-4 mt-2">Done</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}