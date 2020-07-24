const zc = require('./index');

(async () => {
  const records = await zc.readCsv('/home/ecelis/Downloads/HS_18_03_20.csv');
  const total = records.length;
  let counter = 0;
  console.log(`Total: ${total}`);
  const unique = [...new Set(records)];  // unique = records.filter(v, i, a) => a.indexOf(v) === i);
  const addresses = unique.map(async record => {
    let address = `${record[29]}, ${record[30]}, ${record[31]}, ${record[32]}, C.P. `;
    switch (record[33].length) {  // Zip Code
      case 4:
        address += `0${record[33]}`;
        break;
      case 3:
        address += `00${record[33]}`;
        break;
      case 2:
        address += `000${record[33]}`;
        break;
      case 1:
        address += `0000${record[33]}`;
        break;
      default:
        address += `${record[33]}`;
    }
    // GeoCode Address
    const data = await zc.geoCode(address);
    let geoLocation = {
      zipCode: record[33], coordinates: data
    }
    counter += 1;
    console.log(`Done: ${counter} / ${total}`);
    return geoLocation;
  });
})();
