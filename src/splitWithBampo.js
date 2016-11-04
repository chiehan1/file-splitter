var bampoPageRegex = /(<pb id[^<>]+?>(?=([\s\S](?!<pb))*?(?=<bampo n="\d+[a-z]?\.\d+(\.1)?"\/>)))/g;
var bampoRegex = /<bampo n="(\d+[a-z]?)\.(\d+)(\.1)?"\/>/;
var allBampoRegex = /<bampo n="(\d+[a-z]?)\.(\d+)(\.1)?"\/>/g;
var sutraRegex = /<sutra id="[^<>]*(\d+)[^<>\d]*"\/>/;
var delim = '~!@#$%';

var tools = require('./tools.js');
var has = tools.has;

function useBampoTag2objs(bampoText) {
  var bampoObj = {};
  var lastBampoTag = bampoText.match(allBampoRegex)
    .pop()
    .match(bampoRegex);

  bampoObj['bampoN'] = lastBampoTag[1] + '_' + lastBampoTag[2];
  bampoObj['bampoText'] = bampoText;

  return bampoObj;
}

function splitWithBampoTag(text) {
  var bampoTexts = text.replace(bampoPageRegex, delim + '$1')
    .split(delim);
  bampoTexts.splice(0, 2, bampoTexts[0].concat(bampoTexts[1]));

  var bampoObjs = bampoTexts.map(useBampoTag2objs);
  var lastBampoN = bampoObjs.pop().bampoN;

  return {'bampoObjs': bampoObjs, 'lastBampoN': lastBampoN};
}

function splitWithBampo(volObjs) {
  var lastBampoN;

  var bamposInVols = volObjs.map(function(volObj) {
    var volText = volObj.volText;

    if (has(bampoRegex, volText)) {
      var objsAndBampoN = splitWithBampoTag(volText);
      lastBampoN = objsAndBampoN.lastBampoN;
console.log(lastBampoN);
      return objsAndBampoN.bampoObjs;
    }
    else if (has(sutraRegex, volText)) {
      //var objsAndBampoN = splitWithSutraTag(volText);
      //lastBampoN = objsAndBampoN.lastBampoN;

      //return objsAndBampoN.bampoObjs;
    }
    else {

    }
  });

  return bamposInVols;
}

module.exports = splitWithBampo;