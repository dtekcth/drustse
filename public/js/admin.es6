'use strict';

function submitToolForm(form) {
    submitFormAsync(form, (resp) => {
        const result = JSON.parse(resp);
        if (result.success) {
            alert("Succé!");
            window.location.reload();
        } else {
            alert("Tool error: " + result.error);
        }
    });
}

function submitNew() {
    const form = document.getElementById('new-form');
    const name = document.getElementById('new-name');
    const amount = document.getElementById('new-amount');

    form.addEventListener("click", function(event){
        event.preventDefault();
    });

    if (!name.value) {
        alert("Namn obligatoriskt");
    } else if (!amount.value) {
        alert("Antal obligatoriskt");
    } else {
        submitToolForm(form);
    }
}

function submitUpdate(id) {
    const form = document.getElementById('update-'+id);
    const amount = document.getElementById('amount-'+id);

    form.addEventListener("click", function(event){
        event.preventDefault();
    });

    if (!amount.value) {
        alert("Antal obligatoriskt");
    } else {
        submitToolForm(form);
    }
}

function submitRemove(id) {
    const form = document.getElementById('remove-'+id);

    form.addEventListener("click", function(event){
        event.preventDefault();
    });

    submitToolForm(form);
}