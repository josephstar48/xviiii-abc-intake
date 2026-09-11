import React, {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from '@mui/material';
import {InnovationCellCard, Tag} from "./InnovationCellCard";
import {getAllInnovationCells} from "./Client";
import {theme} from "./theme";
import {Footer} from "./Footer";
import {IdeaSubmission} from "./IdeaSubmission";
import {getIdeas, Idea} from "./api/ideasApi";
import {getInnovationCells, InnovationCell} from "./api/innovationCellApi";
import {getTags, Tags} from "./api/tagsApi";

import {useNavigate} from "react-router-dom";
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

export interface InnovationCellProp {
    id: number;
    name: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    address: string;
    tags: Tag[];
}

const InnovationsCells = () => {
    const [displayedCells, setDisplayedCells] = useState<InnovationCellProp[]>([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [submissionIsOpen, setSubmissionIsOpen] = useState(false)
    const [cellsAreLoading, setCellsAreLoading] = useState(true);
    const [cellsLoadError, setCellsLoadError] = useState('');

    const [, setIdeas] = useState<Idea[]>([]);
    const [, setLoading] = useState<boolean>(true);
    const [, setTags] = useState<Tags[]>([]);
    const [, setInnovationCells] = useState<InnovationCell[]>([]);

    const loadIdeas = () => {
        Promise.all([
            getIdeas(),
            getInnovationCells(),
            getTags(),
        ])
            .then(([ideasData, innovationCellsData, tagsData]) => {
                setIdeas(ideasData);
                setInnovationCells(innovationCellsData);
                setTags(tagsData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                navigate('/errorPage');
            })
            .finally(() => setLoading(false));
    }

    const navigate = useNavigate();

    useEffect(() => {
        setCellsAreLoading(true);
        setCellsLoadError('');

        getAllInnovationCells()
            .then((cellsResponse) => {
                setDisplayedCells(cellsResponse);
            })
            .catch((error) => {
                console.error("Error fetching innovation cell data:", error);
                setCellsLoadError('Innovation cell data is unavailable. Check that the backend API is running, then refresh.');
            })
            .finally(() => setCellsAreLoading(false));
    }, []);

    function handleClick() {
        setSubmissionIsOpen(true)
    }

    const unitOptions = useMemo(() => Array.from(new Set(displayedCells.map(cell => cell.name.split(' / ')[0]))), [displayedCells]);

    const routedCells = useMemo(() => {
        return displayedCells.filter((cell) => {
            const matchesUnit = !selectedUnit || cell.name.includes(selectedUnit) || cell.name.includes('XVIII ABC');

            return matchesUnit;
        });
    }, [displayedCells, selectedUnit]);

    return (
        <>
            <Box
                sx={{
                    bgcolor: theme.palette.background.default,
                    backgroundImage: "linear-gradient(rgba(18, 18, 18, 0.84), rgba(18, 18, 18, 0.84)), url('/XVIII ABC Dragon Spark Logo-modified.png')",
                    backgroundPosition: 'center',
                    backgroundAttachment: {xs: 'scroll', md: 'fixed'},
                    backgroundSize: 'min(68vw, 680px)',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    overflowX: 'hidden',
                    px: {xs: 2, sm: 3},
                }}>
                <Box sx={{width: '100%', maxWidth: 1180, mt: {xs: 4, md: 6}, mb: 4}}>
                    <Typography variant="h3" color="white" fontWeight="bold"
                                sx={{
                                    mb: 1,
                                    fontSize: {xs: '2rem', sm: '2.6rem', md: '3.4rem'},
                                    overflowWrap: 'anywhere'
                                }}>
                        Where do I send my problem?
                    </Typography>
                    <Typography variant="h6" color={theme.palette.text.secondary}
                                sx={{maxWidth: 860, lineHeight: 1.45, mb: 3}}>
                        Start with the mission problem. Dragon Spark helps route it to Corps headquarters, JIOP, ODS,
                        or the right division innovation cell, while checking whether a similar digital capability is
                        already being built or reused.
                    </Typography>

                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AssignmentTurnedInOutlinedIcon/>}
                                onClick={handleClick}
                                fullWidth
                                sx={{height: 64, justifyContent: 'flex-start', px: 2}}
                            >
                                Submit a Problem
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<Inventory2OutlinedIcon/>}
                                onClick={() => navigate('/catalog')}
                                fullWidth
                                sx={{height: 64, justifyContent: 'flex-start', px: 2}}
                            >
                                Check Existing Capabilities
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<TimelineOutlinedIcon/>}
                                onClick={() => navigate('/status')}
                                fullWidth
                                sx={{height: 64, justifyContent: 'flex-start', px: 2}}
                            >
                                Track Submitted Work
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{border: '1px solid #334155', borderRadius: 2, backgroundColor: '#111827', p: {xs: 2, md: 3}}}>
                        <Stack direction={{xs: 'column', lg: 'row'}} spacing={2} alignItems={{xs: 'stretch', lg: 'center'}}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{minWidth: {lg: 220}}}>
                                <RouteOutlinedIcon sx={{color: '#FFD700'}}/>
                                <Box>
                                    <Typography variant="subtitle1" color="white" fontWeight="bold">Routing Desk</Typography>
                                    <Typography variant="caption" color={theme.palette.text.secondary}>Pick what you know.</Typography>
                                </Box>
                            </Stack>
                            <FormControl size="small" sx={{minWidth: {xs: '100%', lg: 260}, backgroundColor: '#D2D2D4', borderRadius: 1}}>
                                <InputLabel>Unit / Division</InputLabel>
                                <Select
                                    label="Unit / Division"
                                    value={selectedUnit}
                                    onChange={(event: SelectChangeEvent<string>) => setSelectedUnit(event.target.value)}
                                >
                                    <MenuItem value="">Any unit</MenuItem>
                                    {unitOptions.map((unit) => (
                                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography variant="body2" color="white" sx={{flex: 1}}>
                                {routedCells.length > 0
                                    ? `${routedCells.length} recommended destination${routedCells.length === 1 ? '' : 's'} below.`
                                    : 'No exact match yet. Submit the problem and Corps admin can triage it.'}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>

                <Typography variant="h4" align="center" color="white"
                            sx={{
                                mb: 1,
                                px: 2,
                                fontWeight: 'bold',
                                letterSpacing: 0,
                                fontSize: {xs: '1.6rem', sm: '2rem', md: '2.5rem'},
                                overflowWrap: 'anywhere'}}>
                    Recommended Innovation Cells
                </Typography>
                <Typography variant={'body1'}
                            sx={{
                                mb: {xs: 3, md: 4},
                                px: 2,
                                maxWidth: 1100,
                                opacity: 0.8,
                                letterSpacing: 0,
                                textAlign: 'center',
                            }} color={'white'}>
                    JIOP | ODS | Division innovation cells
                </Typography>

                {cellsLoadError && (
                    <Alert severity="warning" sx={{width: '100%', maxWidth: 900, mb: 3}}>
                        {cellsLoadError}
                    </Alert>
                )}

                {cellsAreLoading && <CircularProgress sx={{my: 4}} />}

                <Grid container spacing={{xs: 2, md: 4}} justifyContent="center" sx={{width: '100%', mx: 0}}>
                    {!cellsAreLoading && !cellsLoadError && (
                        routedCells.map((cell) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={cell.id} sx={{display: 'flex', justifyContent: 'center'}}>
                                <InnovationCellCard {...cell} />
                            </Grid>
                        ))
                    )}
                </Grid>
                    <Typography
                        variant="h4"
                        component="h2"
                        fontWeight="light"
                        mb={6}
                        mt={10}
                        color={theme.palette.common.white}
                    >

                        What is Dragon Spark?
                    </Typography>
                    <Typography
                        align={'center'}
                        color={theme.palette.text.secondary}
                        variant={'h5'}
                        fontWeight={'lighter'}
                        lineHeight={1.5}
                        sx={{width: {xs: '100%', md: '60%'}, fontSize: {xs: '1rem', sm: '1.25rem', md: '1.5rem'}}}
                    >
                        Dragon Spark is the XVIII Airborne Corps intake, triage, and routing system for Soldier-led
                        problems. It connects Corps headquarters, JIOP, ODS, and subordinate division innovation cells
                        so ideas can be scoped, assigned, prototyped, tested, and delivered across the formation.
                    </Typography>
                <Footer/>
            </Box>

            <IdeaSubmission open={submissionIsOpen} setOpen={setSubmissionIsOpen}
                            loadIdeas={loadIdeas} isOnDifferentPage/>

        </>
    );
};

export default InnovationsCells;
