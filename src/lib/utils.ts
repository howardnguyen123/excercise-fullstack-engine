import { EmployeeResponseType, EmployeeType } from '@/types/employee';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handleEmployeeResponse = (employee: EmployeeResponseType): EmployeeType => ({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    createdAt: Number(employee.createdAt),
    updatedAt: Number(employee.updatedAt),
});
