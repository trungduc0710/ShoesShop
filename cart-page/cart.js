const cartEmpty = document.querySelector(".cart-empty");
const cartDetailsElement = document.querySelector(".cartDetails");
const elItemsInCart = document.querySelector(".cD_table-contents");
const elDelItemInCart = document.querySelector(".row-content_del-item");
const elTotalInCart = document.querySelector(".cD_table-total");

const elBackToShopping = document.querySelector(".btn-backToShopping");
const elBuy = document.querySelector(".btn-buy");

const elCartIcon = document.querySelector(".nav-cart");

// Hàm tạo element sản phẩm trong giao diện giỏ hàng
function createElementInCart(item) {
  const rowItemInCart = document.createElement("div");
  rowItemInCart.classList.add("row-content", "cD_table-grid");
  rowItemInCart.innerHTML = `
  <div class="row-content_img">
    <img
    class="content_img"
    src=${getItemInfo(item.id).photo}
    alt=${getItemInfo(item.id).name}
    />
    <div class="content_info">
      <h3>${getItemInfo(item.id).name}</h3>
      <p>Quantity: ${getItemInfo(item.id).quantity}</p>
    </div>
  </div>
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
function renderItemsInCart(cartData) {
  elItemsInCart.innerHTML = ``;
  cartData.forEach((item) => {
    elItemsInCart.append(createElementInCart(item));
  });

  elTotalInCart.innerHTML = `${getTotalAmountInCart(cartData)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// Hàm xóa sản phẩm trong giỏ hàng
function delItemsInCart(id) {
  const isDeleted = confirm("Are you sure delete this shoes?");
  if (isDeleted) {
    const item = cartData.find((item) => item.id === id);
    cartData.splice(cartData.indexOf(item), 1);
    saveToStorage(keyLocalStorageItemCart, cartData);
    renderItemsInCart(cartData);
    elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);
    checkEmptyInCart();
  }
}

// Hàm tăng số lượng sản phẩm đã mua trong giỏ hàng
function plusQuantityInCart(id) {
  if (checkQuantityInStore(id)) {
    const item = cartData.find((item) => item.id === id);
    item.quantity += 1;
    saveToStorage(keyLocalStorageItemCart, cartData);
    renderItemsInCart(cartData);
    elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);
  } else {
    alert("Vượt quá số lượng trong kho");
  }
}

// Hàm giảm số lượng sản phẩm đã mua trong giỏ hàng
function minusQuantityInCart(id) {
  const item = cartData.find((item) => item.id === id);
  item.quantity -= 1;
  if (item.quantity) {
    item.quantity;
  } else {
    item.quantity++;
    delItemsInCart(id);
  }
  saveToStorage(keyLocalStorageItemCart, cartData);
  renderItemsInCart(cartData);
  elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);
}

// Hàm hiện emptyImageCover sản phẩm trong giỏ hàng
function checkEmptyInCart() {
  if (!getTotalQuantityInCart(cartData)) {
    hiddenToggle(cartEmpty);
    hiddenToggle(cartDetailsElement);
  } else {
    renderItemsInCart(cartData);
  }
}
checkEmptyInCart();

// Sự kiện click nút Back To Shopping
elBackToShopping.addEventListener("click", function () {
  hiddenToggle(showItemsElement);
  hiddenToggle(cartDetailsElement);
});

// Sự kiện click nút Buy
elBuy.addEventListener("click", function () {
  hiddenToggle(dialogInfoCustomerElement);
  getProvices();
});

//---------------- Phần dialog nhập thông tin khách hàng -------------------------------------

const elCloseDialogInfoCustomer = document.querySelector(
  ".info-customer--close"
);
const dialogInfoCustomerElement = document.querySelector(
  ".dialog-info-customer"
);
const elInputIC = document.querySelectorAll(".input-ic");
const elInputRequired = document.querySelectorAll(".input-required");
const elSelectAddress = document.querySelectorAll(".ic-select");
const elLastnameIP = document.querySelector(".ic-lastname").children[0];
const elFirstnameIP = document.querySelector(".ic-firstname").children[0];
const elEmail = document.querySelector(".input-email");
const elPhoneNumber = document.querySelector(".input-phone");
const elSelectProvice = document.querySelector(".ic-select_provice");
const elSelectDistrict = document.querySelector(".ic-select_district");
const elSelectWard = document.querySelector(".ic-select_ward");
const elHouseNumberIP = document.querySelector(".ic-house-number").children[0];
const elTextArea = document.querySelector(".textarea-input");
const elBtnCancel = document.querySelector(".btn-cancel");
const elBtnConfirmBuy = document.querySelector(".btn-confirm");

