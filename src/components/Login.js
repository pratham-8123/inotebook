import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        if (json.success) {
            // Save the auth token and Redirect
            localStorage.setItem('token', json.authToken);
            navigate("/");
            props.modifyAlert("success", "Logged In Successfully");
        } else {
            props.modifyAlert("danger", "Invalid Credentials");
        }

    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <>
            <div className="mt-2">
                <h2 className='mb-3'>Login to continue to iNotebook</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name="password" />
                    </div>

                    <button type="submit" className="btn btn-primary" >Login</button>
                </form >
            </div>
        </>
    )
}

export default Login
