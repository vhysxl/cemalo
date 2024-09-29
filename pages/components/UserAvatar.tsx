import Image from "next/image";
import { ReactElement, useState, useEffect } from "react";

interface UserSession {
    user?: {
        image?: string;
        avatar?: string;
    };
}

interface UserAvatarProps {
    session: UserSession;
}

export default function UserAvatar({ session }: UserAvatarProps): ReactElement {
    const [avatarSrc, setAvatarSrc] = useState<string>("https://cdn-icons-png.flaticon.com/512/6988/6988878.png");

    useEffect(() => {
        const updateAvatar = () => {
            const newAvatarSrc = session?.user?.image || session?.user?.avatar || "https://cdn-icons-png.flaticon.com/512/6988/6988878.png";
            setAvatarSrc(newAvatarSrc);
        };

        updateAvatar();

    }, [session]);

    return (
        <img
            src={avatarSrc}
            alt="User Avatar"
            width={500}
            height={500}
            className="w-full h-full object-cover"
        />
    );
}