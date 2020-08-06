const zc = require('../index');

(async () => {
  const records = await zc.readCsv(process.env.DATA_SOURCE);
  const total = records.length;
  const batchSize = 5;
  let bucket = [];
  let counter = 0;

  console.log(`Total: ${total}`);
  // TODO Filter unique
  records.forEach(record => {
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
      zc.geoCode(address)
        .then(data => {
          bucket.push({
              zipCode: pc, coordinates: data,
              localty: record[32]
          });
          if (bucket.length == batchSize) {
            zc.save(bucket)
              .then(loc => {  // TODO Maybe do something with `loc`
                bucket = [];
                counter += 1;
                console.log(`Done ${counter}/${total}`);
              })
              .catch(error => {
                console.log('MONGO', error);
              });
          }
        })
        .catch(error => {
          console.log('MAP', error);
        });
    } catch {
      console.log('Error on: ', address);
    }
  });
})();
