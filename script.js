// =============================================
//  BOLÃO DA COPA 2026 — script.js
// =============================================

// ── RANKING PLACEHOLDER ──────────────────────
// Nomes aleatórios — integrar com banco depois
const RANKING_PLACEHOLDER = [
  { nome: 'Lucas Mendes',    pts: 0 },
  { nome: 'Fernanda Rocha',  pts: 0 },
  { nome: 'Rafael Souza',    pts: 0 },
  { nome: 'Juliana Alves',   pts: 0 },
  { nome: 'Pedro Henrique',  pts: 0 },
  { nome: 'Camila Torres',   pts: 0 },
  { nome: 'Bruno Farias',    pts: 0 },
  { nome: 'Amanda Lima',     pts: 0 },
  { nome: 'Mateus Costa',    pts: 0 },
  { nome: 'Isabela Nunes',   pts: 0 },
];

function renderRanking() {
  const lista = document.getElementById('ranking-lista');
  if (!lista) return;
  lista.innerHTML = RANKING_PLACEHOLDER.map((item, i) => {
    const pos = i + 1;
    const cls = pos===1?'ouro':pos===2?'prata':pos===3?'bronze':'';
    return `<li class="ranking-item">
      <span class="rank-pos ${cls}">${pos}</span>
      <span class="rank-nome">${item.nome}</span>
      <span class="rank-pts">${item.pts} pts</span>
      <span class="rank-arrow">›</span>
    </li>`;
  }).join('');

  const maiorEl = document.getElementById('ranking-maior-pts');
  if (maiorEl) {
    const max = Math.max(...RANKING_PLACEHOLDER.map(r => r.pts));
    maiorEl.textContent = max;
  }
}

// ── GRUPOS ────────────────────────────────────
const GRUPOS = {
  A: { times: ['México','África do Sul','Coreia do Sul','Rep. Tcheca'], jogos:[['México','África do Sul'],['Coreia do Sul','Rep. Tcheca'],['Rep. Tcheca','África do Sul'],['México','Coreia do Sul'],['Rep. Tcheca','México'],['África do Sul','Coreia do Sul']] },
  B: { times: ['Canadá','Bósnia e Herz.','Qatar','Suíça'], jogos:[['Canadá','Bósnia e Herz.'],['Qatar','Suíça'],['Suíça','Bósnia e Herz.'],['Canadá','Qatar'],['Suíça','Canadá'],['Bósnia e Herz.','Qatar']] },
  C: { times: ['Brasil','Marrocos','Haiti','Escócia'], jogos:[['Brasil','Marrocos'],['Escócia','Haiti'],['Haiti','Marrocos'],['Brasil','Escócia'],['Haiti','Brasil'],['Marrocos','Escócia']] },
  D: { times: ['EUA','Paraguai','Austrália','Turquia'], jogos:[['EUA','Paraguai'],['Austrália','Turquia'],['Turquia','Paraguai'],['EUA','Austrália'],['Turquia','EUA'],['Paraguai','Austrália']] },
  E: { times: ['Alemanha','Curaçao','Costa do Marfim','Equador'], jogos:[['Alemanha','Curaçao'],['Equador','Costa do Marfim'],['Costa do Marfim','Curaçao'],['Alemanha','Equador'],['Costa do Marfim','Alemanha'],['Curaçao','Equador']] },
  F: { times: ['Holanda','Japão','Suécia','Tunísia'], jogos:[['Holanda','Japão'],['Suécia','Tunísia'],['Tunísia','Japão'],['Holanda','Suécia'],['Tunísia','Holanda'],['Japão','Suécia']] },
  G: { times: ['Bélgica','Egito','Irã','Nova Zelândia'], jogos:[['Bélgica','Egito'],['Irã','Nova Zelândia'],['Nova Zelândia','Egito'],['Bélgica','Irã'],['Nova Zelândia','Bélgica'],['Egito','Irã']] },
  H: { times: ['Espanha','Cabo Verde','Arábia Saudita','Uruguai'], jogos:[['Espanha','Cabo Verde'],['Arábia Saudita','Uruguai'],['Uruguai','Cabo Verde'],['Espanha','Arábia Saudita'],['Uruguai','Espanha'],['Cabo Verde','Arábia Saudita']] },
  I: { times: ['França','Senegal','Iraque','Noruega'], jogos:[['França','Senegal'],['Iraque','Noruega'],['Noruega','Senegal'],['França','Iraque'],['Noruega','França'],['Senegal','Iraque']] },
  J: { times: ['Argentina','Argélia','Áustria','Jordânia'], jogos:[['Argentina','Argélia'],['Áustria','Jordânia'],['Jordânia','Argélia'],['Argentina','Áustria'],['Jordânia','Argentina'],['Argélia','Áustria']] },
  K: { times: ['Portugal','RD Congo','Uzbequistão','Colômbia'], jogos:[['Portugal','RD Congo'],['Uzbequistão','Colômbia'],['Colômbia','RD Congo'],['Portugal','Uzbequistão'],['Colômbia','Portugal'],['RD Congo','Uzbequistão']] },
  L: { times: ['Inglaterra','Croácia','Gana','Panamá'], jogos:[['Inglaterra','Croácia'],['Gana','Panamá'],['Panamá','Croácia'],['Inglaterra','Gana'],['Panamá','Inglaterra'],['Croácia','Gana']] },
};

