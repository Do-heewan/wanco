export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            하루 한 문제로
            <br />
            코딩테스트를 습관으로
          </h1>
          
          <div className="mt-8 flex flex-col gap-4 text-lg text-gray-700 dark:text-gray-300">
            <p className="font-medium">🔥 매일 새로운 문제로 실력을 키우세요</p>
            <p className="font-medium">📊 스트릭과 통계로 성장을 확인하세요</p>
            <p className="font-medium">🎯 목표 난이도에 맞춘 맞춤형 문제</p>
          </div>
        </div>
      </main>
    </div>
  )
}
