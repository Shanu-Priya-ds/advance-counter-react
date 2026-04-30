import React, { useEffect, useState } from "react";

function AdvancedCounter(){

    //define the state
    const [count, setCount] = useState(0);
    const [countHistory, setCountHistory] = useState<number[]>([]);
    const [stepValue, setSetValue] = useState(1);

    
    const handleDecrement = ()=>{
        setCount(count-stepValue);
           setCountHistory(prevHistory =>[...prevHistory, count]);
        console.log(countHistory);
    
    }

    const handleIncrement = ()=>{
        console.log(stepValue)
        setCount(count+stepValue);
        setCountHistory(prevHistory =>[...prevHistory, count]);
        console.log(countHistory);
    
    }
    const updateStepValue=(e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.value);
        setSetValue(Number(e.target.value));
     }

    //let countHistoryArray = countHistory;

    useEffect(()=>{
      // setCountHistory(...countHistoryArray, countHistoryArray.push(count)); 
    },[count]);
    return(<>
    <h3>Counter</h3>
    <h2>Current Count: {count}</h2>
    <button type="button" onClick={handleDecrement}>Decrement</button>
      <button type="button" onClick={handleIncrement}>Increment</button>
        <button type="button" onClick={handleDecrement}>Reset</button>
        <div>
            <label>Step Value:</label>
            <input type="number" min={1} onChange={updateStepValue} value={stepValue}></input>
            <></>
        </div>
        <div>
            <h5>Count History: {countHistory.length}</h5>
            {countHistory.map((history)=> <div>{history}</div>)}
        </div>
        <span>Use ArrowUp to increment and ArrowDown to decrement.</span>
    </>)
}   

export default AdvancedCounter;