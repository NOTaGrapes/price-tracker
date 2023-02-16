import "./index.css"

import React, { useEffect, useState } from "react"

import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic.js"
import LogoPulse from "./UI/LogoPulse/LogoPulse"
import ReactDOM from "react-dom/client"
import Select from "./UI/Select/Select"
import TextBox from "./UI/TextBox/TextBox"
import reportWebVitals from "./reportWebVitals"

// ================================================================================================================================

// ================================================================================================================================
const Main = () => {
  let listSize = 0
  let mainListPrefab = {
    market: "select market",
    symbol: "select symbol",
  }
  const sortByMarket = (a, b) => (a.market > b.market ? 1 : -1)
  const [mainList, setMainList] = useState([mainListPrefab])
  const [markets, setMarkets] = useState(["select market", "go fuck u"])
  const [market, setMarket] = useState(0)
  const [symbols, setSymbols] = useState(["select symbol 1", "select symbol 2"])
  const [symbol, setSymbol] = useState(0)

  useEffect(() => {
    setSymbol("засетать symbols в зависимости от выбранного market")
  }, [market])

  const onMarketChange = (e) => {
    setMarket(e)
    console.log("Market changed", market)
  }
  const onSymbolChange = (e) => {
    setSymbol(e)
    console.log("Symbol changed", symbol)
  }

  //DERIV PART of CODE//===========================================================================================================
  const app_id = 1089
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  )
  const api = new DerivAPIBasic({ connection })
  const active_symbols_request = {
    active_symbols: "brief",
    product_type: "basic",
  }
  const active_ticks_request = {
    ticks: symbol,
    subscribe: 1,
  }
  const activeSymbolsResponse = async (res) => {
    const data = JSON.parse(res.data)
    if (data.error !== undefined) {
      console.log("Error : ", data.error?.message)
      connection.removeEventListener("message", activeSymbolsResponse, false)
      await api.disconnect()
    }
    if (data.msg_type === "active_symbols") {
      console.log("Data was recieved :", data.active_symbols)
      setMainList(mainList.pop())
      // тут ломается логика передачи массива ["select market", "go fuck u"]
      // setMarkets(markets.pop())
      for (let i = 0; i < data.active_symbols.length; i++) {
        mainListPrefab = {
          market: data.active_symbols[i].market,
          symbol: data.active_symbols[i].symbol,
        }
        // здесь добивается логика передачи массива ["select market", "go fuck u"]
        // if (!markets.includes(data.active_symbols[i].market)) {
        //   setMarkets(markets.push(data.active_symbols[i].market))
        // }
        setMainList(mainList.push(mainListPrefab))
        listSize++
      }
      mainList.sort(sortByMarket)
      console.log("list transfered and now it :", mainList)
      console.log("list of markets created : ", markets)
      console.log("it size of : ", listSize)
    }
    connection.removeEventListener("message", activeSymbolsResponse, false)
  }
  const getActiveSymbols = async () => {
    connection.addEventListener("message", activeSymbolsResponse)
    await api.activeSymbols(active_symbols_request)
  }
  // ==============================================================================================================================
  return (
    <div className="Main" onLoad={getActiveSymbols}>
      <LogoPulse />
      <Select
        name="SelectMarkset"
        onChange={onMarketChange}
        defaultValue="Select Market"
        options={markets}
      />
      <Select
        name="SelectSymbol"
        onChange={onSymbolChange}
        defaultValue="Select Symbol"
        options={symbols}
      />
      <TextBox name="CurrentPrice" defaultValue={0} />
    </div>
  )
}

// =======================================================================================

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Main />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
