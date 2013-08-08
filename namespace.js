/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var ns = module.exports = {};

// Split strings on dot, but only if dot isn't preceded by a backslash. Since
// JavaScript doesn't support lookbehinds, use a placeholder for "\.", split
// on dot, then replace the placeholder character with a dot.
function getParts(str) {
  return str.replace(/\\\./g, '\uffff').split('.').map(function(s) {
    return s.replace(/\uffff/g, '.');
  });
}

// Get the value of a deeply-nested property exist in an object.
ns.get = function(obj, parts, create) {
  if (typeof parts === 'string') {
    parts = getParts(parts);
  }

  var part;
  while (typeof obj === 'object' && obj && parts.length) {
    part = parts.shift();
    if (!(part in obj) && create) {
      obj[part] = {};
    }
    obj = obj[part];
  }

  return obj;
};

// Set a deeply-nested property in an object, creating intermediary objects
// as we go.
ns.set = function(obj, parts, value) {
  parts = getParts(parts);

  var prop = parts.pop();
  obj = ns.get(obj, parts, true);
  if (obj && typeof obj === 'object') {
    return (obj[prop] = value);
  }
};

// Does a deeply-nested property exist in an object?
ns.exists = function(obj, parts) {
  parts = getParts(parts);

  var prop = parts.pop();
  obj = ns.get(obj, parts);

  return typeof obj === 'object' && obj && prop in obj;
};
