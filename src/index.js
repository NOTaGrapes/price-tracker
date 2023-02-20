import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic.js';
import React, {useState,useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
// ================================================================================================================================
import LogoPulse from './UI/LogoPulse/LogoPulse';
import TextBox from "./UI/TextBox/TextBox";
import Select from "./UI/Select/Select";
// ================================================================================================================================
const Main = () => {
  let listSize = 0;
  let mainListPrefab = {
    market:"select market",
    symbol:"select symbol"
  };
  const sortByMarket = (a, b) => a.market > b.market ? 1 : -1;
  const [mainList,setMainList] = useState([]);
  const [markets,setMarkets] = useState([]);
  const [market,setMarket] = useState("");
  const [symbols,setSymbols] = useState([]);
  const [symbol,setSymbol] = useState("");
  const [price,setPrice] = useState(0);
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
    if(market!==""){
      console.log("<market> change detected by useEffect : ",market);
      setPrice(0);
      provideSymbolOptions();
    }
  },[market])

  useEffect(()=>{
    if(symbol!==""){
      console.log("<symbol> change detected by useEffect : ",symbol)
 
      if(symbol && symbol!=="Select Symbol" )
      {
        subscribeTicks();
      }
      if(symbol==="Select Symbol")
      {
        //unsubscribeTicks();
      }
    }
  },[symbol])
  
  const onMarketChange = (e) => {
    unsubscribeTicks();
    setMarket(e);
    console.log("<market> changed to : ", e);
  };
  const onSymbolChange = (e) => {
    unsubscribeTicks();
    setSymbol(e);
    console.log("<symbol> changed to : ", e);
  };

  //DERIV PART of CODE//===========================================================================================================
  const app_id = 1089;
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api        = new DerivAPIBasic({ connection });
  const tickStream = () => api.subscribe(symbol_subscribe_request);

  const active_symbols_request = {
    active_symbols: "brief",
    product_type: "basic"
  };
  const symbol_subscribe_request = {
    "ticks": symbol,
    "subscribe": 1
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
      //setMainList(mainList.pop());
      for (let i = 0; i < data.active_symbols.length;i++)
      {
        newMainList.push({
          market: data.active_symbols[i].market,
          symbol: data.active_symbols[i].symbol,
        })

      } 
      setMainList(newMainList);
      mainList.sort(sortByMarket);
    }
    connection.removeEventListener("message", activeSymbolsResponse, false);
  }; 
  const getActiveSymbols = async () => {
    connection.addEventListener("message", activeSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };

  const tickResponse = async (res) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error : ", data.error.message);
      connection.removeEventListener("message", tickResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === "tick") {
      console.log(data.tick);
      setPrice(data.tick.quote);
      console.log(price)
    }
  };
  const subscribeTicks = async () => {
    await tickStream();
    connection.addEventListener("message", tickResponse);
  };
  const unsubscribeTicks = () => {
    connection.removeEventListener("message", tickResponse, false);
    tickStream().unsubscribe();
    console.log("unsubscribed from ticks");
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
      name="CurrentPrice" 
      value ={price} />
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
