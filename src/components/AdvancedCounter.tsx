import React, { useEffect, useState } from "react";

function AdvancedCounter() {

    //define the state
    const [count, setCount] = useState(0);
    const [countHistory, setCountHistory] = useState<number[]>([]);
    const [stepValue, setSetValue] = useState(1);


    const handleDecrement = () => {
        decrementCounter();
    }

    const handleIncrement = () => {
        incrementCounter();
    }

    const updateStepValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSetValue(Number(e.target.value));
    }

    const handleReset = () => {
        //reset counter and history
        setCount(0);
        setCountHistory([]);
    }

    const handleArrowUpKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowUp") 
            incrementCounter();
     }

    const handleArrowDownKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown")
            decrementCounter();
    }

    const decrementCounter = () => {
        console.log("Decrementing counter and update history")
        setCount(count - stepValue);
        setCountHistory(prevHistory => [...prevHistory, count]);
        console.log(`Count History Array: ${countHistory}`);
    }

    const incrementCounter = () => {
        console.log("Incrementing counter and update history")
        setCount(count + stepValue);
        setCountHistory(prevHistory => [...prevHistory, count]);
        console.log(`Count History Array: ${countHistory}`);
    }

    useEffect(() => {
        return (() => {

        })
    }, [count]);
    return (<>
        <h3>Counter</h3>
        <h2>Current Count: {count}</h2>
        <button type="button" onClick={handleDecrement} onKeyDown={handleArrowDownKey}>Decrement</button>
        <button type="button" onClick={handleIncrement} onKeyDown={handleArrowUpKey}>Increment</button>
        <button type="button" onClick={handleReset}>Reset</button>
        <div>
            <label>Step Value:</label>
            <input type="number" min={1} onChange={updateStepValue} value={stepValue}></input>
            <></>
        </div>
        <div>
            <h5>Count History: {countHistory.length}</h5>
            {countHistory.map((history) => <div>{history}</div>)}
        </div>
        <span>Use ArrowUp to increment and ArrowDown to decrement.</span>
    </>)
}

export default AdvancedCounter;