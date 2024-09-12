const botonCarrito = document.querySelector(".icon-cart");
const cartTab = document.querySelector(".cartTab");
const closeCart = document.querySelector(".close");

const addToCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
  }).then((res) => {
    if (res.status == 200) {
      window.location.reload();
    }
  });
};

const purchaseCart = (cartId) => {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "GET",
  }).then((res) => {
    if (res.status == 200) {
      // window.location.reload();
      window.location.href = "/purchase-success";
    }
  });
};

const deleteFromCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.status == 200) {
      window.location.reload();
    }
  });
};

botonCarrito.addEventListener("click", () => {
  cartTab.classList.toggle("hiddenCart");
  botonCarrito.classList.toggle("hiddenCart");
});

closeCart.addEventListener("click", (event) => {
  cartTab.classList.toggle("hiddenCart");
  botonCarrito.classList.toggle("hiddenCart");
});
