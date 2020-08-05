const zc = require('./index');

describe("Geocoding", () => {
  const oneRecord = {Latitude: 1, Longitude: 2};
  const manyRecords = [
    {Latitude: 2, Longitude: 3},
    {Latitude: 4, Longitude: 5},
    {Latitude: 6, Longitude: 7},
    {Latitude: 8, Longitude: 9}
  ];

   it('Returns geocode for "Sonora, 83260"', async () => {
    const data = await zc.geoCode("Sonora, 83260");
    expect(data).toEqual(expect.objectContaining({
      Latitude: expect.any(Number),
      Longitude: expect.any(Number)
    }));
  });

  it("Read Addresses from CSV", async () => {
    const records = await zc.readCsv('examples/data.csv');
    expect(records.length).toBeGreaterThan(0);
  });

  it("saves one record to mongodb", async () => {
    const oneResult = await zc.save(oneRecord);
    expect(oneResult).toEqual(expect.objectContaining({
      insertedCount: 1
    }));
  });

  it("saves 4 records to mongodb", async () => {
    const manyResult = await zc.save(manyRecords);
    expect(manyResult).toEqual(expect.objectContaining({
      insertedCount: 4
    }));
  });
});

