/** @type {import('prettier').Config} */
export default {
	"semi": true,
	"singleQuote": true,
	"trailingComma": "all",
	"printWidth": 80,
	"proseWrap": "always",
	"tabWidth": 4,
	"useTabs": true,
	"overrides": [
		{
			"files": ".github/workflows/**/*.{yml,yaml}",
			"options": {
				"proseWrap": "preserve"
			}
		}
	]
};