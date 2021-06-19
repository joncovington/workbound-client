import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Header from 'components/Header';
import SignInForm from 'components/Auth/SignInForm';

class App extends React.Component {
    render() {
        return (
            <div className="ui container">
                <BrowserRouter>
                    <Header />
                    <Switch>
                        <Route path="/" exact >
                            <div>Home</div>
                        </Route>
                        <Route path="/signin" exact >
                            <SignInForm />
                        </Route>
                    </Switch>
                </BrowserRouter>
                
            </div>
        );
    };
}

export default App;