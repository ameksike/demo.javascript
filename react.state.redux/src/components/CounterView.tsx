import SCounter from "../services/CounterService";

export default function CounterView({ stl = "red", inc = 1 }) {

    const { count, increment } = SCounter();

    return (
        <div className={"stl-" + stl}>
            <span >{count}</span>
            <button onClick={() => increment(1)}>+{inc}</button>
        </div>
    )
}