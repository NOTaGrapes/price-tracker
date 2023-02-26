import React, { useEffect, useRef, useState } from "react"
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "./TextBox.css"

const TextBox = ({ symbol }) => {
  const [className, setClassName] = useState("TextBoxGray");
  const [price, setPrice] = useState(0);
  const prevPrice = useRef(0);

  const provideClassName = () => {
    const PrevPrice = prevPrice.current;
    const Price = price;
    if (PrevPrice < Price) {
      setClassName("TextBoxGreen");
    }
    if (PrevPrice > Price) {
      setClassName("TextBoxRed");
    }
    // console.log("provide className inited")
  }

  const app_id = 1089;
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

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
    if (data.error !== undefined) {
      console.log("Error : ", data.error.message);
      connection.removeEventListener("message", ticksResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === "tick") {
      console.log(data.tick);
      setPrice(data.tick)
    }
  };

  const tickSubscriber = () => api.subscribe({ ticks: symbol, subscribe: 1 });
  const tickUnSubscriber = () => api.subscribe({ ticks: symbol, subscribe: 1 }).unsubscribe()

  const subscribeTicks = async () => {
    connection.addEventListener("message", ticksResponse);
    await tickSubscriber();
  }
  const unsubscribeTicks = async () => {
    connection.removeEventListener("message", ticksResponse, false);
    await tickUnSubscriber();
  }

  return (
    <>
      <div className="TextBoxGray">
        <input
          type="text"
          className={className}
          symbol={symbol}
          value={price.quote}
          onChange={() => { console.log("(q * o *)p  'Even I don't give a plug haf it happenEnd!'"); }}>
        </input>
      </div>
      <button className="Button" onClick={() => { subscribeTicks() }}>Calculate</button>
      <button className="Button" onClick={() => { unsubscribeTicks() }}>Stop</button>
    </>
  )
}

export default TextBox