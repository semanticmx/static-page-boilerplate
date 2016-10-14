import 'babel-polyfill';

import Greeting from '../shared/greeting';

const message = new Greeting('Hola');

document.querySelector('.app').innerText = message.say();
