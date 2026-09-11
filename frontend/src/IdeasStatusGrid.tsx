import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
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
import { getTags, Tags } from "./api/tagsApi";
import {getInnovationCells, InnovationCell, updateInnovationCell} from "./api/innovationCellApi";
import { IdeaViewerModal } from "./IdeaViewerModal";
import {DocumentsIconButton} from "./DocumentsIconButton";

const stageLabels = ['Submitted', 'Scoped', 'Assigned', 'In Prototype', 'Testing', 'Delivered'];
const urgencyOrder: Record<string, number> = {
  'Critical - current mission impact': 4,
  'High - needed before training event or deployment': 3,
  'Medium - needed this quarter': 2,
  'Low - improvement opportunity': 1
};

type StageChipProp = {
  stage: number | string,
  compact?: boolean
};

const StageChip: React.FC<StageChipProp> = (props) => {
  const { stage, compact } = props;
  const size = compact ? 'small' : 'medium';

  const getStageConfig = (stageValue: number | string): { label: string; color: string, textColor: string } => {
    switch (stageValue) {
      case 0:
      case "SUBMITTED":
        return { label: "SUBMITTED", color: "#E0F2FE", textColor: "#0369A1"};
      case 1:
      case "SCOPED":
        return { label: "SCOPED", color: "#FEF9C3", textColor: "#854D0E" };
      case 2:
      case "ASSIGNED":
        return { label: "ASSIGNED", color: "#DBEAFE", textColor: "#1D4ED8" };
      case 3:
      case "IN_PROTOTYPE":
        return { label: "IN PROTOTYPE", color: "#E0F2FE", textColor: "#0369A1" };
      case 4:
      case "TESTING":
        return { label: "TESTING", color: "#F3E8FF", textColor: "#7E22CE" }
      case 5:
      case "DELIVERED":
        return { label: "DELIVERED", color: "#DCFCE7", textColor: "#15803D" };
      default:
        return { label: "UNKNOWN", color: "#E5E7EB", textColor: "#374151" };
    }
  };

  const { label, color, textColor } = getStageConfig(stage);

  return (
    <Chip
      size={size}
      label={label}
      data-testid={label}
      sx={{
        fontWeight: 'bold',
        backgroundColor: color,
        color: textColor,
        '&:hover': {
          backgroundColor: color, // Maintain color on hover
        }
      }}
    />
  );
};

const IdeasStatusGrid: React.FC = () => {
  const theme = useTheme();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSubmissionModal, setOpenSubmissionModal] = useState<boolean>(false);
  const [tags, setTags] = useState<Tags[]>([]);
  const [innovationCells, setInnovationCells] = useState<InnovationCell[]>([]);
  const [viewedIdea, setViewedIdea] = useState<Idea | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');

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
        console.log(tags)
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
      field: 'tags',
      headerName: 'Tag',
      headerAlign: 'center',
      align: 'center',
      flex: 6,
      renderCell: (params) => {
        const ideaTags: Tags[] = params.value;
        const firstTag = ideaTags && ideaTags.length > 0 ? ideaTags[0] : null;
        return firstTag ? (
          <Chip
            label={firstTag.name}
            size="small"
            style={{ fontSize: '0.8rem' }}
          />
        ) : null;
      },
      valueFormatter: (params) => {
        const tags: Tags[] = params.value;
        return tags && tags.length > 0 ? tags[0].name : '';
      },
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
      const stageLabel = stageLabels[Number(idea.stage)] || 'Unknown';
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
    <Box sx={{border: '1px solid #334155', borderRadius: 2, p: 2, backgroundColor: '#111827', minHeight: 104}}>
      <Typography variant="caption" color={theme.palette.text.secondary}>{label}</Typography>
      <Typography variant="h4" color="white" fontWeight="bold">{value}</Typography>
      {helper && <Typography variant="caption" color={theme.palette.text.secondary}>{helper}</Typography>}
    </Box>
  );

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
      <Stack direction={{xs: 'column', md: 'row'}} spacing={2} mb={3}>
        <TextField
          size="small"
          placeholder="Search title, unit, status, urgency, routing notes"
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
      </Stack>
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
