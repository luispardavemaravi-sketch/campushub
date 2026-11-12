//utilizamos React Router DOM para la navegación
import {
  BrowserRouter, //Activa el sistema de navegación
  Navigate,      //	Agrupa todas las rutas
  Route,         //Define una ruta y la página que muestra
  Routes         //	Redirige a otra página
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { DataProvider } from './context/DataContext.jsx';

import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import InicioPage from './pages/InicioPage.jsx';
import CatalogoPage from './pages/CatalogoPage.jsx';
import DetalleCanchaPage from './pages/DetalleCanchaPage.jsx';
import MisReservasPage from './pages/MisReservasPage.jsx';
import NuevaReservaPage from './pages/NuevaReservaPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <Navbar nombreMarca="SportHub" />

            <main className="app-main container py-4 py-lg-5">
              <Routes>
                {/* Página principal del portal */}
                <Route path="/" element={<InicioPage />} />

                {/* Catálogo público de canchas */}
                <Route path="/catalogo" element={<CatalogoPage />} />

                {/* Detalle de una cancha seleccionada */}
                <Route
                  path="/catalogo/:id"
                  element={<DetalleCanchaPage />}
                />

                {/* Inicio de sesión del cliente */}
                <Route path="/login" element={<LoginPage />} />

                {/* Las funciones personales requieren sesión */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/mis-reservas"
                    element={<MisReservasPage />}
                  />

                  <Route
                    path="/nueva-reserva"
                    element={<NuevaReservaPage />}
                  />
                </Route>

                {/* Ruta para páginas inexistentes */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <footer className="site-footer">
              <div className="container d-flex flex-column flex-md-row justify-content-between gap-2">
                <span>© {new Date().getFullYear()} SportHub</span>
                <span>Gestión de reservas deportivas</span>
              </div>
            </footer>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}