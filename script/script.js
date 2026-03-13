document.addEventListener("DOMContentLoaded", function() {
    
    // Verifica se há alguém logado
    const sessao = JSON.parse(localStorage.getItem('sessao_oinksafe'));
    const isLogado = sessao !== null;

    // --- LÓGICA DOS GRÁFICOS ---
    // Se não estiver logado, tudo é 0. Se estiver, carrega os dados provisórios.
    const dadosPizza = isLogado ? [20, 10, 30, 15, 25] : [0, 0, 0, 0, 0];
    const dadosBarras = isLogado ? [60, 40, 80, 70] : [0, 0, 0, 0];

    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Alimentação', 'Cofrinho', 'Contas', 'Transporte', 'Lazer'],
            datasets: [{
                data: dadosPizza,
                backgroundColor: ['#B02626', '#EBE81B', '#29A643', '#2954A6', '#A02BA8'],
                borderWidth: 1,
                borderColor: '#EAD0A5' 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { font: { family: "'Nunito', sans-serif", size: 12 }, color: '#3A4B7C', boxWidth: 15 } }
            }
        }
    });

    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Mar', 'Abri', 'Mai', 'Jun'],
            datasets: [{
                label: 'Gastos',
                data: dadosBarras,
                backgroundColor: '#4A5CC0',
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false, beginAtZero: true },
                x: { grid: { display: false }, ticks: { font: { family: "'Nunito', sans-serif", weight: 'bold' }, color: '#3A4B7C' } }
            }
        }
    });

    // --- LÓGICA DAS METAS ---
    carregarMetas();
});

// Função que renderiza os cards na tela
function carregarMetas() {
    const container = document.getElementById('container-metas');
    if (!container) return;

    const sessao = JSON.parse(localStorage.getItem('sessao_oinksafe'));
    container.innerHTML = ''; // Limpa os cards atuais

    // Se NÃO estiver logado
    if (!sessao) {
        container.innerHTML = `
            <div class="col-12 text-center mt-4">
                <h5 class="text-muted">Faça login na sua conta para criar e visualizar suas metas!</h5>
            </div>
        `;
        return; // Para a execução da função aqui
    }

    // Se ESTIVER logado, busca os dados da conta
    let usuariosDB = JSON.parse(localStorage.getItem('usuarios_oinksafe')) || [];
    let usuarioAtual = usuariosDB.find(user => user.email === sessao.email);

    if (!usuarioAtual) return;

    // 1. Sempre renderiza primeiro o Card de "Adicionar" (+)
    container.innerHTML = `
        <div class="col-md-4">
            <div class="card card-meta card-add-meta d-flex justify-content-center align-items-center h-100" data-bs-toggle="modal" data-bs-target="#modalNovaMeta">
                <span class="plus-icon">+</span>
            </div>
        </div>
    `;

    // 2. Renderiza as metas reais criadas pelo usuário
    const metas = usuarioAtual.metas || [];
    
    metas.forEach(meta => {
        // Calcula a porcentagem para a barra de progresso
        const porcentagem = meta.objetivo > 0 ? Math.round((meta.guardou / meta.objetivo) * 100) : 0;
        
        // Se a cor escolhida for o Azul Escuro, o texto precisa ser branco para dar leitura
        const corTexto = meta.cor === '#3A4B7C' ? 'text-white' : '';
        const corLink = meta.cor === '#3A4B7C' ? 'text-white' : 'var(--dark-blue)';

        const cardHTML = `
        <div class="col-md-4">
            <div class="card card-meta d-flex flex-column" style="background-color: ${meta.cor};">
                <h4 class="${corTexto}">${meta.nome}</h4>
                <p class="mb-0 ${corTexto}">Objetivo: R$${parseFloat(meta.objetivo).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                <p class="mb-3 ${corTexto}">Guardou: R$${parseFloat(meta.guardou).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                
                <div class="d-flex align-items-center mt-3">
                    <div class="progress progress-custom w-100">
                        <div class="progress-bar progress-bar-custom" role="progressbar" style="width: ${porcentagem}%; background-color: var(--azul-escuro);"></div>
                    </div>
                    <span class="progress-text ${corTexto}">${porcentagem}%</span>
                </div>
                
                <div class="text-end mt-3">
                    <a href="cofrinho.html" class="text-decoration-none fw-bold detalhe-link" style="color: ${corLink}; font-size: 0.95rem;">
                        Detalhes &rarr;
                    </a>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// Função para salvar a meta digitada no Modal
function salvarNovaMeta() {
    const nome = document.getElementById('nomeMeta').value.trim();
    const valor = parseFloat(document.getElementById('valorMeta').value);
    
    // Identifica qual cor foi marcada nas bolinhas (radio buttons)
    let corSelecionada = '#E2E2E2'; // Cinza Padrão
    if (document.getElementById('corRoxa').checked) corSelecionada = '#D5BDE8';
    else if (document.getElementById('corVerde').checked) corSelecionada = '#D7E5AA';
    else if (document.getElementById('corAzul').checked) corSelecionada = '#3A4B7C';

    if (!nome || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha o nome e um valor válido para a meta.");
        return;
    }

    const sessao = JSON.parse(localStorage.getItem('sessao_oinksafe'));
    if (!sessao) return;

    // Busca o banco de dados local para injetar a nova meta
    let usuariosDB = JSON.parse(localStorage.getItem('usuarios_oinksafe')) || [];
    let indexUsuario = usuariosDB.findIndex(user => user.email === sessao.email);

    if (indexUsuario !== -1) {
        // Se a propriedade "metas" não existir no usuário, cria uma array vazia
        if (!usuariosDB[indexUsuario].metas) {
            usuariosDB[indexUsuario].metas = [];
        }

        // Salva a nova meta
        usuariosDB[indexUsuario].metas.push({
            id: Date.now(),
            nome: nome,
            objetivo: valor,
            guardou: 0, // Inicia zerado, o usuário colocará o saldo depois no cofrinho
            cor: corSelecionada
        });

        // Atualiza o banco e recarrega a tela
        localStorage.setItem('usuarios_oinksafe', JSON.stringify(usuariosDB));
        
        // Limpa os campos do formulário para o próximo uso
        document.getElementById('nomeMeta').value = '';
        document.getElementById('valorMeta').value = '';

        // Recarrega os cards visualmente
        carregarMetas();
    }
}