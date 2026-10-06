// As contas do JavaScript ficam em contas.js 
 
const form        = document.getElementById("loginForm"); 
const campoEmail  = document.getElementById("email"); 
const campoSenha  = document.getElementById("senha"); 
const mensagem    = document.getElementById("erro"); 
const btnEntrar   = document.getElementById("btnEntrar"); 
const btnCancelar = document.getElementById("btnCancelar"); 
const btnFechar   = document.getElementById("btnFechar");
 
function mostrarErro(texto) { 
    mensagem.textContent = texto; 
} 
 
 
// CANCELAR: limpa os campos e a mensagem 
btnCancelar.addEventListener("click", function () { 
    form.reset(); 
    mostrarErro(""); 
    campoEmail.focus(); 
}); 

// FECHAR (X): Redireciona para a tela inicial do instituto
if (btnFechar) {
    btnFechar.addEventListener("click", function () {
        window.location.href = "instituto.html";
    });
}
 
form.addEventListener("submit", async function (event) { 
    event.preventDefault(); 
    mostrarErro(""); 
 
    const usuario = campoEmail.value.trim().toLowerCase(); 
    const senha   = campoSenha.value; 
 
    if (!usuario || !senha) { 
        mostrarErro("Preencha o email e a senha."); 
        return; 
    } 
 
    btnEntrar.disabled = true; 
 
    // 1. TENTA LOGIN PELO MYSQL 
    try { 
        const resposta = await fetch("/login", { 
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
            liberarAcesso(); 
            return; 
        } 
    } catch (erro) { 
        console.log("Servidor/MySQL indisponível."); 
    } 
 
    // 2. TENTA LOGIN PELO JAVASCRIPT 
    const usuarioEncontrado = USUARIOS.concat(lerContasLocais()).find(function (conta) { 
        return ( 
            conta.usuario === usuario && 
            conta.senha === senha 
        ); 
    }); 
 
    if (usuarioEncontrado) { 
        liberarAcesso(); 
        return; 
    } 
 
    // Nenhum dos dois aceitou 
    btnEntrar.disabled = false; 
    mostrarErro("Usuário ou senha incorretos!"); 
    campoSenha.value = ""; 
    campoSenha.focus(); 
});