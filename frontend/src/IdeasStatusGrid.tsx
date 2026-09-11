import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Select,
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
      flex: 7
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

  const echelonCounts = ideas.reduce<Record<string, number>>((counts, idea) => {
    const echelon = idea.unitDivision || idea.submitter?.unit || 'Unspecified';
    counts[echelon] = (counts[echelon] || 0) + 1;
    return counts;
  }, {});

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
      <Grid container spacing={2} mb={2}>
        {Object.entries(echelonCounts).map(([echelon, count]) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={echelon}>
            <Box sx={{border: '1px solid #334155', borderRadius: 2, p: 2, backgroundColor: '#111827'}}>
              <Typography variant="caption" color="white">{echelon}</Typography>
              <Typography variant="h4" color="white" fontWeight="bold">{count}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{width: '100%', overflowX: 'auto'}}>
        <Box sx={{height: {xs: 520, md: 600}, minWidth: {xs: 980, md: '100%'}}}>
          <DataGrid
            rows={ideas}
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
