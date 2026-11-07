const api = 'https://pokeapi.co/api/v2/pokemon/';
const campoPesquisa = document.getElementById('campo-pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');
const listaSugestoes = document.getElementById('lista-sugestoes');
const mensagemErro = document.getElementById('mensagem-erro');

const imgNormal = document.getElementById('img-normal-pokemon');
const imgShiny = document.getElementById('img-shiny-pokemon');

const pokemonNumero = document.getElementById('pokemon-numero');
const pokemonNome = document.getElementById('pokemon-nome');
const pokemonTipagem = document.getElementById('pokemon-tipagem');
const pokemonPeso = document.getElementById('pokemon-peso');
const pokemonAltura = document.getElementById('pokemon-altura');
const pokemonRegiao = document.getElementById('pokemon-regiao');
const listaStats = document.getElementById('lista-stats');

const botaoUm = document.getElementById('botao-um');
const botaoDois = document.getElementById('botao-dois');
const botaoTres = document.getElementById('botao-tres');
const botaoQuatro = document.getElementById('botao-quatro');
const botaoCinco = document.getElementById('botao-cinco');
const botaoSeis = document.getElementById('botao-seis');
const botaoSete = document.getElementById('botao-sete');
const botaoOito = document.getElementById('botao-oito');
const botaoNove = document.getElementById('botao-nove');
const botaoZero = document.getElementById('botao-zero');
const botaoDelete = document.getElementById('botao-delete');
const botaoApagarTudo = document.getElementById('botao-apagar-tudo');

const botaoVoltarDez = document.getElementById('botao-voltar-dez')
const botaoAnterior = document.getElementById('botao-anterior');
const botaoProximo = document.getElementById('botao-proximo');
const botaoAvancarDez = document.getElementById('botao-avancar-dez');

const idMinimo = 1;
const idMaximo = 1025;
let idAtual = null;
let cry = null;
let listaNomes = [];

async function buscarPokemon(buscar)
{
    const resposta = await fetch(api + buscar);

    if (!resposta.ok) {
        throw new Error("Pokémon não encontrado");
    }

    const infoPokemon = await resposta.json();
    return infoPokemon;
}

async function buscarRegiao(buscar)
{
    const resposta = await fetch(buscar);

    if (!resposta.ok) {
        throw new Error("Região não encontrada");
    }

    const infoRegiao = await resposta.json();
    return infoRegiao;
}

function exibirPokemon(info)
{
    idAtual = info.id;
    pokemonNumero.textContent = '#' + info.id;
    pokemonNome.textContent = capitalizarNome(info.name);
    pokemonTipagem.textContent = info.types.map(function (item)
    {
        return capitalizarNome(item.type.name);
    }).join(", ");
    imgNormal.src = info.sprites.other.showdown.front_default;
    imgShiny.src = info.sprites.other.showdown.front_shiny;
    cry = info.cries.latest;
    pokemonPeso.textContent = converterPeso(info.weight) + " kg";
    pokemonAltura.textContent = converterAltura(info.height) + " m";
    exibirStats(info.stats);
}

function exibirStats(arrayStats)
{
    listaStats.innerHTML = '';
    arrayStats.forEach(function (item)
    {
        const linha = document.createElement("li");
        linha.textContent = capitalizarNome(item.stat.name + ": " + item.base_stat);
        listaStats.appendChild(linha);
    });
}

function exibirRegiao(infoRegiao)
{
    const geracao = infoRegiao.generation.name;

    if (geracao === 'generation-i') { pokemonRegiao.textContent = 'Kanto'; }
    else if (geracao === 'generation-ii') { pokemonRegiao.textContent = 'Johto';}
    else if (geracao === 'generation-iii') { pokemonRegiao.textContent = 'Hoenn';}
    else if (geracao === 'generation-iv') { pokemonRegiao.textContent = 'Sinnoh';}
    else if (geracao === 'generation-v') { pokemonRegiao.textContent = 'Unova';}
    else if (geracao === 'generation-vi') { pokemonRegiao.textContent = 'Kalos';}
    else if (geracao === 'generation-vii') { pokemonRegiao.textContent = 'Alola';}
    else if (geracao === 'generation-viii') { pokemonRegiao.textContent = 'Galar';}
    else if (geracao === 'generation-ix') { pokemonRegiao.textContent = 'Paldea';}
    else { pokemonRegiao.textContent = 'Desconhecida';}
}

function exibirErro(mensagem)
{
    mensagemErro.textContent = mensagem;
}

function converterPeso(pesoHectogramas)
{
    return pesoHectogramas / 10;
}

function converterAltura(alturaDecimetros)
{
    return alturaDecimetros / 10;
}

