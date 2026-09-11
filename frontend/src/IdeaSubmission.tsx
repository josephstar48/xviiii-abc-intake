import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Box,
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
import {AutoAwesome, Edit, Filter1, Filter2} from "@mui/icons-material";
import axios from "axios";
import {GenericModal} from "./GenericModal";
import {useNavigate} from "react-router-dom";
import {ReactComponent as GeminiLogo} from "./assets/gemini.svg";
import {getIdeas, Idea} from "./api/ideasApi";
import {StageChip} from "./StageChip";
import {Stage} from "./enum/Stage";

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
    'XVIII ABC / Corps Headquarters',
    '82nd Airborne Division',
    '101st Airborne Division (Air Assault)',
    '10th Mountain Division (Light)',
    '3rd Infantry Division'
];

const problemTypes = [
    'Command and Control (C2)',
    'Movement and Maneuver',
    'Intelligence',
    'Fires',
    'Sustainment',
    'Protection'
];

const operationalImpacts = [
    'Decision advantage',
    'Lethality',
    'Survivability / force protection',
    'Mobility / tempo',
    'Readiness / training',
    'Sustainment / endurance',
    'Efficiency / reduced workload',
    'Interoperability / shared understanding'
];

const urgencyLevels = [
    'Low - improvement opportunity',
    'Medium - needed this quarter',
    'High - needed before training event or deployment',
    'Critical - current mission impact'
];

