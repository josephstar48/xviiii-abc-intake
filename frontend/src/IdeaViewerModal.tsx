import {Button, Chip, FormLabel, Stack, TextField, Typography, useTheme} from "@mui/material";
import {Idea} from "./api/ideasApi";
import {Stage} from "./enum/Stage";
import {StageChip} from "./StageChip";
import {GenericModal} from "./GenericModal";
import React, {Dispatch, SetStateAction} from "react";
import {formatLastUpdated} from "./workflowUtils";

type IdeaViewerModalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    idea: Idea | null,
}

export const IdeaViewerModal = (props: IdeaViewerModalProps) => {
    const theme = useTheme();

    const inputFieldStyle = {
        "&:hover fieldset": {
            borderColor: `${theme.palette.warning.main}!important`
        },
    };

    const {open, setOpen, idea} = props;

    return (
        <GenericModal open={open} setOpen={setOpen}>
            <Typography variant='h4' pb={2}>Problem Info</Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{xs: 'flex-start', sm: 'center'}} mb={2} gap={1}>
                <FormLabel sx={{color: theme.palette.common.black, marginRight: 2}}>Status:</FormLabel>
                {idea && <StageChip stage={Stage[idea.stage]}/>}
                <FormLabel sx={{color: theme.palette.common.black, mx: {xs: 0, sm: 2}}}>Assigned To:</FormLabel>
                {idea?.innovationCell
                    ? <Chip
                        label={idea.innovationCell.name.toUpperCase()}
                        style={{
                            backgroundColor: theme.palette.grey['A100'],
                            color: '#0369A1',
                            fontWeight: 'bold',
                            border: '1px solid #0369A1'
                        }}
                      />
                    : <Chip
                        label={'NONE'}
                        style={{
                            backgroundColor: theme.palette.grey['A100'],
                            color: '#0369A1',
                            fontWeight: 'bold',
                            border: '1px solid #0369A1'
                        }}
                      />}
            </Stack>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} mb={2}>
                <TextField size='small' label="POC" fullWidth value={idea?.innovationCell?.email ?? 'Pending assignment'}/>
                <TextField size='small' label="Last Updated" fullWidth value={formatLastUpdated(idea?.lastUpdated)}/>
            </Stack>
            <FormLabel sx={{color: theme.palette.common.black}}>Title</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.title ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} mb={2}>
                <TextField size='small' label="Echelon" fullWidth value={idea?.unitDivision ?? ''}/>
                <TextField size='small' label="Capability Lane" fullWidth value={idea?.capabilityLane ?? ''}/>
            </Stack>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} mb={2}>
                <TextField size='small' label="Problem Type" fullWidth value={idea?.problemType ?? ''}/>
                <TextField size='small' label="Urgency" fullWidth value={idea?.urgency ?? ''}/>
            </Stack>
            <FormLabel sx={{color: theme.palette.common.black}}>Operational Impact</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.operationalImpact ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Routing Notes</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.routingNotes ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Problem Statement</FormLabel>
            <TextField size='small' variant='outlined' fullWidth multiline value={idea?.problemStatement ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Problem Context</FormLabel>
            <TextField size='small' variant='outlined' fullWidth multiline value={idea?.problemContext ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Solution Benefits</FormLabel>
            <TextField size='small' variant='outlined' fullWidth multiline value={idea?.solutionBenefits ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Solution Concepts</FormLabel>
            <TextField size='small' variant='outlined' fullWidth multiline value={idea?.solutionConcepts ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>

            <Typography variant='h5' pb={2}>Submitter Info</Typography>
            <FormLabel sx={{color: theme.palette.common.black}}>First Name</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.submitter.firstName ?? ''}
                       sx={{...inputFieldStyle, mb: 2, p: 0}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Last Name</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.submitter.lastName ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Unit</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.submitter.unit ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Email</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.submitter.email ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <FormLabel sx={{color: theme.palette.common.black}}>Phone</FormLabel>
            <TextField size='small' variant='outlined' fullWidth value={idea?.submitter.phone ?? ''}
                       sx={{...inputFieldStyle, mb: 2}}/>
            <Button variant='contained' color='info' onClick={() => setOpen(false)}>Close</Button>
        </GenericModal>
    )
}