const aposta = { jogos:{}, classificados:{}, mata:{} };
let activeMataTab = 'r32';

function setMataTab(tabId) {
  activeMataTab = tabId;
  renderizarMata();
}

// ── NAVEGAÇÃO ─────────────────────────────────
function irParaTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
  window.scrollTo(0, 0);
}
function salvarEIrMata() { calcularClassificados(); renderizarMata(); irParaTela('tela-mata'); }
function fecharModal()   { document.getElementById('modal-sucesso').classList.add('escondido'); }
function salvarAposta()  { document.getElementById('modal-sucesso').classList.remove('escondido'); }

// ── GRUPOS ────────────────────────────────────
function renderizarGrupos() {
  const container = document.getElementById('grupos-container');
  container.innerHTML = '';
  Object.entries(GRUPOS).forEach(([letra, grupo]) => {
    const card = document.createElement('div');
    card.className = 'grupo-card';
    card.id = `grupo-${letra}`;
    card.innerHTML = `
      <div class="grupo-header">
        <span class="grupo-nome">GRUPO ${letra}</span>
        <span class="grupo-badge">${grupo.times.length} times</span>
      </div>
      <div class="grupo-times">${grupo.times.map(t=>`<span class="time-chip">${getFlag(t)}</span>`).join('')}</div>
      <div class="grupo-jogos">
        <div class="grupo-jogos-titulo">Palpites dos Jogos</div>
        ${grupo.jogos.map((j,i)=>renderJogoRow(letra,i,j)).join('')}
      </div>
      <div class="grupo-classificacao">
        <div class="classif-titulo">Quem se classifica?</div>
        <div class="classif-lista" id="classif-${letra}">${renderClassificacao(letra, grupo.times)}</div>
      </div>`;
    container.appendChild(card);
  });
}

function renderJogoRow(grupo, idx, jogo) {
  const key = `${grupo}_${idx}`;
  const g = (aposta.gols && aposta.gols[key]) ? aposta.gols[key] : { a: null, b: null };
  const golsA = g.a !== null ? g.a : '-';
  const golsB = g.b !== null ? g.b : '-';
  
  const sel = aposta.jogos[key];
  const isASelected = sel === jogo[0];
  const isBSelected = sel === jogo[1];
  const isEmpate = sel === 'empate';

  const classA = isASelected ? 'vencedor' : (isEmpate ? 'drew' : (sel ? 'lost' : ''));
  const classB = isBSelected ? 'vencedor' : (isEmpate ? 'drew' : (sel ? 'lost' : ''));

  return `<div class="jogo-row">
    <div class="jogo-time-info left-time ${classA}">
      ${getFlag(jogo[0])}
    </div>
    
    <div class="jogo-score-selector">
      <div class="score-control">
        <button class="score-btn minus" onclick="alterarGols('${grupo}',${idx},0,-1)">-</button>
        <span class="score-val">${golsA}</span>
        <button class="score-btn plus" onclick="alterarGols('${grupo}',${idx},0,1)">+</button>
      </div>
      
      <span class="vs-label">VS</span>
      
      <div class="score-control">
        <button class="score-btn minus" onclick="alterarGols('${grupo}',${idx},1,-1)">-</button>
        <span class="score-val">${golsB}</span>
        <button class="score-btn plus" onclick="alterarGols('${grupo}',${idx},1,1)">+</button>
      </div>
    </div>

    <div class="jogo-time-info right-time ${classB}">
      ${getFlag(jogo[1])}
    </div>
  </div>`;
}

function renderClassificacao(letra, times) {
  // Usa calcularStats para obter pts, wins, gf/ga, gd e ordem já definida
  const stats = calcularStats(letra); // já ordenado por pts,wins,gd

  return stats.map((s, rank) => {
    const i = s.idx; // índice original
    const time = s.time;
    const pts = s.pts;
    const passa = aposta.classificados[`${letra}_${i}`];
    const cls = passa===true ? 'passa' : passa===false ? 'nao-passa' : '';
    const posC = rank===0 ? 'ouro' : rank===1 ? 'prata' : '';

    return `<div class="classif-item ${cls}" onclick="toggleClassificado('${letra}',${i})" data-time="${time}">
      <span class="classif-pos ${posC}">${rank+1}º</span>
      <span class="classif-nome">${getFlag(time)}</span>
      <span class="classif-pontos">${pts}pts</span>
      <span class="classif-status">${passa===true?'✅':passa===false?'❌':'⬜'}</span>
    </div>`;
  }).join('');
}

function calcularPontos(grupo, time) {
  let pts = 0;
  GRUPOS[grupo].jogos.forEach((jogo, i) => {
    const r = aposta.jogos[`${grupo}_${i}`];
    if (!r) return;
    if (jogo[0]===time||jogo[1]===time) {
      if (r==='empate') pts += 1;
      else if (r===time) pts += 3;
    }
  });
  return pts;
}

