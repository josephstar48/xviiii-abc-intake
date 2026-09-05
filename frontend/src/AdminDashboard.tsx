import React, {useEffect, useMemo, useState} from 'react';
import {Box, Chip, Grid, MenuItem, Select, Typography, useTheme} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {getIdeas, Idea} from "./api/ideasApi";
import {getInnovationCells, InnovationCell, updateInnovationCell} from "./api/innovationCellApi";
import {StageChip} from "./StageChip";
import {Stage} from "./enum/Stage";

const stageLabels = ['Submitted', 'Scoped', 'Assigned', 'In Prototype', 'Testing', 'Delivered'];

const AdminDashboard = () => {
    const theme = useTheme();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [innovationCells, setInnovationCells] = useState<InnovationCell[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleInnovationCellAssignment = async (ideaId: number, innovationCellId: string | number) => {
        const success = await updateInnovationCell(ideaId, innovationCellId);
        if (success) {
            loadData();
        }
    };

    const columns: GridColDef[] = [
        {field: 'title', headerName: 'Problem', flex: 12},
        {field: 'unitDivision', headerName: 'Echelon', flex: 10},
        {field: 'capabilityLane', headerName: 'Lane', flex: 7},
        {field: 'operationalImpact', headerName: 'Impact', flex: 8},
        {field: 'urgency', headerName: 'Urgency', flex: 8},
        {
            field: 'stage',
            headerName: 'Status',
            flex: 7,
            renderCell: (params) => <StageChip stage={Stage[params.value]}/>
        },
        {
            field: 'innovationCell',
            headerName: 'Assigned Cell',
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

    return (
        <Box sx={{width: '100%', p: {xs: 0, sm: 2, md: 3}, pb: 4}}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="white" mb={1} sx={{fontSize: {xs: '1.75rem', sm: '2.125rem'}}}>
                Corps Admin
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={3}>
                Dragon Spark rollup for XVIII ABC, JIOP, ODS, and subordinate division innovation cells.
            </Typography>
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={4}>{renderCountGroup('By Status', statusCounts)}</Grid>
                <Grid item xs={12} md={4}>{renderCountGroup('By Capability Lane', laneCounts)}</Grid>
                <Grid item xs={12} md={4}>{renderCountGroup('By Echelon', echelonCounts)}</Grid>
            </Grid>
            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <Box sx={{height: {xs: 520, md: 560}, minWidth: {xs: 940, md: '100%'}}}>
                    <DataGrid
                        rows={ideas}
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
