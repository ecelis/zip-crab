const zc = require('../index');

(async () => {
  const records = await zc.readCsv(process.env.DATA_SOURCE);
  const total = records.length;
  let counter = 0;
  console.log(`Total: ${total}`);
  // TODO Filter unique
  const addresses = await records.map(async record => {
    // Calle, Colonia, Ciudad, Estado, CP
    // let address = `${record[29]}, ${record[30]}, ${record[31]}, ${record[32]}, C.P. `;
    let address = `${record[32]}, C.P. `;
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
    await zc.geoCode(encodeURIComponent(address))
      .then(data => {
    let geoLocation = {
      zipCode: record[33], coordinates: data,
      localty: record[32]
    }
    counter += 1;
    console.log(`Done: ${geoLocation.zipCode} ${counter} / ${total}`);
    return geoLocation;
  });
  console.log(addresses);
  zc.save(addresses);
})();
