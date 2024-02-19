const billElement = document.querySelector(".bill__product-list");
// Hiển thị đơn hàng từ mockAPI
async function showBill() {
  billElement.innerHTML = ``;
  // const billItem = document.createElement("div");
  billData = await dataLocal.getAPIs();

  billData.forEach((element, index) => {
    totalQuantity = getTotalQuantityInCart(element.order);
    totalValue = getTotalAmountInCart(element.order);
    const billItem = document.createElement("div");
    billItem.classList.add("bill__product-item");
    billItem.innerHTML = `
    <div class="text-center item-detail">
      <div class="item-id">${element.idBill}</div>
      <span class="detail-text" onclick="billDetail('${
        element.idBill
      }')">Details▼</span>
    </div>
    <div class="text-center">${element.fullName}</div>
    <div class="text-center">${element.orderDate}</div>
    <div class="text-center">${element.order.length}</div>
    <div class="text-center">${totalQuantity}</div>
    <div class="text-center">$ ${totalValue.toLocaleString()}</div>
    <div class="text-center elementDelete">
      <i class="fa-regular fa-circle-xmark icon-delete" onclick="deleteBill('${
        element.idBill
      }')"></i>
    </div>
    <div class="modal-detail"></div>`;
    billElement.appendChild(billItem);
    console.log(element);
  });
}

showBill();

// Hàm hiển thị details bill
async function billDetail(id) {
  const bill = billData.find((bill) => bill.idBill === id);
  const modalDetail = document.querySelector(".modal-detail");
  modalDetail.innerHTML = `
      <div class="modal-content">
          <h3 class="modal-title">Thông tin người mua</h3>
          <div class="buyer-info">
              <p><strong>Họ và tên:</strong> ${bill.fullName}</p>
              <p><strong>Email:</strong> ${bill.emailCustomer}</p>
              <p><strong>Số điện thoại:</strong> ${bill.phoneNumber}</p>
              <p><strong>Địa chỉ:</strong> ${bill.addressCustomer}</p>
              <p><strong>Lời nhắn:</strong> <span id="buyerMessage">${
                bill.message ? bill.message : "Không có lời nhắn!"
              }</span></p>
          </div>
          <h3 class="modal-title">Thông tin đơn hàng</h3>
          <div class="order-info">
              <div class="order-detail">
                ${listItemInBill(bill.order)}
              </div>
          </div>
          <!-- Button đóng modal -->
          <span class="close">&times;</span>
      </div>
  `;
  modalDetail.querySelector(".close").onclick = () => {
    modalDetail.querySelector(".modal-content").style.display = "none";
  };
}

function listItemInBill(order) {
  return order
    .map((item) => {
      return `
                <div class="order-item">
                    <img class="img_colums" src="${
                      getItemInfo(item.id).photo
                    }" alt="product-img"/>
                    <div class="desPro">
                        <span class="namePro"><strong>${
                          getItemInfo(item.id).name
                        }</strong></span>
                        <span class="quantityPro">Quantity: ${
                          getItemInfo(item.id).quantity
                        }</span>
                    </div>
                </div>
                `;
    })
    .join("");
}

// Hàm Xóa đơn hàng theo idBill
async function deleteBill(id) {
  try {
    const confirmDelete = confirm(
      `Bạn có chắc chắn muốn xóa đơn hàng "${id}" không?`
    );
    const billData = await dataLocal.getAPIs();
    if (confirmDelete) {
      const bill = billData.find((bill) => bill.idBill === id);
      await dataLocal.deleteApi(bill.id);
      console.log("Xóa thành công đơn hàng: " + bill.idBill);
      returnQuantity(bill);
      showBill();
    }
  } catch (error) {
    console.log("Lỗi khi tải dữ liệu: " + error);
  }
}

// Hàm trả lại số lượng sản phẩm vào kho khi xóa đơn hàng
function returnQuantity(bill) {
  console.log(bill.order);
  bill.order.forEach((itemBill) => {
    shoesData.find((itemStore) => itemStore.id === itemBill.id).quantity +=
      itemBill.quantity;
  });
  saveToStorage(keyLocalStorageListSP, shoesData);
}
