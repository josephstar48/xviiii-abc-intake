import React, {useEffect, useMemo, useState} from 'react';
import {
    Box,
    Chip,
    Grid,
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

const stageLabels = ['Submitted', 'Scoped', 'Assigned', 'In Prototype', 'Testing', 'Delivered'];

const getStageName = (stage: Stage | string | number) => {
    if (typeof stage === 'number') {
        return stageLabels[stage] || 'Unknown';
    }

    return stage.toString().replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

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
    const [search, setSearch] = useState('');
    const [laneFilter, setLaneFilter] = useState('');
    const [echelonFilter, setEchelonFilter] = useState('');

    useEffect(() => {
        getIdeas()
            .then(setIdeas)
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
        <Box sx={{border: '1px solid #334155', borderRadius: 2, p: 2, backgroundColor: '#111827', minHeight: 94}}>
            <Typography variant="caption" color={theme.palette.text.secondary}>{label}</Typography>
            <Typography variant="h4" color="white" fontWeight="bold">{value}</Typography>
        </Box>
    );

    return (
        <Box sx={{width: '100%', p: {xs: 0, sm: 2, md: 3}, pb: 4}}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="white" mb={1} sx={{fontSize: {xs: '1.75rem', sm: '2.125rem'}}}>
                Digital Capability Catalog
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={3}>
                Corps-level visibility of applications, dashboards, spreadsheets, AI tools, and other digital efforts being scoped, built, tested, or reused.
            </Typography>

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>{renderMetric('Tracked Efforts', ideas.length)}</Grid>
                <Grid item xs={12} sm={4}>{renderMetric('Available for Reuse', reuseCount)}</Grid>
                <Grid item xs={12} sm={4}>{renderMetric('Coordinate Before Duplicating', coordinatedCount)}</Grid>
            </Grid>

            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} mb={2}>
                <TextField
                    size="small"
                    placeholder="Search problem, owner, unit, or capability"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    sx={{flex: 1, backgroundColor: '#D2D2D4', borderRadius: 1}}
                />
                <Select
                    size="small"
                    value={laneFilter}
                    displayEmpty
                    onChange={(event: SelectChangeEvent<string>) => setLaneFilter(event.target.value)}
                    sx={{minWidth: {xs: '100%', md: 220}, backgroundColor: '#D2D2D4'}}
                >
                    <MenuItem value="">All capability lanes</MenuItem>
                    {lanes.map((lane) => <MenuItem key={lane} value={lane}>{lane}</MenuItem>)}
                </Select>
                <Select
                    size="small"
                    value={echelonFilter}
                    displayEmpty
                    onChange={(event: SelectChangeEvent<string>) => setEchelonFilter(event.target.value)}
                    sx={{minWidth: {xs: '100%', md: 240}, backgroundColor: '#D2D2D4'}}
                >
                    <MenuItem value="">All sponsoring orgs</MenuItem>
                    {echelons.map((echelon) => <MenuItem key={echelon} value={echelon}>{echelon}</MenuItem>)}
                </Select>
            </Stack>

            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <Box sx={{height: {xs: 560, md: 640}, minWidth: {xs: 1180, md: '100%'}}}>
                    <DataGrid
                        rows={filteredIdeas}
                        columns={columns}
                        loading={loading}
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
