import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { createEmployees, setEmployeeDialogState } from '@/redux/EmployeeSlice';
import { AppDispatch, RootState } from '@/redux/store';
import CreateEmployeeSchema from '@/schema/CreateEmployeeSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

export function CreateEmployeeDialog() {
    const { create: isOpen } = useSelector((state: RootState) => state.employees.popupState);
    const dispatch = useDispatch<AppDispatch>();
    const form = useForm<z.infer<typeof CreateEmployeeSchema>>({
        resolver: zodResolver(CreateEmployeeSchema),
        defaultValues: {
            email: '',
            name: '',
        },
    });

    function onSubmit(values: z.infer<typeof CreateEmployeeSchema>) {
        form.reset();
        handleSetDialogState(false);
        dispatch(createEmployees(values));
    }

    const handleSetDialogState = (status: boolean) => {
        dispatch(setEmployeeDialogState({type: 'create', status}));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(e) => handleSetDialogState(e.valueOf())}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create new employee</DialogTitle>
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
                                        <Input placeholder='Employee name...' {...field} />
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
                            <Button type='submit'>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
