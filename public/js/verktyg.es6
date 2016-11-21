'use strict';

const moment = require('moment');
const Pikaday = require('pikaday');
const $ = require('jquery');

// Settings for datepicker handling the start date
const start = new Pikaday({
  field: document.getElementById('datepickerStart'),
  format: 'YYYY-MM-DD',
  minDate: moment().toDate(), // Default minimum date (today)
  onSelect: function (date) {
    end.setMinDate(date); // Set so that end date can only be selected after start date
  }
});

// Settings for datepicker handling the end date
const end = new Pikaday({
  field: document.getElementById('datepickerEnd'),
  format: 'YYYY-MM-DD',
  minDate: moment().toDate() // Default minimum date (today)
});

const select = document.getElementById('select-tool');
const num = document.getElementById('select-number');
const list = document.getElementById('tool-list');

let toolList = [];

list.style = 'display:none';

// Ajax handler for form
$(function() {
  const form = $('#tool-form');

  // Listen for submit event
  $(form).on('submit', function(event){

    const input = document.getElementById('tool-list-input');
    input.value = JSON.stringify(toolList);

    // Prevent submission
    event.preventDefault();
    const data = $(form).serialize();

    $.ajax({
      type : 'POST',
      url  : $(form).attr('action'),
      data : data,
      dataType : 'json',
      encode : true
    }).done(function(res){

      console.log(res);

      // Reset form fields
      $('#name').val('');
      $('#email').val('');
      $('#datepickerStart').val('');
      $('#datepickerEnd').val('');
      end.setMinDate(moment().toDate()); // Reset datepicker min date

    }).fail(function(res) {
      console.log(res);
    });

  });
});

function setNumber() {
  num.value = 1;
  num.max = tools[select.selectedIndex].amount; // Can't borrow more than the amount of the tool we currently have
}

function addTool(){
  list.style = 'display:inline-block';
  const li = document.createElement('tr');
  const button = document.createElement('button'); // Remove button
  const td1 = document.createElement('td'); // td for text
  const td2 = document.createElement('td'); // td for button
  const tool = tools[select.selectedIndex];

  button.appendChild(document.createTextNode('X'));
  button.addEventListener('click', function(){
    list.removeChild(li);

    const toolIndex = toolList.indexOf(tool);
    if (toolIndex >= 0){
      toolList.splice(toolIndex, 1);
    } else {
      console.log('Tool does not exist');
    }

    if(!list.hasChildNodes()) { // If the list is empty, hide it
      list.style.display = 'none';
    }
  }, false);

  td1.appendChild(document.createTextNode(tool.name + ' : ' + num.value + ' st'));
  td2.appendChild(button);
  li.appendChild(td1);
  li.appendChild(td2);

  list.appendChild(li);
  select.remove(select.selectedIndex);
  toolList.push(tool);

  const index = tools.indexOf(tool);
  if(index >= 0){
    tools.splice(index, 1);
  } else {
    console.log('Tool not in toolList');
  }

  setNumber();
}

// Get the functions exposed to the html file
// This is because of browserify
const verktyg = {
  addTool : addTool,
  setNumber : setNumber
};

module.exports = verktyg;