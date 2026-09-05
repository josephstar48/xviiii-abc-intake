import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    Button,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {AutoAwesome, Filter1, Filter2} from "@mui/icons-material";
import axios from "axios";
import {GenericModal} from "./GenericModal";
import {getTags, Tags} from "./api/tagsApi";
import {useNavigate} from "react-router-dom";
import {ReactComponent as GeminiLogo} from "./assets/gemini.svg";

export type IdeaSubmissionProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    loadIdeas: () => void,
    isCardSubmit?: boolean
    innovationCellId?: string;
    setModuleIsOpen?: Dispatch<SetStateAction<boolean>>,
    isOnDifferentPage?: boolean
}

const unitDivisions = [
    'XVIII ABC / JIOP / ODS',
    '82nd Airborne Division',
    '101st Airborne Division (Air Assault)',
    '10th Mountain Division (Light)',
    '3rd Infantry Division'
];

const problemTypes = [
    'Operational process',
    'Equipment or kit',
    'Mission command',
    'UAS / robotics',
    'Data visibility',
    'Training readiness',
    'Sustainment'
];

const operationalImpacts = [
    'Tactical edge',
    'Division operations',
    'Corps-wide',
    'Joint / coalition',
    'Garrison support'
];

const urgencyLevels = [
    'Routine',
    'Near-term exercise',
    'Deployment need',
    'Immediate operational gap'
];

const capabilityLanes = [
    'Software',
    'Hardware',
    'Data',
    'AI/ML',
    'Training',
    'Sustainment',
    'UAV/Robotics',
    'Manufacturing'
];

