import React, { useEffect } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from 'components/Header';
import SignInForm from 'features/auth/SignInForm';
import Profile from 'features/user/Profile';

import 'semantic-ui-css/semantic.min.css'
import { loginOnLoad } from 'features/auth/authSlice';

function App() {
    const dispatch = useDispatch()
    const token = localStorage.getItem('refresh_token')
    
    useEffect(() => {
        if (token) {
            dispatch(loginOnLoad(token))
        }
    }, [dispatch, token])

 
    return (
        <div className="ui container">
            <BrowserRouter>
                <Header />
                <Profile />
                <Switch>
                    <Route path="/" exact >
                    </Route>
                    <Route path="/signin" exact >
                        <SignInForm />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
    
}

export default App;