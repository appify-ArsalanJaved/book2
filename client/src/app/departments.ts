export interface IDepartment {
    id: number;
    name: string;
    employees: number[];
};

export const departs:IDepartment[] = [
    {
        'id': 0,
        'name': 'Microsoft',
        'employees': [0, 1]
    },
    {
        'id': 0,
        'name': 'Apple',
        'employees': [2, 3]
    },
    {
        'id': 0,
        'name': 'Xiaomi',
        'employees': [3, 4]
    }
]