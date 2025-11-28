document.addEventListener('DOMContentLoaded', () => {
    const authLinkContainer = document.getElementById('authLinkContainer');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');

    // Função para atualizar o link de autenticação na navegação
    function updateAuthLink() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (loggedInUser && loggedInUser.isLoggedIn) {
            // Se o usuário estiver logado, mostra "Perfil"
            authLinkContainer.innerHTML = '<li><a href="perfil.html">Perfil</a></li>';
        } else {
            // Se não estiver logado, mostra "Fazer Login"
            authLinkContainer.innerHTML = '<li><a href="login.html">Fazer Login</a></li>';
        }

        // Adiciona classe 'active' ao link de navegação correto, baseado na página atual
        const currentPath = window.location.pathname.split('/').pop(); // Pega apenas o nome do arquivo
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && currentPath.includes(linkHref)) {
                link.classList.add('active');
            }
        });
    }

    // Lógica para o menu hambúrguer (se ainda não estiver em outro script global)
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // Chama a função para atualizar o link quando a página carrega
    updateAuthLink();

    // Opcional: Adicionar um listener para mudanças no localStorage
    // Isso seria útil se, por exemplo, o login/logout ocorresse em outra aba
    window.addEventListener('storage', (e) => {
        if (e.key === 'loggedInUser') {
            updateAuthLink();
        }
    });
});
