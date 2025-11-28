document.addEventListener("DOMContentLoaded", () => {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
  if (!isAdminLoggedIn) {
    window.location.href = "admin-login.html"
    return
  }

  const navItems = document.querySelectorAll(".nav-item")
  const contentSections = document.querySelectorAll(".content-section")
  const sectionTitle = document.getElementById("sectionTitle")
  const logoutBtn = document.getElementById("logoutBtn")

  // Posts
  const newPostBtn = document.getElementById("newPostBtn")
  const postModal = document.getElementById("postModal")
  const postForm = document.getElementById("postForm")
  const postsContainer = document.getElementById("postsContainer")

  // Quizzes
  const newQuizBtn = document.getElementById("newQuizBtn")
  const quizModal = document.getElementById("quizModal")
  const quizForm = document.getElementById("quizForm")
  const quizzesContainer = document.getElementById("quizzesContainer")
  const addQuestionBtn = document.getElementById("addQuestionBtn")
  const questionsListContainer = document.querySelector(".questions-list")

  const closeModalBtns = document.querySelectorAll(".close-modal, [data-modal]")

  const actionCards = document.querySelectorAll(".action-card")

  let currentEditingPostId = null
  let currentEditingQuizId = null

  if (!localStorage.getItem("mawira_blog_posts")) {
    localStorage.setItem("mawira_blog_posts", JSON.stringify([]))
  }
  if (!localStorage.getItem("mawira_quizzes")) {
    localStorage.setItem("mawira_quizzes", JSON.stringify([]))
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const section = item.dataset.section
      switchSection(section)
    })
  })

  function switchSection(section) {
    navItems.forEach((nav) => nav.classList.remove("active"))
    contentSections.forEach((content) => content.classList.remove("active"))

    const activeNav = document.querySelector(`[data-section="${section}"]`)
    const activeSection = document.getElementById(`${section}Section`)

    if (activeNav && activeSection) {
      activeNav.classList.add("active")
      activeSection.classList.add("active")

      const titles = {
        overview: "Visão Geral",
        posts: "Posts do Blog",
        quizzes: "Quizzes",
      }
      sectionTitle.textContent = titles[section] || "Dashboard"

      if (section === "posts") loadPosts()
      if (section === "quizzes") loadQuizzes()
    }
  }

  actionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const action = card.dataset.action
      if (action === "new-post") {
        openPostModal()
      } else if (action === "new-quiz") {
        openQuizModal()
      }
    })
  })

  logoutBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja sair do painel administrativo?")) {
      localStorage.removeItem("isAdminLoggedIn")
      localStorage.removeItem("adminEmail")
      localStorage.removeItem("adminLoginTime")
      window.location.href = "admin-login.html"
    }
  })

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal
      if (modalId) {
        document.getElementById(modalId).classList.remove("active")
      }
    })
  })
  ;[postModal, quizModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
      }
    })
  })

  // ===== POSTS =====

  function openPostModal(postId = null) {
    currentEditingPostId = postId
    const modalTitle = document.getElementById("postModalTitle")

    if (postId) {
      modalTitle.textContent = "Editar Post"
      loadPostData(postId)
    } else {
      modalTitle.textContent = "Novo Post"
      postForm.reset()
    }

    postModal.classList.add("active")
  }

  function loadPostData(postId) {
    const posts = JSON.parse(localStorage.getItem("mawira_blog_posts") || "[]")
    const post = posts.find((p) => p.id === postId)

    if (post) {
      document.getElementById("postTitle").value = post.title
      document.getElementById("postCategory").value = post.categories[0] || ""
      document.getElementById("postImage").value = post.image
      document.getElementById("postExcerpt").value = post.excerpt
      document.getElementById("postContent").value = post.content
    }
  }

  newPostBtn.addEventListener("click", () => openPostModal())

  postForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const title = document.getElementById("postTitle").value.trim()
    const category = document.getElementById("postCategory").value
    const image = document.getElementById("postImage").value.trim()
    const excerpt = document.getElementById("postExcerpt").value.trim()
    const content = document.getElementById("postContent").value.trim()

    const posts = JSON.parse(localStorage.getItem("mawira_blog_posts") || "[]")

    if (currentEditingPostId) {
      const index = posts.findIndex((p) => p.id === currentEditingPostId)
      if (index !== -1) {
        posts[index] = {
          ...posts[index],
          title,
          categories: [category],
          image,
          excerpt,
          content,
          meta: `Atualizado em ${new Date().toLocaleDateString("pt-BR")}`,
        }
      }
    } else {
      const newPost = {
        id: "post-" + Date.now(),
        title,
        meta: `Publicado em ${new Date().toLocaleDateString("pt-BR")}`,
        image,
        categories: [category],
        excerpt,
        content,
      }
      posts.unshift(newPost)
    }

    localStorage.setItem("mawira_blog_posts", JSON.stringify(posts))
    postModal.classList.remove("active")
    postForm.reset()
    loadPosts()
    updateStats()
    alert(currentEditingPostId ? "Post atualizado com sucesso!" : "Post criado com sucesso!")
  })

  function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("mawira_blog_posts") || "[]")

    if (posts.length === 0) {
      postsContainer.innerHTML =
        '<p style="color: #718096; text-align: center; padding: 40px;">Nenhum post criado ainda. Clique em "Novo Post" para começar.</p>'
      return
    }

    postsContainer.innerHTML = posts
      .map(
        (post) => `
            <div class="item-card">
                <div class="item-info">
                    <h3>${post.title}</h3>
                    <p>${post.meta} • ${post.categories[0]}</p>
                </div>
                <div class="item-actions">
                    <button class="icon-btn edit-btn" onclick="window.editPost('${post.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-btn" onclick="window.deletePost('${post.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  window.editPost = (postId) => openPostModal(postId)

  window.deletePost = (postId) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      const posts = JSON.parse(localStorage.getItem("mawira_blog_posts") || "[]")
      const filtered = posts.filter((p) => p.id !== postId)
      localStorage.setItem("mawira_blog_posts", JSON.stringify(filtered))
      loadPosts()
      updateStats()
      alert("Post excluído com sucesso!")
    }
  }

  // ===== QUIZZES =====

  let questionCount = 0

  function openQuizModal(quizId = null) {
    currentEditingQuizId = quizId
    const modalTitle = document.getElementById("quizModalTitle")
    questionCount = 0
    questionsListContainer.innerHTML = ""

    if (quizId) {
      modalTitle.textContent = "Editar Quiz"
      loadQuizData(quizId)
    } else {
      modalTitle.textContent = "Novo Quiz"
      quizForm.reset()
      questionsListContainer.innerHTML = ""
    }

    quizModal.classList.add("active")
  }

  function loadQuizData(quizId) {
    const quizzes = JSON.parse(localStorage.getItem("mawira_quizzes") || "[]")
    const quiz = quizzes.find((q) => q.id === quizId)

    if (quiz) {
      document.getElementById("quizTitle").value = quiz.title
      document.getElementById("quizDescription").value = quiz.description

      quiz.questions.forEach((question, index) => {
        addQuestionField(question, index)
      })
    }
  }

  newQuizBtn.addEventListener("click", () => openQuizModal())

  addQuestionBtn.addEventListener("click", () => addQuestionField())

  function addQuestionField(questionData = null, index = null) {
    const questionIndex = index !== null ? index : questionCount++
    const questionDiv = document.createElement("div")
    questionDiv.className = "question-item"
    questionDiv.dataset.index = questionIndex

    questionDiv.innerHTML = `
            <div class="question-header">
                <h4>Pergunta ${questionIndex + 1}</h4>
                <button type="button" class="remove-question-btn" onclick="this.closest('.question-item').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <input type="text" class="question-text" placeholder="Digite a pergunta" value="${questionData?.question || ""}" required>
            </div>
            <div class="answers-list" data-question="${questionIndex}">
                ${
                  questionData
                    ? questionData.answers
                        .map(
                          (ans, i) => `
                    <div class="answer-item">
                        <input type="text" placeholder="Resposta ${i + 1}" value="${ans.text}" required>
                        <input type="number" placeholder="Pontos" value="${ans.points}" min="0" required>
                        <button type="button" class="remove-answer-btn" onclick="this.closest('.answer-item').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `,
                        )
                        .join("")
                    : ""
                }
            </div>
            <button type="button" class="add-answer-btn" onclick="window.addAnswerField(${questionIndex})">
                <i class="fas fa-plus"></i> Adicionar Resposta
            </button>
        `

    questionsListContainer.appendChild(questionDiv)
  }

  window.addAnswerField = (questionIndex) => {
    const answersList = document.querySelector(`.answers-list[data-question="${questionIndex}"]`)
    const answerCount = answersList.children.length + 1

    const answerDiv = document.createElement("div")
    answerDiv.className = "answer-item"
    answerDiv.innerHTML = `
            <input type="text" placeholder="Resposta ${answerCount}" required>
            <input type="number" placeholder="Pontos" value="0" min="0" required>
            <button type="button" class="remove-answer-btn" onclick="this.closest('.answer-item').remove()">
                <i class="fas fa-times"></i>
            </button>
        `

    answersList.appendChild(answerDiv)
  }

  quizForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const title = document.getElementById("quizTitle").value.trim()
    const description = document.getElementById("quizDescription").value.trim()

    const questions = []
    document.querySelectorAll(".question-item").forEach((questionDiv, index) => {
      const questionText = questionDiv.querySelector(".question-text").value.trim()
      const answerItems = questionDiv.querySelectorAll(".answer-item")

      const answers = []
      answerItems.forEach((answerItem) => {
        const inputs = answerItem.querySelectorAll("input")
        answers.push({
          text: inputs[0].value.trim(),
          points: Number.parseInt(inputs[1].value) || 0,
        })
      })

      if (questionText && answers.length > 0) {
        questions.push({
          question: questionText,
          answers: answers,
        })
      }
    })

    if (questions.length === 0) {
      alert("Adicione pelo menos uma pergunta com respostas!")
      return
    }

    const quizzes = JSON.parse(localStorage.getItem("mawira_quizzes") || "[]")

    if (currentEditingQuizId) {
      const index = quizzes.findIndex((q) => q.id === currentEditingQuizId)
      if (index !== -1) {
        quizzes[index] = {
          ...quizzes[index],
          title,
          description,
          questions,
        }
      }
    } else {
      const newQuiz = {
        id: "quiz-" + Date.now(),
        title,
        description,
        questions,
        createdAt: new Date().toISOString(),
      }
      quizzes.unshift(newQuiz)
    }

    localStorage.setItem("mawira_quizzes", JSON.stringify(quizzes))
    quizModal.classList.remove("active")
    quizForm.reset()
    questionsListContainer.innerHTML = ""
    loadQuizzes()
    updateStats()
    alert(currentEditingQuizId ? "Quiz atualizado com sucesso!" : "Quiz criado com sucesso!")
  })

  function loadQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem("mawira_quizzes") || "[]")

    if (quizzes.length === 0) {
      quizzesContainer.innerHTML =
        '<p style="color: #718096; text-align: center; padding: 40px;">Nenhum quiz criado ainda. Clique em "Novo Quiz" para começar.</p>'
      return
    }

    quizzesContainer.innerHTML = quizzes
      .map(
        (quiz) => `
            <div class="item-card">
                <div class="item-info">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.questions.length} perguntas • ${quiz.description}</p>
                </div>
                <div class="item-actions">
                    <button class="icon-btn edit-btn" onclick="window.editQuiz('${quiz.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-btn" onclick="window.deleteQuiz('${quiz.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  window.editQuiz = (quizId) => openQuizModal(quizId)

  window.deleteQuiz = (quizId) => {
    if (confirm("Tem certeza que deseja excluir este quiz?")) {
      const quizzes = JSON.parse(localStorage.getItem("mawira_quizzes") || "[]")
      const filtered = quizzes.filter((q) => q.id !== quizId)
      localStorage.setItem("mawira_quizzes", JSON.stringify(filtered))
      loadQuizzes()
      updateStats()
      alert("Quiz excluído com sucesso!")
    }
  }

  function updateStats() {
    const posts = JSON.parse(localStorage.getItem("mawira_blog_posts") || "[]")
    const quizzes = JSON.parse(localStorage.getItem("mawira_quizzes") || "[]")

    document.getElementById("totalPosts").textContent = posts.length
    document.getElementById("totalQuizzes").textContent = quizzes.length
  }

  updateStats()
  loadPosts()
})
