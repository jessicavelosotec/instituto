const form         = document.getElementById("cadastroForm");
const campoEmail   = document.getElementById("email");
const campoSenha   = document.getElementById("senha");
const campoConfirmar = document.getElementById("confirmar");
const mensagem     = document.getElementById("erro");
const btnCadastrar = document.getElementById("btnCadastrar");
const btnCancelar  = document.getElementById("btnCancelar");


function mostrarMensagem(texto, ok) {

    mensagem.textContent = texto;

    mensagem.classList.toggle("ok", Boolean(ok));

}


function voltarParaLogin() {

    window.location.href = "index.html";

}


// CANCELAR: volta para a tela de login
btnCancelar.addEventListener("click", voltarParaLogin);


form.addEventListener("submit", async function (event) {

    event.preventDefault();
    mostrarMensagem("");

    const usuario   = campoEmail.value.trim().toLowerCase();
    const senha     = campoSenha.value;
    const confirmar = campoConfirmar.value;


    // ---------- validações ----------

    if (!usuario || !senha || !confirmar) {
        mostrarMensagem("Preencha todos os campos.");
        return;
    }

    if (!campoEmail.checkValidity()) {
        mostrarMensagem("Digite um email válido.");
        campoEmail.focus();
        return;
    }

    if (senha.length < 4) {
        mostrarMensagem("A senha precisa ter pelo menos 4 caracteres.");
        campoSenha.focus();
        return;
    }

    if (senha !== confirmar) {
        mostrarMensagem("As senhas não são iguais.");
        campoConfirmar.value = "";
        campoConfirmar.focus();
        return;
    }

    if (emailJaExiste(usuario)) {
        mostrarMensagem("Este email já está cadastrado.");
        campoEmail.focus();
        return;
    }


    btnCadastrar.disabled = true;


    // ========================================
    // 1. TENTA CADASTRAR NO MYSQL
    // ========================================

    try {

        const resposta = await fetch("/cadastro", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                usuario: usuario,
                senha: senha
            })

        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            finalizar();
            return;
        }

        // O servidor respondeu e recusou (ex.: email já existe no banco)
        btnCadastrar.disabled = false;
        mostrarMensagem(dados.mensagem || "Não foi possível cadastrar.");
        return;

    }

    catch (erro) {

        console.log("Servidor/MySQL indisponível.");

    }


    // ========================================
    // 2. SEM SERVIDOR: GUARDA PELO JAVASCRIPT
    // ========================================

    salvarContaLocal({
        usuario: usuario,
        senha: senha
    });

    finalizar();

});


function finalizar() {

    mostrarMensagem("Cadastro realizado! Redirecionando para o login...", true);

    btnCadastrar.disabled = true;

    setTimeout(voltarParaLogin, 1600);

}
