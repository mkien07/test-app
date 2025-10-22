async function loadPage(file) {
  try {
    const res = await fetch(`pages/${file}`);
    if (!res.ok) throw new Error("Không tải được file: " + file);
    const html = await res.text();
    document.getElementById("app").innerHTML = html;
    setupLinks(); // Gán lại sự kiện sau khi thay HTML
  } catch (err) {
    document.getElementById("app").innerHTML = `<p style="color:red;text-align:center;">${err.message}</p>`;
  }
}

function setupLinks() {
  // Khi nhấn "Đăng ký"
  const regLink = document.querySelector('a[href="register.html"]');
  if (regLink) {
    regLink.addEventListener("click", e => {
      e.preventDefault();
      loadPage("register.html");
    });
  }

  // Khi nhấn "Đăng nhập"
  const loginLink = document.querySelector('a[href="login.html"], a[href="index.html"]');
  if (loginLink) {
    loginLink.addEventListener("click", e => {
      e.preventDefault();
      loadPage("login.html");
    });
  }
}

// Khi trang load lần đầu
window.addEventListener("DOMContentLoaded", () => {
  loadPage("login.html");
});
