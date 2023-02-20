import './Select.css'

import React from 'react'

const Symbols = ({symbols, selectSymbol}) => {

    return (
        <div className="Select">
            <select name='symbols' id='symbols' onChange={(e) => {
                selectSymbol(e.target.value)
            }}>
                {symbols?.map((symbol, index) => {
                    return (
                        <option key={index} value={symbol.display_name}>
                            {symbol.display_name}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Symbols