function capitalizarNome(palavra)
{
    const partesPalavra = palavra.split('-');
    let resultado = '';
    for (let i = 0; i < partesPalavra.length; i++)
    {
        if (i > 0)
        {
            resultado = resultado + '-';
        }
        resultado = resultado + partesPalavra[i].charAt(0).toUpperCase() + partesPalavra[i].slice(1)
    }
    return resultado;
}

async function carregarPokemon(consulta)
{
    try {
        const dados = await buscarPokemon(consulta);
        const dadosRegiao = await buscarRegiao(dados.species.url);
        exibirErro('');
        exibirPokemon(dados);
        exibirRegiao(dadosRegiao);

    } catch (erro) {
        exibirErro(erro.message || 'Erro ao buscar o Pokémon');
    }
}

function pesquisar()
{
    const texto = campoPesquisa.value.trim().toLowerCase();
    listaSugestoes.innerHTML = '';
    if (texto === "") {
        exibirErro("Digite o número ou o nome de um Pokémon");
        return;
    }
    carregarPokemon(texto);
}

async function carregarListaNomes()
{
    const resposta = await fetch(api + '?limit=1025');
    if (!resposta.ok)
    {
        return
    }
    const dados = await resposta.json();
    dados.results.forEach(function (item)
    {
        listaNomes.push(item.name);
    });
}

function filtrarNomes()
{
    const texto = campoPesquisa.value.trim().toLowerCase();
    listaSugestoes.innerHTML = '';

    if (texto === '' || !isNaN(texto))
    {
        return;
    }
    const resultado = listaNomes.filter(function (nome)
    {
        return nome.includes(texto);
    });
    resultado.slice(0, 5).forEach(function (nome)
    {
        const sugestao = document.createElement('div');
        sugestao.className = 'sugestao';
        sugestao.textContent = capitalizarNome(nome);
        sugestao.addEventListener('click', function ()
        {
            campoPesquisa.value = nome;
            listaSugestoes.innerHTML = '';
            carregarPokemon(nome);
        });
        listaSugestoes.appendChild(sugestao);
    });
}

campoPesquisa.addEventListener('input', filtrarNomes);
carregarListaNomes();

//Teclado Numérico
function digitarNumero(numero)
{
    if (campoPesquisa.value.length < 4)
    {
        campoPesquisa.value = campoPesquisa.value + numero;
    }
    campoPesquisa.focus();
}

function apagarUltimo()
{
    campoPesquisa.value = campoPesquisa.value.slice(0, -1);
    campoPesquisa.focus();
}

function apagarTudo()
{
    campoPesquisa.value = '';
    campoPesquisa.focus();
}

botaoUm.addEventListener('click', function () { digitarNumero('1'); });
botaoDois.addEventListener('click', function () { digitarNumero('2'); });
botaoTres.addEventListener('click', function () { digitarNumero('3'); });
botaoQuatro.addEventListener('click', function () { digitarNumero('4'); });
botaoCinco.addEventListener('click', function () { digitarNumero('5'); });
botaoSeis.addEventListener('click', function () { digitarNumero('6'); });
botaoSete.addEventListener('click', function () { digitarNumero('7'); });
botaoOito.addEventListener('click', function () { digitarNumero('8'); });
botaoNove.addEventListener('click', function () { digitarNumero('9'); });
botaoZero.addEventListener('click', function () { digitarNumero('0'); });
botaoDelete.addEventListener('click', apagarUltimo);
botaoApagarTudo.addEventListener('click', apagarTudo);



function proximoPokemon()
{
    if (idAtual !== null && idAtual < idMaximo) {
        carregarPokemon(idAtual + 1);
    }
}

function avancarDezPokemon()
{
    if (idAtual !== null && idAtual < idMaximo) {
        carregarPokemon(idAtual + 10);
    }
}

function pokemonAnterior()
{
    if (idAtual !== null && idAtual > idMinimo) {
        carregarPokemon(idAtual - 1);
    }
}

function voltarDezPokemon()
{
    if (idAtual !== null && idAtual > idMinimo) {
        carregarPokemon(idAtual - 10);
    }
}

botaoPesquisa.addEventListener('click', pesquisar);
campoPesquisa.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter')
    {
        pesquisar();
    }
});

botaoProximo.addEventListener('click', proximoPokemon);
botaoAvancarDez.addEventListener('click', avancarDezPokemon);
botaoAnterior.addEventListener('click', pokemonAnterior);
botaoVoltarDez.addEventListener('click', voltarDezPokemon);

function reproduzirCry()
{
    if(cry !== null)
    {
        const audio = new Audio(cry);
        audio.volume = 0.3;
        audio.play();
    }
}

imgNormal.addEventListener('click', reproduzirCry);
imgShiny.addEventListener('click', reproduzirCry);

carregarPokemon(idMinimo);