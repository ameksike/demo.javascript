import SCounter from "../services/Counter";

export default function CounterAct({ inc = 1, stl="blue" }) {
    
    const { update } = SCounter();

    return (
        <div className={"stl-" + stl}>
            <button onClick={() => update(inc)}>
                + {inc}
            </button>
        </div>
    )
}