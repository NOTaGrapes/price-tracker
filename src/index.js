import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
// ================================================================================================================================
import LogoPulse from './UI/LogoPulse/LogoPulse';
import TextBox from "./UI/TextBox/TextBox";
import Select from "./UI/Select/Select";
// ================================================================================================================================
const Main = () => {
  const [markets_list, setMarketsList] = useState([])
  const [markets, setMarkets] = useState([])
  const [market, setMarket] = useState()
  const [symbols, setSymbols] = useState([])
  const [symbol, setSymbol] = useState()

  console.log('symbol', symbol);

  useEffect(() => {
    const unique_markets = []
    for (let index = 0; index < markets_list.length; index++) {
      if (!unique_markets.includes(markets_list[index].market_display_name)) {
        unique_markets.push(markets_list[index].market_display_name)
      }
    }
    setMarkets(unique_markets)
  }, [markets_list])

  useEffect(() => {
    const unique_symbols = []
    for (let index = 0; index < markets_list.length; index++) {
      if (market == markets_list[index].market_display_name) {
        unique_symbols.push(markets_list[index])
      }
    }
    setSymbols(unique_symbols)
  }, [market])

  const onMarketChange = (e) => {
    setMarket(e)
  }
  const onSymbolChange = (e) => {
    markets_list.map(market => {
      if (e == market.symbol) {
        setSymbol(market)
      }
    })
  }

  //DERIV PART of CODE//==========//Base variables//=================================================================================================
  const app_id = 1089; // Replace with your app_id or leave the current one for testing.
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });

  // Currently gets all available symbols.
  const active_symbols_request = {
    // landing_company: "maltainvest", // Uncomment landing_company if you want to retrieve specific symbols.
    active_symbols: "brief",
    product_type: "basic"
  };

  const activeSymbolsResponse = async (res) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error : ", data.error?.message);
      connection.removeEventListener("message", activeSymbolsResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === "active_symbols") {
      console.log(data.active_symbols);
      setMarketsList(data.active_symbols)
    }

    connection.removeEventListener("message", activeSymbolsResponse, false);
  };

  const getActiveSymbols = async () => {
    connection.addEventListener("message", activeSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };

  // ==============================================================================================================================
  return (
    <div className="Main" onLoad={getActiveSymbols}>
      <LogoPulse />
      <Select
        name="Select Market"
        options={markets}
        onChangeHandler={onMarketChange}
      />
      <Select
        name="Select Symbol"
        options={symbols}
        onChangeHandler={onSymbolChange}
      />
      <TextBox symbol={symbol} />
    </div>
  );
}
// =======================================================================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
