const { faker } = require("@faker-js/faker");

const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.number.int({ min: 100000, max: 999999 }),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(1),
    stock: faker.number.int({ min: 1, max: 100 }),
    category: faker.commerce.productAdjective(),
    thumbnails: faker.image.url(),
    id: faker.database.mongodbObjectId(),
  };
};

module.exports = generateProducts;
