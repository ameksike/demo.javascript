import SCounter from "../services/Counter";

export default function CounterView({ stl = "red", inc = 1 }) {

    const { count, update } = SCounter();

    return (
        <div className={"stl-" + stl}>
            <span >{count}</span>
            <button onClick={() => update(1)}>+{inc}</button>
        </div>
    )
}