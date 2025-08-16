/** @format */

import { vars } from "nativewind";

type ColorKey = `--color-${string}-${string}`;
type ColorValue = `${number} ${number} ${number}`;
type ColorMap = Record<ColorKey, ColorValue>;

const lightThemeMap = {
	/* Primary - Tailwind blue */
	"--color-primary-0": "239 246 255", // blue-50 #eff6ff
	"--color-primary-50": "219 234 254", // blue-100 #dbeafe
	"--color-primary-100": "191 219 254", // blue-200 #bfdbfe
	"--color-primary-200": "147 197 253", // blue-300 #93c5fd
	"--color-primary-300": "96 165 250", // blue-400 #60a5fa
	"--color-primary-400": "59 130 246", // blue-500 #3b82f6
	"--color-primary-500": "37 99 235", // blue-600 #2563eb
	"--color-primary-600": "29 78 216", // blue-700 #1d4ed8
	"--color-primary-700": "30 64 175", // blue-800 #1e40af
	"--color-primary-800": "23 37 84", // blue-900 #172554
	"--color-primary-900": "12 16 42", // blue-950 #0c102a
	"--color-primary-950": "1 1 8", // blue-dark #010108

	/* Secondary - Tailwind slate */
	"--color-secondary-0": "248 250 252", // slate-50 #f8fafc
	"--color-secondary-50": "241 245 249", // slate-100 #f1f5f9
	"--color-secondary-100": "226 232 240", // slate-200 #e2e8f0
	"--color-secondary-200": "203 213 225", // slate-300 #cbd5e1
	"--color-secondary-300": "148 163 184", // slate-400 #94a3b8
	"--color-secondary-400": "100 116 139", // slate-500 #64748b
	"--color-secondary-500": "71 85 105", // slate-600 #475569
	"--color-secondary-600": "51 65 85", // slate-700 #334155
	"--color-secondary-700": "30 41 59", // slate-800 #1e293b
	"--color-secondary-800": "15 23 42", // slate-900 #0f172a
	"--color-secondary-900": "2 6 23", // slate-950 #020617
	"--color-secondary-950": "1 1 8", // blue-dark #010108

	/* Tertiary - Tailwind gray */
	"--color-tertiary-0": "249 250 251", // gray-50 #f9fafb
	"--color-tertiary-50": "243 244 246", // gray-100 #f3f4f6
	"--color-tertiary-100": "229 231 235", // gray-200 #e5e7eb
	"--color-tertiary-200": "209 213 219", // gray-300 #d1d5db
	"--color-tertiary-300": "156 163 175", // gray-400 #9ca3af
	"--color-tertiary-400": "107 114 128", // gray-500 #6b7280
	"--color-tertiary-500": "75 85 99", // gray-600 #4b5563
	"--color-tertiary-600": "55 65 81", // gray-700 #374151
	"--color-tertiary-700": "31 41 55", // gray-800 #1f2937
	"--color-tertiary-800": "17 24 39", // gray-900 #111827
	"--color-tertiary-900": "3 7 18", // gray-950 #030712
	"--color-tertiary-950": "3 7 18", // gray-950 #030712

	/* Error - Tailwind red */
	"--color-error-0": "254 242 242", // red-50 #fef2f2
	"--color-error-50": "254 226 226", // red-100 #fee2e2
	"--color-error-100": "254 205 205", // red-200 #fecaca
	"--color-error-200": "252 165 165", // red-300 #fca5a5
	"--color-error-300": "239 68 68", // red-400 #ef4444
	"--color-error-400": "220 38 38", // red-500 #dc2626
	"--color-error-500": "185 28 28", // red-600 #b91c1c
	"--color-error-600": "153 27 27", // red-700 #991b1b
	"--color-error-700": "99 15 25", // red-800 #660e18
	"--color-error-800": "69 10 16", // red-900 #450a0a
	"--color-error-900": "45 7 10", // red-950 #2c0508
	"--color-error-950": "45 7 10", // red-950 #2c0508

	/* Success - Tailwind green */
	"--color-success-0": "240 253 244", // green-50 #f0fdf4
	"--color-success-50": "220 252 231", // green-100 #dcfce7
	"--color-success-100": "209 250 229", // green-200 #d1fae5
	"--color-success-200": "187 247 208", // green-300 #bbf7d0
	"--color-success-300": "134 239 172", // green-400 #86efac
	"--color-success-400": "74 222 128", // green-500 #4ade80
	"--color-success-500": "34 197 94", // green-600 #22c55e
	"--color-success-600": "22 163 74", // green-700 #16a34a
	"--color-success-700": "21 128 61", // green-800 #15803d
	"--color-success-800": "6 78 59", // green-900 #064e3b
	"--color-success-900": "5 16 12", // green-950 #05100c
	"--color-success-950": "5 16 12", // green-950 #05100c

	/* Warning - Tailwind amber */
	"--color-warning-0": "255 251 235", // amber-50 #fffbeb
	"--color-warning-50": "255 249 216", // amber-100 #fffbe7
	"--color-warning-100": "254 243 199", // amber-200 #fef3c7
	"--color-warning-200": "253 224 71", // amber-300 #fde047
	"--color-warning-300": "251 191 36", // amber-400 #fbbf24
	"--color-warning-400": "245 158 11", // amber-500 #f59e0b
	"--color-warning-500": "217 119 6", // amber-600 #d97706
	"--color-warning-600": "180 83 9", // amber-700 #b45309
	"--color-warning-700": "120 53 15", // amber-800 #78350f
	"--color-warning-800": "77 47 17", // amber-900 #4d2f11
	"--color-warning-900": "25 18 10", // amber-950 #19120a
	"--color-warning-950": "25 18 10", // amber-950 #19120a

	/* Info - Tailwind sky */
	"--color-info-0": "240 249 255", // sky-50 #f0f9ff
	"--color-info-50": "239 246 255", // sky-100 #eff6ff
	"--color-info-100": "224 242 254", // sky-200 #e0f2fe
	"--color-info-200": "186 230 253", // sky-300 #bae6fd
	"--color-info-300": "125 211 252", // sky-400 #7dd3fc
	"--color-info-400": "56 189 248", // sky-500 #38bdf8
	"--color-info-500": "14 165 233", // sky-600 #0ea5e9
	"--color-info-600": "19 154 185", // sky-700 #1399b9
	"--color-info-700": "14 116 144", // sky-800 #0e7490
	"--color-info-800": "8 47 70", // sky-900 #082f49
	"--color-info-900": "7 14 28", // sky-950 #070e1c
	"--color-info-950": "7 14 28", // sky-950 #070e1c

	/* Typography - Tailwind slate */
	"--color-typography-0": "248 250 252", // slate-50 #f8fafc
	"--color-typography-50": "241 245 249", // slate-100 #f1f5f9
	"--color-typography-100": "226 232 240", // slate-200 #e2e8f0
	"--color-typography-200": "203 213 225", // slate-300 #cbd5e1
	"--color-typography-300": "148 163 184", // slate-400 #94a3b8
	"--color-typography-400": "100 116 139", // slate-500 #64748b
	"--color-typography-500": "71 85 105", // slate-600 #475569
	"--color-typography-600": "51 65 85", // slate-700 #334155
	"--color-typography-700": "30 41 59", // slate-800 #1e293b
	"--color-typography-800": "15 23 42", // slate-900 #0f172a
	"--color-typography-900": "2 6 23", // slate-950 #020617
	"--color-typography-950": "1 1 8", // blue-dark #010108

	/* Outline - Tailwind slate */
	"--color-outline-0": "248 250 252", // slate-50 #f8fafc
	"--color-outline-50": "241 245 249", // slate-100 #f1f5f9
	"--color-outline-100": "226 232 240", // slate-200 #e2e8f0
	"--color-outline-200": "203 213 225", // slate-300 #cbd5e1
	"--color-outline-300": "148 163 184", // slate-400 #94a3b8
	"--color-outline-400": "100 116 139", // slate-500 #64748b
	"--color-outline-500": "71 85 105", // slate-600 #475569
	"--color-outline-600": "51 65 85", // slate-700 #334155
	"--color-outline-700": "30 41 59", // slate-800 #1e293b
	"--color-outline-800": "15 23 42", // slate-900 #0f172a
	"--color-outline-900": "2 6 23", // slate-950 #020617
	"--color-outline-950": "1 1 8", // blue-dark #010108

	/* Background - Tailwind slate */
	"--color-background-0": "248 250 252", // slate-50 #f8fafc
	"--color-background-50": "241 245 249", // slate-100 #f1f5f9
	"--color-background-100": "226 232 240", // slate-200 #e2e8f0
	"--color-background-200": "203 213 225", // slate-300 #cbd5e1
	"--color-background-300": "148 163 184", // slate-400 #94a3b8
	"--color-background-400": "100 116 139", // slate-500 #64748b
	"--color-background-500": "71 85 105", // slate-600 #475569
	"--color-background-600": "51 65 85", // slate-700 #334155
	"--color-background-700": "30 41 59", // slate-800 #1e293b
	"--color-background-800": "15 23 42", // slate-900 #0f172a
	"--color-background-900": "2 6 23", // slate-950 #020617
	"--color-background-950": "1 1 8", // blue-dark #010108

	/* Background Special */
	"--color-background-error": "254 242 242", // red-50 #fef2f2
	"--color-background-warning": "255 251 235", // amber-50 #fffbeb
	"--color-background-success": "240 253 244", // green-50 #f0fdf4
	"--color-background-muted": "248 250 252", // slate-50 #f8fafc
	"--color-background-info": "240 249 255", // sky-50 #f0f9ff

	/* Focus Ring Indicator */
	"--color-indicator-primary": "100 116 139", // slate-500 #64748b
	"--color-indicator-info": "14 165 233", // sky-600 #0ea5e9
	"--color-indicator-error": "220 38 38", // red-500 #dc2626
} satisfies ColorMap;

