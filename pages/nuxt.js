'use strict';

module.exports = {
  url: 'http://localhost:3000',
  elements: {
    searchBar: { 
      selector: 'input[type=text]' 
    },
    submit: { 
      selector: '//button[@name="btnG"]', 
      locateStrategy: 'xpath' 
    }
  }
};