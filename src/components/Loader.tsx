import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import { ClipLoader } from 'react-spinners';

export default function Loader() {
    const { status } = useSelector((state: RootState) => state.employees);

    return (
        <div className={`fixed inset-0 justify-center items-center z-[99] bg-[#1119] ${status === 'loading' ? 'flex' : 'hidden'}`}>
            <ClipLoader
                className='text-primary '
                loading={status === 'loading'}
                size={50}
            />
        </div>
    );
}
