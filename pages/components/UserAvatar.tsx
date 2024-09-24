import Image from "next/image";
import { ReactElement } from "react";

interface UserSession {
    user?: {
        image?: string;
        
    };
}

interface UserAvatarProps {
    session: UserSession;
}

export default function UserAvatar({ session }: UserAvatarProps): ReactElement {
    return (
        <>
            <Image
                src={
                    session?.user?.image ??
                    "https://cdn-icons-png.flaticon.com/512/6988/6988878.png"
                }
                alt="User Avatar"
                width={500}
                height={500}
                className="w-full h-full object-cover"
            />
        </>
    );
}

