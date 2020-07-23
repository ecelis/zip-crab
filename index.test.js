const geoCode = require('./index').geoCode;

test('Geocode Monterrwy, NL', async () => {
  const data = await geoCode("Monterrwy, NL");
  console.log(data);
  expect(data).toEqual(expect.objectContaining({
    Latitude: expect.any(Number),
    Longitude: expect.any(Number)
  }));
});
