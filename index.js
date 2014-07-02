var xxtea = require('xxtea-stream'),
    concat = require('concat-stream'),
    createReadStream = require('filereader-stream'),
    bops = require('bops');

module.exports = function(url, pass, as_string, cb){

  // handle a call signature of function(url, pass, cb)
  if (typeof as_string === 'function') {
    cb = as_string;
    as_string = false;
  }

  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "blob";

  oReq.onload = function (oEvent) {
    createReadStream(oReq.response)
      .pipe(new xxtea.Decrypt(bops.from(pass, 'base64')))
      .pipe(concat(function(contents) {
        if (as_string) return cb(null, bops.to(contents));
        else return cb(null, contents);
      }))
  };
  oReq.send(null);
}