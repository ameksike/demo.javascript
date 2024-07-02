import { useState } from "react";

export function SCounter(init = 0) {
    const [data, setData] = useState(init);
    return {
        count: data,
        update: (val: number) => setData(data + val)
    }
}
