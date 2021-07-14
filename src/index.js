import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
  <Root>
    <div className='ui container'>
      <App />
    </div>
  </Root>,
  document.querySelector('#root')
);
