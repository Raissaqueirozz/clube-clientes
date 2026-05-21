const listaClientes = document.getElementById('listaClientes');
const pesquisa = document.getElementById('pesquisa');

let clientes = [];

async function carregarClientes(){
    const resposta = await fetch('https://clube-clientes-production.up.railway.app/clientes');
    clientes = await resposta.json();
    mostrarClientes(clientes);
}

function mostrarClientes(lista){
    listaClientes.innerHTML = '';

    lista.forEach(cliente => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.endereco || '-'}</td>
            <td>${new Date(cliente.data_cadastro).toLocaleString('pt-BR')}</td>
        `;

        listaClientes.appendChild(tr);
    });
}

pesquisa.addEventListener('input', () => {
    const termo = pesquisa.value.toLowerCase();

    const filtrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.telefone.includes(termo)
    );

    mostrarClientes(filtrados);
});

carregarClientes();