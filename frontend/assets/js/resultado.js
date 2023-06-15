// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// Obtém o parâmetro id_tabela da URL
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_tabela');

// Define a url usada para a requisição
const url = `/resultado?id_tabela=${idTabela}&admin=${admin}`;

// Realiza uma requisição para obter dados da tabela 
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        // Atualiza o conteúdo no HTML com os dados do banco
        document.getElementById('tituloTabela').textContent = data[0].nome_tabela;
        document.getElementById('tituloTabelaPagina').textContent = data[0].nome_tabela;
        document.getElementById('conteudoTabela').textContent = data[0].conteudo_tabela;
        document.getElementById('conjuntoDeDados').textContent = data[0].conjunto_de_dados;
        document.getElementById('nomeDataOwner').textContent = data[0].nome_data_owner;
        document.getElementById('nomeDataSteward').textContent = data[0].nome_data_steward;
        document.getElementById('dataDeCriacao').textContent = data[0].data_de_criacao;
        document.getElementById('defasagemTabela').textContent = data[0].defasagem_tabela;
        document.getElementById('Frequencia').textContent = data[0].frequencia;
        document.getElementById('engIngestaoTabela').textContent = data[0].eng_ingestao_tabela;
        document.getElementById('infoDatabaseTabela').textContent = data[0].info_databese_tabela;
        document.getElementById('caminhoTabela').textContent = data[0].caminho_tabela;
        document.getElementById('tabelaOrigem').textContent = data[0].tabela_origem;
        document.getElementById('databaseOrigem').textContent = data[0].database_origem;
        document.getElementById('schemaOrigem').textContent = data[0].schema_origem;
        document.getElementById('sistemaOrigem').textContent = data[0].sistema_origem;
        document.getElementById('servidorOrigem').textContent = data[0].servidor_origem;
        document.getElementById('defasagemTabela2').textContent = data[0].defasagem_tabela;
        document.getElementById('Frequencia2').textContent = data[0].frequencia;
    })
    .catch((error) => {
        // Trata o erro
        console.error('Ocorreu um erro na requisição:', error);
    });

// Altera funcionalidades(classificação em estrelas e botão de solicitar acesso) na página de resultados de acordo com o valor do parâmetro admin
if (admin == "nao" || !admin) {
    // se for igual a 'nao' ou se for nulo, altera o conteúdo do elemento divFeedback para mostrar a funcionalidade de like/dislike
    let conteudo = "<div style='margin-top: 5%;'><p>Dê seu FeedBack</p></div>\n";
    conteudo += "<button title='Curti a tabela'> <i class='far tooltip-btn fa-thumbs-up'></i></button>\n";
    conteudo += "<button title='Não curti a tabela'><i class='fa-regular fa-thumbs-down'></i></button>";
    document.getElementById("divFeedback").innerHTML = conteudo;

    document.getElementById("divSolicitarAcesso").style.display = "inline-block";
} else if (admin == "sim") {
    // se for igual a 'sim', altera o conteúdo do elemento divFeedback para mostrar a funcionalidade de classificação por estrelas
    let conteudo = "<div style='margin-top: 5%;'><p>Classificar tabela:</p></div>\n";
    conteudo += `
        <div class="rate">
            <input type="radio" id="star5" name="rate" value="5" />
            <label for="star5" title="text">5 stars</label>
            <input type="radio" id="star4" name="rate" value="4" />
            <label for="star4" title="text">4 stars</label>
            <input type="radio" id="star3" name="rate" value="3" />
            <label for="star3" title="text">3 stars</label>
            <input type="radio" id="star2" name="rate" value="2" />
            <label for="star2" title="text">2 stars</label>
            <input type="radio" id="star1" name="rate" value="1" />
            <label for="star1" title="text">1 star</label>
        </div>`;

    document.getElementById("divFeedback").innerHTML = conteudo;

    document.getElementById("divSolicitarAcesso").style.display = "none";
}
