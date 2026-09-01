import {createTheme} from "@mui/material";
import {blue, grey, red} from "@mui/material/colors";


export const theme = createTheme({
    palette: {
        primary: {
            main: blue[900],
            light: blue[700],
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFFFFF',
            contrastText: '#000000',
        },
        error: {
            main: red[800],
            light: red[600],
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#C4E0E3',
            dark: '#B5E0E5',
            contrastText: '#001939'
        },
        warning: {
            main: '#001939',
            light: '#12355D',
            contrastText: '#FFFFFF'
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#9E9E9E',
            disabled: '#717179'
        },
        background: {
            default: '#121212',
            paper: grey[800]
        },
        grey: {
            'A100': '#D2D2D4'
        }
    },
})