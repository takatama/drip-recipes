import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import { translations } from './translations/index'
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom';
import RecipeDescription from './components/RecipeDescription';
import { newHybridMethod } from './recipes/new-hybird-method';
import { fourToSixMethod } from './recipes/four-to-six-method';
import InputParams from './components/InputParams';
import { Step } from './types';
import SettingsScreen from './components/SettingsScreen';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import RecipeList from './components/RecipeList';

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

function AppThemeWrapper({ children }: { children: React.ReactNode }) {
  const { darkMode } = useSettings();
  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

const getUserLang = () => {
  const userLang = navigator.language || navigator.languages[0];
  return userLang.startsWith('ja') ? 'ja' : 'en';
}

const recipes = [newHybridMethod, fourToSixMethod];

function AppWrapper() {
  // TODO: Redirect to the user's preferred language
  const lang = getUserLang();

  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppThemeWrapper>
          <Routes>
            <Route path="/:lang/recipes" element={<RecipeList recipes={recipes} />} />
            <Route path="/:lang/recipes/featured/:recipeId" element={<App />} />
            <Route path="/:lang/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to={`/${lang}/recipes`} replace />} />
          </Routes>
        </AppThemeWrapper>
      </SettingsProvider>
    </BrowserRouter>
  );
}

function App() {
  const { darkMode, language } = useSettings();
  const t = translations[language]; // shorthand for current translations
  const { lang, recipeId } = useParams();
  const [beansAmount, setBeansAmount] = useState(20);
  const [flavor, setFlavor] = useState('neutral');
  const [steps, setSteps] = useState<Step[]>([]);
  const [roastLevel, setRoastLevel] = useState('mediumRoast');
  const [strength, setStrength] = useState('medium');
  const recipe = recipeId === 'four-to-six-method'
    ? fourToSixMethod
    : newHybridMethod;
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && lang !== language) {
      // Update language in the URL
      const pathParts = window.location.pathname.split('/');
      pathParts[1] = language;
      navigate(pathParts.join('/'), { replace: true });
    }
  }, [lang, language, navigate]);

  useEffect(() => {
    const steps = recipe.generateSteps(recipe, beansAmount, flavor, strength);
    setSteps(steps);
  }, [beansAmount, flavor, strength]);

  return (
    <Container maxWidth="sm" sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      py: 2,
      width: '100%',
    }}>
      <Header
        language={language}
        t={t}
      />

      <Typography variant="h5" align="center" gutterBottom>
        {recipe.name[language]}
      </Typography>

      <RecipeDescription recipe={recipe} language={language} t={t} />

      <Typography variant="body1" align="center" gutterBottom>
        {recipe.equipments[language]}
      </Typography>

      <InputParams
        t={t}
        params={recipe.params}
        values={{
          beansAmount,
          waterRatio: recipe.waterRatio,
          flavor,
          roastLevel,
          strength,
        }}
        onChange={(key, value) => {
          if (key === 'beansAmount') {
            setBeansAmount(value);
          }
          if (key === 'flavor') {
            setFlavor(value);
          }
          if (key === 'roastLevel') {
            setRoastLevel(value);
          }
          if (key === 'strength') {
            setStrength(value);
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
        {recipe.preparationSteps && recipe.preparationSteps[language].map((step, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ marginRight: '8px' }}>•</span>
            {step}
          </div>
        ))}
      </Typography>

      <Timeline
        t={t}
        darkMode={darkMode}
        language={language}
        steps={steps}
        setSteps={setSteps}
      />

      <Footer t={t} />
    </Container>
  );
}

export default AppWrapper;
