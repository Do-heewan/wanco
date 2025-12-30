# Docker 빌드 및 실행 스크립트 (Windows PowerShell)
# 사용법: .\deploy.ps1 -Action "build-and-run"
# .env.local 파일에서 자동으로 환경 변수를 읽습니다

param(
    [ValidateSet("build-and-run", "build", "run")]
    [string]$Action = "build-and-run"
)

# 색상 정의 함수
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "🚀 $Message" -ForegroundColor Yellow
}

# .env.local 파일에서 환경 변수 읽기
function Load-EnvFile {
    if (-not (Test-Path ".env.local")) {
        Write-Error-Custom ".env.local 파일을 찾을 수 없습니다."
        Write-Host ""
        Write-Host ".env.local 파일을 생성하세요:"
        Write-Host ""
        Write-Host "NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
        Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here"
        Write-Host ""
        exit 1
    }

    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # 따옴표 제거
            $value = $value -replace '^["'']|["'']$'
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }

    Write-Success ".env.local 파일에서 환경 변수를 로드했습니다."
}

# 환경 변수 검증
function Check-Env {
    if ([string]::IsNullOrEmpty($env:NEXT_PUBLIC_SUPABASE_URL) -or `
        [string]::IsNullOrEmpty($env:NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        Write-Error-Custom "필수 환경 변수가 누락되었습니다."
        Write-Host ""
        Write-Host "다음 변수가 .env.local에 설정되어야 합니다:"
        Write-Host "  - NEXT_PUBLIC_SUPABASE_URL"
        Write-Host "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        Write-Host ""
        exit 1
    }
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL: $($env:NEXT_PUBLIC_SUPABASE_URL)"
    Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: $($env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Substring(0, [Math]::Min(20, $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length)))..."
}

# Docker 빌드
function Build-Image {
    Write-Info "Docker 이미지를 빌드 중입니다..."
    Write-Host ""
    
    docker build `
        --build-arg NEXT_PUBLIC_SUPABASE_URL="$env:NEXT_PUBLIC_SUPABASE_URL" `
        --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$env:NEXT_PUBLIC_SUPABASE_ANON_KEY" `
        -t wanco:latest .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "빌드 완료!"
    } else {
        Write-Error-Custom "빌드 실패!"
        exit 1
    }
}

# Docker 컨테이너 실행
function Run-Container {
    Write-Info "컨테이너를 실행 중입니다... (포트 3000)"
    Write-Host ""
    Write-Host "http://localhost:3000 에 접속하세요"
    Write-Host "종료하려면 Ctrl+C를 누르세요"
    Write-Host ""
    
    docker run -p 3000:3000 `
        -e NEXT_PUBLIC_SUPABASE_URL="$env:NEXT_PUBLIC_SUPABASE_URL" `
        -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$env:NEXT_PUBLIC_SUPABASE_ANON_KEY" `
        wanco:latest
}

# 메인 로직
Write-Host ""
Write-Info "환경 변수 로드 중..."
Load-EnvFile
Write-Host ""
Write-Info "환경 변수 확인:"
Check-Env
Write-Host ""

switch ($Action) {
    "build-and-run" {
        Build-Image
        Run-Container
    }
    "build" {
        Build-Image
    }
    "run" {
        Write-Info "컨테이너를 실행 중입니다... (포트 3000)"
        docker run -p 3000:3000 wanco:latest
    }
}
