import {React, useState, useEffect} from "react";
import './RegistrationPage.css';
import Camera from 'react-html5-camera-photo';
import Axios from 'axios';
import 'react-html5-camera-photo/build/css/index.css';
import CheckPassword from "../../PasswordChecker/PasswordChecker";

function RegistrationPage() {

    const [firstname, setfirstname] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [faceID,setPic] = useState("");
    
    const [passwordScore, setPasswordScore] = useState({score: 0, crack_time: "0.0 seconds", state: "weak"});

    function handleSubmit() {
        if (password.length <= 5) return;
        if (password != confirmPassword) return;

        let obj = {
            firstname :firstname,
            lastname:lastName,
            email:email,
            phone: phone,
            password:password,
            faceID: faceID
        }

        Axios.post("http://localhost:8080/register", obj, {
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
    }

    const handleInputChange = (e) => {
        const {id , value} = e.target;

        if(id === "firstname"){
            setfirstname(value);
        }
        if(id === "lastName"){
            setLastName(value);
        }
        if(id === "email"){
            setEmail(value);
        }
        if(id === "phone"){
            setPhone(value);
        }
        if(id === "password"){
            setPassword(value);

            setPasswordScore(CheckPassword(value))
                // .then(() => {console.log(value + " " + passwordScore.score)});
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
        }
    }
    
    function handleTakePhoto (dataUri) {
        setPic(dataUri);
        // console.log(dataUri);
    }

    return (
        <div className="form">
            <div className="form-body">
                <div className="form_line">
                    <label className="form__label" htmlFor="firstname">First Name </label>
                    <input 
                        className="form__input" 
                        type="text" 
                        id="firstname" 
                        placeholder="First Name"
                        value={firstname}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>

                <div className="form_line">
                    <label className="form__label" htmlFor="lastName">Last Name </label>
                    <input 
                        type="text" 
                        name="" 
                        id="lastName"  
                        className="form__input"
                        placeholder="Last Name"
                        value={lastName}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>

                <div className="form_line">
                    <label className="form__label" htmlFor="email">Email </label>
                    <input  
                        type="email" 
                        id="email" 
                        className="form__input" 
                        placeholder="Email"
                        value={email}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>
                
                <div className="form_line">
                    <label className="form__label" htmlFor="phone">Phone Number </label>
                    <input  
                        type="tel" 
                        id="phone" 
                        className="form__input" 
                        placeholder="Phone Number"
                        value={phone}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>
                
                <div className="form_line">
                    <label className="form__label" htmlFor="password">Password </label>
                    <input 
                        className="form__input" 
                        type="password"  
                        id="password" 
                        placeholder="Password"
                        value={password}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>

                <div className="pass_holder">
                    <p className="pass_counter">Your password score is: <b>{passwordScore.score}</b>, it is <b>{passwordScore.state}</b></p>
                    <p className="pass_counter">It can be brute-forced in <b>{passwordScore.crack_time}</b></p>
                </div>

                <div className="form_line">
                    <label className="form__label" htmlFor="confirmPassword">Confirm Password </label>
                    <input 
                        className="form__input" 
                        type="password" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>

                <div>
                    <p>Already have an account? <a href="/login">Login</a></p> 
                </div>

                <div className="footer">
                    <button onClick={()=>handleSubmit()} type="submit" className="btn">Register</button>
                </div>

                <Camera
                    className="camera"
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
            </div>

        </div>
    );
}

export default RegistrationPage;