import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';


// =======================================================================================
import LogoPulse from './UI/LogoPulse/LogoPulse';
import TextBox from "./UI/TextBox/TextBox";
import Select from "./UI/Select/Select";

let optionsSymbols = [1,2,3,4];
let optionsMarkets = [11,22,33,44];
let symbol = 0;
let market = 0;
let prePrice = 0;
let curPrice = 0;

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
    console.log(data.active_symbols);
    
  }

  connection.removeEventListener("message", activeSymbolsResponse, false);
};

const getActiveSymbols = async () => {
  connection.addEventListener("message", activeSymbolsResponse);
  await api.activeSymbols(active_symbols_request);
};

const onClickMarkets=()=>{
  //getActiveSymbols();
}

const onClickSymbols=()=>{

}

//dat crap is my idea to make coding more comfortable for me. yea, i kinda kinky person 
const Main = (props) => { 

    return (
      <div className="Main">
        <LogoPulse />
        <Select defaultValue="Select market" onClick={getActiveSymbols} options={optionsSymbols} />
        <Select defaultValue ="Select symbol" onClick={getActiveSymbols} options={optionsMarkets} />
        <TextBox defaultValue ={curPrice}/>
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
