import axios from "axios";
import {Stage} from "../enum/Stage";
import {InnovationCell} from "./innovationCellApi";

export type Idea =
  {
    id: number;
    title: string;
    problemStatement: string;
    problemContext: string;
    solutionBenefits: string;
    solutionConcepts: string;
    unitDivision: string;
    problemType: string;
    operationalImpact: string;
    urgency: string;
    capabilityLane: string;
    routingNotes: string;
    submitter:{
      id: number,
      firstName: string,
      lastName: string,
      unit: string,
      email: string,
      phone: string
    },
    innovationCell:InnovationCell | null,
    stage: Stage,
    tags:
      {
        id: number,
        name: string
      }[]
    ,
    documents:
      {
        id: number
        name: string
      }[]

  }



export const getIdeas = async (): Promise<Idea[]>=>{
  const {data} = await axios.get<Idea[]>(`${''}/api/ideas`)
  return data as Idea[];
}
