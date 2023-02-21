import React, { useCallback, useEffect, useRef, useState } from "react" 
import "./TextBox.css" 
 

 
const TextBox = (props) => {

  /*const [className,setClassName] = useState("TextBoxGray");
  const [value,setValue] = useState(props.value);

  useEffect(()=>{
    setValue(props.value);
    setClassName(props.className);
  },[props.value,props.className])*/
  return ( 
    <div>
      <input 
      type="text"
      aria-label={props.name}
      className={props.className}
      value={props.value}
      onChange={()=>{console.log("(q * o *)p  'Even I don't give a plug haf it happenEnd!'");}}>
      </input>
    </div> 
  ) 
} 
 
export default TextBox