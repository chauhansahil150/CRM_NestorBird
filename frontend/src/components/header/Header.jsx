import React, { useContext } from 'react'
import style from  './style.module.css'
import {Link, useNavigate} from 'react-router-dom'
import UserContext from '../../context/user/userContext';
import { BACKEND_URL } from '../../config.jsX';
function Header() {
  const userData = useContext(UserContext);
  const navigate=useNavigate();
  function logout(e) {
    e.preventDefault();
    window.sessionStorage.clear();
    userData.setUser({ isLogin: false, name: "Guest" });
    fetch(BACKEND_URL+'/logout', {
      credentials: "include",
    });
    window.sessionStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <div className={style.container}>
        <div className={style.inner}>
            <div className={style.left}>
            {
              userData?.user?.isLogin?
             <>
              <Link  to="/home">Home</Link>
            <Link  to="/dashboard">Dashboard</Link></>
            :<></>
            }
            </div>
            {console.log(userData)}
            <div className={style.right}>
              {
                userData?.user?.isLogin ?
                  <Link onClick={logout}>Logout</Link>
                    : <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                    </>
              }
              <span className="ml-3 text-gray-300">{userData?.user?.email || 'Guest'}</span>
            </div>
        </div>


    </div>
  )
}

export default Header
