import React, {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {getIdeas, Idea} from "./api/ideasApi";
import {Stage} from "./enum/Stage";
import {StageChip} from "./StageChip";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const getReuseStatus = (idea: Idea) => {
    const stage = Number(idea.stage);

    if (stage >= Stage.TESTING) {
        return 'Available for reuse';
    }

    if (stage >= Stage.ASSIGNED) {
        return 'Coordinate before duplicating';
    }

    return 'Requirement under review';
};

const DigitalCapabilityCatalog = () => {
    const theme = useTheme();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [search, setSearch] = useState('');
    const [laneFilter, setLaneFilter] = useState('');
    const [echelonFilter, setEchelonFilter] = useState('');

    useEffect(() => {
        setLoadError('');
        getIdeas()
            .then(setIdeas)
            .catch((error) => {
                console.error("Error fetching digital capability catalog:", error);
                setLoadError('Unable to load the capability catalog. Check that the backend API is running, then refresh.');
            })
            .finally(() => setLoading(false));
    }, []);

    const lanes = useMemo(() => Array.from(new Set(ideas.map(idea => idea.capabilityLane).filter(Boolean))).sort(), [ideas]);
    const echelons = useMemo(() => Array.from(new Set(ideas.map(idea => idea.unitDivision).filter(Boolean))).sort(), [ideas]);

    const filteredIdeas = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return ideas.filter((idea) => {
            const searchableText = [
                idea.title,
                idea.problemStatement,
                idea.problemContext,
                idea.solutionConcepts,
                idea.unitDivision,
                idea.capabilityLane,
                idea.innovationCell?.name,
                idea.submitter?.unit
            ].join(' ').toLowerCase();

            return (!normalizedSearch || searchableText.includes(normalizedSearch))
                && (!laneFilter || idea.capabilityLane === laneFilter)
                && (!echelonFilter || idea.unitDivision === echelonFilter);
        });
    }, [echelonFilter, ideas, laneFilter, search]);

    const reuseCount = ideas.filter(idea => Number(idea.stage) >= Stage.TESTING).length;
    const coordinatedCount = ideas.filter(idea => Number(idea.stage) >= Stage.ASSIGNED && Number(idea.stage) < Stage.TESTING).length;
    const hasActiveFilters = Boolean(search || laneFilter || echelonFilter);

    const clearFilters = () => {
        setSearch('');
        setLaneFilter('');
        setEchelonFilter('');
    };

    const columns: GridColDef[] = [
        {field: 'title', headerName: 'Capability / Problem', flex: 12, minWidth: 220},
        {field: 'unitDivision', headerName: 'Sponsoring Org', flex: 9, minWidth: 170},
        {
            field: 'productOwner',
            headerName: 'Product Owner',
            flex: 8,
            minWidth: 160,
            valueGetter: (params) => {
                const submitter = params.row.submitter;
                return submitter ? `${submitter.firstName} ${submitter.lastName}` : 'Unassigned';
            }
        },
        {field: 'capabilityLane', headerName: 'Capability Lane', flex: 7, minWidth: 140},
        {
            field: 'stage',
            headerName: 'Development Status',
            flex: 7,
            minWidth: 150,
            renderCell: (params) => <StageChip stage={Stage[params.value] || params.value} size="small"/>
        },
        {
            field: 'users',
            headerName: 'Users',
            flex: 8,
            minWidth: 150,
            valueGetter: (params) => params.row.operationalImpact || params.row.unitDivision || 'Not specified'
        },
        {
            field: 'reuseStatus',
            headerName: 'Reuse Guidance',
            flex: 9,
            minWidth: 190,
            valueGetter: (params) => getReuseStatus(params.row),
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        backgroundColor: params.value === 'Available for reuse' ? '#DCFCE7' : '#FEF9C3',
                        color: params.value === 'Available for reuse' ? '#15803D' : '#854D0E',
                        fontWeight: 'bold'
                    }}
                />
            )
        },
        {
            field: 'assignedCell',
            headerName: 'Assigned Cell',
            flex: 8,
            minWidth: 160,
            valueGetter: (params) => params.row.innovationCell?.name || 'Not assigned'
        }
    ];

    const renderMetric = (label: string, value: number | string) => (
        <Box sx={{border: '1px solid #334155', borderRadius: 1, p: 1.5, backgroundColor: '#1F2937', minHeight: 88}}>
            <Typography variant="caption" color={theme.palette.text.secondary}>{label}</Typography>
            <Typography variant="h4" color="white" fontWeight="bold">{value}</Typography>
        </Box>
    );

    const filterControlSx = {
        flex: {xs: '1 1 100%', sm: '1 1 220px'},
        backgroundColor: '#F8FAFC',
        borderRadius: 1
    };

    return (
        <Box sx={{width: '100%', p: {xs: 0, sm: 2, md: 3}, pb: 4}}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="white" mb={1} sx={{fontSize: {xs: '1.75rem', sm: '2.125rem'}}}>
                Digital Capability Catalog
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={3}>
                Corps-level visibility of applications, dashboards, spreadsheets, AI tools, and other digital efforts being scoped, built, tested, or reused.
            </Typography>
            {loadError && <Alert severity="error" sx={{mb: 2}}>{loadError}</Alert>}

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>{renderMetric('Tracked Efforts', ideas.length)}</Grid>
                <Grid item xs={12} sm={4}>{renderMetric('Available for Reuse', reuseCount)}</Grid>
                <Grid item xs={12} sm={4}>{renderMetric('Coordinate Before Duplicating', coordinatedCount)}</Grid>
            </Grid>

            <Box sx={{border: '1px solid #334155', borderRadius: 1, backgroundColor: '#111827', p: 1.5, mb: 2}}>
                <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" alignItems="center">
                    <Typography variant="subtitle2" color="white" fontWeight="bold" sx={{width: {xs: '100%', sm: 'auto'}, minWidth: 70}}>
                        Filters
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Search problem, owner, unit, capability"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>}}
                        sx={{flex: {xs: '1 1 100%', sm: '2 1 320px'}, backgroundColor: '#F8FAFC', borderRadius: 1}}
                    />
                    <FormControl size="small" sx={filterControlSx}>
                        <InputLabel>Capability Lane</InputLabel>
                        <Select label="Capability Lane" value={laneFilter} onChange={(event: SelectChangeEvent<string>) => setLaneFilter(event.target.value)}>
                            <MenuItem value="">All lanes</MenuItem>
                            {lanes.map((lane) => <MenuItem key={lane} value={lane}>{lane}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{...filterControlSx, flex: {xs: '1 1 100%', sm: '1 1 240px'}}}>
                        <InputLabel>Sponsoring Org</InputLabel>
                        <Select label="Sponsoring Org" value={echelonFilter} onChange={(event: SelectChangeEvent<string>) => setEchelonFilter(event.target.value)}>
                            <MenuItem value="">All orgs</MenuItem>
                            {echelons.map((echelon) => <MenuItem key={echelon} value={echelon}>{echelon}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {hasActiveFilters && (
                        <Button color="info" variant="outlined" startIcon={<ClearIcon/>} onClick={clearFilters} sx={{height: 40, whiteSpace: 'nowrap', flex: {xs: '1 1 100%', sm: '0 0 auto'}}}>
                            Clear
                        </Button>
                    )}
                </Stack>
            </Box>

            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <Box sx={{height: {xs: 560, md: 640}, minWidth: {xs: 1180, md: '100%'}}}>
                    <DataGrid
                        rows={filteredIdeas}
                        columns={columns}
                        loading={loading}
                        density="compact"
                        getRowHeight={() => 'auto'}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: theme.palette.grey[900],
                                color: theme.palette.secondary.main,
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-cell': {
                                py: 1,
                            },
                            '& .MuiSvgIcon-root': {
                                color: '#C4E0E3'
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default DigitalCapabilityCatalog;
