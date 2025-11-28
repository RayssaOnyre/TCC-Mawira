document.addEventListener('DOMContentLoaded', function() {
    // Adiciona funcionalidades do menu hamburger se não estiverem já em script.js
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');

    if (hamburgerMenu && navList) {
        hamburgerMenu.addEventListener('click', function() {
            navList.classList.toggle('open');
        });

        // Fechar o menu ao clicar em um item (opcional, se o menu cobrir a tela toda)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('open');
            });
        });
    }

    // Lidar com o envio do formulário de contato
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Você pode adicionar validações extras aqui antes de "enviar"
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                alert('Por favor, preencha todos os campos do formulário.');
                return; // Impede a continuação se campos estiverem vazios
            }

            // Exemplo de como você enviaria os dados (apenas para demonstração)
            // Na vida real, você enviaria esses dados para um servidor usando Fetch API ou XMLHttpRequest
            console.log('Dados do formulário a serem enviados:');
            console.log('Nome:', name);
            console.log('Email:', email);
            console.log('Assunto:', subject);
            console.log('Mensagem:', message);

            // Simula um envio bem-sucedido
            alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');

            // Opcional: Limpar o formulário após o envio
            contactForm.reset();
        });
    }
});
