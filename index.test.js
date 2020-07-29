const zc = require('./index');

test('Geocode Sonora, 83260', async () => {
  const data = await zc.geoCode("Sonora, 83260");
  expect(data).toEqual(expect.objectContaining({
    Latitude: expect.any(Number),
    Longitude: expect.any(Number)
  }));
});

test("Read Address from CSV", async () => {
  const records = await zc.readCsv('examples/data.csv');
  expect(records.length).toBeGreaterThan(0);
});
