import React from "react";
import './MainPage.css';
import { Navigate } from 'react-router-dom'

function MainPage(props) {
    function createNavbar() {
        if (props.email !== "") {
            return (
                <nav className="Navbar">
                    <p>Welcome, {props.userName}</p>
                </nav>
            );
        }
        return (
            <nav className="Navbar">
                <button 
                    className="NavbarButton"
                    onClick={() => {LoginClick()}}
                    >Login</button>
                <button 
                    className="NavbarButton"
                    onClick={() => {RegisterClick()}}
                    >Register</button>
            </nav>
        );
    }

    function createFindLeakButton() {
        return (
            <div className="FindLeakBody">
                <button 
                    className="FindLeakButton"
                    onClick={() => {FindLeakClick()}}
                    >Find Leak</button>
            </div>
        );
    }

    function FindLeakClick() {
        if (!props.email === "") {
            RegisterClick();
            return;
        }

        window.location.assign('/registration');
    }

    function LoginClick() {
        window.location.assign('/login');
    }

    function RegisterClick() {
        window.location.assign('/registration');
    }

    return (
        <div className="MainPage">
            {createNavbar()}
            {createFindLeakButton()}
        </div>
    );
}

export default MainPage;