"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function LinkGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10.5 13.5a4.5 4.5 0 0 1 0-6.364l1.061-1.06a4.5 4.5 0 1 1 6.364 6.364l-1.5 1.5M13.5 10.5a4.5 4.5 0 0 1 0 6.364l-1.061 1.06a4.5 4.5 0 1 1-6.364-6.364l1.5-1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json() as Promise<{ maintenanceOn?: boolean }>)
      .then((d) => {
        if (d.maintenanceOn) router.replace("/maintenance");
      })
      .catch(() => {});
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="als-enter max-w-sm text-center">
        <div className="mb-10 flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-[1.35rem] bg-[var(--accent-yellow)] shadow-lg shadow-[#f5e6a0]/60 transition-transform duration-300 ease-out hover:scale-105"
            style={{ color: "var(--warm-ink)" }}
          >
            <LinkGlyph className="h-10 w-10" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">
          에이블리 링크 공유
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#767676] sm:text-lg">
          클릭 한 번으로 링크를 공유하고 받아보세요.
        </p>

        <Link
          href="/login"
          className="group mt-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-yellow)] px-10 py-4 text-lg font-semibold text-[var(--warm-ink)] shadow-lg shadow-[#f5e6a0]/50 transition-all duration-200 hover:shadow-xl hover:shadow-[#f0dc8f]/60 hover:scale-[1.02] active:scale-[0.98]"
        >
          시작하기
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </main>
  );
}
