import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, Grid, Stack, Typography} from '@mui/material';
import {TagFilter} from "./TagChip";
import {InnovationCellCard, Tag} from "./InnovationCellCard";
import {getAllInnovationCells, getAllTags} from "./Client";
import {theme} from "./theme";
import {Footer} from "./Footer";
import {IdeaSubmission} from "./IdeaSubmission";
import {getIdeas, Idea} from "./api/ideasApi";
import {getInnovationCells, InnovationCell} from "./api/innovationCellApi";
import {getTags, Tags} from "./api/tagsApi";

import {useNavigate} from "react-router-dom";

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
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [displayedCells, setDisplayedCells] = useState<InnovationCellProp[]>([]);
    const filterTag = useRef<Tag[]>([]);
    const [submissionIsOpen, setSubmissionIsOpen] = useState(false)

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
        getAllTags().then((response) => {
            filterTag.current = response;
            setSelectedTags(response)
        })

        getAllInnovationCells().then((response) => {
            setDisplayedCells(response)
        }).catch((error) => {
            console.error("Error fetching data:", error);
            navigate('/errorPage');
        })
    }, []);

    function handleClick() {
        setSubmissionIsOpen(true)
    }

    return (
        <>
            <Box
                sx={{
                    bgcolor: theme.palette.background.default,
                    backgroundImage: "linear-gradient(rgba(18, 18, 18, 0.84), rgba(18, 18, 18, 0.84)), url('/XVIII ABC Dragon Spark Logo-modified.png')",
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'min(68vw, 680px)',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Typography variant="h1" align="center" color="white"
                            sx={{mt: 8,
                                mb: 2,
                                px: 2,
                                maxWidth: '5xl',
                                textShadow: `0px 0px 15px #0A84FF, 0px 0px 15px #FFD700`,
                                fontWeight: 'bold',
                                letterSpacing: '8px'}}>
                    Dragon Spark</Typography>
                <Typography variant="h3" align="center" color="white"
                            sx={{px: 2, maxWidth: '5xl'}}>
                    CONNECTS XVIII ABC CHALLENGES TO CORPS AND DIVISION INNOVATION CELLS</Typography>
                <Typography variant={'h3'}
                            sx={{
                                mt: 2,
                                mb: 5,
                                px: 2,
                                maxWidth: '5xl',
                                textShadow: `0px 0px 30px #5a93c4, 0px 0px 30px #5a93c4`,
                                fontWeight: 'bold',
                                letterSpacing: '8px'
                            }} color={'white'}>JIOP | ODS | DIVISION INNOVATION</Typography>

                <Stack
                    direction={'row'}
                    spacing={8}

                >
                    {filterTag.current.map((tag) => (
                        <TagFilter
                            selectedTags={selectedTags}
                            onClick={() => {
                                if (selectedTags.includes(tag)) {
                                    setSelectedTags(selectedTags.filter(item => item !== tag));
                                } else {
                                    setSelectedTags([...selectedTags, tag])
                                }
                            }}
                            key={tag.id} chipName={tag.name}
                        />
                    ))}
                </Stack>

                <Button variant={'contained'}
                        onClick={handleClick}
                        sx={{
                            width: '15rem',
                            height: '3rem',
                            mt: 5,
                            fontSize: '1.2rem'
                        }}>Submit A Problem</Button>


                <Typography variant="h3" align="center" color="white" sx={{mt: 4, fontWeight: 700}}>
                    Innovation Cells
                </Typography>
                <Typography variant="h6" align="center" color="white"
                            sx={{mb: 4, opacity: 0.7, fontWeight: 300}}>
                    Threat Informed | Strategically Driven | Operationally Focused | Tactically Prepared
                </Typography>
                <Grid container spacing={4} justifyContent="center">

                    {selectedTags.length === filterTag.current.length ?
                        displayedCells.map((cell) => {
                            return (
                                <Grid item key={cell.id}>
                                    <InnovationCellCard {...cell} />
                                </Grid>
                            );
                        }) :
                        displayedCells.map((cell) => {
                                const selectedTagNames = selectedTags.map(tag => tag.name);
                                const hasMatchingTag = cell.tags.some(tag => selectedTagNames.includes(tag.name));

                                if (hasMatchingTag) {
                                    return (
                                        <Grid item key={cell.id}>
                                            <InnovationCellCard {...cell} />
                                        </Grid>
                                    );
                                }
                                return null;
                            }
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
                        width={'60%'}
                        align={'center'}
                        color={theme.palette.text.secondary}
                        variant={'h5'}
                        fontWeight={'lighter'}
                        lineHeight={1.5}
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
