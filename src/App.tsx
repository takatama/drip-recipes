import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './components/Header';
import Settings from './components/Settings';
import Controls from './components/Controls';
import Timeline from './components/Steps';
import Footer from './components/Footer';
import { translations } from './translations/index'
import { NotificationMode, Step } from './types';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
  useNavigate,
  Navigate,
  useParams
} from 'react-router-dom';
import { useTimer } from './hooks/useTimer';
import { useWakeLock } from './hooks/useWakeLock';

// Create theme with both light and dark modes
const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#6D4C41' : '#A1887F',
    },
    secondary: {
      main: mode === 'light' ? '#A1887F' : '#8D6E63',
    },
    background: {
      default: mode === 'light' ? '#F5F5DC' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});

// Function to calculate timer steps based on the new hybrid method
function calculateSteps(beansAmount: number, flavor: string) {
  // Total water used = beansAmount * 15
  const totalWater = beansAmount * 15;
  const flavorWater = totalWater * 0.4;
  const strengthWater = totalWater * 0.6;
  let flavor1, flavor2;
  // Adjust flavor pours based on taste selection
  if (flavor === "sweet") {
    flavor1 = flavorWater * 0.42;
    flavor2 = flavorWater * 0.58;
  } else if (flavor === "sour") {
    flavor1 = flavorWater * 0.58;
    flavor2 = flavorWater * 0.42;
  } else {
    flavor1 = flavorWater * 0.5;
    flavor2 = flavorWater * 0.5;
  }
  // Fixed strength steps
  let strengthSteps = 2;

  const steps: Array<Step> = [];
  // Flavor pours are fixed at 0s and 45s
  steps.push({
    time: 0,
    pourAmount: flavor1,
    cumulative: flavor1,
    descriptionKey: "flavorPour1",
    status: 'upcoming'
  });
  steps.push({
    time: 40,
    pourAmount: flavor2,
    cumulative: flavor1 + flavor2,
    descriptionKey: "flavorPour2",
    status: 'upcoming'
  });
  // Strength pour 1 is fixed at 90 seconds (1:30)
  const strengthPourAmount = strengthWater / strengthSteps;
  steps.push({
    time: 90,
    pourAmount: strengthPourAmount,
    cumulative: steps[steps.length - 1].cumulative + strengthWater * 0.444,
    descriptionKey: "strengthPour1",
    status: 'upcoming'
  });
  // Strength pour 2 is fixed at 130 seconds (2:10)
  steps.push({
    time: 130,
    pourAmount: strengthPourAmount,
    cumulative: steps[steps.length - 1].cumulative + strengthWater * 0.556,
    descriptionKey: "strengthPour2",
    status: 'upcoming'
  });
  // Final step (finish) is fixed at 210 seconds
  steps.push({
    time: 165,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "open",
    status: 'upcoming'
  });
  // Final step (finish) is fixed at 210 seconds
  steps.push({
    time: 210,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "finish",
    status: 'upcoming'
  });
  return steps;
}

const getUserLang = () => {
  const userLang = navigator.language || navigator.languages[0];
  return userLang.startsWith('ja') ? 'ja' : 'en';
}

function AppWrapper() {
  const lang = getUserLang();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang/recipes/new-hybrid-method" element={<App />} />
        <Route path="*" element={<Navigate to={`/${lang}/recipes/new-hybrid-method`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const { currentTime, isRunning, start, pause, reset } = useTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = getTheme(darkMode ? 'dark' : 'light');
  const [language, setLanguage] = useState<"en" | "ja">("en");
  const t = translations[language]; // shorthand for current translations
  const [beansAmount, setBeansAmount] = useState(20);
  const [flavor, setFlavor] = useState("middle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [notificationMode, setNotificationMode] = useState<NotificationMode>('none');
  const [voice, setVoice] = useState<'male' | 'female'>('female');
  const navigate = useNavigate();
  const { lang } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'ja')) {
      setLanguage(lang);
    }
  }, [lang]);

  useEffect(() => {
    const paramBeans = searchParams.get('beans');
    const paramFlavor = searchParams.get('flavor');

    if (paramBeans) {
      const beans = parseInt(paramBeans, 10);
      if (!isNaN(beans) && beans !== beansAmount) {
        setBeansAmount(beans);
      }
    }

    if (paramFlavor && paramFlavor !== flavor) {
      setFlavor(paramFlavor);
    }
  }, [searchParams]);

  // Recalculate steps whenever coffee parameters change
  useEffect(() => {
    // Update URL query parameters when state changes
    const currentBeans = searchParams.get('beans');
    const currentFlavor = searchParams.get('flavor');
    if (currentBeans !== beansAmount.toString() || currentFlavor !== flavor) {
      const params = new URLSearchParams();
      params.set('beans', beansAmount.toString());
      params.set('flavor', flavor);
      setSearchParams(params, { replace: true });
    }

    const newSteps = calculateSteps(beansAmount, flavor);
    setSteps(newSteps);
  }, [beansAmount, flavor]);

  // Update dark mode when system preference changes
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const handlePlay = async () => {
    if (isRunning) return;
    setSnackbarOpen(true);
    await requestWakeLock();
    start();
  };

  const handlePause = async () => {
    setSnackbarOpen(false);
    await releaseWakeLock();
    pause();
  };

  // Reset the timer
  const handleReset = async () => {
    setSnackbarOpen(false);
    await releaseWakeLock();
    reset();
  };

  // Handler for language toggle
  const handleLanguageChange = (_e: React.MouseEvent<HTMLElement>, newLang: "en" | "ja") => {
    if (newLang) {
      setLanguage(newLang);
      navigate(`/${newLang}/recipes/new-hybrid-method`);
    }
  };

  // Snackbarを閉じるハンドラー
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        py: 2,
        width: '100%',
      }}>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          handleLanguageChange={handleLanguageChange}
          t={t}
        />

        <Typography variant="h5" align="center" gutterBottom>
          {t.title}
        </Typography>

        <Typography variant="body1" align="center" gutterBottom>
          {t.usesHarioSwitch(
            <a
              href={t.harioSwitchLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.palette.primary.main }}
            >
              Hario Switch
            </a>
          )}
        </Typography>
        <Settings
          t={t}
          beansAmount={beansAmount}
          setBeansAmount={setBeansAmount}
          flavor={flavor}
          setFlavor={setFlavor}
        />

        <Typography
          variant="body2"
          component="div"
          sx={{
            fontSize: '1.1rem',
            mb: 2,
            ml: 4,
          }}
        >
          <div style={{ marginBottom: '8px' }}>{t.preparation}</div>
          {t.preparationSteps.map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ marginRight: '8px' }}>•</span>
              {step}
            </div>
          ))}
        </Typography>

        <Controls
          t={t}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          notificationMode={notificationMode}
          setNotificationMode={setNotificationMode}
          voice={voice}
          setVoice={setVoice}
        />

        <Timeline
          t={t}
          steps={steps}
          setSteps={setSteps}
          currentTime={currentTime}
          darkMode={darkMode}
          notificationMode={notificationMode}
          language={language}
          voice={voice}
          onTimerComplete={handlePause}
        />

        <Footer t={t} />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          message={t.keepScreenOn}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </ThemeProvider>
  );
}

export default AppWrapper;
