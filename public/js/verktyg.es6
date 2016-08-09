'use strict';

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

function setNumber(select) {
    const num = document.getElementById('select-number');
    num.value = 1;
    num.max = tools[select.selectedIndex].amount; // Can't borrow more than the amount of the tool we currently have
}

function addTool(button){
    const select = document.getElementById('select-tool');
    select.remove(select.selectedIndex);
}