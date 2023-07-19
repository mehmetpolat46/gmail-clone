//! imports
import { months, categories } from "./constants.js";
import { renderMails, showModal, renderCategories } from "./ui.js";

// locakstorage'dan veri alma
const strMailData = localStorage.getItem("data");

// gelen string veriyi obje ve dizilere çevirme
const mailData = JSON.parse(strMailData) || [];

//! HTML'den çağırdıklarımız
const hamburgerMenu = document.querySelector(".menu");
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create-mail");
const modal = document.querySelector(".modal-wrapper");
const closeMailBtn = document.querySelector("#close-btn");
const form = document.querySelector("#create-mail-form");
const categoryArea = document.querySelector("nav .middle");
const searchButton = document.querySelector("#search-icon");
const searchInput = document.querySelector("#search-input");

//! Olay izleyicileri

document.addEventListener("DOMContentLoaded", () => {
  renderCategories(categoryArea, categories, "Gelen Kutusu");

  renderMails(mailsArea, mailData);
  if (window.innerWidth < 1100) {
    navigation.classList.add("hide");
  }
});
// pencerenin genişliğini izleme ve class ekleyip silme
window.addEventListener("resize", (e) => {
  const width = e.target.innerWidth;
  if (width < 1100) {
    navigation.classList.add("hide");
  } else {
    navigation.classList.remove("hide");
  }
});

hamburgerMenu.addEventListener("click", handleMenu);

searchButton.addEventListener("click", searchMails);

//! modal işlemleri
createMailBtn.addEventListener("click", () => showModal(modal, true));
closeMailBtn.addEventListener("click", () => showModal(modal, false));
form.addEventListener("submit", sendMail);

//mail alanın olan tıklamalar
mailsArea.addEventListener("click", updateMail);

// sidebar alanındaki tıklamalar
categoryArea.addEventListener("click", watchCategory);

//! Functions
function handleMenu() {
  navigation.classList.toggle("hide");
}

//! tarih oluşturan function
function getDate() {
  // bugünün tarihini almak

  const dateArr = new Date().toLocaleDateString().split(".");
  //tarih dizisinden gün almak
  const day = dateArr[0];
  //tarih dizisinden kaçıncı ayda olduğumuz bilgisini almak
  const monthNumber = dateArr[1];
  //ayın sırasına karşı geleni tanımlamak
  const month = months[monthNumber - 1];
  // fonksiyonun çağrıldığı yere gönderilecek cevap
  return [day, month].join(" ");
  // ikinci yol -> return day + " " + month;
}

// mail gönderme
function sendMail(e) {
  // sayfanın yenilenmesini engelleme .preventDefault
  e.preventDefault();

  // formun içerisinde yer alan imputların
  //degerlerine erişme

  const receiver = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;

  // boş mail göndermeyi engelleme
  if (!receiver || !title || !message) {
    // toastify notification codes(alert for empty mail send)
    Toastify({
      text: "Please fill in the form!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
        borderRadius: "6px",
      },
    }).showToast();
    return;
  }

  // yeni mail objesi oluşturma
  const newMail = {
    id: new Date().getTime(),
    sender: "Polat",
    receiver,
    title,
    starred: false,
    message,
    date: getDate(),
  };
  //oluşturdugumuz objeyi dizinin başına ekleme
  mailData.unshift(newMail);

  //Todo veritabanı ( locakstorage ) güncellemek
  //! storage ' a göndermek için string'e çeviriyoruz
  const strData = JSON.stringify(mailData);
  //! storage' a gönderme
  localStorage.setItem("data", strData);

  //ekranı güncellemek
  renderMails(mailsArea, mailData);

  //modal kapatma
  showModal(modal, false);

  // modalı temizlemek
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  // toastify notification codes(alert when mail sent)
  Toastify({
    text: "mail successfully sent!",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "rgb(193,193,0)",
      borderRadius: "6px",
      color: "white",
    },
  }).showToast();
}

// mail alanında bir tıklanma olunca çalışır
function updateMail(e) {
  // güncellenecek maili belirleme
  const mail = e.target.parentElement.parentElement;

  // mailin dizideki verilerini bulmak için id'sine erişme
  const mailId = mail.dataset.id;

  // sil butonu çalıştırma
  if (e.target.id === "delete") {
    //! local storage den kaldırma

    //id değerini bildiğimiz elemanı diziden çıkarma
    const filteredData = mailData.filter((i) => i.id != mailId);

    // diziyi string e çevirme
    const strData = JSON.stringify(filteredData);

    //local storage'e gönderme
    localStorage.setItem("data", strData);

    //! maili html'den kaldırma
    mail.remove();
  }

  // yıldıza tıklanınca çalışır
  if (e.target.id === "star") {
    //id'sinden yola çıkarak mail objesini bulma
    const foundItem = mailData.find((i) => i.id == mailId);

    // bulduğumuz elemanın starred değerini tersine çevirme
    const updatedItem = { ...foundItem, starred: !foundItem.starred };

    // güncellenecek elemanın sırasını bulma
    const index = mailData.findIndex((i) => i.id == mailId);

    // dizideki elemanı güncelleme
    mailData[index] = updatedItem;

    // local storage'a güncel diziyi aktarma
    localStorage.setItem("data", JSON.stringify(mailData));

    // HTML'i güncelleme
    renderMails(mailsArea, mailData);
  }
}

// kategorileri izleyip değiştireceğimiz fonksiyon

function watchCategory(e) {
  const selectedCategory = e.target.dataset.name;
  //navigasyon alanını güncelleme
  renderCategories(categoryArea, categories, selectedCategory);

  if (selectedCategory === "Starred") {
    // starred değeri true olanları seçme
    const filtered = mailData.filter((i) => i.starred === true);
    // seçtiklerimizi ekrana basma
    renderMails(mailsArea, filtered);
    return;
  }
  renderMails(mailsArea, mailData);
}

// mail arama
function searchMails() {
  // arama terimini içeren maillleri alma
  const filtered = mailData.filter((i) =>
    i.message.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  // mailleri ekrana basma
  renderMails(mailsArea, filtered);
}


//! Dark-Light Mode Start
// Toggle düğmesini alma
const ball = document.getElementById("dark-mode-toggle");
// Kullanıcının karanlık mod tercihini kontrol edin
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
const items = document.querySelectorAll("header,section,.toggle-btn::after")

// Karanlık ve açık mod arasında geçiş yapacak fonksiyon
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Toggle düğmesine tıklama olayı ekleme
ball.addEventListener("click", toggleDarkMode);



