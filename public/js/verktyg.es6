'use strict';

const select = document.getElementById('select-tool');
const num = document.getElementById('select-number');
const list = document.getElementById('tool-list');

let toolList = [];

let tools = null;

list.style = 'display:none';

function setNumber() {
  num.value = 1;
  num.max = tools[select.selectedIndex].amount; // Can't borrow more than the amount of the tool we currently have
}

function addTool(){
  list.style.display = 'inline-block';
  const li = document.createElement('tr');
  const button = document.createElement('button'); // Remove button
  const td1 = document.createElement('td'); // td for text
  const td2 = document.createElement('td'); // td for button
  const tool = tools[select.selectedIndex];

  button.appendChild(document.createTextNode('X'));
  button.onclick = function(){
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
  }

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

function addToolList() {
  const input = document.getElementById('tool-list-input');
  input.value = JSON.stringify(toolList);

  const toolForm = document.getElementById('tool-form');
  toolForm.submit();
}