const capabilityLanes = [
    'Software / application',
    'Data / dashboard / analytics',
    'AI / automation',
    'Hardware / device',
    'UAS / robotics',
    'Network / communications',
    'Training product',
    'Process improvement',
    'Sustainment support',
    'Not sure'
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
    const [submitting, setSubmitting] = useState(false);
    const [aiError, setAiError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [completedGen, setCompletedGen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [existingIdeas, setExistingIdeas] = useState<Idea[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
        unitDivision: '',
        problemType: '',
        operationalImpact: '',
        urgency: '',
        capabilityLane: '',
    }

    const [form, setForm] = useState(defaultFormData);

    useEffect(() => {
        getIdeas()
            .then((ideas) => {
                setExistingIdeas(ideas);
            });
    }, []);

    const requiredFields: { key: keyof typeof defaultFormData, label: string }[] = [
        {key: 'firstName', label: 'First name'},
        {key: 'lastName', label: 'Last name'},
        {key: 'unit', label: 'Unit'},
        {key: 'email', label: 'Email'},
        {key: 'phone', label: 'Phone'},
        {key: 'unitDivision', label: 'Unit / division'},
        {key: 'problemType', label: 'Problem type'},
        {key: 'operationalImpact', label: 'Operational impact'},
        {key: 'urgency', label: 'Urgency'},
        {key: 'capabilityLane', label: 'Capability lane'},
        {key: 'title', label: 'Title'},
        {key: 'problemStatement', label: 'Problem statement'},
        {key: 'problemContext', label: 'Problem context'},
        {key: 'solutionBenefits', label: 'Solution benefits'},
        {key: 'solutionConcepts', label: 'Solution concepts'}
    ];

    const validateForm = () => {
        const nextErrors = requiredFields.reduce<Record<string, string>>((errors, field) => {
            if (!form[field.key].toString().trim()) {
                errors[field.key] = `${field.label} is required.`;
            }

            return errors;
        }, {});

        if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            nextErrors.email = 'Enter a valid email address.';
        }

        setFieldErrors(nextErrors);
        return nextErrors;
    };

    const validatePrompt = () => {
        if (prompt.trim()) {
            setAiError('');
            return true;
        }

        setAiError('Add a quick description first, or choose Write it myself to skip AI.');
        return false;
    };

    const startManualEntry = () => {
        setAiError('');
        setSubmitError('');
        setCompletedGen(true);
        setTabValue(1);
    };

    const fetchData = async () => {
        if (!validatePrompt()) {
            return;
        }

        setLoading(true);
        setAiError('');
        setSubmitError('');
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
            setAiError('AI drafting is unavailable right now. You can still choose Write it myself and submit the problem manually.');
        } finally {
            setLoading(false);
        }
    };

    const setFormValue = (key: string, value: string | number[]) => {
        setForm(prev => ({...prev, [key]: value}))
        setFieldErrors(prev => {
            if (!prev[key]) {
                return prev;
            }

            const {[key]: removedError, ...remainingErrors} = prev;
            return remainingErrors;
        });
    }

    const submitData = async () => {
        const nextErrors = validateForm();

        if (Object.keys(nextErrors).length > 0) {
            setSubmitError('Please complete the required fields highlighted below.');
            setTabValue(Object.keys(nextErrors).some(key => ['firstName', 'lastName', 'unit', 'email', 'phone'].includes(key)) ? 0 : 1);
            return;
        }

        setSubmitting(true);
        setSubmitError('');

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
            tags: [],
            innovationCell: innovationCellId ? {id: Number(innovationCellId)} : null,
        }

        try {
            await axios.post('/api/ideas', idea);
            setSuccessMessage('Problem submitted. Dragon Spark has it in the intake queue for routing and triage.');
            loadIdeas();
        } catch (error) {
            console.error("Error submitting Dragon Spark idea:", error);
            setSubmitError('Submission failed. Please check the highlighted fields and try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const handleCancel = () => {
        setTabValue(0);
        setPrompt('');
        setAiError('');
        setSubmitError('');
        setSuccessMessage('');
        setCompletedGen(false);
        setLoading(false);
        setSubmitting(false);
        setFieldErrors({});
        setOpen(false);
        setForm(defaultFormData);
    }

    const handleDone = () => {
        handleCancel();
        if (setModuleIsOpen) {
            setModuleIsOpen(false);
        }
        if (props.isOnDifferentPage) {
            navigate('/status')
        }
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }

    const similarIdeas = useMemo(() => {
        const searchTerms = [
            ...form.title.split(/\s+/),
            ...form.problemStatement.split(/\s+/),
            form.problemType,
            form.capabilityLane
        ]
            .map(term => term.toLowerCase().trim())
            .filter(term => term.length > 3);

        if (searchTerms.length === 0) {
            return [];
        }

        return existingIdeas
            .map((idea) => {
                const ideaText = [
                    idea.title,
                    idea.problemStatement,
                    idea.problemContext,
                    idea.solutionConcepts,
                    idea.problemType,
                    idea.capabilityLane
                ].join(' ').toLowerCase();

                const score = searchTerms.reduce((total, term) => total + (ideaText.includes(term) ? 1 : 0), 0);
                return {idea, score};
            })
            .filter(({score}) => score >= 2)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(({idea}) => idea);
    }, [existingIdeas, form.capabilityLane, form.problemStatement, form.problemType, form.title]);

    const renderSelect = (label: string, key: keyof typeof defaultFormData, options: string[]) => (
        <>
            <FormLabel sx={{color: theme.palette.common.black}}>{label}</FormLabel>
            <Select
                value={form[key]}
                onChange={(e: SelectChangeEvent<string>) => setFormValue(key, e.target.value)}
                error={Boolean(fieldErrors[key])}
                size="small"
                sx={{...inputFieldStyle, mb: 2, width: '100%'}}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
            {fieldErrors[key] && <Typography color="error" variant="caption" display="block" mt={-1.5} mb={1.5}>{fieldErrors[key]}</Typography>}
        </>
    );

    const renderTextField = (
        label: string,
        key: keyof typeof defaultFormData,
        multiline = false,
        size: 'small' | 'medium' = 'medium'
    ) => (
        <>
            <FormLabel sx={{color: theme.palette.common.black}}>{label}</FormLabel>
            <TextField
                size={size}
                variant='outlined'
                fullWidth
                multiline={multiline}
                minRows={multiline ? 3 : undefined}
                value={form[key]}
                error={Boolean(fieldErrors[key])}
                helperText={fieldErrors[key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormValue(key, e.target.value)}
                sx={{...inputFieldStyle, mb: 2}}
            />
        </>
    );

    const renderSimilarIdeas = () => {
        if (similarIdeas.length === 0) {
            return null;
        }

        return (
            <Alert severity="info" sx={{mb: 2}}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Possible existing digital efforts
                </Typography>
                <Stack spacing={1}>
                    {similarIdeas.map((idea) => (
                        <Box key={idea.id}>
                            <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{xs: 'flex-start', sm: 'center'}} spacing={1}>
                                <Typography variant="body2" fontWeight="bold">{idea.title}</Typography>
                                <StageChip stage={Stage[idea.stage] || idea.stage} size="small"/>
                            </Stack>
                            <Typography variant="caption" display="block">
                                {idea.unitDivision || 'Unspecified org'} | {idea.capabilityLane || 'Unspecified lane'} | {idea.innovationCell?.name || 'Not assigned'}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Alert>
        );
    };

    if (successMessage) {
        return (
            <GenericModal open={open} setOpen={setOpen}>
                <Typography variant='h4' pb={1}>Submission received</Typography>
                <Alert severity="success" sx={{mb: 2}}>
                    {successMessage}
                </Alert>
                <Typography variant='body2' pb={2} color={theme.palette.text.disabled}>
                    Your problem is ready for routing, status tracking, and admin triage.
                </Typography>
                <Button variant={'contained'} color={'warning'} onClick={handleDone}>Done</Button>
            </GenericModal>
        )
    }

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
            {submitError && <Alert severity="error" sx={{mb: 2}}>{submitError}</Alert>}
            {(tabValue === 1)
                ? <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>{renderSelect('Unit / Division', 'unitDivision', unitDivisions)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Problem Type', 'problemType', problemTypes)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Operational Impact', 'operationalImpact', operationalImpacts)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Urgency', 'urgency', urgencyLevels)}</Grid>
                        <Grid item xs={12} md={6}>{renderSelect('Capability Lane', 'capabilityLane', capabilityLanes)}</Grid>
                    </Grid>
                    {renderSimilarIdeas()}
                    {renderTextField('Title', 'title', true)}
                    {renderTextField('Problem Statement', 'problemStatement', true)}
                    {renderTextField('Problem Context', 'problemContext', true)}
                    {renderTextField('Solution Benefits', 'solutionBenefits', true)}
                    {renderTextField('Solution Concepts', 'solutionConcepts', true)}
                </>
                : <>
                    {renderTextField('First Name', 'firstName', false, 'small')}
                    {renderTextField('Last Name', 'lastName', false, 'small')}
                    {renderTextField('Unit', 'unit', false, 'small')}
                    {renderTextField('Email', 'email', false, 'small')}
                    {renderTextField('Phone', 'phone', false, 'small')}
                    <FormLabel sx={{color: theme.palette.common.black}}>Quick Problem Description</FormLabel>
                    <TextField variant='outlined' fullWidth multiline
                               minRows={4}
                               value={prompt}
                               onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPrompt(e.target.value)}
                               helperText="Optional unless you want AI to structure the idea."
                               sx={{...inputFieldStyle, mb: 2}}
                    />
                    {aiError && <Alert severity="error" sx={{mb: 2}}>{aiError}</Alert>}
                </>
            }

            {(completedGen)
                ? <>
                    <LoadingButton variant={'contained'} color={'warning'} loading={submitting} onClick={submitData}>Submit</LoadingButton>
                    <Button color='info' variant='contained' onClick={handleCancel} sx={{ml: 2}}>Cancel</Button>
                </>
                : <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{xs: 'stretch', sm: 'center'}} spacing={1}>
                    <LoadingButton variant='contained' color={'warning'} loading={loading}
                                   loadingPosition='start'
                                   startIcon={<AutoAwesome/>} onClick={() => fetchData()}
                                    sx={{"&:disabled": {color: theme.palette.secondary.main}}}>Use AI to structure my idea</LoadingButton>
                    <Button color='info' variant='contained' startIcon={<Edit/>} onClick={startManualEntry}>Write it myself</Button>
                    <Button color='info' variant='contained' onClick={handleCancel}>Cancel</Button>
                    {loading && <Stack direction="row" alignItems="center" justifyContent={{xs: 'center', sm: 'flex-start'}} spacing={1}><Typography>Powered by</Typography><GeminiLogo height={30} width={100}/></Stack>}
                </Stack>
            }

        </GenericModal>
    )
}
