import { render } from 'solid-js/web';
import { NavLink, type Route, Router } from '../../../src';

const Page1 = () => <div>Page 1</div>;
const Page2 = () => <div>Page 2</div>;
const Home = () => <div>Home</div>;

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
      <Router routes={routes} fallback={'Not Found'} />
    </main>
  </>
);

render(App, document.body);
