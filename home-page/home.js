const showItemsElement = document.querySelector(".showItems");
const mainElement = document.querySelector(".main");

const cartDetailsElement = document.querySelector(".cartDetails");
const elItemsInCart = document.querySelector(".cD_table-contents");
const elDelItemInCart = document.querySelector(".row-content_del-item");
const elTotalInCart = document.querySelector(".cD_table-total");

const elBackToShopping = document.querySelector(".btn-backToShopping");
const elBuy = document.querySelector(".btn-buy");

const elCartIcon = document.querySelector(".nav-cart");

// Hàm render sản phẩm lên web

const renderItemsInShop = ({ id, photo, name, price, quantity }) => {
  name = name.length > 20 ? name.slice(0, 21) + "..." : name;

  const shoesElement = document.createElement("div");

  shoesElement.classList.add("card");
  shoesElement.innerHTML = `<div class="shoe-img">
  <img src=${photo} alt=${name} />
  </div>
  <button class="add-item-to-cart btn">
  <i class="fa-solid fa-cart-plus"></i>
  </button>
  <h3 class="shoe-name">${name}</h3>
  <div class="shoe-info">
  <span class="price">${Number(price)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
    <span class="quantity">${quantity}</span>
    </div>`;

  const addBtn = shoesElement.querySelector(".add-item-to-cart");
  addBtn.addEventListener("click", () => {
    addSP(id);
    elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);
  });

  return shoesElement;
};

// Hàm thêm sản phẩm vào giỏ hàng
const addSP = (id, quantity = 1) => {
  const quantityInStore = shoesData.find((item) => item.id === id).quantity;
  const item = cartData.find((item) => item.id === id);
  if (item) {
    if (item.quantity < quantityInStore) {
      item.quantity += 1;
    } else {
      alert("Vượt quá số lượng trong kho");
    }
  } else {
    cartData.push({
      id,
      quantity,
    });
  }
  saveToStorage(keyLocalStorageItemCart, cartData);
};

// Hàm tạo element sản phẩm trong giao diện giỏ hàng
function createElementInCart(item) {
  const rowItemInCart = document.createElement("div");
  rowItemInCart.classList.add("row-content", "cD_table-grid");
  rowItemInCart.innerHTML = `<img
  class="row-content_img"
  src=${getItemInfo(item.id).photo}
  alt=${getItemInfo(item.id).name}
  />
  <div class="row-content_quantity">
  <button class="minus btn" onclick="minusQuantityInCart(${item.id})">-</button>
  <span class="quantity-in-cart">${item.quantity}</span>
  <button class="plus btn" onclick="plusQuantityInCart(${item.id})">+</button>
  </div>
  <span class="row-content_subtotal">${getItemInfo(item.id)
    .price.toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
    <span class="row-content_total">${(
      getItemInfo(item.id).price * item.quantity
    )
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      <button class="row-content_del-item btn"  onclick="delItemsInCart(${
        item.id
      })">
      <i class="fa-regular fa-circle-xmark"></i>
      </button>`;
  return rowItemInCart;
}

// Hàm render sản phẩm trong giỏ hàng ra giao diện
function renderItemsInCart() {
  elItemsInCart.innerHTML = ``;
  cartData.forEach((item) => {
    elItemsInCart.append(createElementInCart(item));
  });

  elTotalInCart.innerHTML = `${getTotalAmountInCart(cartData)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// Hiển thị sản phẩm của shop ra giao diện
shoesData.forEach((shoeObj) => {
  mainElement.append(renderItemsInShop(shoeObj));
});

// Hiển thị số lượng sản phẩm trong giỏ hàng tại vị trí icon giỏ hàng
elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);
