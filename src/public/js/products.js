const botonCarrito = document.querySelector(".icon-cart");
const cartTab = document.querySelector(".cartTab");
const closeCart = document.querySelector(".close");
const payButton = document.querySelector(".pay-button");

const addToCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
  }).then((res) => {
    if (res.status == 200) {
      updateCartView(cartId);
      updateCartIconQuantity(cartId);
    }
  });
};

// const purchaseCart2 = (cartId) => {
//   fetch(`/api/carts/${cartId}/purchase`, {
//     method: "GET",
//   }).then((res) => {
//     if (res.status == 200) {
//       // window.location.reload();
//       window.location.href = "/purchase-success";
//     }
//   });
// };

const purchaseCart = async (cartId) => {
  const stripe = stripe(
    "pk_test_51Q0uUu05kyZCe8RwWpYtAXWrtFhfjjMLBMnjxMrkxShEGy0nURAIbjHO5U8SQvaX3h0d9XUPaPdXheqc37ZKT8sr00954r93ig"
  );
  const response = await fetch(`/api/payments/payment-intents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId }),
  });

  const { clientSecret } = await response.json();

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: "Jenny Rosen",
      },
    },
  });

  if (result.error) {
    console.error(result.error);
  } else {
    if (result.paymentIntent.status === "succeeded") {
      console.log("Pago exitoso!", result.paymentIntent);
      window.location.href = "/purchase-success";
    }
  }
};

const deleteFromCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.status == 200) {
      updateCartView(cartId);
      updateCartIconQuantity(cartId);
    }
  });
};

const updateCartIconQuantity = (cartId) => {
  try {
    fetch(`/api/carts/${cartId}`)
      .then((res) => res.json())
      .then((cartData) => {
        const cartIcon = document.querySelector(".icon-cart span");
        cartIcon.textContent = cartData.products.length;
      });
  } catch (error) {
    console.log(error);
  }
};

const updateCartView = (cartId) => {
  fetch(`/api/carts/${cartId}`)
    .then((res) => res.json())
    .then((cartData) => {
      const cartElement = document.querySelector(".listCart");
      cartElement.innerHTML = ""; // Limpia el contenido actual del carrito

      // Actualiza los productos del carrito en el DOM
      cartData.products.forEach((product) => {
        cartElement.innerHTML += `
          <div class="item">
            <div class="image">
              <img src="${product.product.thumbnail}" alt="${product.product.title}" />
            </div>
            <div class="name">
              <h2>${product.product.title}</h2>
            </div>
            <div class="totalPrice">
              <h2>$${product.product.price}</h2>
            </div>
            <div class="quantity">
              <span>${product.quantity}</span>
            </div>
            <div class="remove">
              <a class="minus" onclick="deleteFromCart('${cartId}', '${product.product._id}')">x</a>
            </div>
          </div>
        `;
      });
      const totalElement = document.querySelector(".total h2");
      totalElement.textContent = `Total: $${cartData.total}`;
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
