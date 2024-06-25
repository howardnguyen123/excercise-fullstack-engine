import client from '@/lib/apolloClient';
import { handleEmployeeResponse } from '@/lib/utils';
import { EmployeeResponseType, type EmployeeType } from '@/types/employee';
import { ApolloError, gql } from '@apollo/client';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState: {
    status: 'idle' | 'loading';
    employees: EmployeeType[];
    popupState: {
        create: boolean;
        update: boolean;
        delete: boolean;
    };
    currentEmployee: EmployeeType | null;
} = {
    status: 'idle',
    employees: [],
    popupState: {
        create: false,
        update: false,
        delete: false,
    },
    currentEmployee: null,
};

type SetDialogState =
    | { type: 'create'; status: boolean }
    | { type: 'update' | 'delete'; status: boolean; employeeId?: string };

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployeeDialogState(state, { payload }: PayloadAction<SetDialogState>) {
            switch (payload.type) {
                case 'update':
                case 'delete':
                    if (payload.status) {
                        const currentEmployee = state.employees.find(({ id }) => id === payload.employeeId);
                        if (!currentEmployee) {
                            return;
                        }
                        state.currentEmployee = currentEmployee;
                    } else {
                        state.currentEmployee = null;
                    }
                    break;
            }

            state.popupState[payload.type] = payload.status;
        },
    },
    extraReducers: (builder) => {
        // For fetching data.
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, { payload }: PayloadAction<EmployeeResponseType[]>) => {
                state.status = 'idle';
                state.employees = payload.map(employee => handleEmployeeResponse(employee));
            });

        // For create new employee
        builder
            .addCase(createEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createEmployees.fulfilled, (state, { payload }: PayloadAction<EmployeeResponseType | null>) => {
                state.status = 'idle';

                if (!payload) {
                    return;
                }

                state.employees.push(handleEmployeeResponse(payload));
            });

        // For update employee
        builder
            .addCase(updateEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateEmployees.fulfilled, (state, { payload }: PayloadAction<EmployeeResponseType | null>) => {
                state.status = 'idle';
                if (!payload) {
                    return;
                }

                const updatedEmployee = handleEmployeeResponse(payload);

                state.employees.forEach((employee) => {
                    if (employee.id === updatedEmployee.id) {
                        employee.email = updatedEmployee.email;
                        employee.name = updatedEmployee.name;
                    }
                });
            });

        // For delete employee
        builder
            .addCase(deleteEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteEmployees.fulfilled, (state, { payload }: PayloadAction<string | null>) => {
                state.status = 'idle';
                state.employees = state.employees.filter(({ id }) => id !== payload);
            });
    },
});

export const fetchEmployees = createAsyncThunk('employee/fetchEmployee', async () => {
    try {
        const response = await client.query({
            query: gql`
                query GetEmployees {
                    employees(limit: 100) {
                        data {
                            id
                            name
                            email
                            createdAt
                            updatedAt
                        }
                    }
                }
            `,
        });

        return response.data.employees.data;
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong!', { style: { color: 'red' } });
        return [];
    }
});

export const createEmployees = createAsyncThunk(
    'employee/createEmployee',
    async ({ email, name }: { email: string; name: string }) => {
        try {
            const response = await client.mutate({
                mutation: gql`
                    mutation CreateEmployee($name: String!, $email: String!) {
                        create(name: $name, email: $email) {
                            data {
                                id
                                name
                                email
                                createdAt
                                updatedAt
                            }
                                message
                        }
                    }
                `,
                variables: {
                    name,
                    email,
                },
            });

            toast.success(`Created employee "${name}" successful!`, { style: { color: 'rgb(25,135,84)' } });
            return response.data.create.data;
        } catch (error) {
            console.error(error);
            toast.error((error as ApolloError).message, { style: { color: '#dc3545' } });

            return null;
        }
    },
);

export const deleteEmployees = createAsyncThunk('employee/deleteEmployee', async ({ id }: { id: string }) => {
    try {
        await client.mutate({
            mutation: gql`
                mutation DeleteEmployee($id: String!) {
                    delete(id: $id) {
                        message
                    }
                }
            `,
            variables: {
                id,
            },
        });

        toast.success(`Deleted employee successful`, { style: { color: 'rgb(25,135,84)' } });
        
        return id;
    } catch (error) {
        console.error(error);
        toast.error((error as ApolloError).message, { style: { color: '#dc3545' } });

        return null;
    }
});

export const updateEmployees = createAsyncThunk(
    'employee/updateEmployee',
    async ({ email, name, id }: { email: string; name: string; id: string }) => {
        try {
            const response = await client.mutate({
                mutation: gql`
                    mutation UpdateEmployee($id: String!, $name: String!, $email: String!) {
                        update(id: $id, name: $name, email: $email) {
                            data {
                                id
                                name
                                email
                                createdAt
                                updatedAt
                            }
                        }
                    }
                `,
                variables: {
                    name,
                    email,
                    id,
                },
            });

            toast.success(`Updated employee ${name} successful`, { style: { color: 'rgb(25,135,84)' } });
            return response.data.update.data;
        } catch (error) {
            console.error(error);
            toast.error((error as ApolloError).message, { style: { color: '#dc3545' } });

            return null;
        }
    },
);

export const { setEmployeeDialogState } = employeeSlice.actions;
export default employeeSlice.reducer;
