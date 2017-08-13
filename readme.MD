[![Build Status](https://travis-ci.org/arjanvanderleden/nodox-core.svg?branch=master)](https://travis-ci.org/arjanvanderleden/nodox-core)
[![Coverage Status](https://coveralls.io/repos/github/arjanvanderleden/nodox-core/badge.svg)](https://coveralls.io/github/arjanvanderleden/nodox-core)

## Installation

  `npm install nodox-core`

## Usage

    var NodoxService = require('nodox-core').NodoxService;
    //or use import {NodoxService} from 'nodox-core';
    var service = new NodoxService();

    // TODO register Nodox Modules
    var document = service.createNewDocument();


## Tests

  `npm test`


