import { useEffect, useState } from "react";

function AdvancedCounter(){

    //define the state
    const [count, setCount] = useState(0);
    const [countHistory, setCountHistory] = useState([]);

    const handleDecrement = ()=>{

    }

    useEffect(()=>{

    });
    return(<>
    <h3>Counter</h3>
    <h2>Current Count: {count}</h2>
    <button type="button" onClick={handleDecrement}>Decrement</button>
      <button type="button" onClick={handleDecrement}>Increment</button>
        <button type="button" onClick={handleDecrement}>Reset</button>
        <div>
            <label>Step Value:</label>
            <input type="number" min={1}></input>
            <></>
        </div>
        <div>
            <h5>Count History:</h5>
        </div>
        <span>Use ArrowUp to increment and ArrowDown to decrement.</span>
    </>)
}   

export default AdvancedCounter;