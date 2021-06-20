import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from 'reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Root = (props) => {
    const store = createStore(
        reducers,
        composeEnhancers(applyMiddleware(reduxThunk))
    );
    return (
        <Provider store={store}>
            <BrowserRouter>
                {props.children}            
            </BrowserRouter>
        </Provider>
    );
};

export default Root;