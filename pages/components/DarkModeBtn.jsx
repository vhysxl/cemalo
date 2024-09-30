import { useTheme } from "next-themes";
import { useState } from "react";
import { useEffect } from "react";

export default function DarkModeBtn() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <div>
            <button
                className="relative w-10 h-10 rounded-full text-base text-slate-50 dark:text-slate-900 bg-blue-950 dark:bg-blue-50 flex justify-center items-center hover:opacity-75 transition ease-in duration-150"
                onClick={() =>
                    theme == "light" ? setTheme("dark") : setTheme("light")
                }
            >
                {/* Light */}
                <div
                    className={`${
                        theme == "dark" ? "opacity-0" : "opacity-100"
                    } absolute`}
                >
                    <i className="bi bi-brightness-high-fill"></i>
                </div>
                {/* Dark */}
                <div
                    className={`${
                        theme == "dark" ? "opacity-100" : "opacity-0"
                    } absolute`}
                >
                    <i className="bi bi-moon-stars-fill"></i>
                </div>
            </button>
        </div>
    );
}
