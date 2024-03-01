import React from "react";
const LabelInput=(props)=>{
    return(
        <div className="form-group"
        >
        <label htmlFor={props.name}>{props.data}</label>
        <input type={props.type} name={props.name} onChange={props.onChange} />
        <p id={props.name+'Error'}></p>
    </div>
    )
}
export default LabelInput;