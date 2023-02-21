import React, { useCallback, useEffect, useRef, useState } from "react"
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "./TextBox.css"



const TextBox = (props) => {
  const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
  const connection = new WebSocket(
      `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });

  const ticks_request = {
    ticks: props.symbol,
    subscribe: 1
  };

  const tickSubscriber = () => api.subscribe(ticks_request);

  const ticksHistoryResponse = async (res) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error : ", data.error.message);
      connection.removeEventListener("message", ticksHistoryResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === "history") {
      console.log(data.history);
    }
    connection.removeEventListener("message", ticksHistoryResponse, false);
  };

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

  const [className,setClassName] = useState(props.className);
  const [value,setValue] = useState(props.value);

  useEffect(()=>{
    setValue(props.value);
  },[props.value]);

  useEffect(()=>{
    setClassName(props.className);
  },[props.className]);

  return (
    <div>
      <input
      type="text"
      aria-label={props.name}
      className={className}
      value={value}
      onChange={()=>{console.log("(q * o *)p  'Even I don't give a plug haf it happenEnd!'");}}>
      </input>
      <button onClick={()=> {subscribeTicks()}}>Calculate</button>
      <button onClick={()=> {unsubscribeTicks()}}>Stop</button>
    </div>
  )
}

export default TextBox