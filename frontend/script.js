const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const dados = {

        nome: document.getElementById('nome').value,

        telefone: document.getElementById('telefone').value,

        endereco: document.getElementById('endereco').value
    };

    try {

        const resposta = await fetch(
            'http://localhost:3000/cadastro',
            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dados)
            }
        );

        const resultado = await resposta.json();

        alert(resultado.mensagem);

        form.reset();

    } catch(error){

        console.log(error);

        alert('Erro ao cadastrar');
    }
});