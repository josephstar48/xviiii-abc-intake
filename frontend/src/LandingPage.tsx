import React, { useEffect } from 'react';
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useGlobalContext } from "./context/GlobalProvider";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isPageHasBackgroundImage, setPageHasBackgroundImage } = useGlobalContext();
  useEffect(() => {
    setPageHasBackgroundImage(false);
  }, [isPageHasBackgroundImage, setPageHasBackgroundImage])

  const DragonSparkEmphasis = styled('span')({
    color: '#FFD700',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(0,0,0,0.5)',
    fontSize: '1.1em',
  });

  const Description = () => (
    <Typography variant="h5" color="white" paragraph sx={{ maxWidth: '600px' }}>
      <DragonSparkEmphasis>Dragon Spark</DragonSparkEmphasis> is the XVIII Airborne Corps innovation intake and routing portal.
      It connects Soldiers, units, JIOP, ODS, and division innovation cells so operational problems move quickly from idea
      to prototype, testing, and delivered impact.
    </Typography>
  );

  return (
    <Box sx={{
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.72)), url('/XVIII ABC Dragon Spark Logo-modified.png')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "min(70vw, 760px)",
      backgroundPosition: "center",
      backgroundAttachment: 'fixed',
      height: '100vh',
      width: '100vw',
      display: 'flex',
    }}>
      <Container  sx={{ width: '95%', marginTop: 8 }}>
        <Stack direction="row" justifyContent="space-between" >
          {/* Left side content */}
          <Box sx={{ width: '45%'}} mr={30}>
            <Typography variant="h2" color="white" gutterBottom fontWeight="bold" sx={{ fontSize: '3.5rem' }}>
              Dragon Spark
            </Typography>
            <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
              XVIII Airborne Corps Innovation Hub
            </Typography>
            <Description />
          </Box>
          {/* Right side content */}
          <Box sx={{ width: '45%'}}>
            <Box
              sx={{
                height: '300px',
                width: '100%',
                overflow: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'left',
                marginBottom: 2,
                padding: 3,
                borderRadius: '8px',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Terms and Conditions
              </Typography>
              <Typography fontSize={14} lineHeight={1.6} fontWeight={400}>
                You are accessing a U.S. Government (USG) Information System (IS) that is provided for
                USG-authorized use only. By using this IS (which includes any device attached to this
                IS), you consent to the following conditions:
                <br /><br />
                The USG routinely intercepts and monitors communications on this IS for purposes
                including, but not limited to, penetration testing, COMSEC monitoring, network
                operations and defense, personnel misconduct (PM), law enforcement (LE), and
                counterintelligence (CI) investigations. At any time, the USG may inspect and seize data
                stored on this IS. Communications using, or data stored on, this IS are not private, are
                subject to routine monitoring, interception, and search, and may be disclosed or used
                for any USG-authorized purpose. This IS includes security measures (e.g., authentication
                and access controls) to protect USG interests--not for your personal benefit or privacy.
                Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI
                investigative searching or monitoring of the content of privileged communications, or
                work product, related to personal representation or services by attorneys,
                psychotherapists, or clergy, and their assistants. Such communications and work product
                are private and confidential. See User Agreement for details.
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="caption" sx={{ color: 'white', flex: 1, fontSize: '0.9rem' }}>
                By clicking, you <b>accept</b> the terms and conditions above
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/innovation-cells')}
                sx={{
                  backgroundColor: '#ffd600',
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#ffc400',
                  }
                }}
              >
                ENTER PORTAL
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default LandingPage;
