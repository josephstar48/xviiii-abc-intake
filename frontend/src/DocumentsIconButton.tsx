import {Button, Grid, IconButton, Typography} from "@mui/material";
import {Download, FolderSpecial, Upload} from "@mui/icons-material";
import {ChangeEvent, useState} from "react";
import {GenericModal} from "./GenericModal";
import axios from "axios";

type DocumentsIconButtonProps = {
    ideaId: number,
    problemName: string,
    documents: {
        id: number
        name: string
    }[],
    reload: () => void
}

export const DocumentsIconButton = (props: DocumentsIconButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {problemName, documents, ideaId, reload} = props;

    const handleDownload = async (documentId: number, documentName: string) => {
        const response = await axios.get(`/api/documents/${documentId}`, {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documentName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if(selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            axios.post(`/api/documents/idea/${ideaId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => reload());
        }
    }

    return <>
        <IconButton onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true)
        }}>
            <FolderSpecial/>
        </IconButton>
        <GenericModal open={isModalOpen} setOpen={setIsModalOpen}>
            <Typography variant='h4'>Documents</Typography>
            <Typography>Problem: {problemName}</Typography>

            <Button startIcon={<Upload />} color='warning' variant='contained' component='label' sx={{my: 2}}>
                Upload File
                <input type='file' hidden onChange={handleFileChange}/>
            </Button>

            <Grid container columns={6} sx={{width: '100%'}}>
                <Grid item xs={1} border='1px solid black'>Id</Grid>
                <Grid item xs={4} border='1px solid black'>Document Name</Grid>
                <Grid item xs={1} border='1px solid black'>Download</Grid>
                {documents.map(document => <>
                    <Grid item xs={1} border='1px solid black' alignContent='center'>{document.id}</Grid>
                    <Grid item xs={4} border='1px solid black' alignContent='center'>{document.name}</Grid>
                    <Grid item xs={1} border='1px solid black' alignContent='center'><IconButton onClick={() => handleDownload(document.id, document.name)}><Download/></IconButton></Grid>
                </>)}

            </Grid>

            <Button variant='contained' color='info' onClick={() => setIsModalOpen(false)} sx={{mt: 2}}>Close</Button>
        </GenericModal>
    </>
}