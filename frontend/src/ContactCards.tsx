import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';

const ContactCard = styled(Box)(({ theme }) => ({
    textAlign: 'left',
    padding: theme.spacing(2),
    color: 'white',
    backgroundColor: '#332F30',
    width: '100%',
    maxWidth: '320px',
    minHeight: '183px',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 0),
}));

interface ContactCardsProps {
    handleClick: () => void
}

const ContactCards = ({handleClick}: ContactCardsProps) => {
    const SWFProductOfficeEmail = 'S_T.TAU@soc.mil';
    const SWFProductOfficePhone = '(214) 707-7478';
    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopyEmailClick = async () => {
        await navigator.clipboard.writeText(SWFProductOfficeEmail);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 4000);
    };

    return (
        <Grid container spacing={2} justifyContent="center" sx={{ pb: 8 }}>
            <Grid item xs={12} sm={6} md={4} sx={{display: 'flex', justifyContent: 'center'}}>
                <ContactCard>
                    <IconWrapper>
                        <EmailIcon sx={{ fontSize: 60 }} />
                    </IconWrapper>
                    <Typography variant="body1" sx={{ fontWeight: 300, pb: 2 }}>
                        Send us an e-mail
                    </Typography>
                    <Tooltip
                        title="Email copied to clipboard!"
                        open={showTooltip}
                        placement="bottom"
                    >
                        <Button
                            onClick={handleCopyEmailClick}
                            sx={{
                                color: 'white',
                                textDecoration: 'underline',
                                opacity: 0.7,
                                fontWeight: 300,
                                textTransform: 'none',
                            }}
                        >
                            {SWFProductOfficeEmail}
                        </Button>
                    </Tooltip>
                </ContactCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{display: 'flex', justifyContent: 'center'}}>
                <ContactCard>
                    <IconWrapper>
                        <PhoneIcon sx={{ fontSize: 60 }} />
                    </IconWrapper>
                    <Typography variant="body1" sx={{ fontWeight: 300, pb: 2 }}>
                        Give us a call
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            textDecoration: 'underline',
                            opacity: 0.7,
                            fontWeight: 300,
                        }}
                    >
                        {SWFProductOfficePhone}
                    </Typography>
                </ContactCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{display: 'flex', justifyContent: 'center'}}>
                <ContactCard>
                    <IconWrapper>
                        <PlaceIcon sx={{ fontSize: 60 }} />
                    </IconWrapper>
                    <Typography variant="body1" sx={{ fontWeight: 300, pb: 2 }}>
                        Submit a problem
                    </Typography>
                    <Button
                        onClick={handleClick}
                        sx={{
                            color: 'white',
                            textDecoration: 'underline',
                            opacity: 0.7,
                            fontWeight: 300,
                            textTransform: 'none',
                        }}
                    >
                        Get a tailored solution
                    </Button>
                </ContactCard>
            </Grid>
        </Grid>
    );
};

export default ContactCards;
