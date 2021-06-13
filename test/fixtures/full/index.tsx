import { JSX, lazy } from 'solid-js';
import { render, Suspense } from 'solid-js/web';
import {
  NavLink, Route, Router, routeTo,
} from '../../../src';

const Page1 = lazy(() => import('./page1'));
const Page1SubPath = lazy(() => import('./page1-sub'));
const Page2 = lazy(() => import('./page2'));
const Home = lazy(() => import('./home'));

const routes: Route[] = [
  { path: '/page1', component: Page1 },
  { path: '/page1/:subPath1/:subPath2?', component: Page1SubPath },
  { path: '/page2', component: Page2 },
  { path: '/', component: Home },
  {
    path: '/redirect',
    component: () => routeTo('/page1/a/b?c=d#e', true) as JSX.Element,
  },
];

const App = () => (
  <>
    <nav>
      <NavLink href="/" class="home">
        Home
      </NavLink>
      <NavLink href="/page1" class="page1" deepMatch>
        Page 1
      </NavLink>
      <NavLink href="/page2" class="page2">
        Page 2
      </NavLink>
      <NavLink href="/redirect" class="redirect">
        Redirect
      </NavLink>
      <NavLink href="/fake" class="fake">
        Fake
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
