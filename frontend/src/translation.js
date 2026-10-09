import { call } from 'frappe-ui'

let translationsPromise

export function loadTranslations() {
	if (window.translatedMessages && Object.keys(window.translatedMessages).length) {
		return Promise.resolve(window.translatedMessages)
	}

	if (!translationsPromise) {
		translationsPromise = call('lms.lms.api.get_translations')
			.then((messages) => {
				window.translatedMessages = messages || {}
				return window.translatedMessages
			})
			.catch(() => {
				window.translatedMessages = {}
				return window.translatedMessages
			})
	}

	return translationsPromise
}

export default function translationPlugin(app) {
	app.config.globalProperties.__ = translate
	window.__ = translate
	if (!window.translatedMessages) loadTranslations()
}

function translate(message) {
	let translatedMessages = window.translatedMessages || {}
	let translatedMessage = translatedMessages[message] || message

	const hasPlaceholders = /{\d+}/.test(message)
	if (!hasPlaceholders) {
		return translatedMessage
	}
	return {
		format: function (...args) {
			return translatedMessage.replace(
				/{(\d+)}/g,
				function (match, number) {
					return typeof args[number] != 'undefined'
						? args[number]
						: match
				}
			)
		},
	}
}
