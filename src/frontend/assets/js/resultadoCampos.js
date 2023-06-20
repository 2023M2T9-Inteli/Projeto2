// Pega o parâmetro admin da url e armazea na variável Admin
const urladmin = new URL(window.location.href);
const Admin = urladmin.searchParams.get("admin");
const id_numerico = urladmin.searchParams.get('id_numerico');

// Obtém a referência do elemento com id 'Geral'
const geral = document.getElementById('Geral');

// Obtém a referência do elemento com id 'Tabela'
const tabela = document.getElementById('Campos');

// Função chamada para alterar a tela quando o usuário clica em tabela
function mudarTelaGeral() {
    // Obtém a referência do elemento com id 'Geral'
    var classeGeral = document.getElementById('Geral');

    // Obtém o valor do atributo 'href' do elemento
    var hrefGeral = classeGeral.href;

    // Obtém o parâmetro 'id_numerico' da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const idTabela = urlParams.get('id_numerico');

    // Codifica o valor do parâmetro 'id_tabela' para uso na URL
    const encodedIdTabela = encodeURIComponent(idTabela);

    // Atualiza o valor do atributo 'href' para redirecionar para a página 'resultado.html' com o parâmetro 'id_numerico'
    hrefGeral = `/resultado.html?id_numerico=${encodedIdTabela}&admin=${Admin}`;

    // Redireciona o usuário para a página 'resultado.html'
    window.location.href = hrefGeral;
}

// Função chamada para alterar a tela quando o usuário clica em campos
function mudarTelaTabela() {
    // Obtém a referência do elemento com id 'Tabela'
    var classeCampos = document.getElementById('Campos');

    // Obtém o valor do atributo 'href' do elemento
    var hrefCampos = classeCampos.href;

    // Obtém o parâmetro 'id_numerico' da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const idTabela = urlParams.get('id_numerico');

    // Codifica o valor do parâmetro 'id_tabela' para uso na URL
    const encodedIdTabela = encodeURIComponent(idTabela);

    // Atualiza o valor do atributo 'href' para redirecionar para a página 'tabela.html' com o parâmetro 'id_tabela'.
    hrefCampos = `/campos.html?id_numerico=${encodedIdTabela}&admin=${Admin}`;

    // Redireciona o usuário para a página 'tabela.html'.
    window.location.href = hrefCampos;
}

// Função chamada para redirecionar o usuário quando clicar para solicitar um ticket.
function solicitarTicket() {
    // Obtém o parâmetro 'id_tabela' da URL atual.
    const urlParams = new URLSearchParams(window.location.search);
    const idTabela = urlParams.get('id_numerico');

    // Codifica o valor do parâmetro 'id_tabela' para uso na URL.
    const encodedIdTabela = encodeURIComponent(idTabela);

    // Define a URL da página 'ticketPessoa.html' com o parâmetro 'id_numerico'.
    href = `/ticketPessoa.html?id_numerico=${encodedIdTabela}&admin=${Admin}`

    // Redireciona o usuário para a URL definida na variável href.
    window.location.href = href;
}

// Altera funcionalidades(classificação em estrelas e botão de solicitar acesso) na página de resultados de acordo com o valor do parâmetro admin 
if (Admin == "nao" || !Admin) {
    // se for igual a 'nao' ou se for nulo, altera o conteúdo do elemento divFeedback para mostrar a funcionalidade de like/dislike
    let conteudo = "<div style='margin-top: 5%;'><p>Dê seu FeedBack</p></div>\n";
    conteudo += "<button title='Curti a tabela'> <i class='far tooltip-btn fa-thumbs-up'></i></button>\n";
    conteudo += "<button title='Não curti a tabela'><i class='fa-regular fa-thumbs-down'></i></button>";
    document.getElementById("divFeedback").innerHTML = conteudo;

    document.getElementById("divSolicitarAcesso").style.display = "inline-block";
} else if (Admin == "sim") {
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

/* Declaração da variável qtdEstrelas, que guarda a quantidade de estrelas da tabela */
var qtdEstrelas;

/* Definição da variável urlClassificacao, referente ao endpoint de SELECT da quantidade de estrelas da tabela */
const urlClassificacao = '/estrelinhas/' + id_numerico;

/* Definições das variáveis referentes aos inputs das estrelinhas */
const star1 = document.getElementById('star1');
const star2 = document.getElementById('star2');
const star3 = document.getElementById('star3');
const star4 = document.getElementById('star4');
const star5 = document.getElementById('star5');

/* Definição da função que verifica se existe uma classificação anterior referente à tabela e, de acordo com isso, preenche as estrelinhas */
const verificarClassificacaoAnterior = async () => {
    const classificacaoAnterior = await fetch(urlClassificacao);
    const classificacaoJson = await classificacaoAnterior.json();

    switch (classificacaoJson[0].classificacao_admin) {
        case 1:
            star1.checked = true;
            break;
        case 2:
            star2.checked = true;
            break;
        case 3:
            star3.checked = true;
            break;
        case 4:
            star4.checked = true;
            break;
        case 5:
            star5.checked = true;
            break;
    }
}
verificarClassificacaoAnterior();

/* Definição da função que verifica se existe uma classificação anterior referente à tabela e atribui o valor na variável qtdEstrelas */
const pegarClassificacaoAnterior = async () => {
    const response = await fetch(urlClassificacao);
    const json = await response.json();
    console.log(json);
    qtdEstrelas = json[0].classificacao_admin;
    console.log(qtdEstrelas);
}
pegarClassificacaoAnterior();

/* Definição da função que realiza uma requisição PUT para realizar o UPDATE conforme o valor de qtdEstrelas */
const atualizarClassificacao = (starValue) => {
    const body = `id_numerico=${id_numerico}&classificacao_admin=${starValue}`;
    fetch('/attclassificacao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    })
        .catch(err => console.log(err));
}

/* Definição da função que cria um event listener de click para as estrelinhas */
const iniciarListener = (star, value) => {
    star.addEventListener('click', () => {
        pegarClassificacaoAnterior();
        atualizarClassificacao(value);
    });
};

iniciarListener(star1, 1);
iniciarListener(star2, 2);
iniciarListener(star3, 3);
iniciarListener(star4, 4);
iniciarListener(star5, 5);