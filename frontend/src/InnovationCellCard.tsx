import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    DialogActions,
    DialogContent,
    DialogContentText,
    Typography
} from "@mui/material";
import {TagChip} from "./TagChip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, {useState} from "react";
import {styled} from "@mui/system";
import {useNavigate} from "react-router-dom";
import {GenericModal} from "./GenericModal";
import {theme} from "./theme";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {getIdeas, Idea} from "./api/ideasApi";
import {getTags, Tags} from "./api/tagsApi";
import {getInnovationCells, InnovationCell} from "./api/innovationCellApi";
import {IdeaSubmission} from "./IdeaSubmission";


const logoMap: { [key: string]: string } = {
    'XVIII ABC / JIOP / ODS': '/xviii abc.png',
    'XVIII ABC / JIOP': '/xviii abc.png',
    'XVIII ABC / ODS': '/xviii abc.png',
    '82nd Airborne Division / Airborne Innovation Lab': '/82nd_Airborne_Division_CSIB.svg.webp',
    '101st Airborne Division / EagleWerx': '/US_101st_Airborne_Division_patch.svg.webp',
    '10th Mountain Division / MISIL': '/10th MTN DIV.png',
    '3rd Infantry Division / Transformation Cell': '/3RD INF DIV.png'
}

const StyledCard = styled(Card)(() => ({
    width: '100%',
    maxWidth: 360,
    minHeight: 300,
    color: 'white',
    borderRadius: 8,
    border: '1px solid #353535',
    background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
}));

export interface Tag {
    id: number;
    name: string;
}

interface InnovationCellCardProps {
    id: number;
    name: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    address: string;
    tags: Tag[];

}

export const InnovationCellCard = ({
                                       id,
                                       name,
                                       email,
                                       phone,
                                       description,
                                       title,
                                       address,
                                       tags
                                   }: InnovationCellCardProps) => {
    const navigate = useNavigate()
    const [moduleIsOpen, setModuleIsOpen] = useState(false)
    const [submissionIsOpen, setSubmissionIsOpen] = useState(false)

    const [, setIdeas] = useState<Idea[]>([]);
    const [, setLoading] = useState<boolean>(true);
    const [, setTags2] = useState<Tags[]>([]);
    const [, setInnovationCells] = useState<InnovationCell[]>([]);
    const blackColor = theme.palette.common.black

    const loadIdeas = () => {
        Promise.all([
            getIdeas(),
            getInnovationCells(),
            getTags(),
        ])
            .then(([ideasData, innovationCellsData, tagsData]) => {
                setIdeas(ideasData);
                setInnovationCells(innovationCellsData);
                setTags2(tagsData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                navigate('/errorPage');
            })
            .finally(() => setLoading(false));
    }

    function handleClick() {
        setModuleIsOpen(true);
    }

    function handleSubmitClick() {
        setSubmissionIsOpen(true)
    }

    return (
        <>
            <StyledCard sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <CardMedia
                            component="img"
                            image={logoMap[name] ?? '/XVIII ABC Dragon Spark Logo-modified.png'}
                            alt={`${name} insignia`}
                            sx={{width: 54, height: 60, marginRight: 1, objectFit: 'contain'}}
                        />
                        <Typography variant="h5" sx={{lineHeight: 1.1, fontSize: {xs: '1.15rem', sm: '1.35rem', md: '1.5rem'}}}>{name}</Typography>
                    </Box>
                    <Box display="flex" flexWrap="wrap" mb={2}>
                        {tags.map((tag) => (
                            <TagChip key={tag.id} chipName={tag.name}/>
                        ))}
                    </Box>
                    <Typography variant="body1" mb={1}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{opacity: 0.7}} mb={2}>
                        {description}
                    </Typography>
                    <Box sx={{mt: 'auto'}}>
                        <Button
                            onClick={handleClick}
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIcon/>}
                            fullWidth
                        >
                            MORE DETAILS
                        </Button>
                    </Box>
                </CardContent>
            </StyledCard>


            <GenericModal open={moduleIsOpen} setOpen={setModuleIsOpen}>
                <div>
                    <Box display="flex" alignItems={{xs: 'flex-start', sm: 'center'}} justifyContent="space-between" flexDirection={{xs: 'column', sm: 'row'}} gap={2} mb={1}>
                        <Box display="flex" alignItems="center">
                            <CardMedia
                                component="img"
                                image={logoMap[name] ?? '/XVIII ABC Dragon Spark Logo-modified.png'}
                                alt={`${name} insignia`}
                                sx={{width: 50, height: 60, marginRight: 1, objectFit: 'contain'}}
                            />
                            <Typography variant="h5">{name}</Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            justifyContent={{xs: 'flex-start', sm: 'flex-end'}}
                            maxWidth={{xs: '100%', sm: '60%'}}
                        >
                            {tags.map((tag) => (
                                <TagChip
                                    key={tag.id}
                                    chipName={tag.name}
                                    color={theme.palette.info.main}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="flex-start" mb={2}>
                        <LocationOnOutlinedIcon
                            sx={{
                                color: theme.palette.text.secondary
                            }}
                        />
                        <Typography
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    maxWidth: '100%'
                                }}
                        >
                            {address}
                        </Typography>
                    </Box>
                    <DialogContent>
                        <Typography fontWeight={'bold'}>Contact</Typography>
                        <DialogContentText color={blackColor}>Phone: {phone}</DialogContentText>
                        <DialogContentText color={blackColor}>Email: {email}</DialogContentText>
                        <Typography fontWeight={'bold'} marginTop={2}>Description</Typography>
                        <DialogContentText color={blackColor}>{description}</DialogContentText>
                    </DialogContent>
                </div>
                <DialogActions sx={{flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'stretch', gap: 1, px: 0}}>
                    <Button
                        variant="contained"
                        onClick={() => setModuleIsOpen(false)}
                        sx={{
                            color: theme.palette.warning.main,
                            backgroundColor: theme.palette.info.main,
                            m: 0,
                        }}
                    >
                        RETURN TO DRAGON SPARK
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmitClick}
                        sx={{
                            backgroundColor: theme.palette.warning.main,
                            m: 0,
                        }}
                    >
                        SUBMIT DIRECT
                    </Button>
                </DialogActions>
            </GenericModal>

            <IdeaSubmission open={submissionIsOpen} setOpen={setSubmissionIsOpen}
                            loadIdeas={loadIdeas} isCardSubmit={true}
                            innovationCellId={id.toString()}
                            setModuleIsOpen={setModuleIsOpen}
                            isOnDifferentPage
            />
        </>
    );
};
