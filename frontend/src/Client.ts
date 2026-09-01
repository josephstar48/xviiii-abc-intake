import {Tag} from "./InnovationCellCard";
import axios from "axios";
import {InnovationCellProp} from "./InnovationsCells";

export const getAllTags = async (): Promise<Tag[]> => {
    const response = await axios.get(`/api/tags`);
    return response.data;
};


export const getAllInnovationCells = async (): Promise<InnovationCellProp[]> => {
    const response = await axios.get(`/api/innovation-cells`);
    return response.data;
};
