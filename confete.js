// Explosão de confete ao abrir a página (desligada se o usuário pediu menos movimento).
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cores = ["#ffd23f", "#ffffff", "#25d366", "#ff4f8b", "#4fc3f7", "#c9530f"];
  var canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = (canvas.width = innerWidth * dpr);
  var H = (canvas.height = innerHeight * dpr);

  function rajada(x, y, qtd, angulo) {
    var ps = [];
    for (var i = 0; i < qtd; i++) {
      var a = angulo + (Math.random() - 0.5) * 1.3;
      var v = (9 + Math.random() * 11) * dpr;
      ps.push({
        x: x, y: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        w: (6 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
        giro: Math.random() * Math.PI, cor: cores[(Math.random() * cores.length) | 0],
      });
    }
    return ps;
  }

  // Dois canhões nos cantos de baixo, mirando pro centro, e um estouro no meio.
  var parts = rajada(0, H, 70, -Math.PI / 3)
    .concat(rajada(W, H, 70, (-2 * Math.PI) / 3))
    .concat(rajada(W / 2, H * 0.35, 50, -Math.PI / 2));

  var inicio = performance.now();
  function quadro(t) {
    var dt = t - inicio;
    ctx.clearRect(0, 0, W, H);
    var vivos = 0;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.35 * dpr;
      p.x += p.vx; p.y += p.vy;
      p.rot += p.vr; p.giro += 0.12;
      if (p.y > H + 40) continue;
      vivos++;
      ctx.save();
      ctx.globalAlpha = dt > 3500 ? Math.max(0, 1 - (dt - 3500) / 800) : 1;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.giro)); // efeito de papel girando
      ctx.fillStyle = p.cor;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (vivos && dt < 4300) requestAnimationFrame(quadro);
    else canvas.remove();
  }
  setTimeout(function () { requestAnimationFrame(function (t) { inicio = t; quadro(t); }); }, 250);
})();
