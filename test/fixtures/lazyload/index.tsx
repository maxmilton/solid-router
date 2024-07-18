import { lazy } from 'solid-js';
import { Suspense, render } from 'solid-js/web';
import { NavLink, type Route, Router } from '../../../src';

const Page1 = lazy(() => import('./page1'));
const Page2 = lazy(() => import('./page2'));
const Home = lazy(() => import('./home'));

const routes: Route[] = [
  { path: '/page1', component: Page1 },
  { path: '/page2', component: Page2 },
  { path: '/', component: Home },
];

const App = () => (
  <>
    <nav>
      <NavLink href="/" class="home">
        Home
      </NavLink>
      <NavLink href="/page1" class="page1">
        Page 1
      </NavLink>
      <NavLink href="/page2" class="page2">
        Page 2
      </NavLink>
    </nav>

    <main>
      <Suspense fallback={'Loading...'}>
        <Router routes={routes} fallback={'Not Found'} />
      </Suspense>
    </main>
  </>
);

render(App, document.body);
