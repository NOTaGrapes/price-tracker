import React, { useCallback, useEffect, useRef, useState } from "react" 
import "./TextBox.css" 
 

 
const TextBox = (props) => {

  const [className,setClassName] = useState(props.className);
  const [value,setValue] = useState(props.value);

  useEffect(()=>{
    setValue(props.value);
  },[props.value]);

  useEffect(()=>{
    setClassName(props.className);
  },[props.className]);
  
  return ( 
    <div>
      <input 
      type="text"
      aria-label={props.name}
      className={className}
      value={value}
      onChange={()=>{console.log("(q * o *)p  'Even I don't give a plug haf it happenEnd!'");}}>
      </input>
    </div> 
  ) 
} 
 
export default TextBox