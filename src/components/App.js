import React, { useState, useEffect, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { Message, Transition } from 'semantic-ui-react';
import { loginOnLoad } from '../features/auth/authSlice';
import Header from './Header';
import SignInForm from '../features/auth/SignInForm';
import Profile from '../features/user/Profile';
import Tasks from '../features/task/Tasks';

export const history = createMemoryHistory()

function App() {
    const dispatch = useDispatch();
    const { isSignedIn, error, status } = useSelector(state => state.auth);
    const token = localStorage.getItem('refresh_token');
    const [ errorMsg, setErrorMsg] = useState('');
    const [ showErrorMsg, setShowErrorMessage ] = useState(false)
    
    useEffect(() => {
        if (token && !isSignedIn) {
            dispatch(loginOnLoad(token));
        }
    }, [dispatch, token, isSignedIn]);

    useEffect(() => {
        if (!isSignedIn && error.hasOwnProperty('signOut')) {
            setErrorMsg(error.signOut)
            setShowErrorMessage(true)
        } else if (isSignedIn) {
            setErrorMsg('')
            setShowErrorMessage(false)
        }
    
    }, [isSignedIn, error, status])


    const [ signInModalOpen, setSignInModalOpen ] = useState(false);

    return (
        <Fragment>
            <Header signInOpen={setSignInModalOpen}/>
            <Transition visible={showErrorMsg} animation='fade up' duration={500}>
                <Message negative onDismiss={()=>{setShowErrorMessage(false)}}>
                    <Message.Header></Message.Header>
                    <Message.Content>{errorMsg}</Message.Content>
                </Message>
            </Transition>
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