function selecionarResultado(grupo, idx, resultado) {
  aposta.jogos[`${grupo}_${idx}`] = resultado;
  const el = document.querySelector(`#grupo-${grupo} .grupo-jogos`);
  el.innerHTML = `<div class="grupo-jogos-titulo">Palpites dos Jogos</div>${GRUPOS[grupo].jogos.map((j,i)=>renderJogoRow(grupo,i,j)).join('')}`;
  atualizarClassificacaoGrupo(grupo);
}

function atualizarClassificacaoGrupo(grupo) {
  const lista = document.getElementById(`classif-${grupo}`);
  if (!lista) return;

  // FLIP - First: Capture positions before changes
  const items = Array.from(lista.children);
  const firstPositions = items.map(item => {
    const rect = item.getBoundingClientRect();
    return {
      time: item.dataset.time,
      top: rect.top
    };
  });

  // FLIP - Last: Update DOM order
  lista.innerHTML = renderClassificacao(grupo, GRUPOS[grupo].times);

  // FLIP - Invert & Play
  const newItems = Array.from(lista.children);
  const lastPositions = newItems.map(item => {
    const rect = item.getBoundingClientRect();
    return {
      element: item,
      time: item.dataset.time,
      top: rect.top
    };
  });

  lastPositions.forEach(last => {
    const first = firstPositions.find(f => f.time === last.time);
    if (first) {
      const deltaY = first.top - last.top;
      if (deltaY !== 0) {
        // Invert: shift element back to first position
        last.element.style.transition = 'none';
        last.element.style.transform = `translateY(${deltaY}px)`;
        
        // Force layout repaint
        last.element.offsetHeight;

        // Play: animate back to its natural position
        last.element.style.transition = 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)';
        last.element.style.transform = 'translateY(0)';
      }
    }
  });
}

function toggleClassificado(grupo, idx) {
  const key = `${grupo}_${idx}`;
  const a = aposta.classificados[key];
  aposta.classificados[key] = a===true ? false : a===false ? undefined : true;
  if (aposta.classificados[key] === undefined) delete aposta.classificados[key];
  atualizarClassificacaoGrupo(grupo);
}

function calcularClassificados() {
  aposta._classificados = {};
  Object.entries(GRUPOS).forEach(([letra, grupo]) => {
    const stats = calcularStats(letra);
    // stats already sorted by pts,wins,gd
    aposta._classificados[letra] = {primeiro: stats[0].time, segundo: stats[1].time};
  });
}

// Calcula estatísticas por time dentro de um grupo: pts, vitórias, gols for/against, saldo
function calcularStats(grupo) {
  const times = GRUPOS[grupo].times;
  const stats = times.map((t, idx) => ({ time: t, pts: 0, wins: 0, gf: 0, ga: 0, idx: idx }));

  GRUPOS[grupo].jogos.forEach((jogo, i) => {
    const a = jogo[0];
    const b = jogo[1];
    const key = `${grupo}_${i}`;
    const sel = aposta.jogos[key];
    const gols = (aposta.gols && aposta.gols[key]) ? aposta.gols[key] : null;

    // points: prefer pontos selected (aposta.jogos). Keep existing behaviour.
    if (sel) {
      if (sel === 'empate') {
        const ai = stats.find(s => s.time === a);
        const bi = stats.find(s => s.time === b);
        if (ai) ai.pts += 1;
        if (bi) bi.pts += 1;
      } else {
        const winner = stats.find(s => s.time === sel);
        if (winner) winner.pts += 3;
      }
    }

    // gols and wins: if explicit gols provided for both teams, use them to update gf/ga and wins
    if (gols && typeof gols.a === 'number' && typeof gols.b === 'number') {
      const sa = stats.find(s => s.time === a);
      const sb = stats.find(s => s.time === b);
      if (sa) { sa.gf += gols.a; sa.ga += gols.b; }
      if (sb) { sb.gf += gols.b; sb.ga += gols.a; }
      if (gols.a > gols.b) {
        const win = stats.find(s => s.time === a);
        if (win) win.wins += 1;
      } else if (gols.b > gols.a) {
        const win = stats.find(s => s.time === b);
        if (win) win.wins += 1;
      }
    } else {
      // sem gols explícitos, inferir vitórias a partir de aposta.jogos
      if (sel && sel !== 'empate') {
        const win = stats.find(s => s.time === sel);
        if (win) win.wins += 1;
      }
    }
  });

  // calcula saldo
  stats.forEach(s => s.gd = s.gf - s.ga);

  // ordena por pontos, depois vitórias, depois saldo, depois ordem original
  stats.sort((x,y) => {
    if (y.pts !== x.pts) return y.pts - x.pts;
    if (y.wins !== x.wins) return y.wins - x.wins;
    if (y.gd !== x.gd) return y.gd - x.gd;
    return GRUPOS[grupo].times.indexOf(x.time) - GRUPOS[grupo].times.indexOf(y.time);
  });

  return stats;
}

