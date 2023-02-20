import React, { useCallback, useEffect, useRef, useState } from "react" 
import "./TextBox.css" 
 

 
const TextBox = (props) => {

  const [className,setClassName] = useState("TextBoxGray");
  const [value,setValue] = useState(props.value);


  const provideClassName = () => {
    
    if(props.prevValue<props.value){
      setClassName("TextBoxGreen");
    }
    if(props.prevValue>props.value){
      setClassName("TextBoxRed");
    }
    if(props.prevValue===props.value)
    {
      setClassName("TextBoxGray");
    }
  }

  useEffect(()=>{
    if(props.value!==0){
      setValue(props.value);
      console.log(`<value> = ${value} <prevValue> = ${props.prevValue}`);
      provideClassName();
    }
  }, [props.value,props.prevValue])


  return ( 
    <div>
      <input 
      type="text"
      aria-label={props.name}
      className={className}
      value={props.value}
      onChange={(e)=>{console.log("qO_op --- 'What?'")}}>
      </input>
    </div> 
  ) 
} 
 
export default TextBox