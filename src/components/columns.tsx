import { EmployeeType } from '@/types/employee';

import { setEmployeeDialogState } from '@/redux/EmployeeSlice';
import { store } from '@/redux/store';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from './ui/button';

export const columns: ColumnDef<EmployeeType>[] = [
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Email
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'name',
        header: () => <div className='text-right'>Name</div>,
        cell: ({ row }) => {
            const name = row.getValue('name') as string;

            return <div className='text-right font-medium'>{name}</div>;
        },
    },
    {
        accessorKey: 'createdAt',
        header: () => <div className='text-right'>Created At</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            const formattedTime = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

            return <div className='text-right font-medium'>{formattedTime}</div>;
        },
    },
    {
        accessorKey: 'updatedAt',
        header: () => <div className='text-right'>Updated At</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue('updatedAt'));
            const formattedTime = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

            return <div className='text-right font-medium'>{formattedTime}</div>;
        },
    },
    {
        accessorKey: 'id',
        header: () => <div className='text-right'>Action</div>,
        cell: ({ row }) => {
            return (
                <div className='font-medium flex justify-end gap-2'>
                    <Trash2Icon
                        size={16}
                        className='hover:scale-125 cursor-pointer'
                        onClick={() =>
                            store.dispatch(
                                setEmployeeDialogState({
                                    type: 'delete',
                                    status: true,
                                    employeeId: row.getValue('id') as string,
                                }),
                            )
                        }
                    />

                    <PencilIcon
                        size={16}
                        className='hover:scale-125 cursor-pointer'
                        onClick={() =>
                            store.dispatch(
                                setEmployeeDialogState({
                                    type: 'update',
                                    status: true,
                                    employeeId: row.getValue('id') as string,
                                }),
                            )
                        }
                    />
                </div>
            );
        },
    },
];
