export interface ProductResult {
  title: string;
  imageUrl: string;
  isCool: boolean;
  coolPct: number;
  coolEmoji: string;
  trashEmoji: string;
}

const W = 720;
const H = 1280;

const INTRO_DUR = 1.5;
const Q_DUR = 3.0;
const SUMMARY_DUR = 2.5;

function totalDuration(count: number) {
  return INTRO_DUR + count * Q_DUR + SUMMARY_DUR;
}

async function preloadImages(urls: string[]): Promise<Map<string, HTMLImageElement>> {
  const map = new Map<string, HTMLImageElement>();
  await Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            map.set(url, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  );
  return map;
}

export async function generateRecapVideo(
  results: ProductResult[],
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const imageMap = await preloadImages(results.map((r) => r.imageUrl));

  const stream = canvas.captureStream(30);

  const candidates = [
    "video/mp4;codecs=avc1,mp4a",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  const mimeType =
    candidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

  const recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const duration = totalDuration(results.length);

  const agreementCount = results.filter((r) => {
    const userPct = r.isCool ? r.coolPct : 100 - r.coolPct;
    return userPct >= 50;
  }).length;

  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType || "video/webm" });
      resolve(blob);
    };
    recorder.onerror = () => reject(new Error("Recording failed"));

    recorder.start(100);
    const startTime = performance.now();

    const frame = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed >= duration) {
        drawFrame(ctx, results, imageMap, duration - 0.01, agreementCount);
        setTimeout(() => recorder.stop(), 100);
        onProgress?.(100);
        return;
      }

      drawFrame(ctx, results, imageMap, elapsed, agreementCount);
      onProgress?.(Math.round((elapsed / duration) * 100));
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  });
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  results: ProductResult[],
  imageMap: Map<string, HTMLImageElement>,
  elapsed: number,
  agreementCount: number
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  if (elapsed < INTRO_DUR) {
    drawIntro(ctx, elapsed);
  } else if (elapsed < INTRO_DUR + results.length * Q_DUR) {
    const qElapsed = elapsed - INTRO_DUR;
    const qIndex = Math.floor(qElapsed / Q_DUR);
    const qTime = qElapsed - qIndex * Q_DUR;
    drawProduct(ctx, results[qIndex], imageMap, qIndex, results.length, qTime);
  } else {
    const sTime = elapsed - INTRO_DUR - results.length * Q_DUR;
    drawSummary(ctx, results, agreementCount, sTime);
  }

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `700 ${26}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("CoolOrTrash.com", W / 2, H - 40);
}

function drawIntro(ctx: CanvasRenderingContext2D, t: number) {
  const alpha = easeOut(Math.min(t / 0.4, 1));
  ctx.globalAlpha = alpha;

  ctx.font = `120px -apple-system, BlinkMacSystemFont, 'Apple Color Emoji', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("\uD83D\uDE0E", W / 2 - 80, H / 2 - 120);
  ctx.fillText("\uD83D\uDDD1\uFE0F", W / 2 + 80, H / 2 - 120);

  ctx.fillStyle = "#0a0a0a";
  ctx.font = `900 64px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("Cool or Trash?", W / 2, H / 2 + 10);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 32px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("My picks", W / 2, H / 2 + 70);

  ctx.globalAlpha = 1;
  ctx.textBaseline = "alphabetic";
}

function drawProduct(
  ctx: CanvasRenderingContext2D,
  q: ProductResult,
  imageMap: Map<string, HTMLImageElement>,
  index: number,
  total: number,
  t: number
) {
  const userPct = q.isCool ? q.coolPct : 100 - q.coolPct;
  const isMajority = userPct >= 50;

  // Progress dots
  ctx.textAlign = "center";
  const dotY = 80;
  const dotSize = 8;
  const dotGap = 22;
  const dotsStartX = W / 2 - ((total - 1) * dotGap) / 2;
  for (let i = 0; i < total; i++) {
    ctx.fillStyle = i <= index ? "#8b5cf6" : "#e5e5e5";
    ctx.beginPath();
    ctx.arc(dotsStartX + i * dotGap, dotY, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Product image
  const imgAlpha = easeOut(Math.min(t / 0.35, 1));
  ctx.globalAlpha = imgAlpha;

  const img = imageMap.get(q.imageUrl);
  if (img) {
    const maxImgW = 360;
    const maxImgH = 360;
    const scale = Math.min(maxImgW / img.width, maxImgH / img.height);
    const imgW = img.width * scale;
    const imgH = img.height * scale;
    const imgX = W / 2 - imgW / 2;
    const imgY = 140;

    // White bg + shadow
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#f5f5f5";
    roundRect(ctx, imgX - 20, imgY - 20, imgW + 40, imgH + 40, 20);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.drawImage(img, imgX, imgY, imgW, imgH);
  }

  // Title
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `800 42px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(q.title, W / 2, 560);
  ctx.globalAlpha = 1;

  // User answer pill
  if (t >= 0.6) {
    const aAlpha = easeOut(Math.min((t - 0.6) / 0.25, 1));
    ctx.globalAlpha = aAlpha;

    const pillW = 280;
    const pillH = 70;
    const pillX = W / 2 - pillW / 2;
    const pillY = 600;

    ctx.fillStyle = q.isCool ? "#dbeafe" : "#fee2e2";
    roundRect(ctx, pillX, pillY, pillW, pillH, 20);
    ctx.fill();

    ctx.fillStyle = q.isCool ? "#1e40af" : "#991b1b";
    ctx.font = `800 32px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    const emoji = q.isCool ? q.coolEmoji : q.trashEmoji;
    ctx.fillText(
      `${q.isCool ? "COOL" : "TRASH"} ${emoji}`,
      W / 2,
      pillY + pillH / 2 + 12
    );

    ctx.globalAlpha = 1;
  }

  // Crowd result
  if (t >= 1.4) {
    const cAlpha = easeOut(Math.min((t - 1.4) / 0.25, 1));
    ctx.globalAlpha = cAlpha;

    const barX = 80;
    const barY = 750;
    const barW = W - 160;
    const barH = 56;
    const coolWidth = Math.max(barW * (q.coolPct / 100), barW * 0.08);
    const trashWidth = barW - coolWidth;

    ctx.fillStyle = "#60a5fa";
    roundRectLeft(ctx, barX, barY, coolWidth, barH, 16);
    ctx.fill();

    ctx.fillStyle = "#fca5a5";
    roundRectRight(ctx, barX + coolWidth, barY, trashWidth, barH, 16);
    ctx.fill();

    ctx.fillStyle = "#1e40af";
    ctx.font = `800 22px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "left";
    if (q.coolPct >= 15) {
      ctx.fillText(`${q.coolEmoji} ${q.coolPct}%`, barX + 14, barY + barH / 2 + 8);
    }

    ctx.fillStyle = "#991b1b";
    ctx.textAlign = "right";
    if (100 - q.coolPct >= 15) {
      ctx.fillText(
        `${100 - q.coolPct}% ${q.trashEmoji}`,
        barX + barW - 14,
        barY + barH / 2 + 8
      );
    }

    // ME marker
    const userOnCool = q.isCool;
    const markerX = userOnCool
      ? barX + coolWidth / 2
      : barX + coolWidth + trashWidth / 2;

    ctx.fillStyle = "#0a0a0a";
    roundRect(ctx, markerX - 32, barY + barH + 12, 64, 30, 15);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 16px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("ME", markerX, barY + barH + 33);

    ctx.fillStyle = "#525252";
    ctx.font = `700 30px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    if (isMajority) {
      ctx.fillText("With the crowd \u2705", W / 2, barY + barH + 90);
    } else {
      ctx.fillText(
        `Only ${userPct}% agree \uD83D\uDC40`,
        W / 2,
        barY + barH + 90
      );
    }

    ctx.globalAlpha = 1;
  }
}

function drawSummary(
  ctx: CanvasRenderingContext2D,
  results: ProductResult[],
  agreementCount: number,
  t: number
) {
  const alpha = easeOut(Math.min(t / 0.4, 1));
  ctx.globalAlpha = alpha;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#0a0a0a";
  ctx.font = `900 140px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText(`${agreementCount}/${results.length}`, W / 2, H / 2 - 100);

  ctx.fillStyle = "#525252";
  ctx.font = `600 36px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("with the crowd", W / 2, H / 2);

  if (t >= 0.8) {
    const ctaAlpha = easeOut(Math.min((t - 0.8) / 0.3, 1));
    ctx.globalAlpha = ctaAlpha;

    ctx.fillStyle = "#8b5cf6";
    ctx.font = `700 32px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillText("Think you know better?", W / 2, H / 2 + 80);

    ctx.fillStyle = "#d4d4d4";
    ctx.font = `600 28px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillText("CoolOrTrash.com", W / 2, H / 2 + 140);
  }

  ctx.globalAlpha = 1;
  ctx.textBaseline = "alphabetic";
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundRectLeft(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundRectRight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}
