'use strict';

// Serialize a POST

function serializeForm(form) {
  let data = {};

  for (let i = 0; i < form.childNodes.length; i++) {
    const child = form.childNodes.item(i);

    if (child.tagName === "INPUT" || child.tagName === "TEXTAREA") {
      data[child.name] = child.value;
    }
  }

  return Object.keys(data).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  }).join('&');
}

function submitFormAsync(form, callback) {
  const httpRequest = new XMLHttpRequest();

  httpRequest.onload = function () {
    return callback(httpRequest.responseText);
  };

  httpRequest.open(form.method, form.action, true);
  httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpRequest.send(serializeForm(form));
}

window.onload = () => {
  document.getElementById("hamburger").onclick = () => {
    let nav = document.getElementById("site-nav");
    if (nav.style.display == "flex") {
      nav.style.display = "none";
    } else {
      nav.style.display = "flex";
    }
  }
}
