import {Dispatch, ReactElement, SetStateAction} from "react";
import {Box, Dialog, useTheme} from "@mui/material";

export type GenericModalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactElement[]
}

export const GenericModal = (props: GenericModalProps) => {
    const theme = useTheme();

    const {open, setOpen, children} = props;

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: '100%',
                        maxWidth: '1200px'
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
                px={4}
                maxHeight='90%'
                width={650}
                borderRadius='4px'
                boxShadow='0px 9px 46px 8px #0000001F'
                sx={{
                    backgroundColor: theme.palette.grey['A100'],
                    color: theme.palette.common.black,
                }}
            >
                {children}
            </Box>
        </Dialog>
    )
}