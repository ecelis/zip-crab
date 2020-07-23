const zc = require('./index');

test('Geocode Monterrwy, NL', async () => {
  const data = await zc.geoCode("Monterrwy, NL");
  expect(data).toEqual(expect.objectContaining({
    Latitude: expect.any(Number),
    Longitude: expect.any(Number)
  }));
});

test("Read Address from CSV", async () => {
  const records = await zc.readCsv('/home/ecelis/Downloads/HS_18_03_20.csv');
  expect(records.length).toBeGreaterThan(0);
});
