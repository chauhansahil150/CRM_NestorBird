import React, { useContext, useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import UserContext from "../context/user/userContext";
import { BACKEND_URL } from "../config.jsX";
import LabelInput from "../components/Form/labelInput";
import Button from "../components/Form/Button";
import FormLink from "../components/Form/FormLink";
import "./css/form.css";

function Register() {
    const [name,setName]=useState("");
    const [region,setRegion]=useState("");
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType,setUserType]=useState('user');
  const [urlPath,setUrlPath]=useState('user/register');
  const [loading, setLoading] = useState(false); // Added loading state
  const userData = useContext(UserContext);
  const [err,setErr]=useState('');
  const [msg,setMsg]=useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Set loading to true before the fetch

      const response = await fetch(`${BACKEND_URL}/${urlPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,region, email, password }),
      });

      if (response.status === 201) {
        const user = await response.json();
        /*if(user.success){
            setMsg(user.message);
            setErr('');
        }*/
        alert("signup successfully")
      } else if(response.status==409){
        setMsg('');
        setErr('user Already exists');
      }
    } catch (error) {
        setErr('');
        setMsg('');
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after the fetch

      // Navigation logic moved to useEffect
    }
  };
  return (
    <div className="container mx-auto">
    <form className="form-container" onSubmit={handleSubmit}>
    <div className="text-center font-bold">{userType.toLocaleUpperCase()} REGISTER</div>
    <LabelInput
        name="name"
        type="name"
        data="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <LabelInput
        name="email"
        type="email"
        data="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <LabelInput
        name="password"
        type="password"
        data="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p className={err.length==0?"text-green-600":"text-red-600"}>{msg?msg:err}</p>
      <Button name="Register" type="submit" />
      <FormLink
        path="/login"
        name="login"
        data="Already have an account?"
      />
    </form>
  </div>
  )
}

export default Register
