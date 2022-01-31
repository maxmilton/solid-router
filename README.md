[![Build status](https://img.shields.io/github/workflow/status/maxmilton/solid-router/ci)](https://github.com/maxmilton/solid-router/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/maxmilton/solid-router)](https://codeclimate.com/github/maxmilton/solid-router)
[![NPM version](https://img.shields.io/npm/v/@maxmilton/solid-router.svg)](https://www.npmjs.com/package/@maxmilton/solid-router)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@maxmilton/solid-router.svg)](https://bundlephobia.com/result?p=@maxmilton/solid-router)
[![Licence](https://img.shields.io/github/license/maxmilton/solid-router.svg)](https://github.com/maxmilton/solid-router/blob/master/LICENSE)

# @maxmilton/solid-router

A lightweight History API based router for [Solid](https://github.com/solidjs/solid) with the features you expect.

**Features:**

- <abbr title="Single Page App">SPA</abbr> routing using [browser History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- Simple — single top level router, no nesting, no context, handles all `<a>` clicks
- Light — [few dependencies](https://npm.anvaka.com/#/view/2d/%2540maxmilton%252Fsolid-router); under the hood it's mostly an abstraction on top of Solid's built-in Switch and Match components + a little handling logic
- Flexible path matching — static paths, parameters, optional parameters, wildcards, and no match fallback
- Optional URL search query params parsing

> Note: This package is not designed to work with SSR or DOM-less pre-rendering. If you need a universal solution use [solid-app-router](https://github.com/solidjs/solid-app-router) instead.

## Installation

```sh
npm install @maxmilton/solid-router
```

or

```sh
yarn add @maxmilton/solid-router
```

## Usage

### Simple + JavaScript

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

### All features + TypeScript

```tsx
import {
  NavLink,
  Router,
  useURLParams,
  routeTo,
  type Route,
} from '@maxmilton/solid-router';
import { lazy, type Component, type JSX } from 'solid-js';
import { ErrorBoundary, render, Suspense } from 'solid-js/web';

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
      console.log(props.params); // -> { x1: "...", x2: ... }

      const [urlParams, setUrlParams] = useURLParams();
      console.log(urlParams()); // -> { ... }

      // Add new URL params
      setUrlParams({ ...urlParams(), name: 'example', x: [1, 2] }); // -> location.search == "?name=example&x=1&x=2"

      // Delete URL params (set to `undefined`)
      setUrlParams({ ...urlParams(), x: undefined }); // -> location.search == "?name=example"

      // Regular links are still handled by the router
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
          // Scroll to top on route change
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

## Browser support

No particularly modern JavaScript APIs are used so browser support should be excellent. However, keep in mind [Solid's official browser support](https://github.com/solidjs/solid#browser-support) only targets modern evergreen browsers.

## Bugs

Report any bugs you encounter on the [GitHub issue tracker](https://github.com/maxmilton/new-tab/issues).

## Changelog

See [releases on GitHub](https://github.com/maxmilton/solid-router/releases).

## License

MIT license. See [LICENSE](https://github.com/maxmilton/solid-router/blob/master/LICENSE).

---

© 2022 [Max Milton](https://maxmilton.com)
