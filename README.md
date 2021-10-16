[![Build status](https://img.shields.io/github/workflow/status/maxmilton/solid-router/ci)](https://github.com/maxmilton/solid-router/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/maxmilton/solid-router)](https://codeclimate.com/github/maxmilton/solid-router)
[![NPM version](https://img.shields.io/npm/v/@maxmilton/solid-router.svg)](https://www.npmjs.com/package/@maxmilton/solid-router)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@maxmilton/solid-router.svg)](https://bundlephobia.com/result?p=@maxmilton/solid-router)
[![Licence](https://img.shields.io/github/license/maxmilton/solid-router.svg)](https://github.com/maxmilton/solid-router/blob/master/LICENSE)

# @maxmilton/solid-router

A light-weight History API based router for [Solid](https://github.com/solidui/solid) with the features you expect.

**Features:**

- <abbr title="Single Page App">SPA</abbr> routing using [browser History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- Simple — single top level router, no nesting, no context, handles all `<a>` clicks
- Light — [few dependencies](https://npm.anvaka.com/#/view/2d/%2540maxmilton%252Fsolid-router); under the hood it's mostly an abstraction on top of Solid's built-in Switch and Match components + a little handling logic
- Flexible path matching — static paths, parameters, optional parameters, wildcards, and optional fallback when no match
- URL search query params parsing

> Note: This package is not designed to work with SSR or DOM-less pre-rendering. If you need a universal solution use [solid-app-router](https://github.com/solidui/solid-app-router) instead.

## Installation

```sh
npm install @maxmilton/solid-router
```

or

```sh
yarn add @maxmilton/solid-router
```

## Usage

Simple + JavaScript:

```jsx
import { NavLink, Router, routeTo } from '@maxmilton/solid-router';
import { lazy } from 'solid-js';
import { render, Suspense } from 'solid-js/web';

const routes = [
  {
    path: '/example',
    component: lazy(() => import('./pages/example')),
  },
  {
    path: '/example/:id',
    component: lazy(() => import('./pages/example/[id]')),
  },
  {
    path: '/',
    component: lazy(() => import('./pages/home')),
  },
];

const App = () => (
  <>
    <div>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/example" deepMatch>
        Examples
      </NavLink>
    </div>

    <Suspense fallback={'Loading...'}>
      <Router routes={routes} fallback={'Page Not Found'} />
    </Suspense>
  </>
);

render(App, document.body);
```

All features + TypeScript:

```tsx
import { NavLink, Route, Router, routeTo } from '@maxmilton/solid-router';
import { Component, JSX, lazy } from 'solid-js';
import { ErrorBoundary, render, Suspense } from 'solid-js/web';

// Scroll to top on route change
const oldHistoryPush = window.history.pushState;
window.history.pushState = function () {
  oldHistoryPush.apply(this, arguments);
  window.scrollTo(0, 0);
};

interface ErrorPageProps {
  code?: number;
  message?: string;
}

const ErrorPage: Component<ErrorPageProps> = ({ error }) => (
  <div>
    <h1>{error.code} Error</h1>
    <p>{error.message || 'An unknown error occurred'}</p>
  </div>
);

const Loading: Component = () => <p>Loading...</p>;

const Nav: Component = () => (
  <nav>
    <NavLink href="/">Home</NavLink>
    <NavLink href="/example" deepMatch>
      Examples
    </NavLink>
    <NavLink href="/redirect">Redirect</NavLink>
    <NavLink href="/xx/123/abc?a=1&a=2&b=yy&c">XX</NavLink>
  </nav>
);

const routes: Route[] = [
  {
    path: '/xx/:x1/:x2?',
    component: (props) => {
      console.log('PARAMS', props.params);
      console.log('QUERY', props.query);
      return <a href="/">I'm still handled correctly!</a>;
    },
  },
  {
    path: '/example',
    component: lazy(() => import('./pages/example')),
  },
  {
    path: '/example/:id',
    component: lazy(() => import('./pages/example/[id]')),
  },
  {
    path: '/redirect',
    component: () => routeTo('/example', true) as JSX.Element,
  },
  {
    path: '/',
    component: lazy(() => import('./pages/home')),
  },
];

const App = (): JSX.Element => (
  <>
    <Nav />
    <ErrorBoundary fallback={(error) => <ErrorPage error={error} />}>
      <Suspense fallback={<Loading />}>
        <Router
          routes={routes}
          fallback={() => {
            const error = new Error('Not found');
            error.code = 404;
            throw error;
          }}
          onRouted={() => window.scrollTo(0, 0)}
        />
      </Suspense>
    </ErrorBoundary>
  </>
);

render(App, document.body);
```

## API

TODO: Write me

<!-- [regexparam](https://github.com/lukeed/regexparam) -->
<!-- [qss](https://github.com/lukeed/qss) -->

## License

`@maxmilton/solid-router` is an MIT licensed open source project. See [LICENSE](https://github.com/maxmilton/solid-router/blob/master/LICENSE).

---

© 2021 [Max Milton](https://maxmilton.com)
