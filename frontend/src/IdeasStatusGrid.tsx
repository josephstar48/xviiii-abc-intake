import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getIdeas, Idea } from "./api/ideasApi";
import { IdeaSubmission } from "./IdeaSubmission";
import {getInnovationCells, InnovationCell, updateInnovationCell} from "./api/innovationCellApi";
import { IdeaViewerModal } from "./IdeaViewerModal";
import {DocumentsIconButton} from "./DocumentsIconButton";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {StageChip} from "./StageChip";
import {formatLastUpdated, getStageLabel, stageLabels, urgencyOrder} from "./workflowUtils";

const IdeasStatusGrid: React.FC = () => {
  const theme = useTheme();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState('');
  const [openSubmissionModal, setOpenSubmissionModal] = useState<boolean>(false);
  const [innovationCells, setInnovationCells] = useState<InnovationCell[]>([]);
  const [viewedIdea, setViewedIdea] = useState<Idea | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');

  const loadIdeas = () => {
    setLoadError('');
    Promise.all([
      getIdeas(),
      getInnovationCells(),
    ])
      .then(([ideasData, innovationCellsData]) => {
        setIdeas(ideasData);
        setInnovationCells(innovationCellsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoadError('Unable to load status data. Check that the backend API is running, then refresh.');
      })
      .finally(() => setLoading(false));
  }

  const handleInnovationCellAssignment = async (ideaId: number, innovationCellId: string | number) => {
    const success = await updateInnovationCell(ideaId, innovationCellId);
    if (success) {
      loadIdeas();
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      headerAlign: 'center',
      align: 'center',
      flex: 16
    },
    {
      field: 'submitter',
      headerName: 'Submitter',
      headerAlign: 'center',
      align: 'center',
      flex: 8,
      renderCell: (params) => {
        const submitter = params.row.submitter;
        return (
          <Tooltip title={`${submitter.email}\n${submitter.phone}`} arrow>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {`${submitter.firstName} ${submitter.lastName}`}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'stage',
      headerName: 'Status',
      flex: 6,
      sortComparator: (a, b) => Number(a) - Number(b),
      renderCell: (params) => <StageChip stage={params.value} />,
    },
    {
      field: 'unitDivision',
      headerName: 'Echelon',
      headerAlign: 'center',
      align: 'center',
      flex: 10
    },
    {
      field: 'capabilityLane',
      headerName: 'Lane',
      headerAlign: 'center',
      align: 'center',
      flex: 6
    },
    {
      field: 'urgency',
      headerName: 'Urgency',
      headerAlign: 'center',
      align: 'center',
      flex: 7,
      sortComparator: (a, b) => (urgencyOrder[String(a)] || 0) - (urgencyOrder[String(b)] || 0)
    },
    {
      field: 'assigned',
      headerName: 'Manual Route',
      headerAlign: 'center',
      align: 'center',
      flex: 8,
      valueGetter: (params) => params.row.innovationCell,
      renderCell: (params) => (
        <Select
          value={params.value?.id || ''}
          onChange={(event) => {
            const newValue = event.target.value as string;
            handleInnovationCellAssignment(params.row.id, newValue);
          }}
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
    },
    {
      field: 'routingNotes',
      headerName: 'Routing Notes',
      headerAlign: 'center',
      align: 'center',
      flex: 9
    },
    {
      field: 'poc',
      headerName: 'POC',
      headerAlign: 'center',
      align: 'center',
      flex: 8,
      valueGetter: (params) => params.row.innovationCell?.email || 'Pending assignment'
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      headerAlign: 'center',
      align: 'center',
      flex: 8,
      valueFormatter: (params) => formatLastUpdated(params.value)
    },
    {
      field: 'documents',
      headerName: 'Documents',
      headerAlign: 'center',
      align: 'center',
      flex: 4,
      renderCell: (params) => <DocumentsIconButton ideaId={params.row.id} problemName={params.row.title} documents={params.value} reload={loadIdeas}/>,
    },
  ];

  const filteredIdeas = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return ideas.filter((idea) => {
      const stageLabel = getStageLabel(idea.stage);
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
        idea.submitter?.unit
      ].join(' ').toLowerCase();

      return (!normalizedSearch || searchableText.includes(normalizedSearch))
        && (!statusFilter || stageLabel === statusFilter)
        && (!urgencyFilter || idea.urgency === urgencyFilter);
    });
  }, [ideas, search, statusFilter, urgencyFilter]);

  const criticalGaps = ideas.filter(idea => idea.urgency === 'Critical - current mission impact').length;
  const unassigned = ideas.filter(idea => !idea.innovationCell).length;
  const delivered = ideas.filter(idea => Number(idea.stage) === 5).length;
  const hasActiveFilters = Boolean(search || statusFilter || urgencyFilter);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setUrgencyFilter('');
  };

  const stageDashboardColumns: GridColDef[] = [
    {
      field: 'echelon',
      headerName: 'Echelon',
      flex: 10,
      minWidth: 230
    },
    {
      field: 'submitted',
      headerName: 'Submitted',
      type: 'number',
      flex: 5,
      minWidth: 120
    },
    {
      field: 'scoped',
      headerName: 'Scoped',
      type: 'number',
      flex: 5,
      minWidth: 110
    },
    {
      field: 'assigned',
      headerName: 'Assigned',
      type: 'number',
      flex: 5,
      minWidth: 120
    },
    {
      field: 'inPrototype',
      headerName: 'In Prototype',
      type: 'number',
      flex: 6,
      minWidth: 140
    },
    {
      field: 'testing',
      headerName: 'Testing',
      type: 'number',
      flex: 5,
      minWidth: 110
    },
    {
      field: 'delivered',
      headerName: 'Delivered',
      type: 'number',
      flex: 5,
      minWidth: 120
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      flex: 4,
      minWidth: 100
    }
  ];

  const stageDashboardRows = useMemo(() => {
    const blankCounts = () => ({
      submitted: 0,
      scoped: 0,
      assigned: 0,
      inPrototype: 0,
      testing: 0,
      delivered: 0,
      total: 0
    });

    const rowsByEchelon = filteredIdeas.reduce<Record<string, ReturnType<typeof blankCounts>>>((rows, idea) => {
      const echelon = idea.unitDivision || idea.submitter?.unit || 'Unspecified';

      if (!rows[echelon]) {
        rows[echelon] = blankCounts();
      }

      switch (Number(idea.stage)) {
        case 0:
          rows[echelon].submitted += 1;
          break;
        case 1:
          rows[echelon].scoped += 1;
          break;
        case 2:
          rows[echelon].assigned += 1;
          break;
        case 3:
          rows[echelon].inPrototype += 1;
          break;
        case 4:
          rows[echelon].testing += 1;
          break;
        case 5:
          rows[echelon].delivered += 1;
          break;
        default:
          break;
      }

      rows[echelon].total += 1;
      return rows;
    }, {});

    return Object.entries(rowsByEchelon).map(([echelon, counts], index) => ({
      id: echelon || index,
      echelon,
      ...counts
    }));
  }, [filteredIdeas]);

  const renderMetric = (label: string, value: number, helper?: string) => (
    <Box sx={{border: '1px solid #334155', borderRadius: 1, p: 1.5, backgroundColor: '#1F2937', minHeight: 88}}>
      <Typography variant="caption" color={theme.palette.text.secondary}>{label}</Typography>
      <Typography variant="h4" color="white" fontWeight="bold">{value}</Typography>
      {helper && <Typography variant="caption" color={theme.palette.text.secondary}>{helper}</Typography>}
    </Box>
  );

  const filterControlSx = {
    flex: {xs: '1 1 100%', sm: '1 1 180px'},
    backgroundColor: '#F8FAFC',
    borderRadius: 1
  };

  function handleRowClick(id: number) {
    const idea = ideas.find(idea => idea.id === id);
    if (idea !== undefined) {
      setViewedIdea(idea);
    }
  }

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems={{xs: 'stretch', sm: 'center'}} flexDirection={{xs: 'column', sm: 'row'}} gap={2} mb={2} mt={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" color='white' sx={{fontSize: {xs: '1.75rem', sm: '2.125rem'}}}>
          Dragon Spark Status
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenSubmissionModal(true)}
          sx={{alignSelf: {xs: 'stretch', sm: 'center'}}}
        >
          Submit New Idea
        </Button>
      </Box>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>{renderMetric('Immediate Gaps', criticalGaps, 'Critical current mission impact')}</Grid>
        <Grid item xs={12} md={4}>{renderMetric('Unassigned', unassigned, 'Needs routing')}</Grid>
        <Grid item xs={12} md={4}>{renderMetric('Delivered', delivered, 'Delivery dates not yet captured')}</Grid>
      </Grid>
      {loadError && <Alert severity="error" sx={{mb: 2}}>{loadError}</Alert>}
      <Box sx={{border: '1px solid #334155', borderRadius: 1, backgroundColor: '#111827', p: 1.5, mb: 3}}>
        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" alignItems="center">
          <Typography variant="subtitle2" color="white" fontWeight="bold" sx={{width: {xs: '100%', sm: 'auto'}, minWidth: 70}}>
            Filters
          </Typography>
          <TextField
            size="small"
            placeholder="Search title, unit, status, urgency, notes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>}}
            sx={{flex: {xs: '1 1 100%', sm: '2 1 320px'}, backgroundColor: '#F8FAFC', borderRadius: 1}}
          />
          <FormControl size="small" sx={filterControlSx}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={statusFilter} onChange={(event: SelectChangeEvent<string>) => setStatusFilter(event.target.value)}>
              <MenuItem value="">All statuses</MenuItem>
              {stageLabels.map((stage) => <MenuItem key={stage} value={stage}>{stage}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{...filterControlSx, flex: {xs: '1 1 100%', sm: '1 1 260px'}}}>
            <InputLabel>Urgency</InputLabel>
            <Select label="Urgency" value={urgencyFilter} onChange={(event: SelectChangeEvent<string>) => setUrgencyFilter(event.target.value)}>
              <MenuItem value="">All urgency levels</MenuItem>
              {Object.keys(urgencyOrder).map((urgency) => <MenuItem key={urgency} value={urgency}>{urgency}</MenuItem>)}
            </Select>
          </FormControl>
          {hasActiveFilters && (
            <Button color="info" variant="outlined" startIcon={<ClearIcon/>} onClick={clearFilters} sx={{height: 40, whiteSpace: 'nowrap', flex: {xs: '1 1 100%', sm: '0 0 auto'}}}>
              Clear
            </Button>
          )}
        </Stack>
      </Box>
      <Box mb={3}>
        <Typography variant="h6" component="h2" color="white" fontWeight="bold" mb={1}>
          Status Dashboard by Echelon
        </Typography>
        <Box sx={{width: '100%', overflowX: 'auto'}}>
          <Box sx={{height: {xs: 360, md: 420}, minWidth: {xs: 980, md: '100%'}}}>
            <DataGrid
              rows={stageDashboardRows}
              columns={stageDashboardColumns}
              loading={loading}
              density="compact"
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[900],
                  color: theme.palette.secondary.main,
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-cell': {
                  color: 'white',
                  fontWeight: 600,
                },
                '& .MuiDataGrid-cell[data-field="echelon"]': {
                  fontWeight: 700,
                },
                '& .MuiSvgIcon-root': {
                  color: '#C4E0E3'
                },
              }}
            />
          </Box>
        </Box>
      </Box>
      <Typography variant="h6" component="h2" color="white" fontWeight="bold" mb={1}>
        Submission Details
      </Typography>
      <Box sx={{width: '100%', overflowX: 'auto'}}>
        <Box sx={{height: {xs: 520, md: 600}, minWidth: {xs: 980, md: '100%'}}}>
          <DataGrid
            rows={filteredIdeas}
            columns={columns}
            loading={loading}
            density="compact"
            onRowClick={params => handleRowClick(params.id as number)}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[900],
                color: theme.palette.secondary.main,
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-sortIcon': {
                color: '#C4E0E3'
              },
              '& .MuiSvgIcon-root': {
                color: '#C4E0E3'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.grey['900']
              }
            }}
          />
        </Box>
      </Box>
      <IdeaSubmission
        open={openSubmissionModal}
        setOpen={setOpenSubmissionModal}
        loadIdeas={loadIdeas}
      />
      <IdeaViewerModal open={Boolean(viewedIdea)} setOpen={() => setViewedIdea(null)} idea={viewedIdea} />
    </Box>
  );
};

export default IdeasStatusGrid;
