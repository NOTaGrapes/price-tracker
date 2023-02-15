import React, {useState,useEffect} from 'react'
import './Select.css'

const Select = (props) => {
	const [options,setOptions] = useState([]);

	useEffect(()=>{
		setOptions(props.options.map((text, index) => {return <option key={index} value={text}>{text}</option>}));
		console.log("Select component get new options",props.options)
	},[props.options]);

	return(
    <div>
		<select 
		aria-label={props.name}
		className="Select"
		options = {props.options}
		onChange={(e)=>{props.onChange(e.target.value)}}
		defaultValue={props.defaultValue}
		>
		<option key="defaultValue"  value={props.defaultValue} disabled>{props.defaultValue}</option>
			{options}
		</select>
	</div>
    );
}

export default Select;