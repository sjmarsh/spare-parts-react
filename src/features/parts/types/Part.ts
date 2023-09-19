import PartCategory from "./partCategory";

interface Part {
    id: number;
    name: string;
    description: string;
    category: PartCategory | null;
    weight: number; 
    price: number;
    startDate: string;
    endDate?: string | null;
}

export default Part;