export type EmployeeType = {
    id: string;
    name: string;
    email: string;
    createdAt: number;
    updatedAt: number;
};

export type EmployeeResponseType = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __typename: string;
}
