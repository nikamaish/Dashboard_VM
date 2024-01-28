import React, {useState} from 'react';
import './Signin.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const Signin = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handelSubmit = (e)=>{
        e.preventDefault();
        console.log('email: ', email);
        console.log('password: ', password);
        
    }

    return(
        <div className='wrapper'>
            <div className='box'>
                <form className='right-container' onSubmit={handelSubmit}>
                    <div className='container1'>
                        <h2 className='heading'>Sign In</h2>
                        <div className='inputText'>
                            <input value={email} type="email" placeholder='Enter email' onChange={(e)=> setEmail(e.target.value)} />
                            <span className='icon'><FontAwesomeIcon icon={faEnvelope} /></span>
                        </div>
                        <div className='inputText'>
                            <input value={password} type="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}/>
                            <span className='icon2'><FontAwesomeIcon icon={faEyeSlash} /></span>
                        </div>
                        <button className='btn' type='submit'>Sign In</button>
                    </div>
                </form>
                
                <section className='left-container gradient1'>
                    <p className='text'>Don't have an account? <br></br> 
                    <button className='btn'><Link className='btnText' to={'/signup'}>Sign Up</Link> </button></p>
                </section>
            </div>
        </div>
    )
} 

export default Signin;