// Altera os gols de um time em um jogo (0-10) usando botões +/-
function alterarGols(grupo, idx, teamPos, delta) {
  const key = `${grupo}_${idx}`;
  if (!aposta.gols) aposta.gols = {};
  if (!aposta.gols[key]) aposta.gols[key] = { a: null, b: null };

  const current = teamPos === 0 ? aposta.gols[key].a : aposta.gols[key].b;
  let next;

  if (current === null) {
    if (delta > 0) next = 0; // Se clicar no + quando vazio, vira 0
    else next = null;       // Se clicar no - quando vazio, continua vazio
  } else {
    next = current + delta;
    if (next < 0) next = null; // Se for menor que 0, vira vazio (permite limpar)
    if (next > 10) next = 10;  // Limite máximo de 10
  }

  if (teamPos === 0) aposta.gols[key].a = next;
  else aposta.gols[key].b = next;

  const jogo = GRUPOS[grupo].jogos[idx];
  const g = aposta.gols[key];
  if (g.a !== null && g.b !== null) {
    if (g.a > g.b) {
      aposta.jogos[key] = jogo[0];
    } else if (g.b > g.a) {
      aposta.jogos[key] = jogo[1];
    } else {
      aposta.jogos[key] = 'empate';
    }
  } else {
    delete aposta.jogos[key];
  }

  // Atualiza classificação do grupo
  atualizarClassificacaoGrupo(grupo);

  // Recarrega jogos do grupo
  const el = document.querySelector(`#grupo-${grupo} .grupo-jogos`);
  if (el) el.innerHTML = `<div class="grupo-jogos-titulo">Palpites dos Jogos</div>${GRUPOS[grupo].jogos.map((j,i)=>renderJogoRow(grupo,i,j)).join('')}`;
}

// ── MATA-MATA ─────────────────────────────────
const MATA_R32 = [
  // Left bracket
  { id: 'r32_0', a: 'E1', b: '3ABCDF' },  // J74
  { id: 'r32_1', a: 'I1', b: '3CDFGH' },  // J77
  { id: 'r32_2', a: 'A2', b: 'B2' },      // J73
  { id: 'r32_3', a: 'F1', b: 'C2' },      // J75
  { id: 'r32_4', a: 'K2', b: 'L2' },      // J83
  { id: 'r32_5', a: 'H1', b: 'J2' },      // J84
  { id: 'r32_6', a: 'D1', b: '3BEFIJ' },  // J81
  { id: 'r32_7', a: 'G1', b: '3AEHIJ' },  // J82

  // Right bracket
  { id: 'r32_8', a: 'C1', b: 'F2' },      // J76
  { id: 'r32_9', a: 'E2', b: 'I2' },      // J78
  { id: 'r32_10', a: 'A1', b: '3CEFHI' }, // J79
  { id: 'r32_11', a: 'L1', b: '3EHIJK' }, // J80
  { id: 'r32_12', a: 'J1', b: 'H2' },     // J86
  { id: 'r32_13', a: 'D2', b: 'G2' },     // J88
  { id: 'r32_14', a: 'B1', b: '3EFGIJ' }, // J85
  { id: 'r32_15', a: 'K1', b: '3DEIJL' }, // J87
];

function obterMelhoresTerceiros() {
  const terceiros = [];
  Object.entries(GRUPOS).forEach(([letra, grupo]) => {
    const stats = calcularStats(letra);
    if (stats && stats[2]) {
      terceiros.push({
        grupo: letra,
        time: stats[2].time,
        pts: stats[2].pts,
        wins: stats[2].wins,
        gd: stats[2].gd,
        gf: stats[2].gf
      });
    }
  });

  // Ordenar de acordo com pontos, vitórias, saldo de gols, gols pró
  terceiros.sort((x, y) => {
    if (y.pts !== x.pts) return y.pts - x.pts;
    if (y.wins !== x.wins) return y.wins - x.wins;
    if (y.gd !== x.gd) return y.gd - x.gd;
    if (y.gf !== x.gf) return y.gf - x.gf;
    return x.grupo.localeCompare(y.grupo);
  });

  return terceiros.slice(0, 8);
}

