var xxtea = require('xxtea-stream'),
    xhr = require('binary-xhr'),
    streamifier = require('streamifier'),
    concat = require('concat-stream'),
    createReadStream = require('filereader-stream'),
    bops = require('bops');

module.exports = function(url, pass, options, cb) {
  // handle a call signature of function(url, pass, cb)
  if (typeof as_string === 'function') {
    cb = as_string;
    options = {};
  }
  if (options.blob) asBlob(url, pass, options, cb);
  else asArray(url, pass, options, cb)
}

function asArray(url, pass, options, cb) {
  xhr(url, function(err, data){
    streamifier.createReadStream(new Uint8Array(data))
      .pipe(new xxtea.Decrypt(bops.from(pass, 'base64')))
      .pipe(concat(function(contents) {
        if (options.return_string) return cb(null, bops.to(contents));
        else return cb(null, contents);
      }))    
  })

}

function asBlob(url, pass, options, cb) {

  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "blob";

  oReq.onload = function (oEvent) {
    createReadStream(oReq.response)
      .pipe(new xxtea.Decrypt(bops.from(pass, 'base64')))
      .pipe(concat(function(contents) {
        if (options.return_string) return cb(null, bops.to(contents));
        else return cb(null, contents);
      }))
  };
  oReq.send(null);
}