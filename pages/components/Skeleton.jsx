export default function Skeleton() {
    const shimmer =
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

    return (
        <div
            className={`${shimmer} w-full relative max-h-28 border-slate-800 dark:border-white bg-slate-200 dark:bg-slate-800 rounded-3xl p-5 overflow-hidden`}
        >
            <div className="mb-1 w-20 h-6 bg-gray-300 dark:bg-gray-500"></div>
            <div className="mb-1 w-full h-6 bg-gray-300 dark:bg-gray-500"></div>
            <div className=" w-full h-6 bg-gray-300 dark:bg-gray-500"></div>
        </div>
    );
}