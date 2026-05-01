import React, { useEffect, useRef, useState } from "react";
import type { CountHistory } from "../types/CountHistory";

function AdvancedCounter() {

    //define the state
    const [count, setCount] = useState(0);
    const [status, setStatus] = useState("");
    const [countHistory, setCountHistory] = useState<CountHistory[]>(()=>{
        const localStorageHistoryCount = localStorage.getItem("countHistory");
        const intialCountHistory:CountHistory[] = localStorageHistoryCount ?  JSON.parse(localStorageHistoryCount): [];
        return intialCountHistory;
    });
    const [stepValue, setSetValue] = useState(1);
    let countRef = useRef(count); //need this refrence to have the latest count in arrowkey function.
    //since the handlers are attached at global level during component mount, which always refers to the intial value in the state.
    //so, arrowkey function does the increment/decrement with stale count data. To avoid this, used useRef hook to have the latest value of count
    //which can be accessed by global listeners .And update this ref whenever count state gets updates
    let stepValueRef = useRef(stepValue);

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
        //reset count and history
        setCount(0);
        setCountHistory([]);
        localStorage.setItem("countHistory","");
    }

    const handleArrowUpKey = (e: Event) => {
        if (e instanceof KeyboardEvent && !(e.target instanceof HTMLInputElement)) {
            let keyboarEvent: KeyboardEvent = e as KeyboardEvent;
            if (keyboarEvent.key === "ArrowUp")
                incrementCounter();
        }
    }


    const handleArrowDownKey = (e: Event) => {
        if (e instanceof KeyboardEvent && !(e.target instanceof HTMLInputElement)) {//don't execute increment/decrement counter when the focus is on any of the input elemen 
            let keyboarEvent: KeyboardEvent = e as KeyboardEvent;
            if (keyboarEvent.key === "ArrowDown")
                decrementCounter();
        }
    }

    const updateCountHistory=(newCount:number)=>{
        const countObj:CountHistory ={
            id:crypto.randomUUID(),
            count:newCount
        }
        setCountHistory(prevHistory => [...prevHistory, countObj]);
        
    }
    const decrementCounter = () => {
        console.log("Decrementing counter and update history")
        const newCount = countRef.current - stepValueRef.current;
        setCount(newCount);
       updateCountHistory(newCount);
        countRef.current = newCount;
    }

    const incrementCounter = () => {
        console.log("Incrementing counter and update history")

        let newCount = countRef.current + stepValueRef.current;
        setCount(newCount);
        updateCountHistory(newCount);
        countRef.current = newCount;
    }

    useEffect(() => {
        console.log("inside useeffect");
        document.addEventListener("keydown", handleArrowDownKey);
        document.addEventListener("keyup", handleArrowUpKey)
        return (() => {
            document.removeEventListener("KeyDown", handleArrowDownKey);
            document.removeEventListener("Keyup", handleArrowUpKey);
        })
    }, []);

    useEffect(() => {
        setStatus("Saving to LocalStorage...");
        setTimeout(()=>{localStorage.setItem("countHistory", JSON.stringify(countHistory));
             setStatus("Changes Saved.");
        },500)
       
    }, [count])

    useEffect(()=>{
        countRef.current = count;
    },[count]);

    useEffect(() => {
        stepValueRef.current = stepValue;
    }, [stepValue]);

    return (<>
        <h3>Counter</h3>
        <h2>Current Count: {count}</h2>
        <button type="button" onClick={handleDecrement} >Decrement</button>
        <button type="button" onClick={handleIncrement} >Increment</button>
        <button type="button" onClick={handleReset}>Reset</button>
        <div>
            <label>Step Value:</label>
            <input type="number" min={1} onChange={updateStepValue} value={stepValue}></input>
            <></>
        </div>
        <span>{status}</span>
        <div>
            <h5>Count History: {countHistory.length}</h5>
            {countHistory.map((history) => <div key={history.id}>{history.count}</div>)}
        </div>
        <span>Use ArrowUp to increment and ArrowDown to decrement.</span>
    </>)
}

export default AdvancedCounter;