import React, { useEffect, useRef, useState } from "react";

function AdvancedCounter() {

    //define the state
    const [count, setCount] = useState(0);
    const [countHistory, setCountHistory] = useState<number[]>([]);
    const [stepValue, setSetValue] = useState(1);
    let countRef = useRef(count); //need this refrence to have the latest count in arrow key function.
    //since the handlers are attached at global level during component mount, which always refers to the intial value in the state.
    //so, arraow key function does the increment/decrement with stale count data. To avoid this, used useRef hook to have the latest value of count
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
        //reset counter and history
        setCount(0);
        setCountHistory([]);
    }

    const handleArrowUpKey = (e: Event) => {
        console.log(e instanceof KeyboardEvent );
           if (e instanceof KeyboardEvent && !(e.target instanceof HTMLInputElement)){
           let keyboarEvent:KeyboardEvent =  e as KeyboardEvent;
           console.log(keyboarEvent.key)
           if(keyboarEvent.key === "ArrowUp" )
            incrementCounter();
        }
     }


    const handleArrowDownKey = (e: Event) => {
        console.log(e instanceof KeyboardEvent );
        console.log(e.target instanceof HTMLInputElement)
         if (e instanceof KeyboardEvent && !(e.target instanceof HTMLInputElement)){//don't execute increment/decrement counter when the focus is on any of the input elemen 
           let keyboarEvent:KeyboardEvent =  e as KeyboardEvent;
           console.log(keyboarEvent.key)
           if(keyboarEvent.key === "ArrowDown" )
            decrementCounter();
        }
    }

    const decrementCounter = () => {
        console.log("Decrementing counter and update history")
         console.log("count" +countRef.current);
        
        setCount(countRef.current  - stepValueRef.current);
         console.log("step value :" + stepValueRef.current);
       
        const newCount = countRef.current  - stepValueRef.current;
        setCountHistory(prevHistory => [...prevHistory, newCount]);
        console.log(`Count History Array: ${countHistory}`);
        countRef.current = newCount;
    }

    const incrementCounter = () => {
        console.log("Incrementing counter and update history")
        console.log("count" +countRef.current);
        let newCount = countRef.current  + stepValueRef.current;
        console.log("step value :" + stepValueRef.current);
        setCount(newCount);
        console.log(newCount);
        setCountHistory(prevHistory => [...prevHistory, newCount]);
        console.log(`Count History Array: ${countHistory}`);
        countRef.current = newCount;
    }

    useEffect(() => {
        console.log("inside useeffect");
       document.addEventListener("keydown" ,handleArrowDownKey);
        document.addEventListener("keyup", handleArrowUpKey)
        return (() => {
           document.removeEventListener("KeyDown",handleArrowDownKey);
            document.removeEventListener("Keyup", handleArrowUpKey);
        })
    }, []);

    useEffect(()=>{
        countRef.current = count;
    },[count])


    useEffect(()=>{
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
        <div>
            <h5>Count History: {countHistory.length}</h5>
            {countHistory.map((history) => <div>{history}</div>)}
        </div>
        <span>Use ArrowUp to increment and ArrowDown to decrement.</span>
    </>)
}

export default AdvancedCounter;