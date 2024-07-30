import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

    const handleSignup = async (e) => {
        e.preventDefault();
        if (credentials.password === credentials.cpassword) {
            const response = await fetch("http://localhost:5000/api/auth/createUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
            });
            const json = await response.json();
            if (json.success) {
                // Save the auth token and Redirect
                localStorage.setItem('token', json.authToken);
                navigate("/");
                props.modifyAlert("success", "Account Created Successfully");
            } else {
                props.modifyAlert("danger", "Invalid Details");
            }
        } else {
            props.modifyAlert("danger", "Passwords do not match");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="container mt-2" onSubmit={handleSignup}>
            <h2 className='mb-3'>Signup to iNotebook</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" onChange={onChange} name="name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} name="password" minLength={5} required />
                </div>
                <div className="form-group">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" onChange={onChange} name="cpassword" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}

export default Signup
