import React, {useEffect, useState} from 'react'
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import LogoPulse from './UI/LogoPulse/LogoPulse'
import Markets from './UI/Select/Markets'
import TextBox from './UI/TextBox/TextBox'
import Symbols from './UI/Select/Symbols'

import './index.css'

const App = () => {
    const [active_markets, setActiveMarkets] = useState()
    const [selected_market, setSelectedMarket] = useState()
    const [symbols, setSymbols] = useState([])
    const [selected_symbol, setSelectedSymbol] = useState()

    const app_id = 1089; // Replace with your app_id or leave the current one for testing.
    const connection = new WebSocket(
        `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
    );
    const api = new DerivAPIBasic({connection});

// Currently gets all available symbols.
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
            setActiveMarkets(data.active_symbols)
            console.log(data.active_symbols);
        }

        connection.removeEventListener("message", activeSymbolsResponse, false);
    };

    const getActiveSymbols = async () => {
        connection.addEventListener("message", activeSymbolsResponse);
        await api.activeSymbols(active_symbols_request);
    };

    useEffect(() => {
        getActiveSymbols()
    }, [])


    useEffect(() => {
        const available_symbols = []
        active_markets?.map((current_market) => {
                if (current_market.market_display_name === selected_market) {
                    available_symbols.push(current_market)
                }
                
                setSymbols(available_symbols)
            }
        )
    }, [selected_market])

    return (
        <div className="Main">
            <LogoPulse/>
            <Markets selectMarket={setSelectedMarket} active_markets={active_markets}/>
            <Symbols selectSymbol={setSelectedSymbol} symbols={symbols}/>
            <TextBox name="CurrentPrice" defaultValue={0}/>
        </div>
    )
}

export default App;
