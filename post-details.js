document.addEventListener('DOMContentLoaded', () => {
    // === Lógica de Avaliação em Estrelas ===
    const starRatingContainer = document.querySelector('.star-rating');
    const stars = document.querySelectorAll('.star-rating .star');
    const averageRatingSpan = document.getElementById('averageRating');
    const totalRatingsSpan = document.getElementById('totalRatings');
    const postId = starRatingContainer ? starRatingContainer.dataset.postId : null;

    let userRating = 0; // Avaliação definida pelo usuário atual
    let postRatings = {}; // Armazena todas as avaliações para este post (simulado)

    // Carrega avaliações do localStorage (simulado)
    if (postId) {
        postRatings = JSON.parse(localStorage.getItem(`ratings_${postId}`)) || { count: 0, sum: 0 };
        updateAverageRatingDisplay();
    }

    // Função para preencher as estrelas visualmente
    function fillStars(rating) {
        stars.forEach((star, index) => {
            const icon = star.querySelector('i');
            if (index < rating) {
                icon.classList.remove('far'); // Remove estrela vazia
                icon.classList.add('fas'); // Adiciona estrela preenchida
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far'); // Adiciona estrela vazia
            }
        });
    }

    // Função para atualizar a exibição da avaliação média
    function updateAverageRatingDisplay() {
        if (postRatings.count > 0) {
            const average = (postRatings.sum / postRatings.count).toFixed(1);
            averageRatingSpan.textContent = average;
            totalRatingsSpan.textContent = postRatings.count;
        } else {
            averageRatingSpan.textContent = '0.0';
            totalRatingsSpan.textContent = '0';
        }
    }

    if (starRatingContainer) {
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.dataset.value);
                fillStars(value); // Preenche as estrelas até o valor do hover
                stars.forEach((s, i) => {
                    if (i < value) s.classList.add('hovered'); // Adiciona classe de hover
                });
            });

            star.addEventListener('mouseout', () => {
                fillStars(userRating); // Volta para a avaliação selecionada pelo usuário
                stars.forEach(s => s.classList.remove('hovered')); // Remove classe de hover
            });

            star.addEventListener('click', () => {
                userRating = parseInt(star.dataset.value);
                fillStars(userRating);

                // Simula salvamento da avaliação (em um app real, envia para o backend)
                // Isto é simplificado; um backend real armazenaria a avaliação específica do usuário
                postRatings.sum += userRating;
                postRatings.count++;
                localStorage.setItem(`ratings_${postId}`, JSON.stringify(postRatings));
                updateAverageRatingDisplay();
                alert(`Você avaliou com ${userRating} estrelas!`);
            });
        });

        // Inicializa as estrelas com a avaliação do usuário se já existir
        // Ou deixa vazias/média se não houver avaliação específica do usuário
        // Para simplicidade, apenas exibe a média ou 0.0 no carregamento inicial.
        fillStars(userRating); // Inicia com 0 estrelas preenchidas pelo usuário
    }

    // === Lógica de Comentários ===
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.getElementById('commentsContainer');
    const commentsCountSpan = document.getElementById('commentsCount');
    const commentNameInput = document.getElementById('commentName');
    const commentTextInput = document.getElementById('commentText');

    let comments = []; // Armazena comentários para este post específico

    // Carrega comentários do localStorage (simulado)
    const storedComments = localStorage.getItem(`comments_${postId}`);
    if (storedComments) {
        comments = JSON.parse(storedComments);
        renderComments();
    }

    // Renderiza os comentários na página
    function renderComments() {
        commentsContainer.innerHTML = ''; // Limpa comentários existentes
        if (comments.length === 0) {
            commentsContainer.innerHTML = `<li class="no-comments-message">Nenhum comentário ainda. Seja o primeiro!</li>`;
        } else {
            comments.forEach(comment => {
                const commentElement = document.createElement('li');
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">${comment.name}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
        commentsCountSpan.textContent = comments.length;
    }

    // Lida com o envio do formulário de comentários
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = commentNameInput.value.trim();
        const text = commentTextInput.value.trim();

        if (!name || !text) {
            alert('Por favor, preencha seu nome e o comentário.');
            return;
        }

        const newComment = {
            name: name,
            text: text,
            date: new Date().toLocaleDateString('pt-BR') // Formata a data
        };

        comments.push(newComment);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(comments)); // Salva no localStorage (backend simulado)

        renderComments(); // Atualiza a lista de comentários na UI
        commentForm.reset(); // Limpa o formulário
        alert('Comentário enviado com sucesso!'); // Sucesso simulado
    });
});
