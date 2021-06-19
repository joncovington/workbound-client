import React from 'react';
import { shallow } from 'enzyme';

import App from 'components/App';
import Header from 'components/Header';

let wrapped;

beforeEach(() => {
  wrapped = shallow(
    <App />
  );
});

afterEach(() => {
  wrapped = null;
})

it('shows the header', () => {
    expect(wrapped.find(Header).length).toEqual(1)
});