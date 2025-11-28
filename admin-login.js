document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_EMAIL = "admin@mawira.com.br"
  const ADMIN_PASSWORD = "admin123"

  const adminLoginForm = document.getElementById("adminLoginForm")
  const adminEmailInput = document.getElementById("adminEmail")
  const adminPasswordInput = document.getElementById("adminPassword")
  const togglePasswordIcon = document.querySelector(".toggle-password")

  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
  if (isAdminLoggedIn) {
    window.location.href = "admin-dashboard.html"
    return
  }

  if (togglePasswordIcon) {
    togglePasswordIcon.addEventListener("click", () => {
      const icon = togglePasswordIcon.querySelector("i")
      if (adminPasswordInput.type === "password") {
        adminPasswordInput.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        adminPasswordInput.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  }

  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = adminEmailInput.value.trim()
    const password = adminPasswordInput.value.trim()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true")
      localStorage.setItem("adminEmail", email)
      localStorage.setItem("adminLoginTime", new Date().toISOString())

      alert("Login realizado com sucesso! Bem-vindo ao painel administrativo.")
      window.location.href = "admin-dashboard.html"
    } else {
      alert("Email ou senha incorretos. Acesso negado.")
      adminPasswordInput.value = ""
      adminPasswordInput.focus()
    }
  })
})
