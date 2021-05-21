[![Build Status](https://travis-ci.org/arjanvanderleden/nodox-core.svg?branch=master)](https://travis-ci.org/arjanvanderleden/nodox-core)
[![Coverage Status](https://coveralls.io/repos/github/arjanvanderleden/nodox-core/badge.svg)](https://coveralls.io/github/arjanvanderleden/nodox-core)

## Installation

  `npm install nodox-core`

## Usage

    import { NodoxService, Core } from '@avdl/nodox-core';
    const service = new NodoxService();

    // register modules that define nodes
    service.register(new Core());
    const document = service.createNewDocument();




## Tests

  `npm test`


