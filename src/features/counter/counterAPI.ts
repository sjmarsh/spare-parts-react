export interface CountType {
  data: number
}

// A mock function to mimic making an async request for data
export function fetchCount(amount:number = 1) : Promise<CountType> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}
