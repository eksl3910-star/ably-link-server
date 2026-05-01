const KAKAO_OPEN_URL = "https://open.kakao.com/o/sgYUGb8h";

export default function MaintenancePage() {
  return (
    <main className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f5f6f8] px-6 text-center pointer-events-none">
      <div className="pointer-events-auto flex max-w-md flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1f2430] sm:text-5xl">
          점검중입니다
        </h1>
        <p className="mt-4 text-sm font-medium text-[#7c8394] sm:text-base">
          다음에 다시 서비스를 이용해 주세요
        </p>
        <a
          href={KAKAO_OPEN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex h-12 min-w-[240px] items-center justify-center rounded-2xl bg-[#111] px-8 text-base font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          제작자에게 문의하기
        </a>
      </div>
    </main>
  );
}
