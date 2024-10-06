import { createApi } from "unsplash-js";

console.log("UNSPLASH_ACCESS_KEY", process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY)

export const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY as string,
    fetch,
})