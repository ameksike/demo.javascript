import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { headingFont } from "@/app/fonts";

export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image
                    src="/images/bird_2.svg"
                    alt="logo"
                    height={50}
                    width={50}
                />
                <p className={cn("text-lg text-neutral-700 pb-1", headingFont.className)}>
                    Taskify
                </p>
            </div>
        </Link>
    );
}