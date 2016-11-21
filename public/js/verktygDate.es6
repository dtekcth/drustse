'use strict';

// For the datepicker. Don't put your own code in here related to /verktyg. Instead put it in verktyg.es6

const moment = require('moment');
const Pikaday = require('pikaday');


const start = new Pikaday({
    field: document.getElementById('datepickerStart'),
    format: 'YYYY-MM-DD',
    onSelect: function (date) {
        end.setMinDate(date); // Set so that end date can only be selected after start date
    }
});

const end = new Pikaday({
    field: document.getElementById('datepickerEnd'),
    format: 'YYYY-MM-DD',
    minDate: moment().toDate() // Default minimum date (today)
});