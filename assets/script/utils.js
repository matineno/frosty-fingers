'use strict';

function getElement(selector, scope = document) {
    return scope.getElementById(selector);
  }
  
  function select(selector, scope = document) {
    return scope.querySelector(selector);
  }
  
  function selectAll(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
  }
  

  function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
  }
  
  function create(element) {
    return document.createElement(element);
  }
export { select, listen, getElement, selectAll, create };