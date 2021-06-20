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

    expect(wrapped.find('input').at(0).props().value)
    .toEqual(email)

    expect(wrapped.find('input').at(1).props().value)
    .toEqual(password)
});

it('can click submit', () => {
    var email = 'fake@email.com'
    var password = 'fakepassword'

    wrapped.find('input').at(0).simulate('change', {
        target: { value: email }
    });

    wrapped.find('input').at(1).simulate('change', {
        target: { value: password }
    });

});
