import React from "react";
const Button=(props)=>{
    return(
      <button className="bg-black p-2 text-white"
      onClick={props.onClick}
      >{props.name}</button>
    )
}
export default Button;