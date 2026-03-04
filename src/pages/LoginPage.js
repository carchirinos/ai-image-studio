import { Authenticator, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const theme = createTheme({
  name: 'ai-studio-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#f0eeff' },
          20: { value: '#e0ddff' },
          40: { value: '#a78bfa' },
          60: { value: '#764ba2' },
          80: { value: '#667eea' },
          90: { value: '#5a67d8' },
          100: { value: '#4c51bf' },
        },
      },
      font: {
        primary: { value: 'white' },
        secondary: { value: 'rgba(255,255,255,0.8)' },
        interactive: { value: '#a78bfa' },
      },
      teal: {
        10: { value: '#f0eeff' },
        20: { value: '#e0ddff' },
        40: { value: '#a78bfa' },
        60: { value: '#764ba2' },
        80: { value: '#667eea' },
        90: { value: '#5a67d8' },
        100: { value: '#4c51bf' },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: '1px',
          borderColor: 'rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        },
      },
      button: {
        primary: {
          backgroundColor: '#667eea',
          borderRadius: '12px',
          color: 'white',
          _hover: {
            backgroundColor: '#764ba2',
          },
        },
        link: {
          color: '#a78bfa',
        },
        borderRadius: '12px',
      },
      fieldcontrol: {
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.06)',
        color: 'white',
        borderColor: 'rgba(255,255,255,0.2)',
        _focus: {
          borderColor: '#667eea',
          boxShadow: '0 0 0 2px rgba(102,126,234,0.3)',
        },
      },
      field: {
        label: {
          color: 'rgba(255,255,255,0.85)',
        },
      },
      tabs: {
        item: {
          color: 'rgba(255,255,255,0.6)',
          borderRadius: '12px 12px 0 0',
          _active: {
            color: 'white',
            borderColor: '#667eea',
            backgroundColor: 'rgba(102,126,234,0.15)',
          },
          _hover: {
            color: 'white',
          },
        },
        backgroundColor: 'transparent',
      },
      icon: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { checkAuthState } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}>
        <Authenticator>
          {({ user }) => {
            if (user) {
              checkAuthState().then(() => navigate('/app'));
            }
            return null;
          }}
        </Authenticator>
      </div>
    </ThemeProvider>
  );
};

export default LoginPage;