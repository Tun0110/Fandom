# Fandom — reprodução demonstrativa

Projeto de estudo com HTML, CSS e JavaScript inspirado na interface da Fandom.

## Como executar
1. Extraia o ZIP.
2. Abra a pasta no VS Code.
3. Execute `index.html` com a extensão Live Server (recomendado).

## Login e cadastro
- Os botões **ENTRAR** e **CRIAR UMA CONTA GRATUITA** abrem formulários separados.
- O cadastro valida os campos, confirma se as senhas coincidem e guarda um registo de demonstração no `localStorage`.
- O login verifica a conta de demonstração criada neste navegador.
- A senha é guardada como hash SHA-256, não como texto simples. Mesmo assim, isto **não é autenticação de produção**: o projeto é apenas front-end e os dados podem ser alterados pelo utilizador no navegador.
- Para uma aplicação real, use um backend, armazenamento seguro de senhas (por exemplo, Argon2id/bcrypt) e sessões protegidas.

A pesquisa e os cartões são demonstrativos. Este não é o site oficial da Fandom.
