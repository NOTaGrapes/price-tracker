import React, {useState} from 'react'
import './Select.css'


const Select = (props) => {

	const options = props.options.map((text, id) => { return <option key={id}>{text}</option>;});
	return(
    <div>
		<select className="Select" onClick={props.onClick} defaultValue={props.defaultValue} >
		<option id='' hidden disabled>{props.defaultValue}</option>
		{options}
		</select>
	</div>
    );
}

export default Select;