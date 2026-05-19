// =============================================
//  BOLÃO DA COPA 2026 — script.js
// =============================================

const GRUPOS = {
  A: {
    times: ['México', 'África do Sul', 'Coreia do Sul', 'Rep. Tcheca'],
    jogos: [
      ['México', 'África do Sul'],
      ['Coreia do Sul', 'Rep. Tcheca'],
      ['Rep. Tcheca', 'África do Sul'],
      ['México', 'Coreia do Sul'],
      ['Rep. Tcheca', 'México'],
      ['África do Sul', 'Coreia do Sul'],
    ]
  },
  B: {
    times: ['Canadá', 'Bósnia e Herz.', 'Qatar', 'Suíça'],
    jogos: [
      ['Canadá', 'Bósnia e Herz.'],
      ['Qatar', 'Suíça'],
      ['Suíça', 'Bósnia e Herz.'],
      ['Canadá', 'Qatar'],
      ['Suíça', 'Canadá'],
      ['Bósnia e Herz.', 'Qatar'],
    ]
  },
  C: {
    times: ['Brasil 🇧🇷', 'Marrocos', 'Haiti', 'Escócia'],
    jogos: [
      ['Brasil 🇧🇷', 'Marrocos'],
      ['Escócia', 'Haiti'],
      ['Haiti', 'Marrocos'],
      ['Brasil 🇧🇷', 'Escócia'],
      ['Haiti', 'Brasil 🇧🇷'],
      ['Marrocos', 'Escócia'],
    ]
  },
  D: {
    times: ['EUA', 'Paraguai', 'Austrália', 'Turquia'],
    jogos: [
      ['EUA', 'Paraguai'],
      ['Austrália', 'Turquia'],
      ['Turquia', 'Paraguai'],
      ['EUA', 'Austrália'],
      ['Turquia', 'EUA'],
      ['Paraguai', 'Austrália'],
    ]
  },
  E: {
    times: ['Alemanha', 'Curaçao', 'Costa do Marfim', 'Equador'],
    jogos: [
      ['Alemanha', 'Curaçao'],
      ['Equador', 'Costa do Marfim'],
      ['Costa do Marfim', 'Curaçao'],
      ['Alemanha', 'Equador'],
      ['Costa do Marfim', 'Alemanha'],
      ['Curaçao', 'Equador'],
    ]
  },
  F: {
    times: ['Holanda', 'Japão', 'Suécia', 'Tunísia'],
    jogos: [
      ['Holanda', 'Japão'],
      ['Suécia', 'Tunísia'],
      ['Tunísia', 'Japão'],
      ['Holanda', 'Suécia'],
      ['Tunísia', 'Holanda'],
      ['Japão', 'Suécia'],
    ]
  },
  G: {
    times: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'],
    jogos: [
      ['Bélgica', 'Egito'],
      ['Irã', 'Nova Zelândia'],
      ['Nova Zelândia', 'Egito'],
      ['Bélgica', 'Irã'],
      ['Nova Zelândia', 'Bélgica'],
      ['Egito', 'Irã'],
    ]
  },
  H: {
    times: ['Espanha', 'Cabo Verde', 'Arábia Saudita', 'Uruguai'],
    jogos: [
      ['Espanha', 'Cabo Verde'],
      ['Arábia Saudita', 'Uruguai'],
      ['Uruguai', 'Cabo Verde'],
      ['Espanha', 'Arábia Saudita'],
      ['Uruguai', 'Espanha'],
      ['Cabo Verde', 'Arábia Saudita'],
    ]
  },
  I: {
    times: ['França', 'Senegal', 'Iraque', 'Noruega'],
    jogos: [
      ['França', 'Senegal'],
      ['Iraque', 'Noruega'],
      ['Noruega', 'Senegal'],
      ['França', 'Iraque'],
      ['Noruega', 'França'],
      ['Senegal', 'Iraque'],
    ]
  },
  J: {
    times: ['Argentina', 'Argélia', 'Áustria', 'Jordânia'],
    jogos: [
      ['Argentina', 'Argélia'],
      ['Áustria', 'Jordânia'],
      ['Jordânia', 'Argélia'],
      ['Argentina', 'Áustria'],
      ['Jordânia', 'Argentina'],
      ['Argélia', 'Áustria'],
    ]
  },
  K: {
    times: ['Portugal', 'RD Congo', 'Uzbequistão', 'Colômbia'],
    jogos: [
      ['Portugal', 'RD Congo'],
      ['Uzbequistão', 'Colômbia'],
      ['Colômbia', 'RD Congo'],
      ['Portugal', 'Uzbequistão'],
      ['Colômbia', 'Portugal'],
      ['RD Congo', 'Uzbequistão'],
    ]
  },
  L: {
    times: ['Inglaterra', 'Croácia', 'Gana', 'Panamá'],
    jogos: [
      ['Inglaterra', 'Croácia'],
      ['Gana', 'Panamá'],
      ['Panamá', 'Croácia'],
      ['Inglaterra', 'Gana'],
      ['Panamá', 'Inglaterra'],
      ['Croácia', 'Gana'],
    ]
  },
};

