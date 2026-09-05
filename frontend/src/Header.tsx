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
        { text: 'CORPS ADMIN', href: '/admin' },
    ];

    const handleNavigate = (href: string) => {
        navigate(href);
        setIsOpen(false);
    };

    return (
        <AppBar position="static" sx={{
            backgroundColor: theme.palette.grey['900']
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
                    width="100%"
                    gap={1}
                >
                    <StyledImage
                        src="/favicon_dragonSpark.png"
                        alt="Dragon Spark logo"
                        sx={{height: {xs: 44, sm: 60}, marginRight: {xs: 1, sm: 2}}}
                    />
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="white"
                        sx={{fontSize: {xs: '1.15rem', sm: '1.5rem'}, whiteSpace: 'nowrap'}}
                    >
                        Dragon Spark
                    </Typography>
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
            >
                <List sx={{minWidth: 260}}>
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
