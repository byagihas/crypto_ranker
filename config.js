var convict = require('convict');
 
convict.addFormat(require('convict-format-with-validator').ipaddress);
 
// Define a schema
var config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESfS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port'
  },
  btx_api_key: {
    doc: '',
    format: '*',
    default: '',
    env: 'BITTREX_API_KEY',
    arg: 'btx_api_key'
  },
  btx_api_secret: {
    doc: '',
    format: '*',
    default: '',
    env: 'BITTREX_SECRET',
    arg: 'btx_api_secret'
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'server1.dev.test'
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'users'
    }
  }
});
 
// Load environment dependent configuration
var env = config.get('env');
config.loadFile('./config/' + env + '.json');
 
// Perform validation
config.validate({allowed: 'strict'});
 
module.exports = config;