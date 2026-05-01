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
                const prevent = (e) => e.preventDefault();
                document.addEventListener("contextmenu", prevent);
                document.addEventListener("dragstart", prevent);
                document.addEventListener("selectstart", prevent);

                const root = document.documentElement;
                let warned = false;
                let opened = false;
                const REDIRECT_URL = "https://www.naver.com";
                const REDIRECT_COOLDOWN_MS = 3000;
                let redirecting = false;
                let lastRedirectAt = 0;

                const setGuard = (on) => {
                  opened = on;
                  root.classList.toggle("als-devtools-open", on);
                  if (on && !warned) {
                    warned = true;
                    alert("개발자 도구가 감지되었습니다. 보안 보호 모드가 활성화됩니다.");
                  }
                  if (on && !redirecting) {
                    const now = Date.now();
                    if (now - lastRedirectAt > REDIRECT_COOLDOWN_MS) {
                      redirecting = true;
                      lastRedirectAt = now;
                      window.location.replace(REDIRECT_URL);
                    }
                  }
                };

                const detect = () => {
                  const wGap = window.outerWidth - window.innerWidth;
                  const hGap = window.outerHeight - window.innerHeight;
                  const maybeOpen = wGap > 160 || hGap > 160;
                  setGuard(maybeOpen);
                };

                window.addEventListener("resize", detect, { passive: true });
                window.addEventListener("focus", detect, { passive: true });
                setInterval(detect, 1200);
                detect();

                document.addEventListener("keydown", (e) => {
                  const key = e.key.toLowerCase();
                  const blocked =
                    key === "f12" ||
                    (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
                    (e.ctrlKey && key === "u");
                  if (blocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!opened) alert("해당 단축키는 사용할 수 없습니다.");
                  }
                });
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
