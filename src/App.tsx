import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { newHybridMethod } from './recipes/new-hybird-method';
import { fourToSixMethod } from './recipes/four-to-six-method';
import SettingsScreen from './components/SettingsScreen';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import RecipeList from './components/RecipeList';
import CoffeeRecipe from './components/CoffeeRecipe';

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
  const { recipeId } = useParams();
  const recipe = recipeId === 'four-to-six-method'
    ? fourToSixMethod
    : newHybridMethod;

  return <CoffeeRecipe recipe={recipe} />;
}

export default AppWrapper;
