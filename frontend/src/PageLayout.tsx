import {ReactNode} from 'react';
import {Box, useTheme} from '@mui/material';
import {useGlobalContext} from "./context/GlobalProvider";
import { Header } from './Header';
import LandingPageHeader from './LandingPageHeader';

type PageLayoutProps = {
  currentPath: string;
    children: ReactNode;
    footer?: {
        element: ReactNode;
        height: number;
    };
    limitContentWidth?: boolean
};

export const PageLayout = (props: PageLayoutProps) => {
    const theme = useTheme();
    const {children, footer,  limitContentWidth, currentPath} = props;

    const {isPageHasBackgroundImage} = useGlobalContext();
  const renderHeader = () => {
    switch (currentPath) {
      case '/':
        return <LandingPageHeader />;
      default:
        return <Header />;
    }
  };

  return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: `80px 1fr ${footer?.height ? footer.height + 'px' : ''}`,
                gridTemplateColumns: '100%',
                height: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box
            >
                {renderHeader()}
            </Box>
            <Box
                sx={{
                    gridRow: 2,
                    width: '100%',
                    maxHeight: '100%',
                    overflowY: 'auto',
                }}
            >
                {limitContentWidth && !isPageHasBackgroundImage ? <Box
                        sx={{
                            maxWidth: '1600px',
                            mx: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {children}
                    </Box> : <Box
                    sx={{
                        mx: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        overflow:'hidden',
                        position: 'fixed'
                    }}
                >
                    {children}
                </Box>

                }
            </Box>
            {footer && (
                <Box
                    sx={{
                        gridRow: 3,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                       position: 'absolute'
                    }}
                >
                    {footer.element}
                </Box>
            )}
        </Box>
    );
};