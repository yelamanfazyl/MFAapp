import {React, useState} from "react";
import './LoginPage.css';
import Camera from 'react-html5-camera-photo';
import Axios from 'axios';
import 'react-html5-camera-photo/build/css/index.css';

function LoginPage(props) {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [faceID, setPic] = useState("");

    function handleSubmit() {
        if (password.length <= 5) return;

        let obj = {
            email:email,
            password:password,
            faceID:faceID
        }

        Axios.post("http://localhost:8080/login", obj, { 
            maxBodyLength: Infinity,
            maxContentLength: Infinity 
        })
            .then(res => {
                props.changeEmail(res.data.email)
                window.location.assign('/');
            });
    }

    const handleInputChange = (e) => {
        const {id , value} = e.target;

        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
    }

    function handleTakePhoto (dataUri) {
        setPic(dataUri);
        // console.log(dataUri);
    }

    return (
        <div className="form-login">
            <div className="form-body-login">
                <div className="form_line-login">
                    <label className="form__label-login" htmlFor="email">Email </label>
                    <input  
                        type="email" 
                        id="email" 
                        className="form__input-login" 
                        placeholder="Email"
                        value={email}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>
                
                <div className="form_line-login">
                    <label className="form__label-login" htmlFor="password">Password </label>
                    <input 
                        className="form__input-login" 
                        type="password"  
                        id="password" 
                        placeholder="Password"
                        value={password}
                        onChange = {(e) => handleInputChange(e)}
                    />
                </div>

                <div>
                    <p>Don't have an account? <a href="/registration">Register</a></p> 
                </div>

                <div className="footer-login">
                    <button onClick={()=>handleSubmit()} type="submit" className="btn">Login</button>
                </div>

                <Camera
                    className="camera"
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
            </div>
        </div>
    );
}

export default LoginPage;