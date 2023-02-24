import React, { useCallback, useEffect, useRef, useState } from "react"
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "./TextBox.css"



const TextBox = (props) => {
  const [className,setClassName] = useState("TextBoxGray");
  const [price,setPrice] = useState(0);
  const prevPrice = useRef(0);

  const provideClassName = () => {
    const PrevPrice = prevPrice.current;
    const Price = price;
    if(PrevPrice<Price){
      setClassName("TextBoxGreen");
    }
    if(PrevPrice>Price){
      setClassName("TextBoxRed");
    }
    // console.log("provide className inited")
  }

  //DERIV PART of CODE//==========//Base variables//=================================================================================================
  const app_id = 1089;
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

  //DERIV PART of CODE//==========//ticks request//=================================================================================================
  const ticks_request = {
    ticks: props.symbol,
    subscribe: 1
  };

  const tickSubscriber = () => api.subscribe(ticks_request);

  const ticksResponse = async (res) => {
    const data = JSON.parse(res.data);
    // This example returns an object with a selected amount of past ticks.
    if (data.error !== undefined) {
      console.log("Error : ", data.error.message);
      connection.removeEventListener("message", ticksResponse, false);
      await api.disconnect();
    }
    // Allows you to monitor ticks.
    if (data.msg_type === "tick") {
      console.log(data.tick);
      //setPrice(data.tick.quote);  //Uncomend code there and try launch app again. There is a problem!
    }
  };

  const subscribeTicks = async () => {
    connection.addEventListener("message", ticksResponse);
    await tickSubscriber();
  };

  const unsubscribeTicks = async () => {
    connection.removeEventListener("message", ticksResponse, false);
    await tickSubscriber().unsubscribe();
  };

  return (
    <div>
      <input
      type="text"
      aria-label={props.name}
      className={className}
      symbol={props.symbol}
      value={price}
      onChange={()=>{console.log("(q * o *)p  'Even I don't give a plug haf it happenEnd!'");}}>
      </input>
      <button 
      className="Button" 
      onClick={()=> {
        subscribeTicks()
        console.log("start pushed")
        }}>
        Start
      </button>
      <button 
      className="Button"
      onClick={()=> {
        unsubscribeTicks()
        console.log("stop pushed")
        }}>
        Stop
      </button>
    </div>
  )
}

export default TextBox