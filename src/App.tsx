import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import { translations } from './translations/index'
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
import RecipeDescription from './components/RecipeDescription';
import { newHybridMethodDSL } from './recipes/new-hybird-method';
import DynamicSettings from './components/DynamicSettings';

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
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = getTheme(darkMode ? 'dark' : 'light');
  const [language, setLanguage] = useState<"en" | "ja">("en");
  const t = translations[language]; // shorthand for current translations
  const [beansAmount, setBeansAmount] = useState(20);
  const [flavor, setFlavor] = useState("neutral");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'ja')) {
      setLanguage(lang);
    }
  }, [lang]);

  // Handler for language toggle
  const handleLanguageChange = (_e: React.MouseEvent<HTMLElement>, newLang: "en" | "ja") => {
    if (newLang) {
      setLanguage(newLang);
      navigate(`/${newLang}/recipes/new-hybrid-method`);
    }
  };

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
  }, [beansAmount, flavor]);

  // Update dark mode when system preference changes
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

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
          {newHybridMethodDSL.name[language]}
        </Typography>

        <RecipeDescription recipe={newHybridMethodDSL} language={language} t={t} />

        <Typography variant="body1" align="center" gutterBottom>
          {newHybridMethodDSL.equipments[language](theme)}
        </Typography>

        <DynamicSettings
          t={t}
          params={newHybridMethodDSL.params}
          values={{
            beansAmount,
            waterRatio: newHybridMethodDSL.waterRatio,
            flavor,
          }}
          onChange={(key, value) => {
            if (key === 'beansAmount') {
              setBeansAmount(value);
            }
            if (key === 'flavor') {
              setFlavor(value);
            }
          }}
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
          {newHybridMethodDSL.preparationSteps[language].map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ marginRight: '8px' }}>•</span>
              {step}
            </div>
          ))}
        </Typography>

        <Timeline
          recipe={newHybridMethodDSL}
          t={t}
          darkMode={darkMode}
          language={language}
          beansAmount={beansAmount}
          flavor={flavor}
        />

        <Footer t={t} />
      </Container>
    </ThemeProvider>
  );
}

export default AppWrapper;
