import {Box, Grid, Typography} from "@mui/material";
import {useGlobalContext} from "./context/GlobalProvider";
import {useEffect} from "react";
import AppLogo from './assets/app-logo.png'
import {styled} from "@mui/system";
import {theme} from "./theme";

const StyledImage = styled('img')({
    height: '120px',
    margin: '0px 30px'
});

export const ErrorPage = () => {
    const {isPageHasBackgroundImage, setPageHasBackgroundImage} = useGlobalContext();

    useEffect(() => {
        setPageHasBackgroundImage(false);
    }, [isPageHasBackgroundImage])

    return (

            <Box
                sx={{
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.72)), url('/XVIII ABC Dragon Spark Logo-modified.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "min(70vw, 760px)",
                    backgroundPosition: "center",
                    backgroundAttachment: 'fixed',
                    height: '100vh',
                    width: '100vw',
                    zIndex: -1,
                }}>
                <Grid container justifyContent='center' textAlign='center'>
                    <Grid item xs={12} mt={10}>
                        <Typography variant='h1' color='#1A3C6F' fontWeight='bold'>404 ERROR</Typography>
                    </Grid>
                    <Grid item xs={12} mt={5} color={theme.palette.text.primary}>
                        <Typography variant='h2'>SKYNET has terminated this URL</Typography>
                    </Grid>
                    <Grid container mt={5} mb={2} alignItems='center' justifyContent='center'>
                        <StyledImage src={AppLogo} alt='Dragon Spark Logo'/>
                        <Typography variant='h2' color='#C9DFE2'>DRAGON SPARK</Typography>
                    </Grid>
                    <Grid item xs={12} mt={5} color={theme.palette.text.primary}>
                        <Typography variant='h2'>is currently working on securing the FUTURE</Typography>
                    </Grid>
                </Grid>
            </Box>

    )
}