// Sự kiện click vào nút X của dialog
elCloseDialogInfoCustomer.addEventListener("click", clearInputAndMessage);

// Sự kiện click vào nút Hủy
elBtnCancel.addEventListener("click", clearInputAndMessage);

//Sự kiện click vào nút Xác nhận mua
elBtnConfirmBuy.addEventListener("click", function (e) {
  e.preventDefault();
  if (validateInput()) {
    generateID(8);
  }
});

// Hàm xóa dữ liệu input, xóa message thông báo
function clearInputAndMessage() {
  hiddenToggle(dialogInfoCustomerElement);
  clearInput();
  elInputRequired.forEach((obj) => {
    clearMessage(obj);
  });
  elSelectAddress.forEach((obj) => {
    clearMessage(obj);
  });
}

// Hàm xóa dữ liệu ở tất cả các ô input
function clearInput() {
  elInputIC.forEach((el) => (el.value = ""));
  getProvices();
}

// Hàm xóa dữ liệu ở các ô input
function clearMessage(obj) {
  obj.nextElementSibling.classList.add("hidden");
}

// Lấy dữ liệu tỉnh, huyện, xã từ API
// async function getProvices() {
//   let provinces = await fetch(`https://provinces.open-api.vn/api/p/`).then(
//     (response) =>
//       response.json().catch((error) => {
//         alert(`Lỗi khi gọi dữ liệu: ${error}`);
//       })
//   );
//   elSelectProvice.innerHTML = `<option value="">-- Chọn Tỉnh/Thành phố --</option>`;
//   elSelectDistrict.innerHTML = `<option value="">-- Chọn Huyện/Quận --</option>`;
//   elSelectWard.innerHTML = `<option value="">-- Chọn Xã/Phường --</option>`;
//   provinces.map(
//     (value) =>
//       (document.querySelector(
//         ".ic-select_provice"
//       ).innerHTML += `<option value="${value.code}">${value.name}</option>`)
//   );
// }
async function getDataAddress() {
  let dataAddress = await fetch(`./local.json`).then((response) =>
    response.json().catch((error) => {
      alert(`Lỗi khi gọi dữ liệu: ${error}`);
    })
  );
  return dataAddress;
}

async function getProvices() {
  let provinces = await getDataAddress();

  elSelectProvice.innerHTML = `<option value="">-- Chọn Tỉnh/Thành phố --</option>`;
  elSelectDistrict.innerHTML = `<option value="">-- Chọn Huyện/Quận --</option>`;
  elSelectWard.innerHTML = `<option value="">-- Chọn Xã/Phường --</option>`;
  provinces.map(
    (value) =>
      (document.querySelector(
        ".ic-select_provice"
      ).innerHTML += `<option value="${value.name}">${value.name}</option>`)
  );
}

async function getDistricts(event) {
  const data = await getDataAddress();
  let dataDistricts = data.filter(
    (province) => province.name === event.target.value
  )[0].districts;

  elSelectDistrict.innerHTML = `<option value="">-- Chọn Huyện/Quận --</option>`;
  elSelectWard.innerHTML = `<option value="">-- Chọn Xã/Phường --</option>`;
  dataDistricts.map(
    (value) =>
      (document.querySelector(
        ".ic-select_district"
      ).innerHTML += `<option value="${value.name}">${value.name}</option>`)
  );
}

async function getWards(event) {
  const data = await getDataAddress();
  let dataWards = data
    .filter((province) => province.name === elSelectProvice.value)[0]
    .districts.filter(
      (district) => district.name === event.target.value
    )[0].wards;

  elSelectWard.innerHTML = `<option value="">-- Chọn Xã/Phường --</option>`;
  dataWards.map(
    (value) =>
      (document.querySelector(
        ".ic-select_ward"
      ).innerHTML += `<option value="${value.name}">${value.name}</option>`)
  );
}

// async function getDistricts(event) {
//   let districts = await fetch(`https://provinces.open-api.vn/api/d/`).then(
//     (response) =>
//       response.json().catch((error) => {
//         alert(`Lỗi khi gọi dữ liệu: ${error}`);
//       })
//   );

//   elSelectDistrict.innerHTML = `<option value="">-- Chọn Huyện/Quận --</option>`;

