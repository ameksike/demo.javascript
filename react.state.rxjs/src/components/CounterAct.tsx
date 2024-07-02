import SCounter from "../services/Counter";

export default function CounterAct({ inc = 1, stl = "blue" }) {

    const { increment } = SCounter();

    return (
        <div className={"stl-" + stl}>
            <button onClick={() => increment(inc)}>
                + {inc}
            </button>
        </div>
    )
}