import "/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import {
    ToastContainer,
    toast,
    Slide,
    Zoom,
    Flip,
    Bounce,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"],
});
export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <main className={poppins.className}>
            <Head>
                <title>CEMALO AI</title>
            </Head>
            <SessionProvider session={session}>
                <ThemeProvider attribute="class">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        limit="5"
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover={false}
                        theme="light"
                        transition={Bounce}
                    />
                    <Component {...pageProps} />
                </ThemeProvider>
            </SessionProvider>
        </main>
    );
}
