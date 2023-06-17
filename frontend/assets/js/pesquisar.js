// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// seleciona o formulário da página
const formulario = document.querySelector('form');

// seleciona o campo de entrada de pesquisa na página
const campoPesquisa = document.querySelector('#pesquisa');

// seleciona a div que exibe os resultados da pesquisa na página
let resultadosDiv = document.querySelector('#resultados');

// Seleciona os elementos de dropdown
const selectConjunto = document.getElementById('selectConjunto');
const selectDadosSensiveis = document.getElementById('selectDadosSensiveis');
const selectOwner = document.getElementById('selectOwner');
const selectSteward = document.getElementById('selectSteward');

function updateUrlParams(param, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(param, value);
    window.history.replaceState(null, null, `?${urlParams.toString()}`);
    pesquisa();
}

function pesquisa() {
    const termosPesquisa = campoPesquisa.value.trim().split(" ");
    const termoPesquisa = termosPesquisa.join("+");

    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get('admin');
    const conjuntoDeDados = urlParams.get('conjuntoDeDados');
    const dadosSensiveis = urlParams.get('dadosSensiveis');
    const owner = urlParams.get('owner');
    const steward = urlParams.get('steward');

    const ordenacao = urlParams.get('ordem');
    
    let url = `/pesquisa?termo=${termoPesquisa}&admin=${admin}`;
    
    if (conjuntoDeDados) {
        url += `&conjuntoDeDados=${conjuntoDeDados}`;
    }

    if (ordenarBtn){
        url += `&ordem=${ordenacao}`;
    }

    if (dadosSensiveis) {
        url += `&dadosSensiveis=${dadosSensiveis}`;
    }

    if (steward) {
        url += `&owner=${steward}`;
    }

    if (owner) {
        url += `&owner=${owner}`;
    }

    function updateUrlParams(param, value) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(param, value);
        window.history.replaceState(null, null, `?${urlParams.toString()}`);
        pesquisa();
    }
    
    // Adiciona o evento de mudança aos elementos de dropdown
    selectConjunto.addEventListener('change', function (event) {
        event.preventDefault();
        const valorSelecionado = selectConjunto.value;
        updateUrlParams('conjuntoDeDados', valorSelecionado);
    });
    
    selectDadosSensiveis.addEventListener('change', function (event) {
        event.preventDefault();
        const valorSelecionado = selectDadosSensiveis.value;
        updateUrlParams('dadosSensiveis', valorSelecionado);
    });
    
    selectOwner.addEventListener('change', function (event) {
        event.preventDefault();
        const valorSelecionado = selectOwner.value;
        updateUrlParams('owner', valorSelecionado);
    });
    
    selectSteward.addEventListener('change', function (event) {
        event.preventDefault();
        const valorSelecionado = selectSteward.value;
        updateUrlParams('steward', valorSelecionado);
    });

    fetch(url)
        .then((response) => response.json())
        .then((resultados) => {
            if (resultadosDiv) {
                resultadosDiv.parentNode.removeChild(resultadosDiv);
            }

            resultadosDiv = document.createElement('div');
            resultadosDiv.id = 'resultados';

            resultados.forEach((resultado) => {
                const valores = Object.values(resultado).join(" ").toLowerCase();

                if (termosPesquisa.every(termo => valores.includes(termo.toLowerCase()))) {
                    const resultadoDiv = document.createElement('div');
                    const tabelaNome = document.createElement('p');
                    tabelaNome.textContent = resultado.nome_tabela;
                    resultadoDiv.appendChild(tabelaNome);

                    const descricao = document.createElement('span');
                    descricao.textContent = `Descrição: ${resultado.conteudo_tabela}`;
                    descricao.classList.add('descricao');
                    resultadoDiv.appendChild(descricao);

                    resultadoDiv.innerHTML += `<br>Nome Owner Tabela: ${resultado.nome_data_owner} <br>Conjunto de Dados: ${resultado.conjunto_de_dados} <br>Chave Primaria: ${resultado.campo_estrangeiro || 'N/A'}`;
                    resultadoDiv.classList.add('area_resultados');

                    resultadoDiv.addEventListener('click', function () {
                        exibirInformacoesTabela(resultado);
                    });

                    function exibirInformacoesTabela(resultado) {
                        // Redirecionar para a página com as informações detalhadas da tabela
                        window.location.href = `resultado.html?id_numerico=${resultado.id_numerico}&admin=${admin}`;
                    }

                    resultadosDiv.appendChild(resultadoDiv);
                }
            });

            // adiciona a nova div de resultados à página
            document.body.appendChild(resultadosDiv);
        });
}

// adiciona um ouvinte de eventos que é ativado sempre que o usuário digita algo no campo de pesquisa
campoPesquisa.addEventListener('input', pesquisa);

// Função que mostra os filtros quando clica-se no ícone de filtro
function mostrarFiltro() {
    let filtro = document.getElementById("divDosFiltros");
    let imgDoFiltro = document.getElementById("imgDoFiltro");

    if (filtro.style.display == "none") {
        imgDoFiltro.className = "fa-solid fa-filter-circle-xmark";
        filtro.style.display = "block";
    } else {
        imgDoFiltro.className = "fa-solid fa-filter";
        filtro.style.display = "none";
        selectConjunto.selectedIndex = 0;
        selectDadosSensiveis.selectedIndex = 0;
        selectOwner.selectedIndex = 0;
        selectSteward.selectedIndex = 0;
        window.history.replaceState(null, null, window.location.pathname);
        pesquisa()
        alert("O filtro foi resetado!")
    }
}

let ordenarBtn = true;

// Função que altera o ícone da funcionalidade de ordenamento
function mostrarFiltroRating() {
    let imgDoFiltroRating = document.getElementById("imgDoFiltroRating");
    if (imgDoFiltroRating.className == "fa-solid fa-arrow-up-wide-short") {
        imgDoFiltroRating.className = "fa-solid fa-arrow-down-wide-short";
        ordenarBtn = false
        updateUrlParams('ordem', ordenarBtn);
        pesquisa()
    } else { 
        imgDoFiltroRating.className = "fa-solid fa-arrow-up-wide-short";
        ordenarBtn = true
        updateUrlParams('ordem', ordenarBtn);
        pesquisa()
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return results[2];
}

window.onload = function () {
    var searchTerm = getParameterByName('term');
    var inputPesquisa = document.getElementById('pesquisa');
    if (searchTerm) {
        inputPesquisa.value = decodeURIComponent(searchTerm);
        pesquisa();
    }
};