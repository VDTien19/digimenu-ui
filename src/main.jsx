import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '~/store/store';
import 'odometer/themes/odometer-theme-default.css';

import './index.css';
import App from './App.jsx';
import GlobalStyles from '~/components/GlobalStyles';
import { CategoryProvider } from '~/contexts/CategoryContext';
import { ProductProvider } from '~/contexts/ProductContext';
import { SearchProvider } from '~/contexts/SearchContext';
import { AuthProvider } from '~/contexts/AuthContext';
import { SocketProvider } from '~/contexts/SocketProvider';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <SocketProvider>
                    <Provider store={store}>
                        <CategoryProvider>
                            <ProductProvider>
                                <SearchProvider>
                                    <App />
                                </SearchProvider>
                            </ProductProvider>
                        </CategoryProvider>
                    </Provider>
                </SocketProvider>
            </AuthProvider>
        </GlobalStyles>
    // </StrictMode>,
);
