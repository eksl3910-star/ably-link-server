import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "에이블리 링크 교환",
  description: "에이블리 링크를 서로 교환해요",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const REDIRECT_URL = "https://www.naver.com";
                const VIEWPORT_THRESHOLD = 150;
                const RECHECK_MS = 700;
                const REDIRECT_RETRY_MS = 900;
                const REDIRECT_COOLDOWN_MS = 3000;
                let isLocked = false;
                let lastRedirectAt = 0;

                const blockBasicActions = () => {
                  const prevent = (e) => e.preventDefault();
                  document.addEventListener("contextmenu", prevent);
                  document.addEventListener("dragstart", prevent);
                  document.addEventListener("selectstart", prevent);
                };

                const tryRedirect = () => {
                  const now = Date.now();
                  if (now - lastRedirectAt < REDIRECT_COOLDOWN_MS) return;
                  lastRedirectAt = now;
                  window.location.replace(REDIRECT_URL);
                };

                const hardBlock = () => {
                  isLocked = true;
                  document.documentElement.classList.add("als-devtools-open");

                  try {
                    if (document.body) {
                      document.body.innerHTML = "";
                      document.body.style.display = "none";
                    }
                  } catch (_) {}

                  tryRedirect();
                };

                const triggerLock = () => {
                  if (!isLocked) hardBlock();
                };

                const detectViewportGap = () => {
                  const wGap = Math.abs(window.outerWidth - window.innerWidth);
                  const hGap = Math.abs(window.outerHeight - window.innerHeight);
                  return wGap > VIEWPORT_THRESHOLD || hGap > VIEWPORT_THRESHOLD;
                };

                const detectDevtools = () => {
                  if (detectViewportGap()) triggerLock();
                };

                // 3중 감지 #2: console.dir getter trap
                const trapTarget = {};
                Object.defineProperty(trapTarget, "devtools", {
                  get() {
                    triggerLock();
                    return "blocked";
                  },
                });

                const runConsoleTrap = () => {
                  try {
                    console.dir(trapTarget);
                  } catch (_) {}
                };

                // 3중 감지 #3: 단축키 감지
                document.addEventListener(
                  "keydown",
                  (e) => {
                    const key = (e.key || "").toLowerCase();
                    const blocked =
                      key === "f12" ||
                      (e.ctrlKey && e.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
                      (e.ctrlKey && ["u", "s", "p"].includes(key));

                    if (blocked || isLocked) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                    }

                    if (blocked) triggerLock();
                  },
                  true
                );

                blockBasicActions();
                window.addEventListener("resize", detectDevtools, { passive: true });
                window.addEventListener("focus", detectDevtools, { passive: true });

                setInterval(() => {
                  detectDevtools();
                  runConsoleTrap();
                }, RECHECK_MS);

                setInterval(() => {
                  if (isLocked && window.location.href !== REDIRECT_URL) {
                    tryRedirect();
                  }
                }, REDIRECT_RETRY_MS);

                detectDevtools();
                runConsoleTrap();
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.als-devtools-open body > *:not(#als-devtools-shield) {
                filter: blur(8px);
                pointer-events: none !important;
                user-select: none !important;
              }
              #als-devtools-shield {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(15, 15, 20, 0.72);
                backdrop-filter: blur(2px);
                color: #fff;
                text-align: center;
                font-weight: 700;
                line-height: 1.6;
              }
              html.als-devtools-open #als-devtools-shield {
                display: flex;
              }
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none fixed -left-[9999px] -top-[9999px] opacity-0 select-none"
        >
          Created by Daniel (eksl3910)
        </span>
        <div id="als-devtools-shield" aria-hidden="true">
          보안 보호 모드 활성화됨
          <br />
          개발자 도구를 닫으면 다시 이용할 수 있어요.
        </div>
        {children}
      </body>
    </html>
  );
}
