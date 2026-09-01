import axios from "axios";

export type Tags =
  {
    id: number,
    name: string
  }

export const getTags = async (): Promise<Tags[]>=>{
  const {data} = await axios.get<Tags[]>(`${''}/api/tags`)
  return data as Tags[];
}