function match3rdsToSlots(qualified3rds) {
  const assignment = {};
  const slots = [
    { key: '3ABCDF', groups: ['A', 'B', 'C', 'D', 'F'] },
    { key: '3CDFGH', groups: ['C', 'D', 'F', 'G', 'H'] },
    { key: '3BEFIJ', groups: ['B', 'E', 'F', 'I', 'J'] },
    { key: '3AEHIJ', groups: ['A', 'E', 'H', 'I', 'J'] },
    { key: '3CEFHI', groups: ['C', 'E', 'F', 'H', 'I'] },
    { key: '3EHIJK', groups: ['E', 'H', 'I', 'J', 'K'] },
    { key: '3EFGIJ', groups: ['E', 'F', 'G', 'I', 'J'] },
    { key: '3DEIJL', groups: ['D', 'E', 'I', 'J', 'L'] },
  ];

  function backtrack(slotIdx, usedIdxs) {
    if (slotIdx === slots.length) return true;
    const slot = slots[slotIdx];
    for (let i = 0; i < qualified3rds.length; i++) {
      if (usedIdxs.has(i)) continue;
      const team = qualified3rds[i];
      if (slot.groups.includes(team.grupo)) {
        assignment[slot.key] = team.time;
        usedIdxs.add(i);
        if (backtrack(slotIdx + 1, usedIdxs)) return true;
        usedIdxs.delete(i);
        delete assignment[slot.key];
      }
    }
    return false;
  }

  const success = backtrack(0, new Set());
  if (!success) {
    const used = new Set();
    slots.forEach(slot => {
      if (assignment[slot.key]) return;
      const match = qualified3rds.find((t, idx) => !used.has(idx) && slot.groups.includes(t.grupo));
      if (match) {
        assignment[slot.key] = match.time;
        used.add(qualified3rds.indexOf(match));
      } else {
        const fallback = qualified3rds.find((t, idx) => !used.has(idx));
        if (fallback) {
          assignment[slot.key] = fallback.time;
          used.add(qualified3rds.indexOf(fallback));
        }
      }
    });
  }
  return assignment;
}

function resolverTime(c, matched3rds) {
  if (!aposta._classificados) return c;
  
  if (c.startsWith('3')) {
    return matched3rds[c] || c;
  }
  
  const grupoLetra = c.charAt(0);
  const posicao = c.charAt(1) === '1' ? 'primeiro' : 'segundo';
  
  return (aposta._classificados[grupoLetra] && aposta._classificados[grupoLetra][posicao]) || c;
}

function getLabelTime(c) {
  if (!c || c === '?') return 'Aguardando...';
  if (countryCodes[c]) return getFlag(c);
  
  if (c.startsWith('3')) {
    const grps = c.substring(1).split('').join('/');
    return `<span class="placeholder-time">3º ${grps}</span>`;
  }
  
  const pos = c.endsWith('1') ? '1º' : c.endsWith('2') ? '2º' : '';
  if (pos) {
    const grp = c.charAt(0);
    return `<span class="placeholder-time">${pos} Gr. ${grp}</span>`;
  }
  
  return `<span class="placeholder-time">${c}</span>`;
}

function alterarGolsMata(jogoId, teamPos, delta, teamA, teamB) {
  if (!aposta.mataGols) aposta.mataGols = {};
  if (!aposta.mataGols[jogoId]) aposta.mataGols[jogoId] = { a: null, b: null };
  const g = aposta.mataGols[jogoId];
  const current = teamPos === 0 ? g.a : g.b;
  let next;
  if (current === null) {
    if (delta > 0) next = 0;
    else next = null;
  } else {
    next = current + delta;
    if (next < 0) next = null;
    if (next > 10) next = 10;
  }
  if (teamPos === 0) g.a = next;
  else g.b = next;

  if (g.a !== null && g.b !== null) {
    if (g.a > g.b) {
      aposta.mata[jogoId] = teamA;
    } else if (g.b > g.a) {
      aposta.mata[jogoId] = teamB;
    } else {
      if (aposta.mata[jogoId] !== teamA && aposta.mata[jogoId] !== teamB) {
        delete aposta.mata[jogoId];
      }
    }
  } else {
    delete aposta.mata[jogoId];
  }
  renderizarMata();
}

function selecionarVencedorMata(jogoId, vencedor, teamA, teamB) {
  if (!aposta.mataGols) aposta.mataGols = {};
  if (!aposta.mataGols[jogoId]) aposta.mataGols[jogoId] = { a: null, b: null };
  const g = aposta.mataGols[jogoId];
  if (g.a === null || g.b === null) {
    if (vencedor === teamA) {
      g.a = g.a !== null && g.a > 0 ? g.a : 1;
      g.b = g.b !== null ? g.b : 0;
    } else {
      g.b = g.b !== null && g.b > 0 ? g.b : 1;
      g.a = g.a !== null ? g.a : 0;
    }
    aposta.mata[jogoId] = vencedor;
    renderizarMata();
    return;
  }
  const isDraw = g.a !== null && g.b !== null && g.a === g.b;
  if (isDraw) {
    aposta.mata[jogoId] = vencedor;
    renderizarMata();
  }
}

