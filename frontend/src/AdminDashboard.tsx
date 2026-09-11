import React, {useEffect, useMemo, useState} from 'react';
import {Box, Chip, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography, useTheme} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {getIdeas, Idea} from "./api/ideasApi";
import {getInnovationCells, InnovationCell, updateInnovationCell} from "./api/innovationCellApi";
import {StageChip} from "./StageChip";
import {Stage} from "./enum/Stage";

const stageLabels = ['Submitted', 'Scoped', 'Assigned', 'In Prototype', 'Testing', 'Delivered'];
const urgencyOrder: Record<string, number> = {
    'Critical - current mission impact': 4,
    'High - needed before training event or deployment': 3,
    'Medium - needed this quarter': 2,
    'Low - improvement opportunity': 1
};

const AdminDashboard = () => {
    const theme = useTheme();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [innovationCells, setInnovationCells] = useState<InnovationCell[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [echelonFilter, setEchelonFilter] = useState('');
    const [assignedCellFilter, setAssignedCellFilter] = useState('');

    const loadData = () => {
        Promise.all([getIdeas(), getInnovationCells()])
            .then(([ideasData, innovationCellsData]) => {
                setIdeas(ideasData);
                setInnovationCells(innovationCellsData);
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
            const stageLabel = stageLabels[Number(idea.stage)] || 'Unknown';
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
        <Box sx={{border: '1px solid #334155', borderRadius: 2, p: 2, backgroundColor: '#111827'}}>
            <Typography variant="h6" color="white" mb={1}>{title}</Typography>
            {Object.entries(counts).map(([label, count]) => (
                <Box key={label} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="white">{label}</Typography>
                    <Chip label={count} size="small" sx={{backgroundColor: '#FFD700', fontWeight: 'bold'}}/>
                </Box>
            ))}
        </Box>
    );

    const renderMetric = (label: string, value: number, helper?: string) => (
        <Box sx={{border: '1px solid #334155', borderRadius: 2, p: 2, backgroundColor: '#111827', minHeight: 104}}>
            <Typography variant="caption" color={theme.palette.text.secondary}>{label}</Typography>
            <Typography variant="h4" color="white" fontWeight="bold">{value}</Typography>
            {helper && <Typography variant="caption" color={theme.palette.text.secondary}>{helper}</Typography>}
        </Box>
    );

    return (
        <Box sx={{width: '100%', p: {xs: 0, sm: 2, md: 3}, pb: 4}}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="white" mb={1} sx={{fontSize: {xs: '1.75rem', sm: '2.125rem'}}}>
                Corps Staff Admin
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={3}>
                Corps-wide triage view for all submitted ideas across XVIII ABC, JIOP, ODS, and subordinate division innovation cells.
            </Typography>
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
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} mb={2}>
                <TextField
                    size="small"
                    placeholder="Search title, submitter, unit, lane, routing notes"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    sx={{flex: 1, backgroundColor: '#D2D2D4', borderRadius: 1}}
                />
                <FormControl size="small" sx={{minWidth: {xs: '100%', md: 190}, backgroundColor: '#D2D2D4', borderRadius: 1}}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        label="Status"
                        value={statusFilter}
                        onChange={(event: SelectChangeEvent<string>) => setStatusFilter(event.target.value)}
                    >
                        <MenuItem value="">All statuses</MenuItem>
                        {stageLabels.map((stage) => <MenuItem key={stage} value={stage}>{stage}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{minWidth: {xs: '100%', md: 290}, backgroundColor: '#D2D2D4', borderRadius: 1}}>
                    <InputLabel>Urgency</InputLabel>
                    <Select
                        label="Urgency"
                        value={urgencyFilter}
                        onChange={(event: SelectChangeEvent<string>) => setUrgencyFilter(event.target.value)}
                    >
                        <MenuItem value="">All urgency levels</MenuItem>
                        {Object.keys(urgencyOrder).map((urgency) => <MenuItem key={urgency} value={urgency}>{urgency}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{minWidth: {xs: '100%', md: 240}, backgroundColor: '#D2D2D4', borderRadius: 1}}>
                    <InputLabel>Echelon</InputLabel>
                    <Select
                        label="Echelon"
                        value={echelonFilter}
                        onChange={(event: SelectChangeEvent<string>) => setEchelonFilter(event.target.value)}
                    >
                        <MenuItem value="">All echelons</MenuItem>
                        {echelons.map((echelon) => <MenuItem key={echelon} value={echelon}>{echelon}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{minWidth: {xs: '100%', md: 260}, backgroundColor: '#D2D2D4', borderRadius: 1}}>
                    <InputLabel>Assigned Cell</InputLabel>
                    <Select
                        label="Assigned Cell"
                        value={assignedCellFilter}
                        onChange={(event: SelectChangeEvent<string>) => setAssignedCellFilter(event.target.value)}
                    >
                        <MenuItem value="">All assignments</MenuItem>
                        <MenuItem value="unassigned">Unassigned</MenuItem>
                        {innovationCells.map((cell) => <MenuItem key={cell.id} value={cell.id.toString()}>{cell.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
            <Typography variant="body2" color={theme.palette.text.secondary} mb={1}>
                Showing {filteredIdeas.length} of {ideas.length} Corps-wide ideas.
            </Typography>
            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <Box sx={{height: {xs: 560, md: 620}, minWidth: {xs: 1180, md: '100%'}}}>
                    <DataGrid
                        rows={filteredIdeas}
                        columns={columns}
                        loading={loading}
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
