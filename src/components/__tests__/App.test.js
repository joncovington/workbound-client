import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from '../../reducers';

import App from '../App';
import Header from '../Header/Header';


it('shows the header', () => {

    const wrapped = shallow(
      <App />
    );
    
    expect(wrapped.find(Header).length).toEqual(1)
});