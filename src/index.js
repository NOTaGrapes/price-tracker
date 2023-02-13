import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';


// =======================================================================================
import LogoPulse from './UI/LogoPulse/LogoPulse';
import TextBox from "./UI/TextBox/TextBox";
import Select from "./UI/Select/Select";

//dat crap is my idea to make coding more comfortable for me. yea, i kinda kinky person 
const Main = (props) => {
  const optionsMarketsSymbols = [];
  const sortByMarket = (a, b) => a.market > b.market ? 1 : -1;
  let symbol;
  
  const app_id = 1089;
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api        = new DerivAPIBasic({ connection });
  
  const active_symbols_request = {
    active_symbols: "brief",
    product_type: "basic"
  };
  
  const active_ticks_request = {
    ticks: symbol,
    subscribe: 1
  };
  
  const activeSymbolsResponse = async (res) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error : ", data.error?.message);
      connection.removeEventListener("message", activeSymbolsResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === "active_symbols") {
      console.log("Data was recieved :", data.active_symbols);
      for (let i = 0; i < data.active_symbols.length;i++)
      {
        optionsMarketsSymbols.push({market: data.active_symbols[i].market, symbol: data.active_symbols[i].symbol});
      }
      optionsMarketsSymbols.sort(sortByMarket);
      console.log("Array of available markets with symbols was created :", optionsMarketsSymbols);
    }
    connection.removeEventListener("message", activeSymbolsResponse, false);
  };
  
  const getActiveSymbols = async () => {
    connection.addEventListener("message", activeSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };
  //func that return array for market's select
  const provideMarketOptions = () =>{
    let MarketOptions =[];
    for(let i=0; i < optionsMarketsSymbols.length; i++){
      if(!MarketOptions.includes(optionsMarketsSymbols[i].market)){
        MarketOptions.push(optionsMarketsSymbols[i].market)
      }
    }
    console.log("Array of available markets created",MarketOptions)
    return MarketOptions;
  }

  //func that return array for symbol's select depending on selected market
  const provideSymbolOptions = (market) =>{
    let SymbolOptions =[];
    for(let i=0; i < optionsMarketsSymbols.length; i++){
      if(market===optionsMarketsSymbols[i].market){
        SymbolOptions.push(optionsMarketsSymbols[i].symbol)
      }
    }
    console.log(`Array of available symbols from <${market}> market array created`,SymbolOptions)
    return SymbolOptions;
  }

    return (
      <div className="Main" onLoad={getActiveSymbols}>
        <LogoPulse />
        <Select name="SelectMarket" />
        <Select name="SelectSymbol" />
        <TextBox name="CurrentPrice" defaultValue ={0}/>
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
