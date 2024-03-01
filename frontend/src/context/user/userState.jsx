import React, { useState } from "react";
import UserContext from "./userContext";
const UserState=(props)=>{

    
    const [user,setUser] = useState(
        (!window.sessionStorage.getItem('user'))?{
            isLogin:false,
            name:'Guest'
        }:{
            isLogin:true,
            ...JSON.parse(window.sessionStorage.getItem('user'))
        }
    )
    return(
        <UserContext.Provider value={{user,setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserState; 