import React, {useState,useEffect} from 'react'
import './Select.css'


const Select = (props) => {

	const options = props.options.map((text, id) => { return <option key={id}>{text}</option>;});
	return(
    <div>
		<select aria-label={props.name} className="Select" onClick={props.onClick} defaultValue={props.defaultValue} >
		<option id='' hidden disabled>{props.defaultValue}</option>
		{options}
		</select>
	</div>
    );
}

export default Select;