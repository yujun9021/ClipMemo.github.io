# ClipMemo Web

ClipMemo 로컬 전용 버전의 한국어 소개·다운로드 페이지입니다. Vite + HTML/CSS/JavaScript 정적 사이트이며, 로그인·DB·서버 함수가 없습니다. 앱의 메모와 복사 기록도 PC에만 저장됩니다.

## 개발

Node.js 22.12 이상이 필요합니다.

```powershell
cd C:\Study\lab\ClipMemo-Web
npm ci
npm run dev
```

콘솔에 표시된 로컬 주소를 브라우저에서 엽니다. `npm run build`로 `dist`를 만들고, `npm run preview`로 배포용 결과를 확인합니다.

## 다운로드 갱신

준비한 배포본은 ClipMemo 1.6.3 Windows x64 로컬 전용 버전입니다. 버전별 배포 폴더의 `ClipMemoSetup.exe`가 준비된 후 실행합니다. 경로를 생략하면 형제 ClipMemo 프로젝트의 AssemblyInfo.cs에서 현재 버전을 읽습니다.

```powershell
npm run release -- "C:\Study\lab\ClipMemo\dist\ClipMemo-v1.6.3-win-x64\ClipMemoSetup.exe"
npm run verify
npm run build
```

버전·이름·크기·SHA-256·다운로드 경로의 기준은 `public/release.json`입니다. 스크립트가 원본 EXE의 Windows x64 형식을 확인하고 SHA-256을 계산한 뒤 설치 파일만 복사하고 해시 파일과 이 정보를 갱신합니다. 서버 파일명에는 버전을 붙이며 브라우저에는 `ClipMemoSetup.exe`로 저장하도록 안내합니다. Vite가 개발 서버·빌드에서 이 정보를 HTML에 직접 반영하므로 모든 다운로드 링크와 버전 표시가 함께 바뀝니다. JavaScript가 꺼져 있어도 동일한 버전의 다운로드와 안내를 사용할 수 있습니다. 이전 포터블 다운로드는 공개 폴더에서 제외하고 .release-archive에 보관합니다.

`npm run verify`는 파일 크기와 해시, 공개 다운로드 파일 이름, Windows x64 실행 파일 형식을 확인합니다. 앱 소스·실제 메모·토큰·촬영 저장소는 공개 폴더에 복사하지 않습니다.

## GitHub Pages 배포

현재 사이트 주소는 https://yujun9021.github.io/ClipMemo.github.io/ 입니다.

저장소 **Settings → Pages → Build and deployment → Source**는 반드시 **GitHub Actions**로 설정합니다. **Deploy from a branch → main → /(root)**는 Vite 소스를 그대로 공개하므로 CSS·이미지·다운로드가 깨집니다.

`.github/workflows/pages.yml`이 `main` 변경 또는 Actions의 수동 실행 시 의존성 설치 → EXE 검증 → Vite 빌드 → `dist` 업로드·배포를 처리합니다. `actions/configure-pages`가 알려준 실제 경로를 `PAGES_BASE_PATH`로 전달하므로 저장소 이름이나 사용자 도메인이 바뀌어도 이미지·CSS·다운로드 경로를 함께 맞춥니다. Pages 설정 자체에서 주소를 바꾼 경우 워크플로를 다시 실행합니다.

새 버전은 위의 다운로드 갱신 명령을 실행한 후 변경된 EXE·해시·`public/release.json`을 함께 커밋하고 `main`에 push하면 배포됩니다. `dist`는 직접 커밋하지 않습니다. `node_modules`, `.capture`, `.release-archive`와 개발용 파일은 빌드 산출물에 포함되지 않습니다.

## Vercel 연결 (대안)

1. 이 폴더를 Git 저장소에 올리고 Vercel에서 Import합니다. 상위 저장소를 연결한다면 Root Directory를 `ClipMemo-Web`으로 지정합니다.
2. Framework Preset은 **Vite**, Build Command는 `npm run build`, Output Directory는 `dist`입니다. `vercel.json`에 같은 구성을 제공합니다.
3. Node.js는 22.x 이상으로 설정합니다. 환경변수·Supabase 키·DB 연결은 필요 없습니다.
4. 배포 후 메인 화면, 모바일 화면, 다운로드 EXE, SHA-256 링크를 확인합니다.

