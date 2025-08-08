import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';

import { SET_THEME } from 'store/actions';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// auth
import UserProvider from 'contexts/UserContext';
import StatusProvider from 'contexts/StatusContext';
import { SnackbarProvider } from 'notistack';
import { LanguageProvider } from 'hooks/useLanguage';

// ==============================|| APP ||============================== //

const App = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      dispatch({ type: SET_THEME, theme: storedTheme });
    }
  }, [dispatch]);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themes(customization)}>
            <CssBaseline />
            <NavigationScroll>
              <SnackbarProvider
                autoHideDuration={5000}
                maxSnack={3}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <UserProvider>
                  <StatusProvider>
                    <Routes />
                  </StatusProvider>
                </UserProvider>
              </SnackbarProvider>
            </NavigationScroll>
          </ThemeProvider>
        </StyledEngineProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;
