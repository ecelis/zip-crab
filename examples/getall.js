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
    let pc = '';
    switch (record[33].length) {  // Zip Code
      case 4:
        pc = `0${record[33]}`;
        break;
      case 3:
        pc = `00${record[33]}`;
        break;
      case 2:
        pc = `000${record[33]}`;
        break;
      case 1:
        pc = `0000${record[33]}`;
        break;
      default:
        pc = `${record[33]}`;
    }
    address += pc;

    let geoLocation;
    try {
      let data = await zc.geoCode(address)
      geoLocation = {
        zipCode: pc, coordinates: data,
        localty: record[32]
      }
      console.log(geoLocation);
    } catch {
      console.log('Error on: ', address);
    }
    counter += 1;

    return geoLocation;
  });
  zc.save(addresses);
})();
