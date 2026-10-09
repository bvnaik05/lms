import type { App } from 'vue'

export default function translationPlugin(app: App): void
export function loadTranslations(): Promise<Record<string, string>>
