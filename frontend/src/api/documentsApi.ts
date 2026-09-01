import axios from "axios";

export type Documents = [
  {
    id: number,
    name: string,
    path?: string
  }
]

export const getDocuments = async (id: number): Promise<Documents[]>=>{
  const {data} = await axios.get<Documents[]>(`${''}/api/documents${id}`)
  return data as Documents[];
}
