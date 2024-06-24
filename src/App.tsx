import { Employeee } from './components/Employee';
import Loader from './components/Loader';
import { Toaster } from './components/ui/sonner';

export default function App() {
    return (
        <main className='container'>
            <Loader />
            <Employeee />
            <Toaster />
        </main>
    );
}
