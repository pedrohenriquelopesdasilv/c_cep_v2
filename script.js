// Contantes de elementos que vamos interagir
const selectedUf = document.getElementById('uf');
const inputCidade = document.getElementById('cidade');
const inputRua = document.getElementById('rua');

const btnBuscar = document.getElementById('btnBuscar');
const divMensagem = document.getElementById('mensagem');
const divResultado = document.getElementById('resultado');

const containerLista = document.getElementById('listaResultados');

// Adicionando os eventos nos componentes
btnBuscar.addEventListener('click', buscarEndereco);

[selectedUf, inputCidade, inputRua].forEach(campo => {
    campo.addEventListener('keypress', (tecla) => {
        if(tecla.key === 'Enter'){
            buscarEndereco();
        }
    });
});


async function buscarEndereco() {
    const valorUf = selectedUf.value.trim();
    const valorCidade = inputCidade.value.trim();
    const valorRua = inputRua.value.trim();

    esconderElemento(divMensagem);
    esconderElemento(divResultado);
    containerLista.innerHTML = '';

    // Validações do CEP
    if(!valorUf){
        mostrarMensagem('Por favor, selecione o Estado (UF).', 'erro');
        selectedUf.focus();
        return;
    }

    if(valorCidade.length < 3){
        mostrarMensagem('Por favor, informe a Cidade com no mínimo 3 caracteres', 'erro');
        inputCidade.focus();
        return;
    }

    if(valorRua.length < 3){
        mostrarMensagem('Por favor, informe Rua/Logradouro com no mínimo 3 caracteres.', 'erro');
        inputRua.focus();
        return;
    }

    mostrarMensagem('Buscando endereço...', 'info');

    try {

        const cidadeFormatada = encodeURIComponent(valorCidade);
        const ruaFormatada = encodeURIComponent(valorRua);

        const url = `https://viacep.com.br/ws/${valorUf}/${cidadeFormatada}/${ruaFormatada}/json/`;

        const resposta = await fetch(url);


        if (!resposta.ok) {
            throw new Error(`Falha na requisição. Codigo de status: ${resposta.status} `);

        }

        const enderecos = await resposta.json();

        if (!Array.isArray(enderecos) || enderecos.length === 0) {
            mostrarMensagem('Nenhum CEP/endereço encontrado para os dados informados.', 'erro');
            return;
        }

        enderecos.forEach((intemEndereco) => {
            const card = document.createElement('div');
            card.className = 'item-endereco';

            card.innerHTML = `
                <pclass="destaque-cep>⚽CEP:${intemEndereco.cep}</p>
                <p><strong>Logradouro:</strong> ${intemEndereco.logradouro || 'Não informado'}</p>
                <p><strong>Bairro:</strong> ${intemEndereco.bairro || 'Não informado'}</p>
                <p><strong>Cidade/UF:</strong> ${intemEndereco.localidade} - ${intemEndereco.uf}</p>
                <p><strong>Complemento:</strong> ${intemEndereco.complemento ? intemEndereco.complemento : 'Nenhum'}</p>

            `;

            containerLista.appendChild(card);
        })

        esconderElemento(divMensagem);
        divResultado.classList.remove('oculto');

    } catch (erro) {
        console.error('Erro na requisição: ', erro);
        mostrarMensagem('Erro de conexão ao buscar CEP, Tente novamente mais tarde.', 'erro');
    }
}

// Funções Auxiliares
function mostrarMensagem(texto, tipo){
    divMensagem.textContent = texto;
    divMensagem.className = `mensagem ${tipo}`;
}

function esconderElemento(elemento){
    elemento.classList.add('oculto');
}  