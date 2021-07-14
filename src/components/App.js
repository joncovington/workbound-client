import React, { useState, useEffect, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { loginOnLoad } from '../features/auth/authSlice';
import Header from './Header';
import SignInForm from '../features/auth/SignInForm';
import Profile from '../features/user/Profile';
import Tasks from '../features/task/Tasks';

export const history = createMemoryHistory()

function App() {
    const dispatch = useDispatch()
    const isSignedIn = useSelector(state => state.auth.isSignedIn)

    const token = localStorage.getItem('refresh_token')
    
    useEffect(() => {
        if (token && !isSignedIn) {
            dispatch(loginOnLoad(token))
        }
    }, [dispatch, token, isSignedIn])

    const [ signInModalOpen, setSignInModalOpen ] = useState(false);

    return (
        <Fragment>
            <Header signInOpen={setSignInModalOpen}/>
            <SignInForm open={signInModalOpen} setOpen={setSignInModalOpen}/>
            <Switch>
                <Route path='/signin' render={() => {
                    setSignInModalOpen(true)
                }}/>
                <Route path='/profile' exact >
                    <Profile />
                </Route>
                <Route path="/tasks" exact component={Tasks}/>
            </Switch>
        </Fragment>
    );
    
}

export default App;