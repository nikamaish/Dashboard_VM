import React, {useState} from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEyeSlash } from '@fortawesome/free-regular-svg-icons';


const Signup = () =>{    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handelSubmit = (e)=>{
        e.preventDefault();
        console.log('name: ', name);
        console.log('email: ', email);
        console.log('password: ', password);
        
    }

    return(
        <div className="wrapper">
            <div className="box1">
                <form className="left-container1" onSubmit={handelSubmit}>
                    <div className="container1">
                        <h2 className="heading">Sign Up</h2>
                        <div className="inputText">
                            <input value={name} type="text" placeholder="Name" onChange={(e)=> setName(e.target.value)}/>
                            <span id="icon"><FontAwesomeIcon icon={faUser} /></span>
                        </div>
                        <div className="inputText">
                            <input value={email} type="email" placeholder='Enter email' onChange={(e)=> setEmail(e.target.value)}/>
                            <span id='icon1'><FontAwesomeIcon icon={faEnvelope} /></span>
                        </div>
                        <div className="inputText" >
                            <input value={password } type="password" placeholder='Enter password' onChange={(e)=> setPassword(e.target.value)} />
                            <span id="icon2"><FontAwesomeIcon icon={faEyeSlash} /></span>
                        </div>
                        <button className="btn" type='submit'>Sign Up</button>
                    </div>
                </form>
                <section className="right-container1 gradient1">
                    <h2 className="text1">Welcome Back !!!</h2>
                    <p className="text">Aleady have an account?</p> 
                    <button className="btn"><Link className="btnText" to={'/signin'}>Sign In</Link></button>
                </section>
            </div>
        </div>
    )
} 

export default Signup;