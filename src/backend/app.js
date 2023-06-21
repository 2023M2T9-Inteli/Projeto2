// Importação de módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Caminho do banco de dados SQLite a ser utilizado
const DBPATH = 'backend/data/catalogo_dados.db';

// Definição do hostname e porta do servidor web
const hostname = '127.0.0.1';
const port = 5500;

// Criação de uma instância do objeto "app" do Express
const app = express();

// Configuração do servidor para servir arquivos estáticos do diretório "frontend"
app.use(express.static('frontend/'));

// Configuração do servidor para lidar com requisições JSON
app.use(express.json());


// Configuração do servidor para lidar com requisições codificadas em texto simples
app.use(bodyParser.text({ type: 'text/plain' }));

// Configuração do servidor para lidar com requisições codificadas em URL
app.use(bodyParser.urlencoded({ extended: false }));

// endpoint responsável pela pesquisa
app.get('/pesquisa', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Definição da quantidade de registros por página
    const registrosPorPagina = 10;
    // Recupera o número da página a partir dos parâmetros da requisição, caso não tenha, define como 1
    const pagina = req.query.pagina ? parseInt(req.query.pagina) : 1;
    // Calcula o offset com base na página atual e a quantidade de registros por página
    const offset = (pagina - 1) * registrosPorPagina;

    // Separação dos termos de pesquisa em um array
    const termosPesquisa = req.query.termo.trim().split(" ");

    // Filtro do conjunto de dados
    const conjuntoDeDadosFiltro = req.query.conjuntoDeDados;
    const dadosSensiveisFiltro = req.query.dadosSensiveis;
    const ownerFiltro = req.query.owner;
    const ordemFiltro = req.query.ordem;

    // Criação de um array de termos com "LIKE" para a consulta SQL
    const termosLike = termosPesquisa.map((termo) => `%${termo}%`);

    // Criação de uma string com os termos de pesquisa para a cláusula "WHERE" da consulta SQL
    const termosParams = termosPesquisa
        .map(() => '(cat_dados_tabela.nome_tabela LIKE ? OR cat_dados_tabela.conjunto_de_dados LIKE ? OR cat_dados_tabela.conteudo_tabela LIKE ? OR cat_dados_owner.nome_data_owner LIKE ? COLLATE NOCASE)')
        .join(' OR ');

    let sql = `SELECT 
    cat_dados_tabela.*, cat_dados_owner.*, cat_dados_conexoes.*
FROM 
    cat_dados_tabela
    INNER JOIN cat_dados_owner ON cat_dados_tabela.conjunto_de_dados = cat_dados_owner.conjunto_de_dados
    INNER JOIN cat_dados_conexoes ON cat_dados_tabela.id_tabela = cat_dados_conexoes.id_tabela
    INNER JOIN feedback ON cat_dados_tabela.id_numerico = feedback.id_numerico`;

    const params = [...termosLike, ...termosLike, ...termosLike, ...termosLike];

    sql += ' WHERE ' + termosParams;

    if (conjuntoDeDadosFiltro) {
        sql += ' AND cat_dados_tabela.conjunto_de_dados = ?';
        params.push(conjuntoDeDadosFiltro);
    }

    if (dadosSensiveisFiltro) {
        sql += ' AND cat_dados_tabela.dados_sensiveis_tabela = ?';
        params.push(dadosSensiveisFiltro);
    }

    if (ownerFiltro) {
        sql += ' AND cat_dados_owner.nome_data_owner = ?';
        params.push(ownerFiltro);
    }

    if (ordemFiltro) {
        sql += `
            ORDER BY 
            feedback.classificacao_admin, feedback.qtd_like_colaborador DESC`;
    } else {
        sql += `
        ORDER BY 
        feedback.classificacao_admin, feedback.qtd_like_colaborador ASC`;
    }

    // Aplicação da paginação na consulta SQL com LIMIT e OFFSET
    sql += ' LIMIT ? OFFSET ?';
    params.push(registrosPorPagina);
    params.push(offset);

    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro interno do servidor.');
        }
        res.json(rows);
    });
});

app.get('/resultado', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    const idNumerico = req.query.id_numerico;

    const sql = `SELECT * FROM cat_dados_tabela JOIN cat_dados_owner ON cat_dados_tabela.conjunto_de_dados = cat_dados_owner.conjunto_de_dados JOIN cat_dados_conexoes ON cat_dados_tabela.id_tabela = cat_dados_conexoes.id_tabela WHERE cat_dados_tabela.id_numerico = ${idNumerico}`;

    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);

        // Fecha o banco
        db.close();
    });
});

app.get('/campos', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    sql = "SELECT * FROM cat_dados_variaveis JOIN cat_dados_tabela ON cat_dados_variaveis.id_tabela = cat_dados_tabela.id_tabela WHERE id_numerico=" + req.query.id_numerico;
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    // Fecha o banco
    db.close();
});

