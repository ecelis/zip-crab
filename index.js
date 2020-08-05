'use strict'
const os = require("os");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const got = require("got");
const MongoClient = require('mongodb').MongoClient;
if (process.env.NODE_ENV == 'development') {
  require('dotenv').config();
}

const { MONGODB_PASSWORD, MONGODB_USER, MONGODB_DB } = process.env
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.9f0eo.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
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
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }
}

exports.readCsv = async function readCsv (filePath) {
  let records = [];
  const content = fs.readFileSync(filePath, "utf8",);
  records = await parse(content);
  return records;
}

exports.save = function save(doc) {
  try {
    client.connect(async err => {
      const collection = client.db(MONGODB_DB).collection("ZipCodes");
      let result;
      if (Array.isArray(doc)) {
        result = await collection.insertMany(doc)
      } else {
        result = await collection.insertOne(doc)
      }
      client.close();
    });
  } catch (e) {
    console.error(e);
  }
}
