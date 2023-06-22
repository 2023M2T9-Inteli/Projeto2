const admin = new URL(window.location.href).searchParams.get("admin");
const selectors = ['form', '#pesquisa', '#resultados', '#selectConjuntoDeDados', '#selectDadosSensiveis', '#selectOwner', '#selectSteward'];
const [formulario, campoPesquisa, resultadosDiv, selectConjunto, selectDadosSensiveis, selectOwner, selectSteward] = selectors.map(s => document.querySelector(s));
const botaoVoltarPagina = document.getElementById('botaoVoltarPagina');
const botaoAvancarPagina = document.getElementById('botaoAvancarPagina');
const paginaAtualSpan = document.getElementById('paginaAtual');

let paginaAtual = 1;

function chamaPesquisa(valor) {
    if (valor == -1) {
        paginaAtual--;
    }
    else if (valor == 1) {
        paginaAtual++;
    }
    else {
        paginaAtual = 1;
    }
    pesquisa(paginaAtual);
    paginaAtualSpan.textContent = paginaAtual;
}

botaoVoltarPagina.addEventListener('click', () => {
    if (paginaAtual > 1) {
        chamaPesquisa(-1);
    }
});

botaoAvancarPagina.addEventListener('click', () => {
    chamaPesquisa(1);
});

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    chamaPesquisa();
});

function updateUrlParams(param, value) {
    let urlParams = new URLSearchParams(window.location.search);
    // Remove o parâmetro existente
    if (urlParams.has(param)) {
        urlParams.delete(param);
    }
    // Adiciona o novo valor
    urlParams.append(param, value);
    // Atualiza a URL
    window.history.replaceState({}, '', '?' + urlParams.toString());
}

const mostrarFiltro = () => {
    const filtro = document.getElementById('divDosFiltros');
    const imgDoFiltro = document.getElementById('imgDoFiltro');
    const status = filtro.style.display == 'none';
    imgDoFiltro.className = status ? 'fa-solid fa-filter-circle-xmark' : 'fa-solid fa-filter';
    filtro.style.display = status ? 'block' : 'none';
    if (!status) {
        [selectConjunto, selectDadosSensiveis, selectOwner, selectSteward].forEach((select) => (select.selectedIndex = 0));
        window.history.replaceState(null, null, window.location.pathname);
        chamaPesquisa();
        alert('O filtro foi resetado!');
    }
};

const getParameterByName = (name) => {
    const regex = new RegExp('[?&]' + name.replace(/[\[\]]/g, '\\$&') + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    return !results ? null : !results[2] ? '' : results[2];
};

const pesquisa = (paginaAtual) => {
    const termosIgnorados = ['tabela', 'de', 'e'];
    const termosPesquisa = campoPesquisa.value.trim().split(' ').filter(termo => !termosIgnorados.includes(termo.toLowerCase()));
    const termoPesquisa = termosPesquisa.join('+');
    const urlParams = new URLSearchParams(window.location.search);
    const { admin, conjuntoDeDados, dadosSensiveis, owner, steward } = Object.fromEntries(urlParams.entries());
    let url = `/pesquisa?term=${termoPesquisa}&admin=${admin}${conjuntoDeDados ? `&conjuntoDeDados=${conjuntoDeDados}` : ''}${dadosSensiveis ? `&dadosSensiveis=${dadosSensiveis}` : ''
        }${owner ? `&owner=${owner}` : ''}${steward ? `&steward=${steward}` : ''}&pagina=${paginaAtual}`;
    fetch(url)
        .then((response) => response.json())
        .then((resultados) => {
            const resultadosDiv = document.getElementById('resultados');
            if (resultadosDiv) resultadosDiv.innerHTML = '';
            resultados.forEach((resultado) => {
                const valores = Object.values(resultado).join(' ').toLowerCase();
                if (termosPesquisa.every((termo) => valores.includes(termo.toLowerCase()))) {
                    const { nome_tabela, conteudo_tabela, nome_data_owner, conjunto_de_dados, campo_estrangeiro, id_numerico } = resultado;
                    const divResultado = document.createElement('div');
                    divResultado.innerHTML = `<p>${nome_tabela}</p><span class='descricao'>Descrição: ${conteudo_tabela}</span><br>Nome Owner Tabela: ${nome_data_owner} <br>Conjunto de Dados: ${conjunto_de_dados}`;
                    divResultado.classList.add('area_resultados');
                    divResultado.addEventListener('click', () => (window.location.href = `resultado.html?id_numerico=${id_numerico}&admin=${admin}`));
                    resultadosDiv.appendChild(divResultado);
                }
            });
        });
};

campoPesquisa.addEventListener('input', () => {
    chamaPesquisa();
});

[selectConjunto, selectDadosSensiveis, selectOwner, selectSteward].forEach((select) => {
    select.addEventListener('change', (event) => {
        event.preventDefault();
        const param = select.id.replace('select', '');
        updateUrlParams(param.charAt(0).toLowerCase() + param.slice(1), select.value);
        chamaPesquisa();
        console.log(paginaAtualSpan)
    });
});

window.onload = () => {
    const searchTerm = getParameterByName('term');
    if (searchTerm) {
        document.getElementById('pesquisa').value = decodeURIComponent(searchTerm);
    }
    chamaPesquisa();
};
