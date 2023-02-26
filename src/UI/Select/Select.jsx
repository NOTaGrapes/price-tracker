import React, { useState, useEffect } from 'react'
import './Select.css'

const Select = ({ options, onChangeHandler, name }) => {
	const [disabled, setDisabled] = useState(true)

	useEffect(() => {
		options.length > 1 && setDisabled(false)
	}, [options])

	return (
		<div>
			<select
				className="Select"
				disabled={disabled}
				onChange={(e) => { onChangeHandler(e.target.value) }}
			>
				<option >{name}</option>
				{options.map((option, index) => {
					return (
						<option key={index} value={option?.symbol || option}>
							{option?.symbol || option}
						</option>
					)
				})}
			</select>
		</div>
	)
}

export default Select