const fs = require('fs');
const path = require('path');

module.exports = () => ({
  key:  fs.readFileSync(path.join(`${__dirname}`,'key.key')),
  cert: fs.readFileSync(path.join(`${__dirname}`,'cert.crt')),
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
  honorCipherOrder: true,
  secureProtocol: 'TLSv1_2_method'
});