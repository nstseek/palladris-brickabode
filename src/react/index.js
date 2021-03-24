import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

export function renderApp() {
    ReactDOM.render(<App />, document.getElementById('root'));
}