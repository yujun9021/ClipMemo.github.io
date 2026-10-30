# ClipMemo 웹사이트

ClipMemo 소개와 Microsoft Store 다운로드 안내를 제공하는 Vite 정적 사이트입니다. 로그인·DB·서버 함수는 없습니다.

## 개발과 확인

```powershell
npm ci
npm run dev
npm run verify
npm run build
npm run preview
```

다운로드 주소는 `public/store.json` 한 곳에서 관리합니다. 메인 화면과 하단 버튼이 같은 Microsoft Store 페이지로 연결되며, 별도 설치 파일을 웹에 복사할 필요가 없습니다. 기존 EXE 준비 스크립트와 파일은 이전 배포 기록이며 현재 배포 절차에서 사용하지 않습니다.

## GitHub Pages 배포

저장소 Settings → Pages → Source를 GitHub Actions로 설정합니다. `main`에 변경 내용을 push하면 `.github/workflows/pages.yml`이 의존성 설치, 링크 검증, Vite 빌드와 Pages 배포를 수행합니다. 실제 Pages 경로는 워크플로에서 빌드에 전달합니다. `dist`와 `node_modules`는 커밋하지 않습니다.

앱 업데이트는 Microsoft Store에 제출합니다. 스토어 제품 주소가 같으면 웹 다운로드 링크를 다시 바꿀 필요가 없습니다.

## 개인정보 처리방침

`public/privacy.html`에서 한국어·영어 방침을 제공합니다. 이전 방침은 `public/privacy-history`에 보존합니다. 앱 기능이나 데이터 처리 방식이 바뀌면 방침을 함께 검토합니다.
