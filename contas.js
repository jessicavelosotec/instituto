// Contas liberadas pelo JavaScript (reserva, caso o MySQL esteja fora do ar)
const USUARIOS = [

    {
        usuario: "professor@email.com",
        senha: "1234"
    },

    {
        usuario: "admin@email.com",
        senha: "1234"
    },

    {
        usuario: "jessica@email.com",
        senha: "1234"
    }

];


// Contas criadas na tela de cadastro quando o MySQL não respondeu
const CHAVE_CONTAS = "contasCadastradas";

function lerContasLocais() {

    try {
        return JSON.parse(localStorage.getItem(CHAVE_CONTAS)) || [];
    }

    catch (erro) {
        return [];
    }

}

function salvarContaLocal(conta) {

    const contas = lerContasLocais();

    contas.push(conta);

    localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));

}

function emailJaExiste(usuario) {

    return USUARIOS
        .concat(lerContasLocais())
        .some(function (conta) {
            return conta.usuario === usuario;
        });

}