function renderizarMata() {
  const bracket = document.getElementById('mata-bracket');
  if (!bracket) return;
  bracket.innerHTML = '';
  
  // Render sub-tabs for mobile bracket view
  const tabsContainer = document.getElementById('mata-tabs-container');
  if (tabsContainer) {
    tabsContainer.innerHTML = `
      <div class="mata-tabs">
        <button class="mata-tab ${activeMataTab === 'r32' ? 'active' : ''}" onclick="setMataTab('r32')">32 Avos</button>
        <button class="mata-tab ${activeMataTab === 'r16' ? 'active' : ''}" onclick="setMataTab('r16')">Oitavas</button>
        <button class="mata-tab ${activeMataTab === 'qf' ? 'active' : ''}" onclick="setMataTab('qf')">Quartas</button>
        <button class="mata-tab ${activeMataTab === 'sf' ? 'active' : ''}" onclick="setMataTab('sf')">Semifinal</button>
        <button class="mata-tab ${activeMataTab === 'final' ? 'active' : ''}" onclick="setMataTab('final')">Finais</button>
      </div>
    `;
  }
  
  const ms = aposta.mata;
  const qualified3rds = obterMelhoresTerceiros();
  const matched3rds = match3rdsToSlots(qualified3rds);

  // 1. Fase de 32 Avos (r32)
  const r32 = MATA_R32.map((c, i) => {
    const key = `r32_${i}`;
    const tA = resolverTime(c.a, matched3rds);
    const tB = resolverTime(c.b, matched3rds);
    if (tA === '?' || tB === '?') {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    } else if (ms[key] && ms[key] !== tA && ms[key] !== tB) {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    }
    return { id: key, a: tA, b: tB };
  });

  // 2. Oitavas (r16) - 8 chaves
  const r16 = Array.from({ length: 8 }, (_, i) => {
    const key = `r16_${i}`;
    const tA = ms[`r32_${i*2}`] || '?';
    const tB = ms[`r32_${i*2+1}`] || '?';
    if (tA === '?' || tB === '?') {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    } else if (ms[key] && ms[key] !== tA && ms[key] !== tB) {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    }
    return { id: key, a: tA, b: tB };
  });

  // 3. Quartas (qf) - 4 chaves
  const qf = Array.from({ length: 4 }, (_, i) => {
    const key = `qf_${i}`;
    const tA = ms[`r16_${i*2}`] || '?';
    const tB = ms[`r16_${i*2+1}`] || '?';
    if (tA === '?' || tB === '?') {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    } else if (ms[key] && ms[key] !== tA && ms[key] !== tB) {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    }
    return { id: key, a: tA, b: tB };
  });

  // 4. Semifinais (sf) - 2 chaves
  const sf = Array.from({ length: 2 }, (_, i) => {
    const key = `sf_${i}`;
    const tA = ms[`qf_${i*2}`] || '?';
    const tB = ms[`qf_${i*2+1}`] || '?';
    if (tA === '?' || tB === '?') {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    } else if (ms[key] && ms[key] !== tA && ms[key] !== tB) {
      delete ms[key];
      if (aposta.mataGols) delete aposta.mataGols[key];
    }
    return { id: key, a: tA, b: tB };
  });

  // 5. Final
  const tFinalA = ms['sf_0'] || '?';
  const tFinalB = ms['sf_1'] || '?';
  if (tFinalA === '?' || tFinalB === '?') {
    delete ms['final_0'];
    if (aposta.mataGols) delete aposta.mataGols['final_0'];
  } else if (ms['final_0'] && ms['final_0'] !== tFinalA && ms['final_0'] !== tFinalB) {
    delete ms['final_0'];
    if (aposta.mataGols) delete aposta.mataGols['final_0'];
  }
  const final = { id: 'final_0', a: tFinalA, b: tFinalB };

  // 6. Decisão de 3º Lugar (Losers of sf_0 and sf_1)
  const t3placeA = (ms['sf_0'] && sf[0].a && sf[0].b) ? (ms['sf_0'] === sf[0].a ? sf[0].b : sf[0].a) : '?';
  const t3placeB = (ms['sf_1'] && sf[1].a && sf[1].b) ? (ms['sf_1'] === sf[1].a ? sf[1].b : sf[1].a) : '?';
  if (t3placeA === '?' || t3placeB === '?') {
    delete ms['terceiro_0'];
    if (aposta.mataGols) delete aposta.mataGols['terceiro_0'];
  } else if (ms['terceiro_0'] && ms['terceiro_0'] !== t3placeA && ms['terceiro_0'] !== t3placeB) {
    delete ms['terceiro_0'];
    if (aposta.mataGols) delete aposta.mataGols['terceiro_0'];
  }
  const terceiro = { id: 'terceiro_0', a: t3placeA, b: t3placeB };

  const campeao = ms['final_0'] || '';

  // Função auxiliar para renderizar uma coluna de rodada
  function renderColunaRodada(titulo, jogos) {
    const rEl = document.createElement('div');
    rEl.className = 'mata-rodada';
    rEl.innerHTML = `<div class="rodada-titulo">${titulo}</div>`;

    const jEl = document.createElement('div');
    jEl.className = 'mata-jogos';

    jogos.forEach(jogo => {
      const jogoEl = document.createElement('div');
      jogoEl.className = 'mata-jogo';
      if (jogo.id === 'final_0') jogoEl.classList.add('mata-final');

      const mkSlot = (nome, teamPos, outroNome) => {
        const slotEl = document.createElement('div');
        if (!nome || nome === '?') {
          slotEl.className = 'mata-slot-vazio';
          slotEl.textContent = 'Aguardando...';
          return slotEl;
        }

        const v = ms[jogo.id];
        const isWinner = v === nome;
        const isLoser = v && v !== nome;
        const g = aposta.mataGols && aposta.mataGols[jogo.id];
        const score = g ? (teamPos === 0 ? g.a : g.b) : null;
        const scoreStr = score !== null ? score : '-';
        const isDraw = g && g.a !== null && g.b !== null && g.a === g.b;
        const isPenaltyWinner = isDraw && isWinner;

        slotEl.className = 'mata-time' + (isWinner ? ' vencedor' : '') + (isLoser ? ' perdedor' : '');
        slotEl.innerHTML = `
          <div class="mata-time-clickable" onclick="selecionarVencedorMata('${jogo.id}', '${nome}', '${teamPos === 0 ? nome : outroNome}', '${teamPos === 1 ? nome : outroNome}')">
            ${getLabelTime(nome)}
            ${isPenaltyWinner ? '<span class="penalty-badge">🏆 pen</span>' : ''}
          </div>
          <div class="score-control">
            <button class="score-btn minus" onclick="alterarGolsMata('${jogo.id}', ${teamPos}, -1, '${teamPos === 0 ? nome : outroNome}', '${teamPos === 1 ? nome : outroNome}')">-</button>
            <span class="score-val">${scoreStr}</span>
            <button class="score-btn plus" onclick="alterarGolsMata('${jogo.id}', ${teamPos}, 1, '${teamPos === 0 ? nome : outroNome}', '${teamPos === 1 ? nome : outroNome}')">+</button>
          </div>
        `;
        return slotEl;
      };

      jogoEl.appendChild(mkSlot(jogo.a, 0, jogo.b));
      jogoEl.appendChild(mkSlot(jogo.b, 1, jogo.a));
      jEl.appendChild(jogoEl);
    });

    rEl.appendChild(jEl);
    return rEl;
  }

  // Montar o Chaveamento em Espelho (Split Bracket)
  
  // Coluna Esquerda: 32_avos (Esq) -> Oitavas (Esq) -> Quartas (Esq) -> Semifinal (Esq)
  const colEsquerda = document.createElement('div');
  colEsquerda.className = 'mata-coluna esquerda';
  colEsquerda.appendChild(renderColunaRodada('32 avos', r32.slice(0, 8)));
  colEsquerda.appendChild(renderColunaRodada('Oitavas', r16.slice(0, 4)));
  colEsquerda.appendChild(renderColunaRodada('Quartas', qf.slice(0, 2)));
  colEsquerda.appendChild(renderColunaRodada('Semifinal', [sf[0]]));

  // Coluna Central: Final, 3º Lugar e Campeão
  const colCentro = document.createElement('div');
  colCentro.className = 'mata-centro';
  
  const finalEl = renderColunaRodada('Grande Final', [final]);
  finalEl.classList.add('final-col-wrapper');
  
  const terceiroEl = renderColunaRodada('Disputa de 3º Lugar', [terceiro]);
  terceiroEl.classList.add('terceiro-col-wrapper');

  const campiaoBox = document.createElement('div');
  campiaoBox.className = 'campiao-box';
  campiaoBox.innerHTML = `
    <div class="campiao-label">Campeão do Mundo</div>
    <div class="campiao-nome">${campeao ? getFlag(campeao) : '—'}</div>
  `;

  colCentro.appendChild(finalEl);
  colCentro.appendChild(terceiroEl);
  colCentro.appendChild(campiaoBox);

  // Coluna Direita: Semifinal (Dir) <- Quartas (Dir) <- Oitavas (Dir) <- 32_avos (Dir)
  const colDireita = document.createElement('div');
  colDireita.className = 'mata-coluna direita';
  colDireita.appendChild(renderColunaRodada('Semifinal', [sf[1]]));
  colDireita.appendChild(renderColunaRodada('Quartas', qf.slice(2, 4)));
  colDireita.appendChild(renderColunaRodada('Oitavas', r16.slice(4, 8)));
  colDireita.appendChild(renderColunaRodada('32 avos', r32.slice(8, 16)));

  bracket.className = `mata-bracket tab-${activeMataTab}`;
  bracket.appendChild(colEsquerda);
  bracket.appendChild(colCentro);
  bracket.appendChild(colDireita);
}

