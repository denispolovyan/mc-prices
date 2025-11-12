// DATA URL
export const BASE_URL = 'https://denispolovyan.github.io/delievery_parser_endpoint/data/result/categorized_result.json';

// NOTYF
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
export const notyf = new Notyf({
  duration: 2500,
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'add',
      background: '#ffae2cff',
      duration: 1000,
      dismissible: true
    },
    {
      type: 'delete',
      background: '#ffae2cff	',
      duration: 1000,
      dismissible: true,
    }
  ]
});