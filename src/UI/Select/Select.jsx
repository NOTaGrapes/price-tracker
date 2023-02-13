import React, {useState,useEffect} from 'react'
import './Select.css'


const Select = (props) => {

	const [options,setOptions] = useState(props.defaultValue);

	const handleChange = (event) => {
		setOptions(event.target.options);
	}
	
	return(
    <div>
		<select aria-label={props.name} className="Select" onChange={handleChange} onClick={props.onClick} defaultValue={props.defaultValue} >
		{options}
		</select>
	</div>
    );
}

export default Select;