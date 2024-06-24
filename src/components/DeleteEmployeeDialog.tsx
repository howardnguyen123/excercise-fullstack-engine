import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteEmployees, setEmployeeDialogState } from '@/redux/EmployeeSlice';
import { AppDispatch, RootState } from '@/redux/store';
import DeleteEmployeeSchema from '@/schema/DeleteEmployeeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

export function DeleteEmployeeDialog() {
    const { delete: isOpen } = useSelector((state: RootState) => state.employees.popupState);
    const { currentEmployee } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();
    const form = useForm<z.infer<typeof DeleteEmployeeSchema>>({
        resolver: zodResolver(DeleteEmployeeSchema),
        defaultValues: {
            id: '',
        },
    });

    const handleSetDialogState = (status: boolean) => {
        dispatch(
            setEmployeeDialogState({
                type: 'delete',
                status,
            }),
        );
    };

    function onSubmit(values: z.infer<typeof DeleteEmployeeSchema>) {
        handleSetDialogState(false);
        dispatch(deleteEmployees(values));
    }

    useEffect(() => {
        if (!currentEmployee) {
            return;
        }

        form.setValue('id', currentEmployee.id);
    }, [currentEmployee]);

    if (!currentEmployee) {
        return null;
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(e) => handleSetDialogState(e.valueOf())}>
            <AlertDialogTrigger asChild>
                <Button variant='outline'>Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        <span className='font-semibold'>"{currentEmployee.name}"</span>
                        account and remove your data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
