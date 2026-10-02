// Fonte única da verdade para cálculo de ligas.
// Use essa função em qualquer componente para consistência total.
export function obterLiga(xp) {
  if (xp < 150)  return { nome: "Bronze",       cor: "#cd7f32", icone: "fa-medal"  }
  if (xp < 300)  return { nome: "Prata",         cor: "#c0c0c0", icone: "fa-shield" }
  if (xp < 501)  return { nome: "Ouro",          cor: "#ffd700", icone: "fa-trophy" }
  if (xp < 850)  return { nome: "Platina",       cor: "#b0e0e6", icone: "fa-trophy" }
  if (xp < 1100) return { nome: "Diamante",      cor: "#00d2ff", icone: "fa-gem"    }
  if (xp < 1600) return { nome: "Champion",      cor: "#a855f7", icone: "fa-gem"    }
  if (xp < 1750) return { nome: "GrandChampion", cor: "#ef4444", icone: "fa-gem"    }
  return           { nome: "Mestre",             cor: "#f1c40f", icone: "fa-crown"  }
}
