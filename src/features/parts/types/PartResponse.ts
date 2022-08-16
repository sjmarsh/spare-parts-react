import Part from './Part';

interface PartResponse {
    value?: Part | null;
    hasError: boolean;
    message?: string | null;
}

export default PartResponse