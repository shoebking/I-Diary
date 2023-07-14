import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
export default function NavBar() {
  let history=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('token');
    history("/login");
  }
  return (
   <div>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">Navbar</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about">About</Link>
        </li> 
      </ul>
      {(!localStorage.getItem('token'))?<  form className="d-flex" role="search">
      <Link className="btn btn-primary mx-1" to="/login"  role="button">Login</Link>
      <Link className="btn btn-primary mx-1" to="/signup" role="button">Sign Up</Link>
      </form>:<button className='btn btn-primary' onClick={handleLogout}>Logout</button>}
     {/* <  form className="d-flex" role="search">
      <Link className="btn btn-primary mx-1" to="/login"  role="button">Login</Link>
      <Link className="btn btn-primary mx-1" to="/signup" role="button">Sign Up</Link>
      </form> */}
    </div>
  </div>
</nav>
   </div>
  )
}
