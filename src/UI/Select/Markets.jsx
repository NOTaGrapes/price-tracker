import './Select.css'

import React from 'react'

const Markets = ({active_markets, selectMarket}) => {
    const unique_markets = []
    active_markets?.map((market) => {
        if (!unique_markets.includes(market.market_display_name)) {
            unique_markets.push(market.market_display_name)
        }
    })

    return (
        <div className="Markets">
            <select name="Markets" id="markets" onChange={(e) => {
                selectMarket(e.target.value)
            }}>
                {unique_markets?.map((market) => {
                    return (
                        <option key={market} value={market}>
                            {market}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Markets
