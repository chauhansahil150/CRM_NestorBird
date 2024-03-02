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
   localStorage.removeItem("token");
   navigate('/login')
  }
  return (
    <div className={style.container}>
        <div className={style.inner}>
            <div className={style.left}>
            {
             
              <Link  to="/home">Home</Link>
            }
            </div>
            {console.log(userData)}
            <div className={style.right}>
              {
                localStorage.getItem("token") ?
                  <Link onClick={logout}>Logout</Link>
                    : <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                    </>
              }
              {/* <span className="ml-3 text-gray-300">{userData?.user?.email || 'Guest'}</span> */}
            </div>
        </div>


    </div>
  )
}

export default Header
