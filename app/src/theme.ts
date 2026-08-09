import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// Design tokens synced from the "NeoAuth Design System" Claude Design project
// (styles.css): neutral Helvetica interface, one green accent reserved for
// selection, progress and the primary action — the object icons are the only
// other colour.
export const tokens = {
    canvas: '#F3F3F1',
    card: '#FFFFFF',
    sunken: '#EDEEEB',
    ink: '#14161A',
    inkSoft: '#666B72',
    inkFaint: '#9AA0A6',
    line: '#E3E4E0',
    lineStrong: '#CFD1CC',
    accent: '#1A7F5A',
    accentDark: '#14684A',
    accentWash: '#E9F2EE',
    danger: '#B3261E',
    shadow1: '0 1px 2px rgba(20,22,26,.05), 0 1px 3px rgba(20,22,26,.06)',
    shadow2: '0 2px 4px rgba(20,22,26,.04), 0 8px 20px rgba(20,22,26,.07)',
    shadow3: '0 4px 8px rgba(20,22,26,.04), 0 16px 40px rgba(20,22,26,.09)',
}

// No webfont, nothing to load.
export const font = '"Helvetica Neue", Helvetica, Arial, sans-serif'

let theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: tokens.accent, dark: tokens.accentDark, light: tokens.accentWash },
        success: { main: tokens.accent },
        error: { main: tokens.danger },
        background: { default: tokens.canvas, paper: tokens.card },
        text: { primary: tokens.ink, secondary: tokens.inkSoft },
        divider: tokens.line,
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: font,
        fontSize: 15,
        h3: { fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08 },
        h4: { fontWeight: 600, letterSpacing: '-0.02em' },
        h5: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.35rem' },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        subtitle1: { color: tokens.inkSoft },
        body1: { fontSize: 15 },
        body2: { color: tokens.inkSoft, fontSize: 15 },
        caption: { fontSize: 13, color: tokens.inkSoft },
        overline: {
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: tokens.inkFaint,
            lineHeight: 2,
        },
        button: { textTransform: 'none', fontWeight: 500, fontSize: 15 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 10, paddingInline: 18, paddingBlock: 9 },
                contained: {
                    boxShadow: tokens.shadow1,
                    '&:hover': { boxShadow: tokens.shadow1, backgroundColor: tokens.accentDark },
                    '&.Mui-disabled': { backgroundColor: tokens.sunken, color: tokens.inkFaint },
                },
                outlined: {
                    backgroundColor: tokens.card,
                    borderColor: tokens.lineStrong,
                    color: tokens.ink,
                    boxShadow: tokens.shadow1,
                    '&:hover': { borderColor: tokens.inkFaint, backgroundColor: tokens.card },
                },
                text: {
                    color: tokens.accent,
                    '&:hover': { backgroundColor: tokens.accentWash },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: 'none',
                    boxShadow: tokens.shadow1,
                },
            },
        },
        MuiTextField: { defaultProps: { size: 'medium' } },
    },
})

theme = responsiveFontSizes(theme)

export default theme
