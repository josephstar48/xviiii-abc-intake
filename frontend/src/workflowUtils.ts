import {Stage} from "./enum/Stage";

export const stageLabels = ['Submitted', 'Scoped', 'Assigned', 'In Prototype', 'Testing', 'Delivered'];

export const urgencyOrder: Record<string, number> = {
    'Critical - current mission impact': 4,
    'High - needed before training event or deployment': 3,
    'Medium - needed this quarter': 2,
    'Low - improvement opportunity': 1
};

export const getStageLabel = (stage: Stage | string | number | undefined) => {
    if (stage === undefined || stage === null) {
        return 'Unknown';
    }

    if (typeof stage === 'number') {
        return stageLabels[stage] || 'Unknown';
    }

    return stage.toString().replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

export const formatLastUpdated = (lastUpdated?: string) => {
    if (!lastUpdated) {
        return 'Not recorded';
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(lastUpdated));
};
