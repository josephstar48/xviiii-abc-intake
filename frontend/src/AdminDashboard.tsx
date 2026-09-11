import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Box, Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography, useTheme} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {getIdeas, Idea} from "./api/ideasApi";
import {getInnovationCells, InnovationCell, updateInnovationCell} from "./api/innovationCellApi";
import {StageChip} from "./StageChip";
import {Stage} from "./enum/Stage";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {formatLastUpdated, getStageLabel, stageLabels, urgencyOrder} from "./workflowUtils";

const AdminDashboard = () => {
    const theme = useTheme();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [innovationCells, setInnovationCells] = useState<InnovationCell[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [echelonFilter, setEchelonFilter] = useState('');
    const [assignedCellFilter, setAssignedCellFilter] = useState('');

    const loadData = () => {
        setLoadError('');
        Promise.all([getIdeas(), getInnovationCells()])
            .then(([ideasData, innovationCellsData]) => {
                setIdeas(ideasData);
                setInnovationCells(innovationCellsData);
            })
            .catch((error) => {
                console.error("Error fetching admin data:", error);
                setLoadError('Unable to load Corps admin data. Check that the backend API is running, then refresh.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const countBy = (key: keyof Idea) => ideas.reduce<Record<string, number>>((counts, idea) => {
        const value = String(idea[key] || 'Unspecified');
        counts[value] = (counts[value] || 0) + 1;
        return counts;
    }, {});

    const statusCounts = useMemo(() => ideas.reduce<Record<string, number>>((counts, idea) => {
        const label = stageLabels[Number(idea.stage)] || 'Unknown';
        counts[label] = (counts[label] || 0) + 1;
        return counts;
    }, {}), [ideas]);

    const laneCounts = useMemo(() => countBy('capabilityLane'), [ideas]);
    const echelonCounts = useMemo(() => countBy('unitDivision'), [ideas]);
    const echelons = useMemo(() => Array.from(new Set(ideas.map(idea => idea.unitDivision || idea.submitter?.unit || 'Unspecified'))).sort(), [ideas]);
    const filteredIdeas = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return ideas.filter((idea) => {
            const stageLabel = getStageLabel(idea.stage);
            const echelon = idea.unitDivision || idea.submitter?.unit || 'Unspecified';
            const assignedCell = idea.innovationCell?.id?.toString() || 'unassigned';
            const searchableText = [
                idea.title,
                idea.problemStatement,
                idea.problemContext,
                idea.solutionConcepts,
                idea.unitDivision,
                idea.problemType,
                idea.operationalImpact,
                idea.urgency,
                idea.capabilityLane,
                idea.routingNotes,
                idea.innovationCell?.name,
                idea.submitter?.firstName,
                idea.submitter?.lastName,
                idea.submitter?.unit,
                idea.submitter?.email
            ].join(' ').toLowerCase();

            return (!normalizedSearch || searchableText.includes(normalizedSearch))
                && (!statusFilter || stageLabel === statusFilter)
                && (!urgencyFilter || idea.urgency === urgencyFilter)
                && (!echelonFilter || echelon === echelonFilter)
                && (!assignedCellFilter || assignedCell === assignedCellFilter);
        });
    }, [assignedCellFilter, echelonFilter, ideas, search, statusFilter, urgencyFilter]);

    const criticalGaps = ideas.filter(idea => idea.urgency === 'Critical - current mission impact').length;
    const unassigned = ideas.filter(idea => !idea.innovationCell).length;
    const delivered = ideas.filter(idea => Number(idea.stage) === Stage.DELIVERED).length;
    const hasActiveFilters = Boolean(search || statusFilter || urgencyFilter || echelonFilter || assignedCellFilter);

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setUrgencyFilter('');
        setEchelonFilter('');
        setAssignedCellFilter('');
    };

    const handleInnovationCellAssignment = async (ideaId: number, innovationCellId: string | number) => {
        const success = await updateInnovationCell(ideaId, innovationCellId);
        if (success) {
            loadData();
        }
    };

    const columns: GridColDef[] = [
        {field: 'title', headerName: 'Problem', flex: 12},
        {field: 'unitDivision', headerName: 'Echelon', flex: 10},
        {
            field: 'submitterName',
            headerName: 'Submitter',
            flex: 8,
            valueGetter: (params) => {
                const submitter = params.row.submitter;
                return submitter ? `${submitter.firstName} ${submitter.lastName}` : 'Unknown';
            }
        },
        {
            field: 'submitterUnit',
            headerName: 'Submitter Unit',
            flex: 8,
            valueGetter: (params) => params.row.submitter?.unit || 'Unspecified'
        },
        {field: 'capabilityLane', headerName: 'Lane', flex: 7},
        {field: 'operationalImpact', headerName: 'Impact', flex: 8},
        {
            field: 'urgency',
            headerName: 'Urgency',
            flex: 8,
            sortComparator: (a, b) => (urgencyOrder[String(a)] || 0) - (urgencyOrder[String(b)] || 0)
        },
        {
            field: 'stage',
            headerName: 'Status',
            flex: 7,
            sortComparator: (a, b) => Number(a) - Number(b),
            renderCell: (params) => <StageChip stage={Stage[params.value]}/>
        },
        {field: 'routingNotes', headerName: 'Routing Notes', flex: 12},
        {
            field: 'poc',
            headerName: 'POC',
            flex: 8,
            valueGetter: (params) => params.row.innovationCell?.email || 'Pending assignment'
        },
        {
            field: 'lastUpdated',
            headerName: 'Last Updated',
            flex: 8,
            valueFormatter: (params) => formatLastUpdated(params.value)
        },
        {
            field: 'innovationCell',
            headerName: 'Manual Route',
            flex: 12,
            renderCell: (params) => (
                <Select
                    value={params.value?.id || ''}
                    onChange={(event) => handleInnovationCellAssignment(params.row.id, event.target.value as string)}
                    size="small"
                    fullWidth
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {innovationCells.map((cell) => (
                        <MenuItem key={cell.id} value={cell.id}>
                            {cell.name}
                        </MenuItem>
                    ))}
                </Select>
            )
        }
    ];

    const renderCountGroup = (title: string, counts: Record<string, number>) => (
        <Box sx={{border: '1px solid #334155', borderRadius: 1, p: 1.5, backgroundColor: '#1F2937'}}>
            <Typography variant="subtitle1" color="white" mb={1} fontWeight="bold">{title}</Typography>
            {Object.entries(counts).map(([label, count]) => (
                <Box key={label} display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                    <Typography variant="body2" color="white">{label}</Typography>
                    <Typography variant="body2" color={theme.palette.text.secondary} fontWeight="bold">
                        {count}
                    </Typography>
                </Box>
            ))}
        </Box>
    );

    const renderMetric = (label: string, value: number, helper?: string) => (
        <Box sx={{border: '1px solid #334155', borderRadius: 1, p: 1.5, backgroundColor: '#1F2937', minHeight: 88}}>
            <Typography variant="caption" color={theme.palette.text.secondary}>{label}</Typography>
            <Typography variant="h4" color="white" fontWeight="bold">{value}</Typography>
            {helper && <Typography variant="caption" color={theme.palette.text.secondary}>{helper}</Typography>}
        </Box>
    );

    const filterControlSx = {
        flex: {xs: '1 1 100%', md: '1 1 180px', lg: '0 1 220px'},
        backgroundColor: '#F8FAFC',
        borderRadius: 1
    };

    return (
        <Box sx={{width: '100%', p: {xs: 0, sm: 2, md: 3}, pb: 4}}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="white" mb={1} sx={{fontSize: {xs: '1.75rem', sm: '2.125rem'}}}>
                Corps Staff Admin
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={3}>
                Corps-wide triage view for all submitted ideas across XVIII ABC, JIOP, ODS, and subordinate division innovation cells.
            </Typography>
            {loadError && <Alert severity="error" sx={{mb: 2}}>{loadError}</Alert>}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={4}>{renderMetric('Immediate Gaps', criticalGaps, 'Critical current mission impact')}</Grid>
                <Grid item xs={12} md={4}>{renderMetric('Unassigned', unassigned, 'Needs manual triage')}</Grid>
                <Grid item xs={12} md={4}>{renderMetric('Delivered', delivered, 'Delivery dates not yet captured')}</Grid>
            </Grid>
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={4}>{renderCountGroup('By Status', statusCounts)}</Grid>
                <Grid item xs={12} md={4}>{renderCountGroup('By Capability Lane', laneCounts)}</Grid>
                <Grid item xs={12} md={4}>{renderCountGroup('By Echelon', echelonCounts)}</Grid>
            </Grid>
            <Box sx={{border: '1px solid #334155', borderRadius: 1, backgroundColor: '#111827', p: 1.5, mb: 2}}>
                <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" alignItems="center">
                    <Typography variant="subtitle2" color="white" fontWeight="bold" sx={{width: {xs: '100%', md: 'auto'}, minWidth: 70}}>
                        Filters
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Search title, submitter, unit, lane, notes"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>}}
                        sx={{flex: {xs: '1 1 100%', md: '2 1 320px'}, backgroundColor: '#F8FAFC', borderRadius: 1}}
                    />
                    <FormControl size="small" sx={filterControlSx}>
                        <InputLabel>Status</InputLabel>
                        <Select label="Status" value={statusFilter} onChange={(event: SelectChangeEvent<string>) => setStatusFilter(event.target.value)}>
                            <MenuItem value="">All statuses</MenuItem>
                            {stageLabels.map((stage) => <MenuItem key={stage} value={stage}>{stage}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{...filterControlSx, flex: {xs: '1 1 100%', md: '1 1 250px', lg: '0 1 270px'}}}>
                        <InputLabel>Urgency</InputLabel>
                        <Select label="Urgency" value={urgencyFilter} onChange={(event: SelectChangeEvent<string>) => setUrgencyFilter(event.target.value)}>
                            <MenuItem value="">All urgency levels</MenuItem>
                            {Object.keys(urgencyOrder).map((urgency) => <MenuItem key={urgency} value={urgency}>{urgency}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={filterControlSx}>
                        <InputLabel>Echelon</InputLabel>
                        <Select label="Echelon" value={echelonFilter} onChange={(event: SelectChangeEvent<string>) => setEchelonFilter(event.target.value)}>
                            <MenuItem value="">All echelons</MenuItem>
                            {echelons.map((echelon) => <MenuItem key={echelon} value={echelon}>{echelon}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{...filterControlSx, flex: {xs: '1 1 100%', md: '1 1 230px', lg: '0 1 250px'}}}>
                        <InputLabel>Assigned Cell</InputLabel>
                        <Select label="Assigned Cell" value={assignedCellFilter} onChange={(event: SelectChangeEvent<string>) => setAssignedCellFilter(event.target.value)}>
                            <MenuItem value="">All assignments</MenuItem>
                            <MenuItem value="unassigned">Unassigned</MenuItem>
                            {innovationCells.map((cell) => <MenuItem key={cell.id} value={cell.id.toString()}>{cell.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {hasActiveFilters && (
                        <Button color="info" variant="outlined" startIcon={<ClearIcon/>} onClick={clearFilters} sx={{height: 40, whiteSpace: 'nowrap', flex: {xs: '1 1 100%', sm: '0 0 auto'}}}>
                            Clear
                        </Button>
                    )}
                </Stack>
            </Box>
            <Typography variant="body2" color={theme.palette.text.secondary} mb={1}>
                Showing {filteredIdeas.length} of {ideas.length} Corps-wide ideas.
            </Typography>
            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <Box sx={{height: {xs: 560, md: 620}, minWidth: {xs: 1180, md: '100%'}}}>
                    <DataGrid
                        rows={filteredIdeas}
                        columns={columns}
                        loading={loading}
                        density="compact"
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: theme.palette.grey[900],
                                color: theme.palette.secondary.main,
                                fontWeight: 'bold',
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

export default AdminDashboard;