`public/images`, `public/downloads`, `public/release.json`과 `package-lock.json`을 함께 커밋해야 합니다. `node_modules`, `dist`, `.capture`, `.vercel`은 제외합니다. Vercel에서는 `PAGES_BASE_PATH`를 설정하지 않아 루트 경로를 사용합니다.

## 이미지와 촬영

앱 아이콘은 기존 ClipMemo 자산입니다. 대표·보조 이미지는 1.5.0 앱을 컴퓨터 유즈로 촬영한 실제 창이며, 모든 글과 그림은 공개용 샘플입니다. `.capture`의 별도 데이터 저장소를 사용했고 기존 사용자 메모와 계정은 사용하지 않았습니다.

`scripts/prepare-capture.ps1 -Theme cream` 또는 `-Theme navy`로 샘플 문서와 그림을 준비할 수 있습니다. 기존 촬영 상태는 덮어쓰지 않습니다. 앱을 촬영할 때는 `--data-dir`에 해당 폴더를 지정하고 `--no-startup --foreground`를 사용합니다. 샘플은 수집 정지·로그아웃·자동 실행 해제로 준비되며 일반 호출 단축키와 다른 조합을 사용합니다. 촬영 후에는 해당 샘플 앱의 **설정 → 완전히 종료**로 닫습니다.

## 수동 확인

- 1440px 데스크톱과 390px 모바일에서 가로 넘침, 제목 줄바꿈, 이미지 비율과 메뉴를 확인합니다.
- 상단/하단 다운로드 링크가 같은 버전 EXE를 받는지, 해시 링크가 해당 EXE의 해시인지 확인합니다.
- 기능·사용법 앵커 이동, 키보드 Tab 포커스와 본문 바로가기를 확인합니다.
- JavaScript를 꺼도 다운로드 버튼과 버전·사용법이 그대로 표시되는지 확인합니다.
- 글꼴은 Noto Sans KR을 Google Fonts에서 불러오며 실패하면 맑은 고딕 등 시스템 글꼴을 사용합니다.

앱 기능 테스트는 수행하지 않았으며, 앱 실행은 공개용 이미지 촬영에 한정했습니다.

이전 동기화 버전의 EXE와 웹 배포용 ZIP은 공개 폴더에서 제외하고 로컬의 .release-archive에 보관했습니다. 기존 Windows 앱 배포 폴더와 원본은 유지합니다. 현재 공개 다운로드는 로컬 전용 1.6.3 설치 파일입니다. 사용자의 배포 요청에 따라 GitHub Pages 워크플로로 반영합니다. 에이전트는 설치·제거·앱 실행 테스트를 수행하지 않았습니다.

## 설치 파일 갱신 흐름 (1.6.2부터)

1. 형제 ClipMemo 폴더에서 AssemblyInfo.cs와 app.manifest의 버전을 올립니다.
2. ClipMemo 폴더에서 `.\package.ps1`을 실행해 앱 페이로드와 ClipMemoSetup.exe를 만듭니다.
3. 이 폴더에서 `npm run release` → `npm run verify` → `npm run build`를 실행합니다.
4. 사용자가 설치·업데이트·메모 보관·제거를 확인한 뒤 웹 변경을 커밋하고 main에 push합니다. 자동으로 공개하지 않습니다.

웹 공개 폴더에는 Setup EXE와 해시만 둡니다. 실제 앱은 설치할 때 %LOCALAPPDATA%\Programs\ClipMemo에 복사되며 메모는 %LOCALAPPDATA%\ClipMemo에 유지됩니다. 제거 시 다운로드한 설치 파일은 지워지지 않습니다. 이전 앱 EXE를 웹 릴리스로 지정하면 스크립트가 거부합니다. 설치본과 웹의 버전은 1.6.3입니다. 설치·제거의 실제 실행 확인은 사용자가 수행합니다.