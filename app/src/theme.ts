import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// NeoAuth "memory lab" design tokens: cool porcelain surfaces, blue-black
// ink, a single cobalt accent — the object icons supply all other colour.
export const tokens = {
    paper: '#F5F6F3',
    card: '#FFFFFF',
    ink: '#1B2130',
    inkSoft: '#5C6478',
    line: '#DCDFE4',
    cobalt: '#2B4BDF',
    cobaltDark: '#1F38AC',
    success: '#177B4B',
}

export const mono = '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace'
const sans = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'

let theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: tokens.cobalt, dark: tokens.cobaltDark, light: '#E8ECFC' },
        success: { main: tokens.success },
        background: { default: tokens.paper, paper: tokens.card },
        text: { primary: tokens.ink, secondary: tokens.inkSoft },
        divider: tokens.line,
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: sans,
        h3: { fontWeight: 650, letterSpacing: '-0.03em', lineHeight: 1.1 },
        h4: { fontWeight: 650, letterSpacing: '-0.02em' },
        h5: { fontWeight: 600, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600 },
        subtitle1: { color: tokens.inkSoft },
        body2: { color: tokens.inkSoft },
        overline: {
            fontFamily: mono,
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: tokens.inkSoft,
        },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 8, paddingInline: 18 },
                outlined: { borderColor: tokens.line, color: tokens.ink },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: tokens.card,
                    color: tokens.ink,
                    boxShadow: 'none',
                    borderBottom: `1px solid ${tokens.line}`,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: `1px solid ${tokens.line}`,
                    boxShadow: '0 1px 2px rgba(27, 33, 48, 0.04)',
                },
            },
        },
        MuiTextField: { defaultProps: { size: 'medium' } },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { fontFamily: mono, fontSize: 12 },
            },
        },
    },
})

theme = responsiveFontSizes(theme)

export default theme
