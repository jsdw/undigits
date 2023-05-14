/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { App } from './components/App';

const root = document.getElementById('root');

render(() => <App />, root!);
