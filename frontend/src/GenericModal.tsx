import {Dispatch, ReactNode, SetStateAction} from "react";
import {Box, Dialog, useMediaQuery, useTheme} from "@mui/material";

export type GenericModalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode
}

export const GenericModal = (props: GenericModalProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {open, setOpen, children} = props;

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullScreen={fullScreen}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: '100%',
                        maxWidth: '1200px',
                        margin: {xs: 1, sm: 4},
                    }
                },
                "& .MuiOutlinedInput-root": {
                    color: theme.palette.common.black,
                },
            }}
        >
            <Box
                pt={3}
                pb={2}
                px={{xs: 2, sm: 4}}
                maxHeight={{xs: '100%', sm: '90vh'}}
                width={{xs: '100%', sm: 650}}
                maxWidth="100%"
                borderRadius='4px'
                boxShadow='0px 9px 46px 8px #0000001F'
                sx={{
                    backgroundColor: theme.palette.grey['A100'],
                    color: theme.palette.common.black,
                    overflowY: 'auto',
                }}
            >
                {children}
            </Box>
        </Dialog>
    )
}