//   districts
//     .filter((value) => {
//       return value.province_code === Number(event.target.value);
//     })
//     .map(
//       (value) =>
//         (document.querySelector(
//           ".ic-select_district"
//         ).innerHTML += `<option value="${value.code}">${value.name}</option>`)
//     );
//   getWards(event);
// }

// async function getWards(event) {
//   let wards = await fetch(`https://provinces.open-api.vn/api/w/`).then(
//     (response) =>
//       response.json().catch((error) => {
//         alert(`Lỗi khi gọi dữ liệu: ${error}`);
//       })
//   );

//   elSelectWard.innerHTML = `<option value="">-- Chọn Xã/Phường --</option>`;

//   wards
//     .filter((value) => {
//       return value.district_code === Number(event.target.value);
//     })
//     .map(
//       (value) =>
//         (document.querySelector(
//           ".ic-select_ward"
//         ).innerHTML += `<option value="${value.code}">${value.name}</option>`)
//     );
// }

const generateID = async (lengID) => {
  let billData = await dataLocal.getAPIs();
  const charsTemp = [..."abcdefghijklmnopqrstuvwxyz0123456789"];
  let idBill = "";
  let orderDate = new Date().toLocaleDateString("en-GB");
  let fullName = `${elLastnameIP.value} ${elFirstnameIP.value}`;
  let addressCustomer = `${elHouseNumberIP.value}, ${elSelectWard.value}, ${elSelectDistrict.value}, ${elSelectProvice.value}`;
  let emailCustomer = `${elEmail.value}`;
  let phoneNumber = `${elPhoneNumber.value}`;
  let message = `${elTextArea.value}`;
  // Tạo ID của bill
  for (let i = 0; i < lengID; i++) {
    const index = Math.floor(Math.random() * charsTemp.length);
    idBill += charsTemp[index];
  }
  // Kiểm tra trùng lặp ID của bill
  if (!billData.find((bill) => bill.idBill === idBill)) {
    bill = {
      idBill,
      fullName,
      addressCustomer,
      emailCustomer,
      phoneNumber,
      orderDate,
      order: cartData,
      message,
    };
    dataLocal.postAPI(apiBill, bill);
    clearInputAndMessage();
    handingQuantity();
    checkEmptyInCart();
  } else {
    console.log("id da ton tai: " + idBill);
    generateID(lengID);
  }
};

// Hàm validate dữ liệu input
const showAlert = (obj, mes) => {
  obj.nextElementSibling.classList.remove("hidden");
  obj.nextElementSibling.innerHTML = mes;
};

const validateInput = () => {
  let check1 = checkEmptyInput(elInputRequired);
  let check2 = checkEmptyInput(elSelectAddress);
  let check3 = validateEmail(elEmail);
  let check4 = validatePhoneNumber(elPhoneNumber);
  return check1 && check2 && check3 && check4;
};

const checkEmptyInput = (arr) => {
  let check = true;
  arr.forEach((node) => {
    if (!node.value) {
      showAlert(node, "Không được để trống!");
      check = false;
    } else {
      clearMessage(node);
    }
  });
  return check;
};

// checkEmptyInput(elSelectAddress);

const validatePhoneNumber = (obj) => {
  const regexPhoneNumber = /(84|0)+([0-9]{9})\b/g;
  if (obj.value) {
    if (obj.value.match(regexPhoneNumber)) {
      return true;
    } else {
      obj.nextElementSibling.classList.remove("hidden");
      obj.nextElementSibling.innerHTML = "Số điện thoại chưa đúng định dạng!";
      return false;
    }
  } else {
    return false;
  }
};

const validateEmail = (obj) => {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (obj.value) {
    if (obj.value.match(mailformat)) {
      return true;
    } else {
      obj.nextElementSibling.classList.remove("hidden");
      obj.nextElementSibling.innerHTML = "Email chưa đúng định dạng!";
      return false;
    }
  } else {
    return false;
  }
};

// Hàm xử lý số lượng sản phẩm khi xác nhận đơn hàng thành công

function handingQuantity() {
  cartData.forEach((value) => {
    shoesData.find((item) => item.id === value.id).quantity -= value.quantity;
  });
  cartData.splice(0);
  saveToStorage(keyLocalStorageItemCart, cartData);
  saveToStorage(keyLocalStorageListSP, shoesData);
  renderItemsInCart(cartData);
  elTotalQuantityInCart.textContent = getTotalQuantityInCart(cartData);
}
