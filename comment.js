const USERID = {
  name: null,
  identity: null,
  image: null,
  message: null,
  date: null,
};

const userComment = document.querySelector(".usercomment");
const publishBtn = document.querySelector("#publish");
const comments = document.querySelector(".comments");
const userName = document.querySelector(".user");

window.addEventListener("load", () => {
  const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.forEach((comment) => {
    displayComment(comment);
  });
  updateCommentCount(savedComments.length);
});

userComment.addEventListener("input", () => {
  if (!userComment.value) {
    publishBtn.setAttribute("disabled", "disabled");
    publishBtn.classList.remove("abled");
  } else {
    publishBtn.removeAttribute("disabled");
    publishBtn.classList.add("abled");
  }
});

function displayComment(commentData) {
  const { id, name, message, image, date } = commentData;
  const commentHTML = `
                    <div class="parents" data-id="${id}">
                    <div class="comment-content">
                        <img src="${image}" class="user-image">
                        <div class="comment-text">
                        <h1>${name}</h1>
                        <p>${message}</p>
                        <div class="engagements">
                            <img src="./assets/favicon/like.png" id="like">
                            <img src="./assets/favicon/share.png" alt="">
                        </div>
                        <span class="date">${date}</span>
                        </div>
                    </div>
                    <button type="button" class="delete-btn">Delete</button>
                    </div>
                    `;

  // Menggunakan insertAdjacentHTML agar event listener tidak hilang
  comments.insertAdjacentHTML("beforeend", commentHTML);

  // Tambahkan event listener untuk tombol delete
  const deleteButton = comments.querySelector(`[data-id="${id}"] .delete-btn`);
  deleteButton.addEventListener("click", () => deleteComment(id));
}

function addPost() {
  if (!userComment.value) return;

  const commentId = Date.now();

  USERID.name = userName.value || "Anonymous";
  USERID.identity = USERID.name !== "Anonymous";
  USERID.image = USERID.identity ? "./assets/favicon/user.png" : "./assets/favicon/anonymous.png";
  USERID.message = userComment.value;
  USERID.date = new Date().toLocaleString();

  const commentData = {
    id: commentId,
    name: USERID.name,
    message: USERID.message,
    image: USERID.image,
    date: USERID.date,
  };

  const commentsList = JSON.parse(localStorage.getItem("comments")) || [];
  commentsList.push(commentData);

  // Simpan komentar yang diperbarui ke localStorage
  localStorage.setItem("comments", JSON.stringify(commentsList));

  // Tampilkan komentar
  displayComment(commentData);

  // Reset input
  userComment.value = "";
  publishBtn.classList.remove("abled");
  publishBtn.setAttribute("disabled", "disabled");

  // Perbarui jumlah komentar
  updateCommentCount(commentsList.length);
}

// Fungsi untuk memperbarui jumlah komentar di halaman
function updateCommentCount(count) {
  document.getElementById("comment").textContent = count;
}

function deleteComment(commentId) {
  let commentsList = JSON.parse(localStorage.getItem("comments")) || [];
  commentsList = commentsList.filter((comment) => comment.id !== commentId);

  // Simpan daftar yang diperbarui ke localStorage
  localStorage.setItem("comments", JSON.stringify(commentsList));

  // Hapus elemen komentar dari DOM
  const commentElement = comments.querySelector(`[data-id="${commentId}"]`);
  if (commentElement) commentElement.remove();

  // Perbarui jumlah komentar
  updateCommentCount(commentsList.length);
}

// Event listener untuk tombol publish
publishBtn.addEventListener("click", addPost);