app.get('/tabela/nome', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    var sql = "SELECT nome_tabela FROM cat_dados_tabela WHERE id_numerico=" + req.query.id_numerico;
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    // Fecha o banco
    db.close();
});

// Endpoint para solicitação de ticket de alteração de dados
app.post('/ticket/solicitacao', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Separa as linhas do corpo da requisição
    const lines = req.body.split('\n');

    // Mapeia os valores a partir das linhas
    const values = lines.reduce((acc, line) => {
        const [key, value] = line.split('|');
        acc[key.trim()] = value.trim();
        return acc;
    }, {});

    // Extrai os valores individuais
    const { nome, email, motivo, id_numerico, update_query, status, resumo } = values;

    // Executa a lógica de atualização no banco de dados
    const sql = `INSERT INTO ticket (nome, email, motivo, id_numerico, update_query, status, resumo) VALUES ('${nome}', '${email}', '${motivo}', '${id_numerico}', '${update_query.replace(/'/g, "''")}', '${status}', '${resumo}')`;

    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.run(sql, [], function (err) {
        if (err) {
            throw err;
        }

        res.send('Ticket enviado com sucesso');

        // Fecha o banco
        db.close();
    });
});

app.get('/ticket/pendente', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    sql = "SELECT * FROM ticket JOIN cat_dados_tabela ON ticket.id_numerico = cat_dados_tabela.id_numerico WHERE status = 'pendente'";
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    // Fecha o banco
    db.close();
});

app.post('/ticket/apagar', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    sql = "UPDATE ticket SET status='rejeitado' WHERE id_ticket=" + req.body.id_ticket;
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); // Fecha o banco
    res.end();
});

app.post('/ticket/aprovar', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    var db = new sqlite3.Database(DBPATH); // Abre o banco

    var consultaSQL = "UPDATE ticket SET status='aprovado' WHERE id_ticket=" + req.body.id_ticket;
    var consultaUpdate = req.body.update_query;

    db.run(consultaSQL, [], erroConsulta => {
        if (erroConsulta) {
            console.error('Erro ao executar a consulta:', erroConsulta);
            res.status(500).json({ error: 'Ocorreu um erro ao aprovar o ticket.' });
            db.close();
            return;
        }

        if (consultaUpdate) {
            var queries = consultaUpdate.split(';'); // Divide as queries separadas por ponto e vírgula
            queries = queries.map(query => query.trim()); // Remove espaços em branco extras

            var totalQueries = queries.length;
            var queriesExecutadas = 0;
            var erroUpdateOcorreu = false;

            queries.forEach(query => {
                if (query) {
                    db.run(query, [], erroUpdate => {
                        queriesExecutadas++;
                        if (erroUpdate) {
                            console.error('Erro ao executar a consulta de atualização:', erroUpdate);
                            erroUpdateOcorreu = true;
                        }

                        if (queriesExecutadas === totalQueries) {
                            if (erroUpdateOcorreu) {
                                res.status(500).json({ error: 'Ocorreu um erro ao executar a consulta de atualização.' });
                            } else {
                                res.json({ message: 'Ticket aprovado com sucesso.' });
                            }
                            db.close();
                        }
                    });
                } else {
                    queriesExecutadas++;
                    if (queriesExecutadas === totalQueries) {
                        if (erroUpdateOcorreu) {
                            res.status(500).json({ error: 'Ocorreu um erro ao executar a consulta de atualização.' });
                        } else {
                            res.json({ message: 'Ticket aprovado com sucesso.' });
                        }
                        db.close();
                    }
                }
            });
        } else {
            res.json({ message: 'Ticket aprovado com sucesso.' });
            db.close();
        }
    });
});





app.get('/estrelinhas/:id', (req, res) => {
    const idClassificacao = req.params.id;
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    sql = `SELECT classificacao_admin FROM feedback WHERE id_numerico = ${idClassificacao}`;
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    // Fecha o banco
    db.close();
});

app.put('/attClassificacao', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    sql = `UPDATE feedback SET classificacao_admin = ${req.body.classificacao_admin} WHERE id_numerico = ${req.body.id_numerico};`;
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); // Fecha o banco
    res.end();
});

app.get('/joinha/:id', (req, res) => {
    const idJoinha = req.params.id;
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    sql = `SELECT qtd_like_colaborador FROM feedback WHERE id_numerico = ${idJoinha}`;
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    // Fecha o banco
    db.close();
});

app.put('/attJoinha', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    sql = `UPDATE feedback SET qtd_like_colaborador = ${req.body.qtd_like_colaborador} WHERE id_numerico = ${req.body.id_numerico};`;
    console.log(sql);
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); // Fecha o banco
    res.end();
});

// Inicialização do servidor web na porta e hostname definidos anteriormente
app.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});