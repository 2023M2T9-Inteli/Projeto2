const url = `/ticket/pendente`;

fetch(url)
    .then((response) => response.json())
    .then((data) => {
        const ticketModelo = document.getElementById('ticketModelo');

        data.forEach((item) => {
            const novoTicket = ticketModelo.cloneNode(true);
            novoTicket.removeAttribute('id');
            novoTicket.style.display = '';

            const tituloTabela = novoTicket.querySelector('#tituloTabela');
            tituloTabela.textContent = item.nome_tabela;

            const nomeSolicitante = novoTicket.querySelector('#nomeSolicitante');
            nomeSolicitante.textContent = item.nome;

            const motivoSolicitacao = novoTicket.querySelector('#motivoSolicitacao');
            motivoSolicitacao.textContent = item.motivo;

            const emailSolicitante = novoTicket.querySelector('#emailSolicitante');
            emailSolicitante.textContent = item.email;

            const resumoTicket = novoTicket.querySelector('#resumoTicket');
            resumoTicket.innerHTML = item.resumo;

            const updateTicket = novoTicket.querySelector('#updateTicket');
            updateTicket.textContent = item.update_query;

            const botaoVerTicket = novoTicket.querySelector('.verTicket');
            const iconeTicket = botaoVerTicket.querySelector('.iconeVerTicket');
            const conteudoTicketContainer = novoTicket.querySelector('.conteudoTicket');

            conteudoTicketContainer.style.display = 'none';

            botaoVerTicket.addEventListener('click', () => {
                if (conteudoTicketContainer.style.display === 'none') {
                    conteudoTicketContainer.style.display = '';
                    iconeTicket.classList.remove('fa-circle-arrow-down');
                    iconeTicket.classList.add('fa-circle-arrow-up');
                } else {
                    conteudoTicketContainer.style.display = 'none';
                    iconeTicket.classList.remove('fa-circle-arrow-up');
                    iconeTicket.classList.add('fa-circle-arrow-down');
                }
            });

            const botaoApagarTicket = novoTicket.querySelector('.escolhaRejeitar');

            botaoApagarTicket.addEventListener('click', () => {
                fetch('/ticket/apagar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_ticket: item.id_ticket })
                })
                    .catch(error => {
                        // Trata erros de requisição
                        console.error('Erro:', error);
                    });
            })

            const botaoAprovarTicket = novoTicket.querySelector('.escolhaAprovar');

            botaoAprovarTicket.addEventListener('click', () => {
                fetch('/ticket/aprovar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_ticket: item.id_ticket,
                    update_query: item.update_query
                    })
                })
                    .catch(error => {
                        // Trata erros de requisição
                        console.error('Erro:', error);
                    });
            })

            ticketsSolicitados.appendChild(novoTicket);
        });
    })
    .catch((error) => {
        console.error('Ocorreu um erro na requisição:', error);
    });

const botaoEditarTicket = novoTicket.querySelector('.editarTicket');

botaoEditarTicket.addEventListener('click', () => {
   
})