// Estado da aposta
const aposta = {
  jogos: {}, // chave: "grupo_jogoIdx" => 'time1' | 'time2' | 'empate'
  classificados: {}, // chave: "grupo_timeIdx" => true/false
  mata: {},  // chave: "rodada_jogoIdx_timePos" => winner
};

// =============================================
// NAVEGAÇÃO
// =============================================
function irParaTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  const tela = document.getElementById(id);
  tela.classList.add('ativa');
  window.scrollTo(0, 0);
}

function salvarEIrMata() {
  calcularClassificados();
  renderizarMata();
  irParaTela('tela-mata');
}

function fecharModal() {
  document.getElementById('modal-sucesso').classList.add('escondido');
}

function salvarAposta() {
  document.getElementById('modal-sucesso').classList.remove('escondido');
}

// =============================================
// GRUPOS — RENDER
// =============================================
function renderizarGrupos() {
  const container = document.getElementById('grupos-container');
  container.innerHTML = '';

  Object.entries(GRUPOS).forEach(([letra, grupo]) => {
    const card = document.createElement('div');
    card.className = 'grupo-card';
    card.id = `grupo-${letra}`;

    card.innerHTML = `
      <div class="grupo-header">
        <span class="grupo-nome">Grupo ${letra}</span>
        <span class="grupo-badge">${grupo.times.length} times</span>
      </div>
      <div class="grupo-times">
        ${grupo.times.map(t => `<span class="time-chip">${t}</span>`).join('')}
      </div>
      <div class="grupo-jogos">
        <div class="grupo-jogos-titulo">Palpites dos Jogos</div>
        ${grupo.jogos.map((jogo, i) => renderJogoRow(letra, i, jogo)).join('')}
      </div>
      <div class="grupo-classificacao">
        <div class="classif-titulo">Quem se classifica?</div>
        <div class="classif-lista" id="classif-${letra}">
          ${renderClassificacao(letra, grupo.times)}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderJogoRow(grupo, idx, jogo) {
  const key = `${grupo}_${idx}`;
  const selecionado = aposta.jogos[key];
  return `
    <div class="jogo-row">
      <button class="time-btn${selecionado === jogo[0] ? ' selecionado' : ''}"
        onclick="selecionarResultado('${grupo}', ${idx}, '${jogo[0]}')"
        title="${jogo[0]}"
      >${jogo[0]}</button>
      <span class="vs-label">VS</span>
      <button class="time-btn${selecionado === jogo[1] ? ' selecionado' : ''}"
        onclick="selecionarResultado('${grupo}', ${idx}, '${jogo[1]}')"
        title="${jogo[1]}"
      >${jogo[1]}</button>
      <button class="empate-btn${selecionado === 'empate' ? ' selecionado' : ''}"
        onclick="selecionarResultado('${grupo}', ${idx}, 'empate')"
      >EMP</button>
    </div>
  `;
}

function renderClassificacao(letra, times) {
  return times.map((time, i) => {
    const key = `${letra}_${i}`;
    const pts = calcularPontos(letra, time);
    const passa = aposta.classificados[key];
    const cls = passa === true ? 'passa' : passa === false ? 'nao-passa' : '';
    const pos = i + 1;
    const posClass = pos === 1 ? 'ouro' : pos === 2 ? 'prata' : '';
    return `
      <div class="classif-item ${cls}" onclick="toggleClassificado('${letra}', ${i})">
        <span class="classif-pos ${posClass}">${pos}º</span>
        <span class="classif-nome">${time}</span>
        <span class="classif-pontos">${pts}pts</span>
        <span class="classif-status">${passa === true ? '✅' : passa === false ? '❌' : '⬜'}</span>
      </div>
    `;
  }).join('');
}

// =============================================
// LÓGICA DE PONTOS
// =============================================
function calcularPontos(grupo, time) {
  const jogos = GRUPOS[grupo].jogos;
  let pts = 0;
  jogos.forEach((jogo, i) => {
    const key = `${grupo}_${i}`;
    const result = aposta.jogos[key];
    if (!result) return;
    if (jogo[0] === time || jogo[1] === time) {
      if (result === 'empate') pts += 1;
      else if (result === time) pts += 3;
    }
  });
  return pts;
}

function selecionarResultado(grupo, idx, resultado) {
  const key = `${grupo}_${idx}`;
  aposta.jogos[key] = resultado;

  // Re-render jogos do grupo
  const jogosList = document.querySelector(`#grupo-${grupo} .grupo-jogos`);
  jogosList.innerHTML = `
    <div class="grupo-jogos-titulo">Palpites dos Jogos</div>
    ${GRUPOS[grupo].jogos.map((jogo, i) => renderJogoRow(grupo, i, jogo)).join('')}
  `;

  // Atualiza classificação
  atualizarClassificacaoGrupo(grupo);
}

function atualizarClassificacaoGrupo(grupo) {
  const lista = document.getElementById(`classif-${grupo}`);
  if (!lista) return;
  lista.innerHTML = renderClassificacao(grupo, GRUPOS[grupo].times);
}

function toggleClassificado(grupo, idx) {
  const key = `${grupo}_${idx}`;
  const atual = aposta.classificados[key];
  if (atual === undefined || atual === false) {
    aposta.classificados[key] = true;
  } else if (atual === true) {
    aposta.classificados[key] = false;
  } else {
    aposta.classificados[key] = undefined;
    delete aposta.classificados[key];
  }
  atualizarClassificacaoGrupo(grupo);
}

// =============================================
// CALCULAR CLASSIFICADOS (para mata-mata)
// =============================================
function calcularClassificados() {
  // Pega os 2 classificados de cada grupo com mais pontos
  // ou os que o usuário marcou manualmente
  const result = {};
  Object.entries(GRUPOS).forEach(([letra, grupo]) => {
    const pontos = grupo.times.map((time, i) => ({
      time, pts: calcularPontos(letra, time),
      manual: aposta.classificados[`${letra}_${i}`]
    }));

    // Ordena por pontos
    pontos.sort((a, b) => b.pts - a.pts);

    // Os 2 primeiros passam (a menos que usuário tenha alterado manualmente)
    result[letra] = {
      primeiro: pontos[0].time,
      segundo: pontos[1].time,
    };
  });
  aposta._classificados = result;
}

// =============================================
// MATA-MATA — RENDER
// =============================================
//
// Formato Copa do Mundo 2026:
// 32 classificados (2 de cada grupo A-L) + 8 melhores terceiros
// Para simplificar o esboço: 32 times → 16 oitavas → 8 quartas → 4 semi → 2 final → campeão
//
// Vamos montar as oitavas com os classificados gerados

const MATA_OITAVAS_CONFRONTOS = [
  { a: 'A1', b: 'B2' },
  { a: 'C1', b: 'D2' },
  { a: 'E1', b: 'F2' },
  { a: 'G1', b: 'H2' },
  { a: 'I1', b: 'J2' },
  { a: 'K1', b: 'L2' },
  { a: 'B1', b: 'A2' },
  { a: 'D1', b: 'C2' },
  { a: 'F1', b: 'E2' },
  { a: 'H1', b: 'G2' },
  { a: 'J1', b: 'I2' },
  { a: 'L1', b: 'K2' },
  // 4 vagas de melhores 3ºs — colocamos placeholders
  { a: '3º1', b: '3º2' },
  { a: '3º3', b: '3º4' },
  { a: '3º5', b: '3º6' },
  { a: '3º7', b: '3º8' },
];

function resolverTime(code) {
  if (!aposta._classificados) return code;
  const letra = code.replace('1', '').replace('2', '');
  const pos = code.includes('1') ? 'primeiro' : 'segundo';
  return (aposta._classificados[letra] && aposta._classificados[letra][pos]) || code;
}

function renderizarMata() {
  const bracket = document.getElementById('mata-bracket');
  bracket.innerHTML = '';

  // Estado do mata-mata
  const mataState = aposta.mata;

  // Montar oitavas
  const oitavas = MATA_OITAVAS_CONFRONTOS.map((c, i) => ({
    id: `oitava_${i}`,
    a: resolverTime(c.a) || c.a,
    b: resolverTime(c.b) || c.b,
  }));

  // Montar quartas (depende das oitavas)
  const quartas = Array.from({ length: 8 }, (_, i) => ({
    id: `quarta_${i}`,
    a: mataState[`oitava_${i * 2}`] || '?',
    b: mataState[`oitava_${i * 2 + 1}`] || '?',
  }));

  // Semi (depende das quartas)
  const semis = Array.from({ length: 4 }, (_, i) => ({
    id: `semi_${i}`,
    a: mataState[`quarta_${i * 2}`] || '?',
    b: mataState[`quarta_${i * 2 + 1}`] || '?',
  }));

  // Final
  const final = {
    id: 'final_0',
    a: mataState[`semi_0`] || '?',
    b: mataState[`semi_1`] || '?',
    c: mataState[`semi_2`] || '?',
    d: mataState[`semi_3`] || '?',
  };

  // Campeão
  const campiao = mataState['final_0'] || '';

  const rodadas = [
    { titulo: 'Oitavas', jogos: oitavas.slice(0, 8) },
    { titulo: 'Oitavas (2)', jogos: oitavas.slice(8, 16) },
    { titulo: 'Quartas', jogos: quartas },
    { titulo: 'Semifinal', jogos: semis },
    { titulo: '🏆 Final', jogos: [{ id: 'final_0', a: final.a, b: final.c }], isFinal: true },
  ];

  rodadas.forEach(({ titulo, jogos, isFinal }) => {
    const rodadaEl = document.createElement('div');
    rodadaEl.className = 'mata-rodada';

    const tituloEl = document.createElement('div');
    tituloEl.className = 'rodada-titulo';
    tituloEl.textContent = titulo;
    rodadaEl.appendChild(tituloEl);

    const jogosEl = document.createElement('div');
    jogosEl.className = 'mata-jogos';

    jogos.forEach(jogo => {
      const jogoEl = document.createElement('div');
      jogoEl.className = 'mata-jogo' + (isFinal ? ' mata-final' : '');

      const vencedor = mataState[jogo.id];

      const criarTimeEl = (nome, pos) => {
        const el = document.createElement('div');
        const isEmpty = !nome || nome === '?';
        el.className = 'mata-time' + (vencedor === nome && !isEmpty ? ' vencedor' : '') +
                       (vencedor && vencedor !== nome && !isEmpty ? ' perdedor' : '');

        if (isEmpty) {
          el.className = 'mata-slot-vazio';
          el.textContent = 'Aguardando...';
        } else {
          el.textContent = nome;
          el.onclick = () => {
            if (isEmpty) return;
            mataState[jogo.id] = nome;
            renderizarMata();
          };
        }
        return el;
      };

      jogoEl.appendChild(criarTimeEl(jogo.a, 'a'));
      jogoEl.appendChild(criarTimeEl(jogo.b, 'b'));
      jogosEl.appendChild(jogoEl);
    });

    rodadaEl.appendChild(jogosEl);
    bracket.appendChild(rodadaEl);
  });

  // Coluna do campeão
  const campEl = document.createElement('div');
  campEl.className = 'mata-rodada';
  campEl.innerHTML = `
    <div class="rodada-titulo">Campeão</div>
    <div class="mata-jogos">
      <div class="campiao-box">
        <span class="campiao-trofeu">🏆</span>
        <div class="campiao-label">CAMPEÃO DO MUNDO</div>
        <div class="campiao-nome">${campiao || '—'}</div>
      </div>
    </div>
  `;
  bracket.appendChild(campEl);
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  renderizarGrupos();
});
