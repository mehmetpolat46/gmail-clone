//yazzıları kesmnek için function
function trimString(str, max) {
  //Metin 40 karakterden kısa ise bir şey yapmaz
  if (str.length < max) return str;

  // Metnin harf uzunluğu 40 karakterden uzunsa
  // 40 a kadar olan kısmı keser ve üç nokta koyar.
  return str.slice(0, max) + "...";
}

//! Mail list to screen function
//! outlet: ekranın hangi kısmına müdahale edilecek
//! data: hangi verileri ekrana basacağız

export function renderMails(outlet, data) {
  if (!data) return;
  // herbir mail objesi için bir maili temsil edem html oluştur
  // oluşan mail htmlini mailler alanına gönderme
  outlet.innerHTML = data
    .map(
      (mail) => `
             <div class="mail" data-id=${mail.id}>
                    <div class="left">
                        <input type="checkbox">
                        <i id="star" class="bi bi-star ${
                          mail.starred && "star-active"
                        }"></i>
                        <span>${mail.sender}</span>
                    </div>
                    <div class="right">
                        <p class="message-title">
                        ${trimString(mail.title, 80)}
                        </p>

                        <p class="message-desc">
                        ${trimString(mail.message, 40)}
                        </p>

                        <p class="message-date">
                        ${mail.date}
                        </p>
                        <button id="delete">Sil</button>
                    </div>
                </div>
    `
    )
    .join("");
}

// ekrana maill oluşturma penceresi açacak function

export function showModal(modal, willOpen) {
  modal.style.display = willOpen ? "grid" : "none";
}

// kategorileri ekrana basma methodu
export function renderCategories(outlet, data, selectedCategory) {
  // eski kategorileri silme
  outlet.innerHTML = "";

  // bize gelen diziyi dönme
  data.forEach((category) => {
    const categoryItem = document.createElement("a");

    // kategori elemanına veri ekleme
    categoryItem.dataset.name = category.title;

    // aktif olan kategoriye active classını ekleme
    categoryItem.className =
      selectedCategory === category.title && "active-category";

    categoryItem.innerHTML = `
       <i class="bi ${category.class}"></i>
       <span>${category.title}</span>`;

    outlet.appendChild(categoryItem);
  });
}


