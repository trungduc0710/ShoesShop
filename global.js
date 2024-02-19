const keyLocalStorageListSP = "DANHSACHSP";
const keyLocalStorageItemCart = "DANHSACHITEMCART";
const keyLocalStorageBill = "DANHSACHBILL";
const apiBill = "https://65c4189fdae2304e92e24ff8.mockapi.io/api/billData";

const shoesData = getFromStorage(keyLocalStorageListSP);
let cartData = getFromStorage(keyLocalStorageItemCart);

const elTotalQuantityInCart = document.querySelector(".cart__products-count");

const listData = [
  {
    id: 1,
    name: "Air jordan 1 mid",
    photo: "../images/Air_jordan_1_mid_3669.webp",
    price: 3669,
    quantity: 10,
  },
  {
    id: 2,
    name: "Air jordan legacy 312 low",
    photo: "../images/Air_jordan_legacy_312_low_3620.webp",
    price: 3620,
    quantity: 12,
  },
  {
    id: 3,
    name: "Nike air force 1 GTX",
    photo: "../images/Nike_air_force_1_GTX_4699.webp",
    price: 4699,
    quantity: 14,
  },
  {
    id: 4,
    name: "Nike Air Force 1 LV8",
    photo: "../images/Nike_Air_Force_1_LV8_3519.webp",
    price: 3519,
    quantity: 10,
  },
  {
    id: 5,
    name: "Nike air max excee",
    photo: "../images/Nike_air_max_excee_2929.webp",
    price: 2929,
    quantity: 12,
  },
  {
    id: 6,
    name: "Nike air pegasus",
    photo: "../images/Nike_air_pegasus_2649.webp",
    price: 2649,
    quantity: 14,
  },
  {
    id: 7,
    name: "Nike air trainer 1",
    photo: "../images/Nike_air_trainer_1_3829.webp",
    price: 3829,
    quantity: 10,
  },
  {
    id: 8,
    name: "Nike Full Force low",
    photo: "../images/Nike_Full_Force_low_2929.webp",
    price: 2929,
    quantity: 12,
  },
  {
    id: 9,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 14,
  },
  {
    id: 10,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 12,
  },
  {
    id: 11,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 14,
  },
  {
    id: 12,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 12,
  },
  {
    id: 13,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 14,
  },
  {
    id: 14,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 10,
  },
  {
    id: 15,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 12,
  },
  {
    id: 16,
    name: "Nike Waffle Debut",
    photo: "../images/Nike_Waffle_Debut_2349.webp",
    price: 2349,
    quantity: 14,
  },
];

// Hàm lưu dữ liệu
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//Hàm lấy dữ liệu
function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

//Lưu dữ liệu sản phẩm xuống localStorage
if (!getFromStorage(keyLocalStorageListSP)) {
  saveToStorage(keyLocalStorageListSP, listData);
  saveToStorage(keyLocalStorageItemCart, []);
  saveToStorage(keyLocalStorageBill, []);
}

// Hàm kiểm tra số lượng mua/tồn kho
function checkQuantityInStore(id) {
  const quantityInStore = shoesData.find((item) => item.id === id).quantity;
  const quantityOrder = cartData.find((item) => item.id === id).quantity;
  return quantityInStore - quantityOrder > 0 ? true : false;
}

// Hàm tính tổng số lượng sản phẩm trong giỏ hàng
const getTotalQuantityInCart = (arr) => {
  return arr.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
};
elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);

// Hàm tính tiền tổng sản phẩm trong giỏ hàng
const getTotalAmountInCart = (arr) => {
  return arr.reduce((totalPrice, item) => {
    return totalPrice + getItemInfo(item.id).price * item.quantity;
  }, 0);
};

// Hàm lấy thông tin item
const getItemInfo = (id) => {
  const item = shoesData.find((item) => item.id === id);
  return item;
};

// Hàm ẩn/hiện section
function hiddenToggle(el) {
  el.classList.toggle("hidden");
}

// Hàm GET/ POST/ DELETE bills
const dataLocal = (() => {
  return {
    async getAPIs() {
      try {
        const response = await fetch(apiBill);
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu!");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu!:", error);
        return null;
      }
    },

    async postAPI(apiBill, data) {
      try {
        const response = await fetch(apiBill, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return response.json();
      } catch (error) {
        Promise.reject(error);
      }
    },

    async deleteApi(id) {
      try {
        const response = await fetch(`${apiBill}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const resData = await response.json();
          return resData;
        } else {
          throw new Error("Error delete");
        }
      } catch (error) {
        console.error(error);
      }
    },
  };
})();
