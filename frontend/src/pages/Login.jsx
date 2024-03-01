import React, { useContext, useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import UserContext from "../context/user/userContext";
import { BACKEND_URL } from "../config.jsX";
import LabelInput from "../components/Form/labelInput";
import Button from "../components/Form/Button";
import FormLink from "../components/Form/FormLink";
import "./css/form.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType,setUserType]=useState('user');
  const [urlPath,setUrlPath]=useState('user/login');
  const [loading, setLoading] = useState(false); // Added loading state
  const userData = useContext(UserContext);
  const [err,setErr]=useState('');
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
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const token = await response.json();
        localStorage.setItem("token",token.access_token)
        navigate('/home');
      } else if(response.status==401){
        setErr('Wrong Password');
      }else if(response.status==404){
        setErr('User not found');
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after the fetch

      // Navigation logic moved to useEffect
    }
  };

  return (
    <div className="container mx-auto">
      <form className="form-container" onSubmit={handleSubmit}>
      <div className="text-center font-bold">{userType.toLocaleUpperCase()} LOGIN</div>
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
        <p className="text-red-600">{err}</p>
        <Button name="Login" type="submit" />
        <FormLink
          path="/register"
          name="Register"
          data="Don't have an account?"
        />
        <FormLink
          path="/user/forgot-password"
          name="Click"
          data="Forgot Password?"
        />
        {/* <FormLink path="/seller/login" name="Click" data="Seller?" />
        <FormLink path="/transporter/login" name="Click" data="Transporter ?" /> */}
       
      
      </form>
    </div>
  );
};

export default LoginForm;


// import React from 'react';
// import { useForm } from 'react-hook-form';

// export default function LoginForm() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const onSubmit = data => console.log(data);
//   console.log(errors);
  
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input type="text" placeholder="First name" {...register("First name", {required: true, maxLength: 80})} />
//       <input type="email" placeholder="Email" {...register("Email", {required: true})} />
//       <input type="tel" placeholder="Mobile number" {...register("Mobile number", {required: true, minLength: 6, maxLength: 12})} />

//       <input type="submit" />
//     </form>
//   );
// }