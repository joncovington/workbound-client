import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import Root from '../Root';
import App from 'components/App'

test('renders logo link', () => {
  const { getByText } = render(
    <Root>
      <App />
    </Root>
  );
  const linkElement = getByText(/workbound/i);
  expect(linkElement).toBeInTheDocument();
});