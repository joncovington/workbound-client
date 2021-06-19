import React from 'react';
import { shallow } from 'enzyme';

import App from 'components/App';
import Header from 'components/Header/Header';


it('shows the header', () => {

    const wrapped = shallow(
      <App />
    );
    
    expect(wrapped.find(Header).length).toEqual(1)
});