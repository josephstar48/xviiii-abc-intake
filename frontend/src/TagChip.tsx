import {Box, Chip, Typography} from "@mui/material";
import React from "react";
import {Tag} from "./InnovationCellCard";
import {grey} from "@mui/material/colors";
import SoftwareImg from './assets/SOFTWARE.png'
import RoboticsImg from './assets/UAV-ROBOTICS.png'
import AIMLImg from './assets/AI-ML.png'
import ManufacturingImg from './assets/MANUFACTURING.png'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const imageMap: { [key: string]: string } = {
    'SOFTWARE': SoftwareImg,
    'UAV/ROBOTICS': RoboticsImg,
    'AI/ML': AIMLImg,
    'MANUFACTURING': ManufacturingImg
}

const iconMap: { [key: string]: React.ReactNode } = {
    'DATA': <StorageOutlinedIcon sx={{fontSize: 64, color: 'white'}}/>,
    'SUSTAINMENT': <BuildOutlinedIcon sx={{fontSize: 64, color: 'white'}}/>,
    'TRAINING': <SchoolOutlinedIcon sx={{fontSize: 64, color: 'white'}}/>,
    'HARDWARE': <Inventory2OutlinedIcon sx={{fontSize: 64, color: 'white'}}/>
}

interface TagChipProps {
    chipName: string;
    color?: string
}

export const TagChip = ({chipName, color = '#D7D3E1'}: TagChipProps) => (
    <Chip
        label={chipName}
        size={'small'}
        sx={{
            margin: .2,
            height: 16,
            color: '#3A3642',
            backgroundColor: color,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            marginRight: 1,
        }}
    />

);


interface TagFilterProp {
    chipName: string;
    onClick: () => void;
    selectedTags: Tag[]
}


export const TagFilter = ({chipName, onClick, selectedTags}: TagFilterProp) => {
    const selectedTagNames = selectedTags.map(tag => tag.name);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            onClick={onClick}
            sx={{
                width: '100%',
                cursor: 'pointer',
                verticalAlign: 'bottom'
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: '100%',
                    height: '100px',
                    marginBottom: '10px',
                }}
            >
                {imageMap[chipName] ? (
                    <img
                        src={imageMap[chipName]}
                        alt={`${chipName} icon`}
                        style={{
                            maxWidth: '60px',
                            maxHeight: '90px',
                            objectFit: 'cover',
                        }}
                    />
                ) : iconMap[chipName]}
            </Box>
            <Box sx={{flexGrow: 1}}/>
            <Typography
                variant={'h6'}
                sx={{
                    color: selectedTagNames.includes(chipName) ? grey[500] : '#FFF',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}
            >
                {chipName}
            </Typography>
        </Box>
    )
}
