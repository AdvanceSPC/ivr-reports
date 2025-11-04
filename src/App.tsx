import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-white"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
}

export default App;
