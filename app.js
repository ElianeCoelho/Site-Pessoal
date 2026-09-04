/* =========================================================
   CONFIGURAÇÕES INICIAIS
   ========================================================= */

const siteContent = window.SITE_CONTENT || {};
const subjects = siteContent.subjects || [];
const socials = siteContent.socials || [];
const materiais = window.MATERIAIS || [];


/* =========================================================
   FUNÇÃO PARA CRIAR IDENTIFICADORES
   Exemplo:
   "Programação Back-End" vira "programacao-backend"
   ========================================================= */

function criarSlug(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/* =========================================================
   IDENTIFICADOR DA DISCIPLINA
   Utiliza o slug definido no content.js.
   Se ele não existir, cria automaticamente pelo título.
   ========================================================= */

function obterSlugDisciplina(disciplina) {
  return disciplina.slug || criarSlug(disciplina.title);
}


/* =========================================================
   PÁGINA INICIAL — CARDS DAS DISCIPLINAS
   ========================================================= */

function carregarDisciplinas() {
  const subjectGrid = document.querySelector("#subjectGrid");

  if (!subjectGrid) {
    return;
  }

  if (subjects.length === 0) {
    subjectGrid.innerHTML = `
      <div class="empty-materials">
        <strong>Nenhuma disciplina cadastrada</strong>

        <p>
          As disciplinas serão disponibilizadas em breve.
        </p>
      </div>
    `;

    return;
  }

  subjectGrid.innerHTML = subjects
    .map((disciplina, indice) => {
      const slug = obterSlugDisciplina(disciplina);

      const numero = String(indice + 1).padStart(2, "0");

      const titulo = disciplina.title || "Disciplina";

      const descricao =
        disciplina.description ||
        "Aulas, atividades e materiais da disciplina.";

      const icone = disciplina.icon || "01";

      const tom = disciplina.tone || "green";

      return `
        <article class="subject-card ${tom}">

          <div class="card-top">

            <span
              class="subject-icon"
              aria-hidden="true"
            >
              ${icone}
            </span>

            <span class="card-number">
              ${numero}
            </span>

          </div>

          <h3>${titulo}</h3>

          <p>${descricao}</p>

          <a
            class="card-link"
            href="disciplina.html?disciplina=${encodeURIComponent(slug)}"
            aria-label="Acessar materiais de ${titulo}"
          >
            <span>Ver materiais</span>
            <span aria-hidden="true">→</span>
          </a>

        </article>
      `;
    })
    .join("");
}


/* =========================================================
   PÁGINA INICIAL — REDES E PERFIS
   ========================================================= */

function carregarRedesSociais() {
  const socialGrid = document.querySelector("#socialGrid");

  if (!socialGrid) {
    return;
  }

  if (socials.length === 0) {
    socialGrid.innerHTML = `
      <p>
        Os links profissionais serão disponibilizados em breve.
      </p>
    `;

    return;
  }

  socialGrid.innerHTML = socials
    .map((rede) => {
      const nome = rede.name || "Perfil";

      const detalhe =
        rede.detail ||
        "Acessar perfil profissional";

      const icone = rede.icon || "↗";

      const endereco = rede.url || "#";

      const linkDisponivel =
        endereco !== "#" &&
        endereco.trim() !== "";

      if (!linkDisponivel) {
        return `
          <div class="social-card social-disabled">

            <span
              class="social-icon"
              aria-hidden="true"
            >
              ${icone}
            </span>

            <span>
              <strong>${nome}</strong>
              <small>Link em atualização</small>
            </span>

          </div>
        `;
      }

      return `
        <a
          class="social-card"
          href="${endereco}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acessar ${nome}"
        >

          <span
            class="social-icon"
            aria-hidden="true"
          >
            ${icone}
          </span>

          <span>
            <strong>${nome}</strong>
            <small>${detalhe}</small>
          </span>

          <b aria-hidden="true">↗</b>

        </a>
      `;
    })
    .join("");
}


/* =========================================================
   PÁGINA DA DISCIPLINA
   ========================================================= */

function carregarPaginaDisciplina() {
  const tituloElemento =
    document.querySelector("#disciplineTitle");

  if (!tituloElemento) {
    return;
  }

  const parametros =
    new URLSearchParams(window.location.search);

  const slugSelecionado =
    parametros.get("disciplina");

  const disciplina = subjects.find((item) => {
    return obterSlugDisciplina(item) === slugSelecionado;
  });

  if (!disciplina) {
    mostrarDisciplinaNaoEncontrada();
    return;
  }

  preencherInformacoesDisciplina(disciplina);

  carregarMateriaisDaDisciplina(
    obterSlugDisciplina(disciplina)
  );
}


/* =========================================================
   PREENCHER INFORMAÇÕES DA DISCIPLINA
   ========================================================= */

function preencherInformacoesDisciplina(disciplina) {
  const tituloElemento =
    document.querySelector("#disciplineTitle");

  const descricaoElemento =
    document.querySelector("#disciplineDescription");

  const nomeElemento =
    document.querySelector("#disciplineName");

  const titulo = disciplina.title || "Disciplina";

  const descricao =
    disciplina.description ||
    "Aulas, atividades e materiais da disciplina.";

  if (tituloElemento) {
    tituloElemento.textContent = titulo;
  }

  if (descricaoElemento) {
    descricaoElemento.textContent = descricao;
  }

  if (nomeElemento) {
    nomeElemento.textContent = titulo;
  }

  document.title =
    `${titulo} | Prof.ª Eliane Coelho`;
}


/* =========================================================
   MATERIAIS DA DISCIPLINA
   ========================================================= */

function carregarMateriaisDaDisciplina(slugDisciplina) {
  const materialsGrid =
    document.querySelector("#materialsGrid");

  if (!materialsGrid) {
    return;
  }

  const materiaisDaDisciplina =
    materiais
      .filter((material) => {
        return material.disciplina === slugDisciplina;
      })
      .sort(ordenarMateriais);

  materialsGrid.dataset.disciplina =
    slugDisciplina;

  exibirMateriais(materiaisDaDisciplina);
}


/* =========================================================
   ORDENAÇÃO DOS MATERIAIS
   Mais novos primeiro
   ========================================================= */

function ordenarMateriais(materialA, materialB) {
  const dataA = converterData(materialA.data);
  const dataB = converterData(materialB.data);

  return dataB - dataA;
}


function converterData(data) {
  if (!data) {
    return 0;
  }

  const partes = data.split("/");

  if (partes.length !== 3) {
    return 0;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const ano = Number(partes[2]);

  return new Date(ano, mes, dia).getTime();
}


/* =========================================================
   EXIBIÇÃO DOS MATERIAIS
   ========================================================= */

function exibirMateriais(listaDeMateriais) {
  const materialsGrid =
    document.querySelector("#materialsGrid");

  if (!materialsGrid) {
    return;
  }

  if (listaDeMateriais.length === 0) {
    materialsGrid.innerHTML = `
      <div class="empty-materials">

        <strong>
          Nenhum material publicado
        </strong>

        <p>
          As aulas e atividades desta disciplina
          serão disponibilizadas em breve.
        </p>

      </div>
    `;

    return;
  }

  materialsGrid.innerHTML =
    listaDeMateriais
      .map(criarCardMaterial)
      .join("");
}


/* =========================================================
   CARD DE CADA MATERIAL
   ========================================================= */

function criarCardMaterial(material) {
  const titulo =
    material.titulo ||
    "Material sem título";

  const tipo =
    material.tipo ||
    "Material";

  const data =
    material.data ||
    "Data não informada";

  const arquivo =
    material.arquivo ||
    "#";

  const descricao =
    material.descricao ||
    "";

  const arquivoDisponivel =
    arquivo !== "#" &&
    arquivo.trim() !== "";

  const textoBotao =
    definirTextoBotao(tipo);

  let botao;

  if (arquivoDisponivel) {
    botao = `
      <a
        class="material-open"
        href="${arquivo}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir ${titulo}"
      >
        ${textoBotao}
      </a>
    `;
  } else {
    botao = `
      <span class="material-open material-unavailable">
        Em breve
      </span>
    `;
  }

  return `
    <article
      class="material-card"
      data-tipo="${criarSlug(tipo)}"
    >

      <span class="material-type">
        ${tipo}
      </span>

      <div class="material-info">

        <strong>${titulo}</strong>

        <small>
          Publicado em ${data}
        </small>

        ${
          descricao
            ? `<p>${descricao}</p>`
            : ""
        }

      </div>

      ${botao}

    </article>
  `;
}


/* =========================================================
   TEXTO DO BOTÃO DE ACORDO COM O TIPO
   ========================================================= */

function definirTextoBotao(tipo = "") {
  const tipoNormalizado = criarSlug(tipo);

  if (
    tipoNormalizado.includes("slides") ||
    tipoNormalizado.includes("aula")
  ) {
    return "Abrir aula";
  }

  if (
    tipoNormalizado.includes("atividade") ||
    tipoNormalizado.includes("exercicio")
  ) {
    return "Abrir atividade";
  }

  if (
    tipoNormalizado.includes("avaliacao") ||
    tipoNormalizado.includes("prova")
  ) {
    return "Abrir avaliação";
  }

  return "Abrir material";
}


/* =========================================================
   FILTRO DOS MATERIAIS
   ========================================================= */

function configurarFiltroMateriais() {
  const filtro =
    document.querySelector("#materialFilter");

  const materialsGrid =
    document.querySelector("#materialsGrid");

  if (!filtro || !materialsGrid) {
    return;
  }

  filtro.addEventListener("change", () => {
    const slugDisciplina =
      materialsGrid.dataset.disciplina;

    const tipoSelecionado =
      criarSlug(filtro.value);

    let listaFiltrada =
      materiais.filter((material) => {
        return material.disciplina === slugDisciplina;
      });

    if (
      tipoSelecionado &&
      tipoSelecionado !== "todos"
    ) {
      listaFiltrada =
        listaFiltrada.filter((material) => {
          return criarSlug(material.tipo) ===
            tipoSelecionado;
        });
    }

    listaFiltrada.sort(ordenarMateriais);

    exibirMateriais(listaFiltrada);
  });
}


/* =========================================================
   DISCIPLINA NÃO ENCONTRADA
   ========================================================= */

function mostrarDisciplinaNaoEncontrada() {
  const tituloElemento =
    document.querySelector("#disciplineTitle");

  const descricaoElemento =
    document.querySelector("#disciplineDescription");

  const materialsGrid =
    document.querySelector("#materialsGrid");

  if (tituloElemento) {
    tituloElemento.textContent =
      "Disciplina não encontrada";
  }

  if (descricaoElemento) {
    descricaoElemento.textContent =
      "O endereço informado não corresponde a uma disciplina cadastrada.";
  }

  if (materialsGrid) {
    materialsGrid.innerHTML = `
      <div class="empty-materials">

        <strong>
          Não foi possível localizar esta disciplina
        </strong>

        <p>
          Volte para a página inicial e escolha
          uma das disciplinas disponíveis.
        </p>

        <a
          class="button primary"
          href="index.html#disciplinas"
        >
          Ver disciplinas
        </a>

      </div>
    `;
  }

  document.title =
    "Disciplina não encontrada | Prof.ª Eliane Coelho";
}


/* =========================================================
   MENU PARA CELULARES
   ========================================================= */

function configurarMenu() {
  const menuButton =
    document.querySelector(".menu-button");

  const navegacao =
    document.querySelector(".nav");

  if (!menuButton || !navegacao) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const menuAberto =
      document.body.classList.toggle("menu-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(menuAberto)
    );

    menuButton.setAttribute(
      "aria-label",
      menuAberto
        ? "Fechar menu"
        : "Abrir menu"
    );

    menuButton.textContent =
      menuAberto ? "×" : "☰";
  });

  navegacao
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        menuButton.setAttribute(
          "aria-label",
          "Abrir menu"
        );

        menuButton.textContent = "☰";
      });
    });
}


/* =========================================================
   ANO AUTOMÁTICO DO RODAPÉ
   ========================================================= */

function carregarAnoAtual() {
  const yearElement =
    document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }
}


/* =========================================================
   INICIALIZAÇÃO DO SITE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  carregarDisciplinas();
  carregarRedesSociais();
  carregarPaginaDisciplina();
  configurarFiltroMateriais();
  configurarMenu();
  carregarAnoAtual();
});