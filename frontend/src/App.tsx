import './styles/global.css';
import { useState } from 'react';
import { LoginPage } from './pages/loginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { Auth } from './auth/auth';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  const isAuth = Auth();
  debugger;
  if(isAuth === null){
    return <div>Validation session...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Welcome to the BookingCity! 🏨</h1>
      
      {isAuth ? <div>Success</div> : 
      isRegistering ? (
        <RegistrationPage onSwitchToLogin={() => setIsRegistering(false)} />
       ) : 
       (
         <LoginPage onSwitchToRegister={() => {
          setIsRegistering(true)}} />
       )}
      
    </div>
  );
}
export default App;