'use strict'
const os = require("os");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const got = require("got");
const MongoClient = require('mongodb').MongoClient;
if (process.env.NODE_ENV == 'development') {
  require('dotenv').config();
}

const { MONGODB_CLUSTER, MONGODB_PASSWORD, MONGODB_USER, MONGODB_DB } = process.env
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${MONGODB_DB}?retryWrites=true&w=majority`;
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

exports.save = async function save(doc) {
  let result;
  const client = new MongoClient(uri,
    { useNewUrlParser: true, poolSize: 10 });
  try {
    await client.connect();
    const database = client.db(MONGODB_DB);
    const collection = database.collection("ZipCodes");
    if (Array.isArray(doc)) {
      result = await collection.insertMany(doc);
    } else {
      result = await collection.insertOne(doc);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return result;
}