// ── CONFETE ───────────────────────────────────
// 2 explosões: canto esquerdo e canto direito
// cruzam na diagonal — 220 pedaços por explosão
function iniciarConfete() {
  const canvas = document.getElementById('confete-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Cores: branco, amarelo, verde, azul
  const CORES = ['#ffffff','#FFD700','#FFEC00','#009C3B','#00D44F','#002776','#00aaff'];

  // Ponto de explosão esquerdo: canto inferior esquerdo
  const BLAST_L = { x: canvas.width * 0.08, y: canvas.height * 0.92 };
  // Ponto de explosão direito: canto inferior direito
  const BLAST_R = { x: canvas.width * 0.92, y: canvas.height * 0.92 };

  const COUNT = 220;

  function criarParticula(origin, direcaoPrincipal) {
    // direcaoPrincipal: 1 = esq→dir-cima, -1 = dir→esq-cima
    const angle = direcaoPrincipal === 1
      ? (-Math.PI / 2) + (Math.random() - 0.3) * (Math.PI * 0.7)   // ~subindo p/ dir
      : (-Math.PI / 2) + (Math.random() - 0.7) * (Math.PI * 0.7);  // ~subindo p/ esq

    const speed = 8 + Math.random() * 18;
    return {
      x:     origin.x + (Math.random() - 0.5) * 30,
      y:     origin.y + (Math.random() - 0.5) * 30,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      rot:   Math.random() * 360,
      vrot:  (Math.random() - 0.5) * 18,
      w:     Math.random() * 12 + 4,
      h:     Math.random() * 6  + 3,
      color: CORES[Math.floor(Math.random() * CORES.length)],
      gravity: 0.28 + Math.random() * 0.14,
      shape:   Math.random() < 0.4 ? 'circle' : 'rect',
      alpha:   1,
    };
  }

  // Cria todas as partículas das 2 explosões
  let particles = [];
  for (let i = 0; i < COUNT; i++) particles.push(criarParticula(BLAST_L,  1));
  for (let i = 0; i < COUNT; i++) particles.push(criarParticula(BLAST_R, -1));

  let frame = 0;
  const FADE_START = 120;
  const FADE_END   = 220;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += p.gravity;
      p.rot += p.vrot;

      if (frame > FADE_START) {
        p.alpha = Math.max(0, 1 - (frame - FADE_START) / (FADE_END - FADE_START));
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });

    frame++;
    if (frame < FADE_END) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderRanking();
  renderizarGrupos();
  setTimeout(iniciarConfete, 300);
});


