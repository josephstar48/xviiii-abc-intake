import React from 'react';
import {Box, Container, Stack, Typography} from '@mui/material';
import {styled} from '@mui/system';
import ArmyLogo from './assets/army.png'

const StyledFooter = styled('footer')(({theme}) => ({
    minWidth: theme.breakpoints.values.lg,
    color: 'white',
}));

export const Footer = () => {

    return (
        <>
            <StyledFooter>
                <Container maxWidth="lg">
                    <Stack
                        direction={{xs: 'column', md: 'row'}}
                        justifyContent="center"
                        alignItems="center"
                        spacing={{xs: 3, md: 10}}
                        textAlign="center"
                        pt={6}
                        pb={8}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{minWidth: 360}}>
                            <FooterImage src={ArmyLogo} alt="U.S. Army logo"/>
                            <Typography sx={{minWidth: 170}}>
                                <div>U.S. Army</div>
                                <div>XVIII Airborne Corps</div>
                            </Typography>
                            <FooterImage src="/xviii abc.png" alt="XVIII Airborne Corps insignia"/>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{minWidth: 360}}>
                            <FooterImage src="/favicon_dragonSpark.png" alt="Dragon Spark favicon"/>
                            <Typography sx={{minWidth: 210}}>
                                <div>Dragon Spark</div>
                                <div>JIOP / ODS Innovation Intake</div>
                            </Typography>
                            <FooterImage src="/XVIII ABC Dragon Spark Logo-modified.png" alt="Dragon Spark logo"/>
                        </Stack>
                    </Stack>
                </Container>
            </StyledFooter>
        </>
    );
};

const FooterImage = ({src, alt}: {src: string, alt: string}) => (
    <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
            width: 56,
            height: 56,
            objectFit: 'contain',
            flex: '0 0 56px',
        }}
    />
);
