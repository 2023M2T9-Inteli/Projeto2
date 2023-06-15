// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// Obtém o parâmetro id_tabela e id_ticket da URL
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_numerico');

// Define a url usada para a requisição do titulo da tabela.
const url = `/tabela/nome?id_numerico=${idTabela}`;

// Realiza uma requisição para obter dados da tabela.
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        // Atualiza o título da tabela no HTML de acordo com o banco de dados.
        document.getElementById('tituloTabela').textContent = data[0].nome_tabela;
    })
    .catch((error) => {
        // Trata erros de requisição.
        console.error('Erro:', error);
    });

// Recupera e armazena em variáveis as informações armazenadas no local storage.
var resumo = localStorage.getItem('resumoAlteracoes');

// Obtém uma referência para o elemento HTML com o id "resumoAlteracoes"
var elementoResumo = document.getElementById("resumoAlteracoes");

// Atualiza o conteúdo do elemento HTML com o valor da variável 'resumo'
elementoResumo.innerHTML = resumo;

function enviarTicket() {
    var updateQuery = localStorage.getItem('updateQuery');
    var nome = localStorage.getItem('nome');
    var email = localStorage.getItem('email');
    var motivo = localStorage.getItem('motivo');

    const body = `nome|${nome}\nemail|${email}\nmotivo|${motivo}\nid_numerico|${idTabela}\nupdate_query|${updateQuery}\nstatus|pendente\nresumo|${resumo}`;

    fetch('/ticket/solicitacao', {
        // Define o método, tipo de conteúdo e as informações a serem enviadas.
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: body

    })
        .catch(error => {
            // Trata erros de requisição
            console.error('Erro:', error);
        });

    acionarPopup();
}

function enviarEmail(email, assunto, mensagem) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
        to: email,
        from: 'nicollasisaac012@gmail.com',
        subject: assunto,
        text: mensagem,
    };

    sgMail.send(msg).then(() => {
        console.log('Email enviado com sucesso');
    }).catch((error) => {
        console.error('Erro ao enviar o email:', error);
    });
}
