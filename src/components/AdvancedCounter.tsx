import React, { useEffect, useRef, useState } from "react";
import type { CountHistory, Count } from "../types/CountHistory";

function AdvancedCounter() {

    const [count, setCount] = useState(0);
    const [status, setStatus] = useState("");
    const [stepValue, setStepValue] = useState(1);

    // Initialize countHistory from localStorage so count and step value survive page refresh.
    const [countHistory, setCountHistory] = useState<CountHistory | null>(() => {
        const localStorageHistoryCount = localStorage.getItem("countHistory");
        const intialCountHistory: CountHistory = localStorageHistoryCount ? JSON.parse(localStorageHistoryCount) : null;
        if (intialCountHistory) {
            setCount(intialCountHistory.currentCount);
            setStepValue(intialCountHistory.stepValue);
        }
        return intialCountHistory;
    });

    // Refs are needed because the global keydown/keyup listeners are registered once on mount
    // and always close over the initial state values. Without refs, arrow-key handlers would
    // increment/decrement using stale count and stepValue.
    let countRef = useRef(count);
    let stepValueRef = useRef(stepValue);

    /** Calls decrementCounter when the Decrement button is clicked. */
    const handleDecrement = () => {
        decrementCounter();
    }

    /** Calls incrementCounter when the Increment button is clicked. */
    const handleIncrement = () => {
        incrementCounter();
    }

    /** Syncs the stepValue state with the number input. */
    const updateStepValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStepValue(Number(e.target.value));
    }

    /** Resets count to 0, clears history state, and removes the localStorage entry. */
    const handleReset = () => {
        setCount(0);
        setCountHistory(null);
        setStepValue(1);
        localStorage.setItem("countHistory", "");
    }

    /**
     * Global keyup handler — triggers increment on ArrowUp.
     * Skipped when an input element has focus so typing numbers isn't intercepted.
     */
    const handleArrowUpKey = (e: Event) => {
        if (e instanceof KeyboardEvent && !(e.target instanceof HTMLInputElement)) {
            let keyboarEvent: KeyboardEvent = e as KeyboardEvent;
            if (keyboarEvent.key === "ArrowUp")
                incrementCounter();
        }
    }

    /**
     * Global keydown handler — triggers decrement on ArrowDown.
     * Skipped when an input element has focus so typing numbers isn't intercepted.
     */
    const handleArrowDownKey = (e: Event) => {
        if (e instanceof KeyboardEvent && !(e.target instanceof HTMLInputElement)) {
            let keyboarEvent: KeyboardEvent = e as KeyboardEvent;
            if (keyboarEvent.key === "ArrowDown")
                decrementCounter();
        }
    }

    /** Appends the new count value to the countHistory state. */
    const updateCountHistory = (newCount: number) => {
        setCountHistory(prevHistory => updateCountInObj(prevHistory, newCount));
    }

    /**
     * Returns a new CountHistory object with the given count appended.
     * Spreads both the top-level object and the inner counts array to avoid
     * mutating the existing state reference.
     */
    function updateCountInObj(prevHistory: CountHistory | null, newCount: number) {
        const countObj: Count = {
            id: crypto.randomUUID(),
            count: newCount
        }
        let copyOfPrevHistory = (prevHistory && prevHistory != null) ? { ...prevHistory } : {
            counts: [],
            stepValue: stepValue,
            currentCount: count
        };

        copyOfPrevHistory = {
            ...copyOfPrevHistory,
            counts: [...copyOfPrevHistory.counts, countObj]
        };
        copyOfPrevHistory.stepValue = stepValueRef.current;
        copyOfPrevHistory.currentCount = newCount;
        return copyOfPrevHistory;
    }

    /** Subtracts the current step value from count and records the change in history. */
    const decrementCounter = () => {
        const newCount = countRef.current - stepValueRef.current;
        setCount(newCount);
        updateCountHistory(newCount);
        countRef.current = newCount;
    }

    /** Adds the current step value to count and records the change in history. */
    const incrementCounter = () => {
        let newCount = countRef.current + stepValueRef.current;
        setCount(newCount);
        updateCountHistory(newCount);
        countRef.current = newCount;
    }

    // Register global arrow-key listeners once on mount; clean up on unmount.
    useEffect(() => {
        document.addEventListener("keydown", handleArrowDownKey);
        document.addEventListener("keyup", handleArrowUpKey)
        return (() => {
            document.removeEventListener("keydown", handleArrowDownKey);
            document.removeEventListener("keyup", handleArrowUpKey);
        })
    }, []);

    // Debounce localStorage writes by 500 ms so rapid increments/decrements
    // don't hammer storage on every keystroke.
    useEffect(() => {
        setStatus("Saving to LocalStorage...");
        let timeOutId = setTimeout(() => {
            localStorage.setItem("countHistory", JSON.stringify(countHistory));
            setStatus("Changes Saved.");
        }, 500)

        return () => clearTimeout(timeOutId);

    }, [count])

    // Keep refs in sync with state so global listeners always read the latest values.
    useEffect(() => {
        countRef.current = count;
    }, [count]);

    useEffect(() => {
        stepValueRef.current = stepValue;
    }, [stepValue]);

    return (<div className="border-solid border-white m-5">
        <h3>Counter</h3>
        <h2>Current Count: {count}</h2>
        <div className="flex gap-3 justify-center p-5">
        <button type="button" className=" bg-white cursor-pointer p-2 rounded-sm" onClick={handleDecrement} >Decrement</button>
        <button type="button" className=" bg-white  cursor-pointer p-2 rounded-sm" onClick={handleIncrement} >Increment</button>
        <button type="button" className=" bg-red-400  cursor-pointer p-2 rounded-sm" onClick={handleReset}>Reset</button>
        </div>
        <div className="m-2">
            <label>Step Value:</label>
            <input type="number" min={1} className=" m-3 w-15 bg-white" onChange={updateStepValue} value={stepValue}></input>
            <></>
        </div>
        <i>{status}</i>
        <div className="m-10">
            <h5>Count History: {countHistory?.counts?.length}</h5>
            {countHistory?.counts?.map((history) => <div key={history.id}>{history.count}</div>)}
        </div>
        <span>Use ArrowUp to increment and ArrowDown to decrement.</span>
    </div>)
}

export default AdvancedCounter;