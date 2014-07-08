var xxtea = require('xxtea-stream'),
    streamifier = require('streamifier'),
    concat = require('concat-stream'),
    createReadStream = require('filereader-stream'),
    bops = require('bops');

module.exports = function(url, pass, as_string, cb) {
  asBlob(url, pass, as_string, function(err, contents){
    fallback(url, pass, as_string, cb);
  });
  

}

function fallback(url, pass, as_string, cb) {
  console.log('fallback')
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.overrideMimeType('text\/plain; charset=x-user-defined');
  oReq.onreadystatechange = function() {
    console.log('onreadystatechange');
    if (oReq.readyState === 4) {
      console.log(typeof oReq.responseText)
      console.log('is binary', bops.is(oReq.responseText))
      console.log(oReq.responseText);
      console.log(bops.from(oReq.responseText, 'base64'))
      streamifier.createReadStream(oReq.responseText, {})
        .pipe(new xxtea.Decrypt(bops.from(pass, 'base64')))
        .pipe(concat(function(contents) {
          console.log('fallback', contents);
          if (as_string) return cb(null, bops.to(contents));
          else return cb(null, contents);
        }))
    }
  }
  oReq.send(null);
}

function asBlob(url, pass, as_string, cb) {

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
        console.log('blob', contents);
        if (as_string) return cb(null, bops.to(contents));
        else return cb(null, contents);
      }))
  };
  oReq.send(null);
}