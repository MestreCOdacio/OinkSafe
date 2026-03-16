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
    const btnEntrar = document.getElementById('btn-nav-entrar'); 

    if (sessao && btnEntrar) {
        const primeiroNome = sessao.nome.split(' ')[0];
        btnEntrar.classList.remove('btn-entrar');
        btnEntrar.style.border = "none";
        btnEntrar.innerHTML = `
            <span class="fw-bold text-dark me-2">Olá, ${primeiroNome}</span>
            <button onclick="fazerLogout()" class="btn btn-sm btn-outline-danger" style="border-radius: 10px;">Sair</button>
        `;
        btnEntrar.href = "#";
        btnEntrar.onclick = function(e) { e.preventDefault(); };
    }
}

// 5. Função para proteger botões e exibir o Modal bonito
function protegerBotoesPrivados() {
    const elementosRestritos = document.querySelectorAll('.restricted-action');

    elementosRestritos.forEach(elemento => {
        elemento.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão de cliques e links
            
            // Verifica o login EXATAMENTE no momento do clique (mais seguro)
            const isLogado = localStorage.getItem('sessao_oinksafe') !== null;
            
            if (!isLogado) {
                // Se NÃO estiver logado -> Abre modal de aviso
                const avisoEl = document.getElementById('modalAvisoLogin');
                if (avisoEl) {
                    const modalAviso = bootstrap.Modal.getOrCreateInstance(avisoEl);
                    modalAviso.show();
                } else {
                    console.error("ERRO: Modal de aviso não encontrado no HTML!");
                }
            } 
            else {
                // Se ESTIVER logado -> Identifica qual botão foi clicado
                if (this.id === 'btn-add-deposito') {
                    const depEl = document.getElementById('modalAddDeposito');
                    if (depEl) {
                        const modalDep = bootstrap.Modal.getOrCreateInstance(depEl);
                        modalDep.show();
                    } else {
                        console.error("ERRO: Modal de Depósito não encontrado no HTML!");
                    }
                } 
                else if (this.id === 'btn-add-gasto') {
                    const gastoEl = document.getElementById('modalAddGasto');
                    if (gastoEl) {
                        const modalGasto = bootstrap.Modal.getOrCreateInstance(gastoEl);
                        modalGasto.show();
                    } else {
                        console.error("ERRO: Modal de Gasto não encontrado no HTML!");
                    }
                } 
                else if (this.tagName === 'A' && this.getAttribute('href') !== '#') {
                    // Se for um link da navbar (como "Metas"), deixa o usuário ir para a página
                    window.location.href = this.getAttribute('href');
                }
            }
        });
    });
}

// Atualiza o ouvinte de eventos para rodar as duas funções quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    checarEstadoLogin();
    protegerBotoesPrivados(); // Essa é a linha que estava faltando para o código dos modais ligar
});