import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, ToastBar } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { AdminLayout, ClientLayout, ServiceLayout } from './layouts';
import ProtectedRoute, { publicRoutes, privateRoutes } from './routes';
import { SlugProvider } from '~/contexts/SlugContext';
import GuestRoute from '~/routes/GuestRoute';
import socket from '~/socket';
import AppInit from './AppInit';

function App() {
    // useEffect(() => {
    //     socket.connect();

    //     socket.on('connect', () => {
    //         console.log('Connected to the server: ', socket.id);
    //     })
        
    //     return () => {
    //         socket.off('connect');
    //     }
    // }, [])
    return (
        <Router>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(22, 22, 22, 0.9',
                        color: '#fff',
                        fontSize: '1.3rem',
                        borderRadius: '8px',
                        padding: '6px 2px',
                        width: '100%',
                    },
                }}
            >
                {(t) => (
                    <ToastBar
                        toast={t}
                        style={{
                            ...t.style,
                            animation: t.visible
                                ? 'custom-enter 0.4s ease'
                                : 'custom-exit 0.4s ease forwards',
                        }}
                    />
                )}
            </Toaster>

            <ToastContainer />
            <AppInit />

            <div className="app">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = ClientLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        const PageElement = (
                            <Layout>
                                <Page />
                            </Layout>
                        );

                        if (route.guestOnly) {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <SlugProvider>
                                            <GuestRoute>
                                                {PageElement}
                                            </GuestRoute>
                                        </SlugProvider>
                                    }
                                />
                            );
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <SlugProvider>{PageElement}</SlugProvider>
                                }
                            />
                        );
                    })}

                    {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout;

                        if (route.layout === 'admin') {
                            Layout = AdminLayout;
                        } else if (route.layout === 'staff') {
                            Layout = ServiceLayout;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <SlugProvider>
                                        <ProtectedRoute roleRequired={route.roleRequired}>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </ProtectedRoute>
                                    </SlugProvider>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
