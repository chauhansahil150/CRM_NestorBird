import React from "react";
import { Link } from "react-router-dom";
const FormLink=(props)=>{
    return(
        <div className="form-link">
        {props.data}
        <Link className="link" to={props.path}>{props.name}</Link>
        </div>
    )
}
export default FormLink;