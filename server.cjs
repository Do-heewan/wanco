// Railway 배포를 위한 서버 래퍼
// Next.js standalone 모드는 기본적으로 localhost에 바인딩되므로
// Railway의 동적 PORT 환경 변수와 0.0.0.0 호스트 바인딩을 위해 래퍼가 필요합니다.

// 포트 설정 (Railway는 PORT 환경 변수를 제공)
const port = process.env.PORT || 3000

// Next.js standalone 서버는 이미 HTTP 서버를 생성하므로
// 환경 변수를 설정한 후 서버를 로드
// 하지만 standalone 서버가 localhost에 바인딩되어 있다면
// 서버 인스턴스에 접근하여 호스트를 변경해야 합니다.

// standalone 서버를 로드하기 전에 환경 변수 설정
process.env.PORT = String(port)

// Next.js standalone 서버 실행
// standalone 서버는 내부적으로 서버를 생성하므로
// 환경 변수만으로는 호스트를 변경할 수 없을 수 있습니다.
// 따라서 서버 인스턴스에 접근하여 호스트를 변경해야 합니다.

const standaloneServer = require('./.next/standalone/server.js')

// standalone 서버가 이미 서버를 생성했다면
// 서버 인스턴스에 접근하여 호스트를 변경할 수 없으므로
// 대신 새로운 서버를 생성하고 standalone 서버의 핸들러를 사용해야 합니다.

// 하지만 standalone 서버가 export하는 것이 핸들러 함수라면
// 새로운 서버를 만들고 그 핸들러를 사용할 수 있습니다.

const { createServer } = require('http')
const { parse } = require('url')

// standalone 서버가 export하는 핸들러를 가져옴
const handler = standaloneServer.default || standaloneServer

// 새로운 HTTP 서버 생성 (0.0.0.0에 바인딩)
const server = createServer(async (req, res) => {
  try {
    const parsedUrl = parse(req.url || '', true)
    await handler(req, res, parsedUrl)
  } catch (err) {
    console.error('Error occurred handling', req.url, err)
    res.statusCode = 500
    res.end('internal server error')
  }
})

server.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
  console.log(`> Ready on http://0.0.0.0:${port}`)
})

