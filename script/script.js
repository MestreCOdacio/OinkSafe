// Aguarda o documento carregar para evitar erros caso o JS carregue antes do HTML
document.addEventListener("DOMContentLoaded", function() {
    
    // Configuração do Gráfico de Pizza (Despesas por categoria)
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Alimentação', 'Cofrinho', 'Contas', 'Transporte', 'Lazer'],
            datasets: [{
                data: [20, 10, 30, 15, 25],
                backgroundColor: [
                    '#B02626', // Vermelho (Alimentação)
                    '#EBE81B', // Amarelo (Cofrinho)
                    '#29A643', // Verde (Contas)
                    '#2954A6', // Azul (Transporte)
                    '#A02BA8'  // Roxo (Lazer)
                ],
                borderWidth: 1,
                borderColor: '#EAD0A5' // Mesma cor do fundo do card para dar o espaçamento
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: "'Nunito', sans-serif", size: 12 },
                        color: '#3A4B7C',
                        boxWidth: 15
                    }
                }
            }
        }
    });

    // Configuração do Gráfico de Barras (Gastos mensais)
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abri', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Gastos',
                data: [60, 40, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Alturas aproximadas
                backgroundColor: '#4A5CC0', // Azul das barras
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // Oculta a legenda superior
            },
            scales: {
                y: {
                    display: false, // Oculta os números do eixo Y
                    beginAtZero: true
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Nunito', sans-serif", weight: 'bold' },
                        color: '#3A4B7C'
                    }
                }
            }
        }
    });
});