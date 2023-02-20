import React, {useState,useEffect} from 'react'
import './Select.css'

const Select = (props) => {
	const [options,setOptions] = useState([]);
	const [selected,setSelected] = useState("");

	useEffect(()=>{
		setOptions(props.options.map((text, index) => {
			if(index===0){
				return <option key={index} value={text} hidden>{text}</option>;
			}
			else{
				return <option key={index} value={text}>{text}</option>
			}
		}));
		setSelected(options[0]);
		console.log(`Select component named <${props.name}> get new options`,props.options)
	},[props.options, props.name]);

	return(
    <div>
		<select 
		aria-label={props.name}
		className="Select"
		options = {props.options}
		onChange={(e)=>{
			props.onChange(e.target.value);
			setSelected(e.target.value)
			}}
		value={selected}
		>
			{options}
		</select>
	</div>
    );
}

export default Select;