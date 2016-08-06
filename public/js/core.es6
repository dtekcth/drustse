'use strict';

// Serialize a POST

function serializeForm(form) {
  var data = {};

  for (var i = 0; i < form.childNodes.length; i++) {
    var child = form.childNodes.item(i);

    if (child.tagName == "INPUT" || child.tagName == "TEXTAREA") {
      data[child.name] = child.value;
    }
  }

  return Object.keys(data).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  }).join('&');
}

function submitFormAsync(form, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onload = function () {
    return callback(httpRequest.responseText);
  };

  httpRequest.open(form.method, form.action, true);
  httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpRequest.send(serializeForm(form));
}