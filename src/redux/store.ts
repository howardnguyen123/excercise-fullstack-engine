import { configureStore } from '@reduxjs/toolkit';
import EmployeeSlice from './EmployeeSlice';

export const store = configureStore({
    reducer: {
        employees: EmployeeSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
