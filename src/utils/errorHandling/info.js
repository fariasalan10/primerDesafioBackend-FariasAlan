const ProductErrorInfo = (product) => {
  return `One or more fields are invalid. Please check the information and try again.
    Properties required:
    - title: wait for a string, but got ${product.title}
    - description: wait for a string, but got ${product.description}
    - price: wait for a number, but got ${product.price}
    - thumbnail: wait for a string, but got ${product.thumbnail}
    - code: wait for a string, but got ${product.code}
    - stock: wait for a number, but got ${product.stock}
    `;
};

const idErrorInfo = (id) => {
  return `The property ID is inexistent. Please check the information and try again.
        - Received: ${id}`;
};

module.exports = { ProductErrorInfo, idErrorInfo };
