const moment = require('moment');
const Pikaday = require('pikaday');

let picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'YYYY-MM-DD'
});