var request = require('request'),
    xxtea = require('xxtea-stream'),
    concat = require('concat-stream'),
    bops = require('bops');

module.exports = function(url, pass, as_string, cb){

  // handle a call signature of function(url, pass, cb)
  if (typeof as_string === 'function') {
    cb = as_string;
    as_string = false;
  }

  request(url)
    .pipe(new xxtea.Decrypt(bops.from(pass, 'base64')))
    .pipe(concat(function(contents) {
      if (as_string) return cb(null, bops.to(contents));
      else return cb(null, contents);
    }))

}