export const IdeaSubmission = (props: IdeaSubmissionProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const {
        open,
        setOpen,
        loadIdeas,
        innovationCellId,
        setModuleIsOpen
    } = props;

    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [completedGen, setCompletedGen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [availableTags, setAvailableTags] = useState<Tags[]>([]);

    const inputFieldStyle = {
        "&:hover fieldset": {
            borderColor: `${theme.palette.warning.main}!important`
        },
    };

    const defaultFormData = {
        title: '',
        problemStatement: '',
        problemContext: '',
        solutionBenefits: '',
        solutionConcepts: '',
        firstName: '',
        lastName: '',
        unit: '',
        email: '',
        phone: '',
        tagId: '',
        unitDivision: '',
        problemType: '',
        operationalImpact: '',
        urgency: '',
        capabilityLane: '',
    }

    const [form, setForm] = useState(defaultFormData);

    useEffect(() => {
        getTags().then(tags => setAvailableTags(tags));
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setAiError('');
        try {
            const {data} = await axios.post('/api/ai/structure-idea', {prompt});

            setForm(prev => ({
                ...prev,
                title: data.title,
                problemStatement: data.problemStatement,
                problemContext: data.problemContext,
                solutionBenefits: data.solutionBenefits,
                solutionConcepts: data.solutionConcepts
            }));

            setCompletedGen(true);
            setTabValue(1);
        } catch (error) {
            console.error("Error generating Dragon Spark draft:", error);
            setAiError('AI drafting is unavailable. Check the Gemini API key on the backend.');
        } finally {
            setLoading(false);
        }
    };

    const setFormValue = (key: string, value: string | number[]) => {
        setForm(prev => ({...prev, [key]: value}))
    }

    const submitData = async () => {
        const idea = {
            title: form.title,
            problemStatement: form.problemStatement,
            problemContext: form.problemContext,
            solutionBenefits: form.solutionBenefits,
            solutionConcepts: form.solutionConcepts,
            unitDivision: form.unitDivision,
            problemType: form.problemType,
            operationalImpact: form.operationalImpact,
            urgency: form.urgency,
            capabilityLane: form.capabilityLane,
            submitter: {
                firstName: form.firstName,
                lastName: form.lastName,
                unit: form.unit,
                email: form.email,
                phone: form.phone
            },
            stage: 0,
            tags: form.tagId ? [{id: Number(form.tagId)}] : [],
            innovationCell: innovationCellId ? {id: Number(innovationCellId)} : null,
        }

        await axios.post('/api/ideas', idea);
        handleCancel();
        if (setModuleIsOpen) {
            setModuleIsOpen(false);
        }
        if (props.isOnDifferentPage) {
            navigate('/status')
        }
        loadIdeas();
    }

    const handleCancel = () => {
        setTabValue(0);
        setPrompt('');
        setAiError('');
        setCompletedGen(false);
        setLoading(false);
        setOpen(false);
        setForm(defaultFormData);
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }

    const renderSelect = (label: string, key: keyof typeof defaultFormData, options: string[]) => (
        <>
            <FormLabel sx={{color: theme.palette.common.black}}>{label}</FormLabel>
            <Select
                value={form[key]}
                onChange={(e: SelectChangeEvent<string>) => setFormValue(key, e.target.value)}
                size="small"
                sx={{...inputFieldStyle, mb: 2, width: '100%'}}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </>
    );

    return (
        <GenericModal open={open} setOpen={setOpen}>
            <Typography variant='h4' pb={1}>Submit to Dragon Spark</Typography>
            <Typography variant='body2' pb={2} color={theme.palette.text.disabled}>
                Route an XVIII ABC problem to JIOP, ODS, or the right division innovation cell.
            </Typography>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{width: '100%', mb: 2}}
                textColor='inherit'
                TabIndicatorProps={{style: {background: theme.palette.common.black}}}
            >
                <Tab value={0} label={<Filter1/>} sx={{width: '50%'}}/>
                <Tab value={1} label={<Filter2/>} sx={{width: '50%'}} disabled={!completedGen}/>
            </Tabs>
            {(tabValue === 1)
                ? <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>{renderSelect('Unit / Division', 'unitDivision', unitDivisions)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Problem Type', 'problemType', problemTypes)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Operational Impact', 'operationalImpact', operationalImpacts)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Urgency', 'urgency', urgencyLevels)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Capability Lane', 'capabilityLane', capabilityLanes)}</Grid>
                        <Grid item xs={12} md={6}>
                            <FormLabel sx={{color: theme.palette.common.black}}>Tag</FormLabel>
                            <Select
                                value={form.tagId}
                                onChange={(e: SelectChangeEvent<string>) => setFormValue('tagId', e.target.value)}
                                size="small"
                                sx={{...inputFieldStyle, mb: 2, width: '100%'}}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {availableTags.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.id.toString()}>
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <FormLabel sx={{color: theme.palette.common.black}}>Title</FormLabel>
                    <TextField variant='outlined' fullWidth multiline value={form.title}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('title', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Problem Statement</FormLabel>
                    <TextField variant='outlined' fullWidth multiline value={form.problemStatement}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('problemStatement', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Problem Context</FormLabel>
                    <TextField variant='outlined' fullWidth multiline value={form.problemContext}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('problemContext', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Solution Benefits</FormLabel>
                    <TextField variant='outlined' fullWidth multiline value={form.solutionBenefits}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('solutionBenefits', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Solution Concepts</FormLabel>
                    <TextField variant='outlined' fullWidth multiline value={form.solutionConcepts}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('solutionConcepts', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                </>
                : <>
                    <FormLabel sx={{color: theme.palette.common.black}}>First Name</FormLabel>
                    <TextField size='small' variant='outlined' fullWidth value={form.firstName}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('firstName', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Last Name</FormLabel>
                    <TextField size='small' variant='outlined' fullWidth value={form.lastName}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('lastName', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Unit</FormLabel>
                    <TextField size='small' variant='outlined' fullWidth value={form.unit}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('unit', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Email</FormLabel>
                    <TextField size='small' variant='outlined' fullWidth value={form.email}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('email', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Phone</FormLabel>
                    <TextField size='small' variant='outlined' fullWidth value={form.phone}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue('phone', e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}/>
                    <FormLabel sx={{color: theme.palette.common.black}}>Enter your Problem and/or Proposed Solution</FormLabel>
                    <TextField variant='outlined' fullWidth multiline
                               value={prompt}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPrompt(e.target.value)}
                               sx={{...inputFieldStyle, mb: 2}}
                    />
                    {aiError && <Typography color="error" mb={2}>{aiError}</Typography>}
                </>
            }

            {(completedGen)
                ? <>
                    <Button variant={'contained'} color={'warning'} onClick={submitData}>Submit</Button>
                    <Button color='info' variant='contained' onClick={handleCancel} sx={{ml: 2}}>Cancel</Button>
                </>
                : <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{xs: 'stretch', sm: 'center'}} spacing={1}>
                    <LoadingButton variant='contained' color={'warning'} loading={loading}
                                   loadingPosition='start'
                                   startIcon={<AutoAwesome/>} onClick={() => fetchData()}
                                    sx={{"&:disabled": {color: theme.palette.secondary.main}}}>Continue</LoadingButton>
                    <Button color='info' variant='contained' onClick={handleCancel}>Cancel</Button>
                    {loading && <Stack direction="row" alignItems="center" justifyContent={{xs: 'center', sm: 'flex-start'}} spacing={1}><Typography>Powered by</Typography><GeminiLogo height={30} width={100}/></Stack>}
                </Stack>
            }

        </GenericModal>
    )
}
