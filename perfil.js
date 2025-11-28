document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos do DOM do Perfil ---
  const profileAvatarImg = document.getElementById("profileAvatarImg")
  const avatarUploadInput = document.getElementById("avatarUpload")

  const userNameDisplay = document.getElementById("userNameDisplay")
  const userNameInput = document.getElementById("userNameInput")
  const editUserNameButton = document.getElementById("editUserNameButton")

  const userEmailDisplay = document.getElementById("userEmailDisplay")
  const hairTypeDisplay = document.getElementById("hairTypeDisplay")

  const hairTypeSelect = document.getElementById("hairTypeSelect")
  const hairRoutineElement = document.getElementById("hairRoutine")
  const completeQuizButton = document.getElementById("completeQuizButton")

  const quizHistoryList = document.getElementById("quizHistoryList")
  const noHistoryMessage = quizHistoryList ? quizHistoryList.querySelector(".no-history-message") : null
  const viewAllQuizzesButton = document.getElementById("viewAllQuizzesButton")

  // Novos botões de navegação
  const viewHistoryButton = document.getElementById("viewHistoryButton")
  const editProfileButton = document.getElementById("editProfileButton")
  const changePasswordButton = document.getElementById("changePasswordButton")
  const deactivateAccountButton = document.getElementById("deactivateAccountButton")
  const logoutButton = document.getElementById("logoutButton")

  let loggedInUser = null // Variável para armazenar os dados do usuário logado

  // --- Dados Simulados (para teste) ---
  const simulatedQuizzes = [
    { id: 1, title: "Quiz Tipo de Cabelo (Crespo)", date: "10/06/2024", resultLink: "quizzes.html?result=type-crespo" },
    {
      id: 2,
      title: "Quiz Rotina Capilar (Nutrição)",
      date: "28/05/2024",
      resultLink: "quizzes.html?result=routine-nutricao",
    },
    {
      id: 3,
      title: "Quiz Saúde do Couro Cabeludo",
      date: "15/05/2024",
      resultLink: "quizzes.html?result=scalp-health",
    },
  ]
  // Adicionando um usuário de teste mais completo para simular dados existentes
  const TEST_USER_DATA = {
    name: "Usuário Teste",
    email: "teste@mawira.com.br",
    isLoggedIn: true,
    hairType: "crespo", // Simulando um tipo de cabelo salvo
    hairRoutine: "Rotina de nutrição profunda, lavagem 2x semana, hidratação e umectação.", // Simulando uma rotina
    profilePicture: "https://i.ibb.co/2d9yM0h/placeholder-user.jpg", // Exemplo de URL de imagem (pode ser qualquer URL de imagem real ou um placeholder seu)
    quizHistory: simulatedQuizzes, // Adiciona o histórico simulado
  }

  /**
   * Carrega e exibe os dados do perfil do usuário.
   * Redireciona para a página inicial se o usuário não estiver logado.
   */
  function loadUserProfile() {
    // Tenta carregar do localStorage, se não tiver, usa os dados de teste para simulação
    loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || TEST_USER_DATA

    // Se o usuário não estiver logado ou não houver dados, redireciona
    if (!loggedInUser || !loggedInUser.isLoggedIn) {
      alert("Você precisa estar logado(a) para acessar esta página.")
      window.location.href = "index.html"
      return // Garante que a execução da função pare aqui
    }

    // --- Atualiza o Header do Perfil ---
    userNameDisplay.textContent = `Olá, ${loggedInUser.name || "Usuário"}!`
    userNameInput.value = loggedInUser.name || ""
    userEmailDisplay.textContent = loggedInUser.email || ""

    // Foto de Perfil
    if (loggedInUser.profilePicture) {
      profileAvatarImg.src = loggedInUser.profilePicture
    }

    // --- Minhas Informações ---
    if (loggedInUser.hairType) {
      const hairTypeLabels = {
        liso: "Liso",
        ondulado: "Ondulado",
        cacheado: "Cacheado",
        crespo: "Crespo",
      }
      hairTypeDisplay.textContent = hairTypeLabels[loggedInUser.hairType] || "Tipo de cabelo definido"
      hairTypeSelect.value = loggedInUser.hairType
      completeQuizButton.innerHTML = '<i class="fas fa-clipboard-list"></i> Refazer o Quiz'
    } else {
      hairTypeDisplay.textContent = "Tipo de cabelo não definido"
      hairTypeSelect.value = ""
      completeQuizButton.innerHTML = '<i class="fas fa-clipboard-list"></i> Fazer o Quiz'
    }
    hairRoutineElement.textContent =
      loggedInUser.hairRoutine || "Sua rotina capilar aparecerá aqui após você completar um quiz."

    // --- Histórico de Quizzes ---
    renderQuizHistory(loggedInUser.quizHistory || []) // Renderiza o histórico (ou vazio se não tiver)
  }

  /**
   * Alterna entre visualização e edição do nome de usuário.
   * Salva o novo nome no localStorage.
   */
  function toggleUserNameEdit() {
    if (userNameInput.style.display === "none") {
      // Modo de edição
      userNameDisplay.style.display = "none"
      userNameInput.style.display = "inline-block"
      userNameInput.focus()
      editUserNameButton.innerHTML = '<i class="fas fa-check"></i>' // Ícone de Salvar
      editUserNameButton.title = "Salvar Nome"
    } else {
      // Modo de visualização (salvar)
      const newName = userNameInput.value.trim()
      if (newName && newName !== loggedInUser.name) {
        loggedInUser.name = newName
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
        userNameDisplay.textContent = newName
        alert("Nome de usuário atualizado com sucesso!")
      }
      userNameDisplay.style.display = "inline-block"
      userNameInput.style.display = "none"
      editUserNameButton.innerHTML = '<i class="fas fa-edit"></i>' // Ícone de Editar
      editUserNameButton.title = "Editar Nome"
    }
  }

  /**
   * Renderiza a lista de quizzes no histórico.
   * @param {Array} history - Array de objetos de quiz {id, title, date, resultLink}.
   */
  function renderQuizHistory(history) {
    if (!quizHistoryList) return

    quizHistoryList.innerHTML = ""

    if (history && history.length > 0) {
      history.forEach((quiz) => {
        const li = document.createElement("li")
        li.innerHTML = `
                    <span class="quiz-title">${quiz.title}</span>
                    <span class="quiz-date">${quiz.date}</span>
                    <a href="${quiz.resultLink}" class="link-action">Ver Resultado</a>
                `
        quizHistoryList.appendChild(li)
      })
      if (noHistoryMessage) noHistoryMessage.style.display = "none"
    } else {
      if (noHistoryMessage) {
        quizHistoryList.appendChild(noHistoryMessage)
        noHistoryMessage.style.display = "block"
      }
    }
  }

  /**
   * Lida com o upload da foto de perfil.
   * Simula o salvamento da imagem como Base64 no localStorage.
   * @param {Event} event - O evento de 'change' do input de arquivo.
   */
  function handleProfilePictureUpload(event) {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Limite de 2MB
        alert("A imagem é muito grande! Por favor, selecione uma imagem menor (máx. 2MB).")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        profileAvatarImg.src = e.target.result
        loggedInUser.profilePicture = e.target.result // Salva a imagem como base64
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
        alert("Foto de perfil atualizada!")
      }
      reader.readAsDataURL(file) // Lê o arquivo como URL de dados (base64)
    }
  }

  /**
   * Lida com a ação de logout do usuário.
   * Limpa o estado de login e redireciona para a página inicial.
   */
  function handleLogout() {
    if (loggedInUser) {
      loggedInUser.isLoggedIn = false
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
    } else {
      localStorage.removeItem("loggedInUser")
    }
    alert("Você foi desconectado(a).")
    window.location.href = "index.html"
  }

  // --- Adição de Event Listeners ---
  if (editUserNameButton) {
    editUserNameButton.addEventListener("click", toggleUserNameEdit)
  }
  if (userNameInput) {
    userNameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        toggleUserNameEdit() // Salva ao pressionar Enter no input
      }
    })
  }

  if (avatarUploadInput) {
    avatarUploadInput.addEventListener("change", handleProfilePictureUpload)
  }

  if (completeQuizButton) {
    completeQuizButton.addEventListener("click", () => {
      window.location.href = "quizzes.html"
    })
  }

  if (viewAllQuizzesButton) {
    viewAllQuizzesButton.addEventListener("click", () => {
      window.location.href = "quizzes.html#quiz-history"
    })
  }

  if (viewHistoryButton) {
    viewHistoryButton.addEventListener("click", () => {
      document.querySelector(".quiz-history-list").scrollIntoView({ behavior: "smooth" })
    })
  }

  if (editProfileButton) {
    editProfileButton.addEventListener("click", () => {
      alert('Funcionalidade "Editar Perfil" em desenvolvimento. Aqui você poderia editar mais informações do perfil.')
    })
  }

  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", () => {
      alert(
        'Funcionalidade "Alterar Senha" em desenvolvimento. Você seria redirecionado para uma página de alteração de senha.',
      )
    })
  }

  if (deactivateAccountButton) {
    deactivateAccountButton.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.")) {
        alert('Funcionalidade "Desativar Conta" em desenvolvimento.')
      }
    })
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout)
  }

  // --- Inicialização: Carrega os dados do perfil quando a página é totalmente carregada ---
  loadUserProfile()
})
