import React from 'react';
import { mount } from 'enzyme';
import Root from 'Root';
import SignInForm from 'components/Auth/SignInForm';

let wrapped;

beforeEach(() => {
    wrapped = mount(
        <Root>
            <SignInForm />
        </Root>    
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

it('allows user typing in inputs', () => {
    var email = 'fake@email.com'
    var password = 'fakepassword'

    wrapped.find('input').at(0).simulate('change', {
        target: { value: email }
    });

    wrapped.find('input').at(1).simulate('change', {
        target: { value: password }
    });

    const stateFormData = wrapped.children().props().store.getState().form.signInForm.values

    expect(stateFormData['email']).toEqual(email)
    expect(stateFormData['password']).toEqual(password)
});

it('can submit', () => {
    var email = 'fake@email.com'
    var password = 'fakepassword'

    wrapped.find('input').at(0).simulate('change', {
        target: { value: email }
    });

    wrapped.find('input').at(1).simulate('change', {
        target: { value: password }
    });
    
    wrapped.find('form').simulate('submit');
    
    const signInForm = wrapped.children().props().store.getState().form.signInForm

    expect(signInForm.submitSucceeded).toEqual(true)

});
