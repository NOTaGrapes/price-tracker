import "./Select.css"

import React from "react"

const Select = ({ options, name, defaultValue, onChange }) => {
  console.log("options", options)
  return (
    <div>
      <select
        aria-label={name}
        className="Select"
        options={options}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        defaultValue={defaultValue}
      >
        <option key="defaultValue" value={defaultValue} disabled>
          {defaultValue}
        </option>
        {["select symbol 1", "select symbol 2"].map((text, index) => {
          return (
            <option key={index} value={text}>
              {text}
            </option>
          )
        })}
        {options}
      </select>
    </div>
  )
}

export default Select
