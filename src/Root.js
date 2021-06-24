import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store'



const Root = (props) => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                {props.children}            
            </BrowserRouter>
        </Provider>
    );
};

export default Root;