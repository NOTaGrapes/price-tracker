import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import React, {useState, useEffect, useRef, useCallback} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
// ================================================================================================================================
import LogoPulse from './UI/LogoPulse/LogoPulse';
import TextBox from "./UI/TextBox/TextBox";
import Select from "./UI/Select/Select";
// ================================================================================================================================
const Main = () => {
  const sortByMarket = (a, b) => a.market > b.market ? 1 : -1;
  const [mainList,setMainList] = useState([]);
  const [markets,setMarkets] = useState([]);
  const [market,setMarket] = useState("");
  const [symbols,setSymbols] = useState([]);
  const [symbol,setSymbol] = useState("");
  //func that return array for market's select
  const provideMarketOptions = () => {
    let AllOptions = mainList;
    let MarketOptions = ["Select Market"];
    for(let i=0; i < AllOptions.length; i++){
      let copy = AllOptions[i]['market'];
      if(!MarketOptions.includes(copy)){
        MarketOptions.push(copy);
      }
    }
    // console.log("provide market options inited")
    setMarkets(MarketOptions);
    setMarket(MarketOptions[0]);
  }
  //func that return array for market's select
  const provideSymbolOptions = () => {
    let AllOptions = mainList;
    let SymbolOptions = ["Select Symbol"];
    if(market!=="Select Market" && market!==""){
      for(let i=0; i < AllOptions.length; i++){
        let newMarket = AllOptions[i]['market'];
        let copy = AllOptions[i]['symbol'];
        if(newMarket===market){
          SymbolOptions.push(copy);
        }
      }
    }
    // console.log("provide symbol options inited")
    setSymbols(SymbolOptions);
    setSymbol(SymbolOptions[0]);
  }
 
  useEffect(()=>{
    if(mainList.length!==0)
    {
      console.log("<mainList> change detected by useEffect : ",mainList);
      provideMarketOptions();
      provideSymbolOptions();
    }
  }, [mainList])

  useEffect(()=>{
    if(market!=="" && market!=="Select Market"){
      console.log("<market> change detected by useEffect : ",market);
      provideSymbolOptions();
    }
  }, [market]);

  
  const onMarketChange = (e) => {
    setMarket(e);
    console.log("<market> changed to : ", e);
  };

  const onSymbolChange = (e) => {
    setSymbol(e);
    console.log("<symbol> changed to : ", e);
  };

  //DERIV PART of CODE//==========//Base variables//=================================================================================================
  const app_id = 1089;
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api        = new DerivAPIBasic({ connection });
  //DERIV PART of CODE//==========//Active symbols request//=================================================================================================
  const active_symbols_request = {
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
      console.log("<data> was recieved :", data.active_symbols);
      let newMainList =[];
      for (let i = 0; i < data.active_symbols.length;i++)
      {
        newMainList.push({
          market: data.active_symbols[i].market,
          symbol: data.active_symbols[i].symbol,
        })

      }
      newMainList.sort(sortByMarket);
      setMainList(newMainList);
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
      name="SelectMarket"
      onChange={onMarketChange}
      defaultValue="Select Market"
      options={markets}
      />
      <Select
      name="SelectSymbol"
      onChange={onSymbolChange}
      options={symbols}
      />
      <TextBox
      name="TextBoxPrice"
      symbol={symbol}
      />
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
