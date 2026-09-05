import {Box, Grid, Typography} from "@mui/material";
import {useGlobalContext} from "./context/GlobalProvider";
import {useEffect} from "react";
import AppLogo from './assets/app-logo.png'
import {styled} from "@mui/system";
import {theme} from "./theme";

const StyledImage = styled('img')({
    height: '120px',
    margin: '0px 30px',
    maxWidth: '35vw',
    objectFit: 'contain',
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
                    backgroundAttachment: {xs: 'scroll', md: 'fixed'},
                    minHeight: '100%',
                    width: '100%',
                    zIndex: -1,
                    overflowX: 'hidden',
                    px: {xs: 2, sm: 3},
                }}>
                <Grid container justifyContent='center' textAlign='center'>
                    <Grid item xs={12} mt={10}>
                        <Typography variant='h1' color='#1A3C6F' fontWeight='bold' sx={{fontSize: {xs: '2.75rem', sm: '4rem', md: '6rem'}}}>404 ERROR</Typography>
                    </Grid>
                    <Grid item xs={12} mt={5} color={theme.palette.text.primary}>
                        <Typography variant='h2' sx={{fontSize: {xs: '1.75rem', sm: '2.75rem', md: '3.75rem'}}}>SKYNET has terminated this URL</Typography>
                    </Grid>
                    <Grid container mt={5} mb={2} alignItems='center' justifyContent='center' rowGap={2}>
                        <StyledImage src={AppLogo} alt='Dragon Spark Logo'/>
                        <Typography variant='h2' color='#C9DFE2' sx={{fontSize: {xs: '2rem', sm: '3rem', md: '3.75rem'}, overflowWrap: 'anywhere'}}>DRAGON SPARK</Typography>
                    </Grid>
                    <Grid item xs={12} mt={5} color={theme.palette.text.primary}>
                        <Typography variant='h2' sx={{fontSize: {xs: '1.75rem', sm: '2.75rem', md: '3.75rem'}}}>is currently working on securing the FUTURE</Typography>
                    </Grid>
                </Grid>
            </Box>

    )
}
