// 1. Função para Cadastrar Usuário
function registrarUsuario(event) {
    event.preventDefault(); // Evita recarregar a página

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Verifica se os campos estão vazios
    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Verifica se as senhas coincidem (Pedido do seu prompt anterior)
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem. Tente novamente.");
        return;
    }

    // Pega a lista de usuários já existentes no LocalStorage (ou cria uma vazia)
    let usuariosDB = JSON.parse(localStorage.getItem('usuarios_oinksafe')) || [];

    // Verifica se o email já está cadastrado
    const emailExiste = usuariosDB.find(user => user.email === email);
    if (emailExiste) {
        alert("Este email já está cadastrado!");
        return;
    }

    // Salva o novo usuário
    const novoUsuario = { nome, email, senha };
    usuariosDB.push(novoUsuario);
    localStorage.setItem('usuarios_oinksafe', JSON.stringify(usuariosDB));

    alert("Cadastro realizado com sucesso! Faça seu login.");
    window.location.href = 'login.html'; // Redireciona para o login
}

// 2. Função para Fazer Login
function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert("Preencha email e senha!");
        return;
    }

    // Busca os usuários no LocalStorage
    let usuariosDB = JSON.parse(localStorage.getItem('usuarios_oinksafe')) || [];

    // Verifica se existe um usuário com este email e senha
    const usuarioLogado = usuariosDB.find(user => user.email === email && user.senha === senha);

    if (usuarioLogado) {
        // Salva uma "Sessão" no LocalStorage para avisar que ele está logado
        localStorage.setItem('sessao_oinksafe', JSON.stringify({ nome: usuarioLogado.nome, email: usuarioLogado.email }));
        window.location.href = 'index.html'; // Redireciona para a página inicial
    } else {
        alert("Email ou senha incorretos!");
    }
}

// 3. Função para Fazer Logout (Sair)
window.fazerLogout = function() {
    localStorage.removeItem('sessao_oinksafe');
    window.location.reload(); // Recarrega a página para o botão "Entrar" voltar
}

// 4. Função para alterar a Navbar se o usuário estiver logado
function checarEstadoLogin() {
    const sessao = JSON.parse(localStorage.getItem('sessao_oinksafe'));
    const btnEntrar = document.getElementById('btn-nav-entrar'); // ID que vamos colocar no index.html

    if (sessao && btnEntrar) {
        // Pega apenas o primeiro nome para não quebrar o layout
        const primeiroNome = sessao.nome.split(' ')[0];
        
        // Remove a classe de botão tradicional e muda o visual para o Nome + Botão de Sair
        btnEntrar.classList.remove('btn-entrar');
        btnEntrar.style.border = "none";
        btnEntrar.innerHTML = `
            <span class="fw-bold text-dark me-2">Olá, ${primeiroNome}</span>
            <button onclick="fazerLogout()" class="btn btn-sm btn-outline-danger" style="border-radius: 10px;">Sair</button>
        `;
        // Remove o link original
        btnEntrar.href = "#";
        btnEntrar.onclick = function(e) { e.preventDefault(); };
    }
}

// Roda a checagem de login sempre que a página for carregada
document.addEventListener('DOMContentLoaded', checarEstadoLogin);