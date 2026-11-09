# Task Manager

Aplicação web para organizar tarefas do dia a dia: cadastre, edite, conclua e exclua tarefas, filtre por status e mantenha tudo salvo no navegador.

![Tela do Task Manager](docs/screenshot.png)

## Objetivo

Projeto desenvolvido durante o primeiro semestre de Engenharia de Software para praticar os fundamentos do desenvolvimento web: estrutura semântica com HTML, layout responsivo com CSS e manipulação do DOM com JavaScript puro, sem frameworks.

## Funcionalidades

- Cadastro de tarefas com título, prioridade (baixa, média ou alta) e prazo opcional
- Edição e exclusão de tarefas
- Marcar e desmarcar tarefas como concluídas
- Filtros: todas, pendentes e concluídas, com contadores
- Destaque para tarefas com prazo vencido
- Remoção de todas as tarefas concluídas de uma vez
- Persistência dos dados com `localStorage` (as tarefas continuam ali ao recarregar a página)
- Validação do formulário com mensagem de erro
- Layout responsivo (desktop, tablet e celular) e navegação por teclado

## Tecnologias

| Tecnologia | Função no projeto |
| --- | --- |
| HTML5 | Estrutura e semântica da página |
| CSS3 | Estilo, layout com Grid/Flexbox e responsividade |
| JavaScript (ES6+) | Lógica da aplicação e manipulação do DOM |
| localStorage | Armazenamento dos dados no navegador |

## Como executar

Não é necessário instalar nada.

```bash
git clone https://github.com/SEU-USUARIO/task-manager.git
cd task-manager
```

Depois, abra o arquivo `index.html` no navegador (duplo clique ou arraste para a janela do navegador).

## Estrutura de pastas

```
task-manager/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── docs/
│   └── screenshot.png
└── README.md
```

## O que aprendi

- Manipular o DOM e tratar eventos, incluindo delegação de eventos na lista
- Organizar o código em funções pequenas, cada uma com uma responsabilidade
- Salvar e recuperar dados com `localStorage`
- Construir layouts responsivos com CSS Grid e Flexbox
- Cuidar de acessibilidade básica: rótulos, foco visível e uso de teclado
- Evitar inserir texto do usuário como HTML, usando `textContent`

## Próximos passos

- Busca por texto
- Ordenação personalizada
- Tema escuro
- Testes automatizados

## Autora

**SEU NOME** — estudante de Engenharia de Software  
[GitHub](https://github.com/SEU-USUARIO) · [LinkedIn](https://www.linkedin.com/in/SEU-PERFIL)
