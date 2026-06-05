import { loginView } from '../views/loginView.js';
import { homeView } from '../views/homeView.js';
import { adminView } from '../views/adminView.js'; 
import { notFound } from '../views/notFound.js';
import { getSession } from '../utils.js';

const routes = {
  '/': { view: homeView, authRequired: true, role: 'any' },
  '/home': { view: homeView, authRequired: true, role: 'any' },
  '/login': { view: loginView, authRequired: false, role: 'any' },
  '/admin': { view: adminView, authRequired: true, role: 'admin' } //Asignar la vista correcta
};

export const router = async () => {
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
    return;
  }

  const path = window.location.hash.slice(1) || '/';
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const route = routes[path];
  if (!route) {
    appContainer.innerHTML = notFound();
    return;
  }

  const session = getSession();

  if (route.authRequired && !session) {
    window.location.hash = '#/login';
    return;
  }

  if (path === '/login' && session) {
    window.location.hash = '#/home';
    return;
  }

  if (route.role === 'admin' && session?.role !== 'admin') {
    alert('Acceso denegado.');
    window.location.hash = '#/home';
    return;
  }

  appContainer.innerHTML = route.view(session);

  // Inicialización síncrona/asíncrona de controladores post-render
  if (path === '/login') {
    const { initLoginController } = await import('../controllers/login.controller.js');
    initLoginController();
  } else if (path === '/' || path === '/home') {
    const { initHomeController } = await import('../controllers/home.controller.js');
    await initHomeController();
  } else if (path === '/admin') {
    const { initAdminController } = await import('../controllers/admin.controller.js');
    await initAdminController(); // Cargar la lógica del panel administrativo
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);


