import React from "react" 
import "./TextBox.css" 
 

 
const TextBox = (props) => { 
  return ( 
    <div> 
      <input className="TextBox"  defaultValue={props.defaultValue}/> 
    </div> 
  ) 
} 
 
export default TextBox