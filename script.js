const searchForm = document.getElementById("searchForm");
const mainSearch = document.getElementById("mainSearch");
const topSearch = document.getElementById("topSearch");
const searchMessage = document.getElementById("searchMessage");
const newsCards = [...document.querySelectorAll(".news-card")];
const wikiTiles = [...document.querySelectorAll(".wiki-tile")];
const emptyStates = [...document.querySelectorAll(".empty-state")];
const accountDialog = document.getElementById("accountDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogDescription = document.getElementById("dialogDescription");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toast = document.getElementById("toast");
let toastTimer;

function avisar(mensagem) {
  toast.textContent = mensagem;
  toast.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.style.display = "none", 3200);
}

function pesquisar(valor) {
  const termo = valor.trim().toLocaleLowerCase("pt-BR");
  let encontrados = 0;

  newsCards.forEach(card => {
    const corresponde = !termo || (card.dataset.search + " " + card.textContent).toLocaleLowerCase("pt-BR").includes(termo);
    card.hidden = !corresponde;
    if (corresponde) encontrados++;
  });

  wikiTiles.forEach(tile => {
    const corresponde = !termo || (tile.dataset.name + " " + tile.textContent).toLocaleLowerCase("pt-BR").includes(termo);
    tile.hidden = !corresponde;
    if (corresponde) encontrados++;
  });

  emptyStates.forEach(state => state.hidden = encontrados !== 0);
  searchMessage.textContent = termo ? `${encontrados} resultado(s) para “${valor.trim()}”` : "";
  document.getElementById("populares").scrollIntoView({ behavior: "smooth", block: "start" });
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  pesquisar(mainSearch.value);
});

topSearch.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    mainSearch.value = topSearch.value;
    pesquisar(topSearch.value);
  }
});

mainSearch.addEventListener("input", () => {
  topSearch.value = mainSearch.value;
});

document.querySelectorAll(".show-all").forEach(button => button.addEventListener("click", () => {
  [...newsCards, ...wikiTiles].forEach(item => item.hidden = false);
  mainSearch.value = "";
  topSearch.value = "";
  searchMessage.textContent = "";
  emptyStates.forEach(state => state.hidden = true);
  avisar("Mostrando todas as notícias e wikis desta demonstração.");
}));

function abrirFormulario(modo) {
  const cadastro = modo === "cadastro";
  loginForm.hidden = cadastro;
  signupForm.hidden = !cadastro;
  dialogTitle.textContent = cadastro ? "Crie sua conta gratuita" : "Entre na Fandom";
  dialogDescription.textContent = cadastro
    ? "Crie uma conta de demonstração para experimentar esta interface."
    : "Entre para salvar suas wikis favoritas e acompanhar suas comunidades.";
  if (!accountDialog.open) accountDialog.showModal();
  setTimeout(() => (cadastro ? document.getElementById("signupName") : document.getElementById("loginEmail")).focus(), 30);
}

async function hashSenha(senha) {
  if (!window.crypto?.subtle) throw new Error("Abra o projeto pelo VS Code com Live Server para habilitar a validação segura da senha.");
  const bytes = new TextEncoder().encode(senha);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function lerContas() {
  try { return JSON.parse(localStorage.getItem("fandomDemoAccounts") || "{}"); }
  catch { return {}; }
}

document.getElementById("loginBtn").addEventListener("click", () => abrirFormulario("login"));
document.getElementById("signupBtn").addEventListener("click", () => abrirFormulario("cadastro"));
document.getElementById("showSignup").addEventListener("click", () => abrirFormulario("cadastro"));
document.getElementById("showLogin").addEventListener("click", () => abrirFormulario("login"));
document.getElementById("dialogClose").addEventListener("click", () => accountDialog.close());

signupForm.addEventListener("submit", async event => {
  event.preventDefault();
  const nome = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const senha = document.getElementById("signupPassword").value;
  const confirmar = document.getElementById("signupConfirm").value;
  if (senha !== confirmar) { avisar("As senhas não coincidem."); document.getElementById("signupConfirm").focus(); return; }
  if (senha.length < 6) { avisar("A senha precisa ter pelo menos 6 caracteres."); return; }
  try {
    const contas = lerContas();
    if (contas[email]) { avisar("Já existe uma conta de demonstração com esse e-mail."); return; }
    contas[email] = { nome, senhaHash: await hashSenha(senha) };
    localStorage.setItem("fandomDemoAccounts", JSON.stringify(contas));
    signupForm.reset();
    accountDialog.close();
    avisar(`Conta de demonstração criada! Bem-vindo(a), ${nome}.`);
  } catch (erro) { avisar(erro.message || "Não foi possível criar a conta neste navegador."); }
});

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const senha = document.getElementById("loginPassword").value;
  try {
    const conta = lerContas()[email];
    const hash = await hashSenha(senha);
    if (!conta || conta.senhaHash !== hash) { avisar("E-mail ou senha incorretos. Se ainda não tem conta, faça seu cadastro."); return; }
    sessionStorage.setItem("fandomDemoUser", JSON.stringify({ nome: conta.nome, email }));
    loginForm.reset();
    accountDialog.close();
    avisar(`Login de demonstração realizado. Olá, ${conta.nome}!`);
  } catch (erro) { avisar(erro.message || "Não foi possível entrar nesta demonstração."); }
});
document.querySelectorAll(".wiki-strip a, .sidebar a, .wiki-tile").forEach(link => {
  link.addEventListener("click", event => {
    if (link.classList.contains("wiki-tile")) {
      event.preventDefault();
      avisar(`Você selecionou a wiki ${link.dataset.name}. Esta é uma página demonstrativa.`);
    } else if (link.getAttribute("href")?.startsWith("#") && !["#inicio", "#populares"].includes(link.getAttribute("href"))) {
      event.preventDefault();
      avisar("Esta seção é ilustrativa nesta reprodução de interface.");
    }
  });
});
