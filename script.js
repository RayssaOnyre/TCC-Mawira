// global.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Comuns (Header, Menu Hamburguer) ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');
    const profileLinkContainer = document.getElementById('profileLinkContainer');

    // Hamburger menu toggle
    if (hamburgerMenu && navList) {
        hamburgerMenu.addEventListener('click', () => {
            navList.classList.toggle('open');
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('open')) {
                    navList.classList.remove('open');
                }
            });
        });
    }

    // --- Função para Atualizar o Link do Perfil/Login no Cabeçalho ---
    function updateHeaderProfileLink() {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (profileLinkContainer) {
            if (currentUser && currentUser.name) {
                // Usuário logado: mostra ícone de perfil e nome
                profileLinkContainer.innerHTML = `
                    <a href="perfil.html" class="nav-profile-link">
                        <i class="fas fa-user-circle"></i> Olá, ${currentUser.name.split(' ')[0]}
                    </a>
                `;
            } else {
                // Usuário NÃO logado: mostra botão de login
                profileLinkContainer.innerHTML = `
                    <a href="login.html" class="btn btn-login">Fazer Login</a>
                `;
            }
        }
    }

    // **CHAMADA INICIAL**: Garante que o cabeçalho seja atualizado ao carregar QUALQUER página.
    // Se não houver 'loggedInUser', mostrará "Fazer Login".
    updateHeaderProfileLink();

    // --- Torna updateHeaderProfileLink acessível globalmente ---
    // Isso é crucial para que login.js e profile.js possam chamá-la.
    window.updateHeaderProfileLink = updateHeaderProfileLink;

    // --- Lógica do Modal de Boas-Vindas (se existir na página) ---
    // Mantenho aqui por ser uma funcionalidade que pode estar em qualquer página inicial.
    const welcomeModal = document.getElementById('welcomeModal');
    const logoMawira = document.getElementById('logoMawira'); // Presume que a logo pode abrir o modal
    if (welcomeModal) {
        const closeModalButton = document.querySelector('.modal .close-button');
        const btnModalClose = document.querySelector('.btn-modal-close');

        if (!sessionStorage.getItem('mawiraWelcomeShown')) {
            welcomeModal.style.display = 'flex';
            sessionStorage.setItem('mawiraWelcomeShown', 'true');
        }

        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => { welcomeModal.style.display = 'none'; });
        }
        if (btnModalClose) {
            btnModalClose.addEventListener('click', () => { welcomeModal.style.display = 'none'; });
        }
        window.addEventListener('click', (event) => {
            if (event.target === welcomeModal) { welcomeModal.style.display = 'none'; }
        });
        if (logoMawira) {
            logoMawira.addEventListener('click', (e) => {
                e.preventDefault();
                welcomeModal.style.display = 'flex';
            });
        }
    }

    // --- Lógica do Carrossel (apenas para index.html) ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length > 0 && window.location.pathname.includes('index.html')) { // Confere a página
        let currentItem = 0;
        function showNextItem() {
            carouselItems[currentItem].classList.remove('active');
            currentItem = (currentItem + 1) % carouselItems.length;
            carouselItems[currentItem].classList.add('active');
        }
        setInterval(showNextItem, 5000);
    }

    // --- Lógica de Smooth Scroll (âncoras) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href').length > 1 && !anchor.closest('.carousel-nav')) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
                    window.scrollTo({ top: targetElement.offsetTop - headerHeight, behavior: 'smooth' });
                }
            });
        }
    });

    // --- Lógica de PROTEÇÃO DE ROTA para perfil.html ---
    // Esta é a parte crítica para garantir que o perfil só abre após o login.
    if (window.location.pathname.includes('perfil.html')) {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!currentUser || !currentUser.name) {
            window.location.href = 'login.html'; // Redireciona para o login
            // NÃO coloque "return" aqui, pois o redirecionamento já encerra a execução efetivamente.
        }
    }
});
