import React, { useState, useEffect } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginOnLoad } from 'features/auth/authSlice';
import Header from 'components/Header';
import SignInForm from 'features/auth/SignInForm';
import Profile from 'features/user/Profile';
import 'semantic-ui-css/semantic.min.css'


function App() {
    const dispatch = useDispatch()
    const isSignedIn = useSelector(state => state.auth.isSignedIn)

    const token = localStorage.getItem('refresh_token')
    
    useEffect(() => {
        if (token && !isSignedIn) {
            dispatch(loginOnLoad(token))
        }
    }, [dispatch, token, isSignedIn])

    const [signInModalOpen, setSignInModalOpen] = useState(false);

    return (
        <div className="ui container">
            <BrowserRouter>
                <Header signInOpen={setSignInModalOpen}/>
                <SignInForm open={signInModalOpen} setOpen={setSignInModalOpen}/>
                <Switch>
                    <Route path="/" exact >
                    </Route>
                    <Route path="/profile" exact children={<Profile />}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
    
}

export default App;