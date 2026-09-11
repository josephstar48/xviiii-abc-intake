import React, {useState} from 'react';
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography, useTheme
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import {styled} from '@mui/system';
import {useNavigate} from "react-router-dom";

const StyledImage = styled('img')({
    height: '60px',
    marginRight: '16px',
    flexShrink: 0,
});

const StyledLink = styled(Typography)(() => ({
    color: 'white',
    opacity: 0.7,
    textDecoration: 'none',
    '&:hover': {
        opacity: 1,
    },
}));

export const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { text: 'INNOVATION CELLS', href: '/innovation-cells' },
        { text: 'SUBMISSION STATUS', href: '/status' },
        { text: 'CAPABILITY CATALOG', href: '/catalog' },
        { text: 'CORPS ADMIN', href: '/admin' },
    ];

    const handleNavigate = (href: string) => {
        navigate(href);
        setIsOpen(false);
    };

    return (
        <AppBar position="fixed" sx={{
            backgroundColor: theme.palette.grey['900'],
            top: 0,
            zIndex: theme.zIndex.drawer + 1,
        }}>
            <Toolbar
                sx={{
                    margin: {xs: '0.25rem 0', sm: '0.5rem'},
                    minHeight: {xs: 64, sm: 72},
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexGrow={1}
                    minWidth={0}
                    gap={1}
                >
                    <Button
                        color="inherit"
                        onClick={() => handleNavigate('/innovation-cells')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textTransform: 'none',
                            p: 0,
                            minWidth: 0,
                            maxWidth: {xs: 'calc(100vw - 96px)', sm: 'none'},
                        }}
                    >
                        <StyledImage
                            src="/favicon_dragonSpark.png"
                            alt="Dragon Spark logo"
                            sx={{height: {xs: 40, sm: 56}, marginRight: {xs: 1, sm: 2}}}
                        />
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="white"
                            sx={{
                                fontSize: {xs: '1.05rem', sm: '1.35rem'},
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            Dragon Spark
                        </Typography>
                    </Button>
                    <Box display={{xs: 'none', md: 'flex'}} flexGrow={1} justifyContent="center">
                        <Box>
                            {menuItems.map((item) => (
                                <Button key={item.text} color="inherit" sx={{ mx: {md: 0.5, lg: 2} }} onClick={() => handleNavigate(item.href)}>
                                    <StyledLink variant="button">{item.text}</StyledLink>
                                </Button>
                            ))}
                        </Box>
                    </Box>
                    <Box display={{xs: 'none', md: 'flex'}} alignItems="center" gap={1}>
                        <Typography variant="body2" color="white" fontWeight="bold">
                            XVIII Airborne Corps
                        </Typography>
                        <StyledImage
                            src="/xviii abc.png"
                            alt="XVIII Airborne Corps insignia"
                            sx={{height: '44px', marginRight: 0}}
                        />
                    </Box>
                </Box>

                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleClick}
                    sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 'auto' }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            <Drawer
                anchor="right"
                open={isOpen}
                onClose={handleClick}
                sx={{ display: { md: 'none' } }}
                PaperProps={{
                    sx: {
                        mt: {xs: '72px', sm: '88px'},
                        height: {xs: 'calc(100% - 72px)', sm: 'calc(100% - 88px)'},
                    }
                }}
            >
                <List sx={{width: 'min(320px, 86vw)'}}>
                    {menuItems.map((item) => (
                        <ListItem button key={item.text} onClick={() => handleNavigate(item.href)}>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    );
};
