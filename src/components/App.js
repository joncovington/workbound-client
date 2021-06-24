import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Header from 'components/Header';
import SignInForm from 'features/auth/SignInForm';
import Profile from 'features/user/Profile';

import 'semantic-ui-css/semantic.min.css'

function App() {
 
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