import App from './App';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import './i18n';


const container = document.getElementById('root');
render(<App />, container);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
