document.addEventListener("DOMContentLoaded", () => {
  // --- Credenciais de Teste e Dados Padrão ---
  const TEST_EMAIL = "teste@mawira.com.br"
  const TEST_PASSWORD = "senha123"
  const TEST_USERNAME = "Usuário Teste"
  const DEFAULT_PROFILE_PICTURE = "https://via.placeholder.com/140/8B4513/FFFFFF?text=MP" // URL da imagem padrão para o perfil

  const ADMIN_EMAIL = "admin@mawira.com.br"
  const ADMIN_PASSWORD = "admin123"

  // --- Elementos do DOM ---
  const showLoginButton = document.getElementById("showLogin")
  const showRegisterButton = document.getElementById("showRegister")
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const togglePasswordIcons = document.querySelectorAll(".toggle-password")
  const loginEmailInput = document.getElementById("loginEmail")
  const loginPasswordInput = document.getElementById("loginPassword")
  const registerNameInput = document.getElementById("registerName")
  const registerEmailInput = document.getElementById("registerEmail")
  const registerPasswordInput = document.getElementById("registerPassword")
  const confirmPasswordInput = document.getElementById("confirmPassword")
  const agreeTermsCheckbox = document.getElementById("agreeTerms")

  // --- Funções Auxiliares ---

  /**
   * Ativa o formulário e o botão correspondente, alternando entre Login e Registro.
   * @param {HTMLElement} formToShow - O formulário a ser exibido (loginForm ou registerForm).
   * @param {HTMLElement} buttonToActivate - O botão a ser ativado (showLoginButton ou showRegisterButton).
   */
  function activateForm(formToShow, buttonToActivate) {
    loginForm.classList.remove("active")
    registerForm.classList.remove("active")
    showLoginButton.classList.remove("active")
    showRegisterButton.classList.remove("active")

    formToShow.classList.add("active")
    buttonToActivate.classList.add("active")
  }

  /**
   * Alterna a visibilidade da senha nos campos de input.
   * @param {Event} event - O evento de clique no ícone do olho.
   */
  function togglePasswordVisibility(event) {
    const icon = event.currentTarget
    const targetId = icon.dataset.target
    const passwordField = document.getElementById(targetId)
    const iconElement = icon.querySelector("i")

    if (passwordField.type === "password") {
      passwordField.type = "text"
      iconElement.classList.remove("fa-eye")
      iconElement.classList.add("fa-eye-slash")
    } else {
      passwordField.type = "password"
      iconElement.classList.remove("fa-eye-slash")
      iconElement.classList.add("fa-eye")
    }
  }

  // --- Lógica de Submissão de Formulários ---

  /**
   * Lida com a submissão do formulário de LOGIN.
   * Simula a autenticação e salva os dados do usuário no localStorage.
   * @param {Event} e - O evento de submissão do formulário.
   */
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault() // Impede o envio padrão do formulário

    const email = loginEmailInput.value.trim()
    const password = loginPasswordInput.value.trim()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true")
      localStorage.setItem("adminEmail", email)
      localStorage.setItem("adminLoginTime", new Date().toISOString())
      alert("Login de administrador bem-sucedido!")
      window.location.href = "admin-dashboard.html"
      return
    }

    // --- SIMULAÇÃO de Autenticação ---
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      // Cria o objeto de usuário com mais detalhes para o perfil
      const user = {
        name: TEST_USERNAME,
        email: TEST_EMAIL,
        isLoggedIn: true,
        hairType: "", // Pode ser preenchido após o quiz
        hairRoutine: "", // Pode ser preenchido após o quiz
        profilePicture: DEFAULT_PROFILE_PICTURE, // Define uma imagem padrão
        quizHistory: [], // Inicializa um array vazio para o histórico de quizzes
      }
      localStorage.setItem("loggedInUser", JSON.stringify(user)) // Salva no localStorage

      alert("Login bem-sucedido! Bem-vindo(a) de volta à Mawira!")
      window.location.href = "perfil.html" // Redireciona para a página de perfil
    } else {
      alert("E-mail ou senha incorretos. Por favor, tente novamente.")
    }
  })

  /**
   * Lida com a submissão do formulário de REGISTRO (Simulado).
   * @param {Event} e - O evento de submissão do formulário.
   */
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault() // Impede o envio padrão

    const name = registerNameInput.value.trim()
    const email = registerEmailInput.value.trim()
    const password = registerPasswordInput.value
    const confirmPassword = confirmPasswordInput.value

    // --- Validação Básica dos Campos ---
    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos para criar sua conta.")
      return
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem! Por favor, verifique.")
      return
    }
    if (password.length < 6) {
      // Exemplo de validação de senha forte
      alert("A senha deve ter no mínimo 6 caracteres.")
      return
    }
    if (!agreeTermsCheckbox.checked) {
      alert("Você deve concordar com os Termos de Uso e Política de Privacidade para criar sua conta.")
      return
    }

    // --- SIMULAÇÃO DE CADASTRO ---
    // Em um site real, você enviaria esses dados para um servidor para criar a conta.
    // Aqui, apenas alertamos o sucesso e voltamos para o formulário de login.
    console.log("Dados de registro a serem enviados (simulados):", { name, email, password: "***(oculta)***" })

    alert("Conta criada com sucesso! Agora você pode fazer login.")
    registerForm.reset() // Limpa o formulário de registro
    agreeTermsCheckbox.checked = false // Desmarca o checkbox
    activateForm(loginForm, showLoginButton) // Ativa o formulário de login para que o usuário possa logar
  })

  // --- Adição de Event Listeners Iniciais ---
  showLoginButton.addEventListener("click", () => activateForm(loginForm, showLoginButton))
  showRegisterButton.addEventListener("click", () => activateForm(registerForm, showRegisterButton))
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", togglePasswordVisibility)
  })

  // --- Inicialização: Garante que o formulário de login esteja ativo ao carregar a página ---
  activateForm(loginForm, showLoginButton)
})
