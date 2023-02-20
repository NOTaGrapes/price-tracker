import React, {useState,useEffect} from 'react'
import './Select.css'

const Select = (props) => {
	const [options,setOptions] = useState([]);
	const [selected,setSelected] = useState("");
	const [disabled, setDisabled] = useState(true)

	useEffect(()=>{
		if(props.options.length>1){
			setOptions(props.options.map((text, index) => {
				if(index===0){
					return <option hidden key={index} value={text} >{text}</option>;
				}
				else{
					return <option key={index} value={text}>{text}</option>
				}
			}));
			setSelected(options[0]);
			setDisabled(false)
			console.log(`Select component <${props.name}> get new options : `,props.options)	
		}
		else{
			setOptions(props.options.map((text,index) => {
				return <option hidden key={index} value={text} >{text}</option>;
			}));
			setSelected(options[0]);
			setDisabled(true);

		}
	},[props.options, props.name]);

	return(
    <div>
		<select 
		aria-label={props.name}
		className="Select"
		disabled={disabled}
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