type ThemeColorKey = keyof typeof lightThemeMap;
type ThemeColorMap = Record<ThemeColorKey, ColorValue>;

// TODO: Confirm this dark theme colors are correct. Was ignored because we don't support dark theme yet.
const darkThemeMap = {
	/* Primary - Tailwind blue */
	"--color-primary-0": "1 1 8", // blue-dark #010108
	"--color-primary-50": "12 16 42", // blue-950 #0c102a
	"--color-primary-100": "23 37 84", // blue-900 #172554
	"--color-primary-200": "30 64 175", // blue-800 #1e40af
	"--color-primary-300": "29 78 216", // blue-700 #1d4ed8
	"--color-primary-400": "37 99 235", // blue-600 #2563eb
	"--color-primary-500": "59 130 246", // blue-500 #3b82f6
	"--color-primary-600": "96 165 250", // blue-400 #60a5fa
	"--color-primary-700": "147 197 253", // blue-300 #93c5fd
	"--color-primary-800": "191 219 254", // blue-200 #bfdbfe
	"--color-primary-900": "219 234 254", // blue-100 #dbeafe
	"--color-primary-950": "239 246 255", // blue-50 #eff6ff

	/* Secondary - Tailwind slate */
	"--color-secondary-0": "1 1 8", // blue-dark #010108
	"--color-secondary-50": "2 6 23", // slate-950 #020617
	"--color-secondary-100": "15 23 42", // slate-900 #0f172a
	"--color-secondary-200": "30 41 59", // slate-800 #1e293b
	"--color-secondary-300": "51 65 85", // slate-700 #334155
	"--color-secondary-400": "71 85 105", // slate-600 #475569
	"--color-secondary-500": "100 116 139", // slate-500 #64748b
	"--color-secondary-600": "148 163 184", // slate-400 #94a3b8
	"--color-secondary-700": "203 213 225", // slate-300 #cbd5e1
	"--color-secondary-800": "226 232 240", // slate-200 #e2e8f0
	"--color-secondary-900": "241 245 249", // slate-100 #f1f5f9
	"--color-secondary-950": "248 250 252", // slate-50 #f8fafc

	/* Tertiary - Tailwind gray */
	"--color-tertiary-0": "3 7 18", // gray-950 #030712
	"--color-tertiary-50": "3 7 18", // gray-950 #030712
	"--color-tertiary-100": "17 24 39", // gray-900 #111827
	"--color-tertiary-200": "31 41 55", // gray-800 #1f2937
	"--color-tertiary-300": "55 65 81", // gray-700 #374151
	"--color-tertiary-400": "75 85 99", // gray-600 #4b5563
	"--color-tertiary-500": "107 114 128", // gray-500 #6b7280
	"--color-tertiary-600": "156 163 175", // gray-400 #9ca3af
	"--color-tertiary-700": "209 213 219", // gray-300 #d1d5db
	"--color-tertiary-800": "229 231 235", // gray-200 #e5e7eb
	"--color-tertiary-900": "243 244 246", // gray-100 #f3f4f6
	"--color-tertiary-950": "249 250 251", // gray-50 #f9fafb

	/* Error - Tailwind red */
	"--color-error-0": "45 7 10", // red-950 #2c0508
	"--color-error-50": "45 7 10", // red-950 #2c0508
	"--color-error-100": "69 10 16", // red-900 #450a0a
	"--color-error-200": "99 15 25", // red-800 #660e18
	"--color-error-300": "153 27 27", // red-700 #991b1b
	"--color-error-400": "185 28 28", // red-600 #b91c1c
	"--color-error-500": "220 38 38", // red-500 #dc2626
	"--color-error-600": "239 68 68", // red-400 #ef4444
	"--color-error-700": "252 165 165", // red-300 #fca5a5
	"--color-error-800": "254 205 205", // red-200 #fecaca
	"--color-error-900": "254 226 226", // red-100 #fee2e2
	"--color-error-950": "254 242 242", // red-50 #fef2f2

	/* Success - Tailwind green */
	"--color-success-0": "5 16 12", // green-950 #05100c
	"--color-success-50": "5 16 12", // green-950 #05100c
	"--color-success-100": "6 78 59", // green-900 #064e3b
	"--color-success-200": "21 128 61", // green-800 #15803d
	"--color-success-300": "22 163 74", // green-700 #16a34a
	"--color-success-400": "34 197 94", // green-600 #22c55e
	"--color-success-500": "74 222 128", // green-500 #4ade80
	"--color-success-600": "134 239 172", // green-400 #86efac
	"--color-success-700": "187 247 208", // green-300 #bbf7d0
	"--color-success-800": "209 250 229", // green-200 #d1fae5
	"--color-success-900": "220 252 231", // green-100 #dcfce7
	"--color-success-950": "240 253 244", // green-50 #f0fdf4

	/* Warning - Tailwind amber */
	"--color-warning-0": "25 18 10", // amber-950 #19120a
	"--color-warning-50": "25 18 10", // amber-950 #19120a
	"--color-warning-100": "77 47 17", // amber-900 #4d2f11
	"--color-warning-200": "120 53 15", // amber-800 #78350f
	"--color-warning-300": "180 83 9", // amber-700 #b45309
	"--color-warning-400": "217 119 6", // amber-600 #d97706
	"--color-warning-500": "245 158 11", // amber-500 #f59e0b
	"--color-warning-600": "251 191 36", // amber-400 #fbbf24
	"--color-warning-700": "253 224 71", // amber-300 #fde047
	"--color-warning-800": "254 243 199", // amber-200 #fef3c7
	"--color-warning-900": "255 249 216", // amber-100 #fffbe7
	"--color-warning-950": "255 251 235", // amber-50 #fffbeb

	/* Info - Tailwind sky */
	"--color-info-0": "7 14 28", // sky-950 #070e1c
	"--color-info-50": "7 14 28", // sky-950 #070e1c
	"--color-info-100": "8 47 70", // sky-900 #082f49
	"--color-info-200": "14 116 144", // sky-800 #0e7490
	"--color-info-300": "19 154 185", // sky-700 #1399b9
	"--color-info-400": "14 165 233", // sky-600 #0ea5e9
	"--color-info-500": "56 189 248", // sky-500 #38bdf8
	"--color-info-600": "125 211 252", // sky-400 #7dd3fc
	"--color-info-700": "186 230 253", // sky-300 #bae6fd
	"--color-info-800": "224 242 254", // sky-200 #e0f2fe
	"--color-info-900": "239 246 255", // sky-100 #eff6ff
	"--color-info-950": "240 249 255", // sky-50 #f0f9ff

	/* Typography - Tailwind slate */
	"--color-typography-0": "1 1 8", // blue-dark #010108
	"--color-typography-50": "2 6 23", // slate-950 #020617
	"--color-typography-100": "15 23 42", // slate-900 #0f172a
	"--color-typography-200": "30 41 59", // slate-800 #1e293b
	"--color-typography-300": "51 65 85", // slate-700 #334155
	"--color-typography-400": "71 85 105", // slate-600 #475569
	"--color-typography-500": "100 116 139", // slate-500 #64748b
	"--color-typography-600": "148 163 184", // slate-400 #94a3b8
	"--color-typography-700": "203 213 225", // slate-300 #cbd5e1
	"--color-typography-800": "226 232 240", // slate-200 #e2e8f0
	"--color-typography-900": "241 245 249", // slate-100 #f1f5f9
	"--color-typography-950": "248 250 252", // slate-50 #f8fafc

	/* Outline - Tailwind slate */
	"--color-outline-0": "1 1 8", // blue-dark #010108
	"--color-outline-50": "2 6 23", // slate-950 #020617
	"--color-outline-100": "15 23 42", // slate-900 #0f172a
	"--color-outline-200": "30 41 59", // slate-800 #1e293b
	"--color-outline-300": "51 65 85", // slate-700 #334155
	"--color-outline-400": "71 85 105", // slate-600 #475569
	"--color-outline-500": "100 116 139", // slate-500 #64748b
	"--color-outline-600": "148 163 184", // slate-400 #94a3b8
	"--color-outline-700": "203 213 225", // slate-300 #cbd5e1
	"--color-outline-800": "226 232 240", // slate-200 #e2e8f0
	"--color-outline-900": "241 245 249", // slate-100 #f1f5f9
	"--color-outline-950": "248 250 252", // slate-50 #f8fafc

	/* Background - Tailwind slate */
	"--color-background-0": "1 1 8", // blue-dark #010108
	"--color-background-50": "2 6 23", // slate-950 #020617
	"--color-background-100": "15 23 42", // slate-900 #0f172a
	"--color-background-200": "30 41 59", // slate-800 #1e293b
	"--color-background-300": "51 65 85", // slate-700 #334155
	"--color-background-400": "71 85 105", // slate-600 #475569
	"--color-background-500": "100 116 139", // slate-500 #64748b
	"--color-background-600": "148 163 184", // slate-400 #94a3b8
	"--color-background-700": "203 213 225", // slate-300 #cbd5e1
	"--color-background-800": "226 232 240", // slate-200 #e2e8f0
	"--color-background-900": "241 245 249", // slate-100 #f1f5f9
	"--color-background-950": "248 250 252", // slate-50 #f8fafc

	/* Background Special */
	"--color-background-error": "85 15 15", // Red-50 #550F0F
	"--color-background-warning": "80 50 10", // Yellow-50 #50320A
	"--color-background-success": "5 50 25", // Green-50 #053219
	"--color-background-muted": "15 15 15", // Deep Gray #0F0F0F
	"--color-background-info": "8 47 73", // Sky-50 #082F49

	/* Focus Ring Indicator */
	"--color-indicator-primary": "160 160 160", // Gray-600 #A0A0A0
	"--color-indicator-info": "14 165 233", // Sky-500 #0EA5E9
	"--color-indicator-error": "239 68 68", // Red-500 #EF4444
} satisfies ThemeColorMap;

const config = {
	light: vars(lightThemeMap),
	dark: vars(darkThemeMap),
};

export { config, lightThemeMap, darkThemeMap };
export type { ThemeColorMap, ThemeColorKey, ColorKey, ColorValue };
