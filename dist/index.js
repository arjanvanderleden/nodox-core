
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./nodox-core.cjs.production.min.js')
} else {
  module.exports = require('./nodox-core.cjs.development.js')
}
