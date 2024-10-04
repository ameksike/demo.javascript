import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const geistSans = localFont({
    src: "../public/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

export const geistMono = localFont({
    src: "../public/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const headingFont = localFont({
    src: "../public/fonts/LiuJianMaoCao-Regular.ttf"
});

export const textFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});
