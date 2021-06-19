import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from '../../reducers';


const store = createStore(
  reducers,
  applyMiddleware(reduxThunk)
);

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('shows the header', () => {

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      container
    );

});