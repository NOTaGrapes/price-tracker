import React, { useEffect, useRef, useState } from "react"
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "./TextBox.css"



const TextBox = ({ symbol }) => {
  const [price, setPrice] = useState(0);
  const [subscribed_symbol, setSubscribeDSymbol] = useState()

  useEffect(() => {
    unsubscribeTicks(subscribed_symbol)
    subscribeTicks(symbol)
  }, [symbol])

  //DERIV PART of CODE//==========//Base variables//=================================================================================================
  const app_id = 1089;
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

  //DERIV PART of CODE//==========//ticks request//=================================================================================================

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
      setPrice(data.tick.quote);  //Uncomend code there and try launch app again. There is a problem!
    }
  };

  { }

  const subscribeTicks = async (data) => {
    if (data?.symbol) {
      connection.addEventListener("message", ticksResponse);
      await api.subscribe({ ticks: data, subscribe: 1 })
      setSubscribeDSymbol({ ticks: data, subscribe: 1 })
    }

  };

  const unsubscribeTicks = async (data) => {
    connection.removeEventListener("message", ticksResponse, false);
    await api.subscribe({ ticks: data, subscribe: 1 }).unsubscribe()
    setSubscribeDSymbol({})
  };

  return (
    <div className="TextBoxGray">
      {price}
    </div>
  )
}

export default TextBox