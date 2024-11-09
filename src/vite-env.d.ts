/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOGETHER_API_KEY: string
  readonly VITE_SERPER_API_KEY: string
  readonly VITE_HELICONE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}