import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { setEmployeeDialogState, updateEmployees } from '@/redux/EmployeeSlice';
import { AppDispatch, RootState } from '@/redux/store';
import UpdateEmployeeSchema from '@/schema/UpdateEmployeeSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

export function UpdateEmployeeDialog() {
    const { update: isOpen } = useSelector((state: RootState) => state.employees.popupState);
    const { currentEmployee } = useSelector((state: RootState) => state.employees);
    const dispatch = useDispatch<AppDispatch>();
    const form = useForm<z.infer<typeof UpdateEmployeeSchema>>({
        resolver: zodResolver(UpdateEmployeeSchema),
        defaultValues: {
            email: '',
            name: '',
        },
    });

    function onSubmit(values: z.infer<typeof UpdateEmployeeSchema>) {
        handleSetDialogState(false);
        dispatch(updateEmployees(values));
    }

    const handleSetDialogState = (type: boolean) => {
        dispatch(
            setEmployeeDialogState({
                type: 'update',
                status: type,
            }),
        );
    };

    useEffect(() => {
        if (!currentEmployee) {
            return;
        }

        form.setValue('id', currentEmployee.id);
        form.setValue('name', currentEmployee.name);
        form.setValue('email', currentEmployee.email);
    }, [currentEmployee]);

    if (!currentEmployee) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(e) => handleSetDialogState(e.valueOf())}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Updating "{currentEmployee.name}"</DialogTitle>
                    <DialogDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, nobis.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Your name...' {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='example@gmail.com' {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public display email.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type='submit'>Update</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
