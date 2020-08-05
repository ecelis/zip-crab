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

test("Save to MongoDB", async () => {
  const data = {Latitude: 2, Longitude: 3};
  const result = await zc.save(data);
  expect(result).toEqual({})
});
