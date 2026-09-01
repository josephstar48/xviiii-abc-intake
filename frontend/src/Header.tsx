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
        { text: 'INNOVATION CELLS', href: '/innovationCell' },
        { text: 'SUBMISSION STATUS', href: '/status' },
        { text: 'CORPS ADMIN', href: '/admin' },
    ];

    return (
        <AppBar position="static" sx={{
            backgroundColor: theme.palette.grey['900']
        }}>
            <Toolbar
                sx={{
                    margin: '0.5rem'
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                >
                    <StyledImage
                        src="/favicon_dragonSpark.png"
                        alt="Dragon Spark logo"
                    />
                    <Typography variant="h5" fontWeight="bold" color="white">
                        Dragon Spark
                    </Typography>
                    <Box display="flex" flexGrow={1} justifyContent="center">
                        <Box>
                            {menuItems.map((item) => (
                                <Button key={item.text} color="inherit" href={item.href} sx={{ mx: 2 }} onClick={() => navigate(item.href)}>
                                    <StyledLink variant="button">{item.text}</StyledLink>
                                </Button>
                            ))}
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
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
                    sx={{ display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            <Drawer
                anchor="right"
                open={isOpen}
                onClose={handleClick}
                sx={{ display: { sm: 'none' } }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem button key={item.text} component="a" href={item.href} onClick={handleClick}>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    );
};
