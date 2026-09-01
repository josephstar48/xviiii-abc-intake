import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { Stage } from './enum/Stage';

interface StageChipProps extends Omit<ChipProps, 'label' | 'color'> {
  stage: Stage | string;
}

export const StageChip: React.FC<StageChipProps> = ({ stage, ...props }) => {
  const getStageConfig = (stageValue: Stage | string): { label: string; color: string; textColor: string } => {
    switch (stageValue) {
      case Stage.SUBMITTED:
      case "SUBMITTED":
        return { label: "SUBMITTED", color: "#E0F2FE", textColor: "#0369A1" };
      case Stage.SCOPED:
      case "SCOPED":
        return { label: "SCOPED", color: "#FEF9C3", textColor: "#854D0E" };
      case Stage.ASSIGNED:
      case "ASSIGNED":
        return { label: "ASSIGNED", color: "#DBEAFE", textColor: "#1D4ED8" };
      case Stage.IN_PROTOTYPE:
      case "IN_PROTOTYPE":
        return { label: "IN PROTOTYPE", color: "#E0F2FE", textColor: "#0369A1" };
      case Stage.TESTING:
      case "TESTING":
        return { label: "TESTING", color: "#F3E8FF", textColor: "#7E22CE" };
      case Stage.DELIVERED:
      case "DELIVERED":
        return { label: "DELIVERED", color: "#DCFCE7", textColor: "#15803D" };
      default:
        return { label: "UNKNOWN", color: "#E5E7EB", textColor: "#374151" };
    }
  };

  const { label, color, textColor } = getStageConfig(stage);

  return (
    <Chip
      label={label}
      style={{
        backgroundColor: color,
        color: textColor,
        fontWeight: 'bold',
        border: `1px solid ${textColor}`
      }}
      {...props}
    />
  );
};
