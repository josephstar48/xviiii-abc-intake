import axios from "axios";

export type InnovationCell =
  {
    id: number,
    name: string,
    title: string,
    description: string,
    email: string,
    phone: string,
    address: string,
    tags:
      {
        id: number,
        name: string
      }[]
}

export const getInnovationCells = async (): Promise<InnovationCell[]>=>{
  const {data} = await axios.get<InnovationCell[]>(`${''}/api/innovation-cells`)
  return data as InnovationCell[];
}

export const updateInnovationCell = async (ideaId: number, innovationCellId: string | number): Promise<boolean> => {
  try {
    const payload = innovationCellId === "" ? null : Number(innovationCellId);
    const response = await axios.post(`/api/ideas/update-innovation-cell/${ideaId}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return true;
    } else {
      console.error('Failed to update innovation cell');
      return false;
    }
  } catch (error) {
    console.error('Error updating innovation cell:', error);
    return false;
  }
};
