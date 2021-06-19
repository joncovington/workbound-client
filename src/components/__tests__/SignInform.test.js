import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { mount } from 'enzyme';

import SignInForm from 'components/Auth/SignInForm';

import reducers from 'reducers';

const store = createStore(
    reducers,
    applyMiddleware(reduxThunk)
);

let wrapped;

beforeEach(() => {
    wrapped = mount(
    <Provider store={store}>
        <BrowserRouter>
            <SignInForm />
        </BrowserRouter>
    </Provider>

    );
});

afterEach(() => {
    wrapped.unmount()
    wrapped = null;
})

it('has two inputs and a button', () => {
    expect(wrapped.find('input').length).toEqual(2)
    expect(wrapped.find('button').length).toEqual(1)
})

it('updates store on user typing in inputs', () => {
    var email = 'fake@email.com'
    var password = 'fakepassword'

    wrapped.find('input').at(0).simulate('change', {
        target: { value: email }
    });

    wrapped.find('input').at(1).simulate('change', {
        target: { value: password }
    });

    expect(store.getState().form.signInForm.values['email'])
    .toEqual(email)

    expect(store.getState().form.signInForm.values['password'])
    .toEqual(password)
});