/* Bandeiras */ 

const countries = {
  BR: "Brasil",
  AR: "Argentina",
  UY: "Uruguai",
  CO: "Colômbia",
  EC: "Equador",
  VE: "Venezuela",
  CL: "Chile",
  PY: "Paraguai",
  BO: "Bolívia",
  PE: "Peru",

  FR: "França",
  DE: "Alemanha",
  ES: "Espanha",
  PT: "Portugal",
  IT: "Itália",
  NL: "Holanda",
  BE: "Bélgica",
  HR: "Croácia",
  CH: "Suíça",
  AT: "Áustria",
  DK: "Dinamarca",
  RS: "Sérvia",
  SE: "Suécia",
  NO: "Noruega",
  PL: "Polônia",
  UA: "Ucrânia",
  TR: "Turquia",
  CZ: "República Tcheca",
  SCT: "Escócia",

  US: "Estados Unidos",
  CA: "Canadá",
  MX: "México",
  CR: "Costa Rica",
  JM: "Jamaica",
  PA: "Panamá",

  JP: "Japão",
  KR: "Coreia do Sul",
  AU: "Austrália",
  IR: "Irã",
  SA: "Arábia Saudita",
  QA: "Qatar",
  AE: "Emirados Árabes",

  MA: "Marrocos",
  SN: "Senegal",
  EG: "Egito",
  DZ: "Argélia",
  TN: "Tunísia",
  CM: "Camarões",
  NG: "Nigéria",
  ZA: "África do Sul",
  GH: "Gana",

  NZ: "Nova Zelândia"
};

const countryCodes = {
  'Brasil': 'br',
  'Argentina': 'ar',
  'Uruguai': 'uy',
  'Colômbia': 'co',
  'Equador': 'ec',
  'Venezuela': 've',
  'Chile': 'cl',
  'Paraguai': 'py',
  'Bolívia': 'bo',
  'Peru': 'pe',

  'França': 'fr',
  'Alemanha': 'de',
  'Espanha': 'es',
  'Portugal': 'pt',
  'Itália': 'it',
  'Holanda': 'nl',
  'Bélgica': 'be',
  'Croácia': 'hr',
  'Suíça': 'ch',
  'Áustria': 'at',
  'Dinamarca': 'dk',
  'Sérvia': 'rs',
  'Suécia': 'se',
  'Noruega': 'no',
  'Polônia': 'pl',
  'Turquia': 'tr',
  'Escócia': 'gb-sct',
  'Inglaterra': 'gb-eng',

  'EUA': 'us',
  'Canadá': 'ca',
  'México': 'mx',
  'Costa Rica': 'cr',
  'Panamá': 'pa',

  'Japão': 'jp',
  'Coreia do Sul': 'kr',
  'Austrália': 'au',
  'Irã': 'ir',
  'Arábia Saudita': 'sa',
  'Qatar': 'qa',

  'Marrocos': 'ma',
  'Senegal': 'sn',
  'Egito': 'eg',
  'Argélia': 'dz',
  'Tunísia': 'tn',
  'Gana': 'gh',
  'África do Sul': 'za',

  'Nova Zelândia': 'nz',

  'Rep. Tcheca': 'cz',
  'Curaçao': 'cw',
  'Cabo Verde': 'cv',
  'Iraque': 'iq',
  'Jordânia': 'jo',
  'RD Congo': 'cd',
  'Uzbequistão': 'uz',
  'Bósnia e Herz.': 'ba',
  'Haiti': 'ht',
  'Costa do Marfim': 'ci'
};

function getFlag(country) {
  const code = countryCodes[country];

  if (!code) return country;

  return `
    <span class="team-flag-wrapper">
      <span class="fi fi-${code}"></span>
      <span>${country}</span>
    </span>
  `;
}