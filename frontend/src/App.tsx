import './styles/global.css';
import { useState } from 'react';
import { LoginPage } from './pages/loginPage';
import { RegistrationPage } from './pages/RegistrationPage';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Welcome to the BookingCity! 🏨</h1>
      {isRegistering ? (
        <RegistrationPage onSwitchToLogin={() => setIsRegistering(false)} />
       ) : 
       (
         <LoginPage onSwitchToRegister={() => {
          console.log("Сигнал дошел! Переключаем на регистрацию...");
          setIsRegistering(true)}} />
       )}
    </div>
  );
}

export default App;