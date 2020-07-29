'use strict'
const os = require("os");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const got = require("got");

if (process.env.NODE_ENV == 'development') {
  require('dotenv').config();
}
const url = "https://geocoder.ls.hereapi.com/search/6.2/geocode.json";
const apiKey = process.env.HERE_API_KEY;

exports.geoCode = async function geoCode (qry) {
  if (process.env.NODE_ENV == 'development') {
    console.log(`Looking for ${qry}`);
    console.log(`${url}?searchtext=${qry}`);
  }
  try {
    const res = await got(url, {
      searchParams: {searchtext: qry, apiKey: apiKey}
    });
    let result = JSON.parse(res.body);
    let latLon = result.Response.View[0].Result[0].Location.DisplayPosition;
    return latLon;
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

exports.readCsv = async function readCsv (filePath) {
  let records = [];
  const content = fs.readFileSync(filePath, "utf8",);
  records = await parse(content);
  return records;
}
