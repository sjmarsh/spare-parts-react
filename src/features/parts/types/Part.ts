interface Part {
    id: number;
    name: string;
    description: string;
    weight: number; 
    price: number;
    startDate: string;
    endDate?: string | null;
}

export default Part;