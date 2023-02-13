import React from "react" 
import "./TextBox.css" 
 

 
const TextBox = (props) => { 
  return ( 
    <div> 
      <input type="text" aria-label={props.name} className="TextBox"  defaultValue={props.defaultValue}/> 
    </div> 
  ) 
} 
 
export default TextBox