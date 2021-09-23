import { decode } from 'qss';
import { parse } from 'regexparam';
import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  startTransition,
} from 'solid-js';
import { Match, Switch } from 'solid-js/web';

const [urlPath, setUrlPath] = createSignal(location.pathname);

export function routeTo(url: string, replace?: boolean): void {
  history[`${replace ? 'replace' : 'push'}State` as const]({}, '', url);
  startTransition(() => setUrlPath(/[^#?]*/.exec(url)![0]));
}

function handleClick(event: MouseEvent): void {
  if (
    event.ctrlKey
    || event.metaKey
    || event.altKey
    || event.shiftKey
    || event.button
    || event.defaultPrevented
  ) {
    return;
  }

  const link = (event.target as Element).closest('a');
  const href = link && link.getAttribute('href');

  if (!href || link.target || link.host !== location.host || href[0] === '#') {
    return;
  }

  event.preventDefault();
  routeTo(href);
}

export type RouteComponent<P = Record<string, any>> = (
  props: P & {
    children?: JSX.Element;
    readonly params: Record<string, string | null>;
    readonly query: Partial<Record<string, any>>;
  },
) => JSX.Element;

export interface Route {
  component: RouteComponent;
  path: string;
}

interface RouterProps {
  fallback?: JSX.Element;
  routes: Route[];
  /** Optional callback function run after the route has changed. */
  onRouted?: () => void;
}

export const Router: Component<RouterProps> = ({
  fallback,
  routes,
  onRouted = () => {},
}) => {
  const handleHistoryState = () => {
    startTransition(() => setUrlPath(location.pathname));
    onRouted();
  };

  addEventListener('popstate', handleHistoryState);
  addEventListener('replacestate', handleHistoryState);
  addEventListener('pushstate', handleHistoryState);
  addEventListener('click', handleClick);

  onCleanup(() => {
    removeEventListener('popstate', handleHistoryState);
    removeEventListener('replacestate', handleHistoryState);
    removeEventListener('pushstate', handleHistoryState);
    removeEventListener('click', handleClick);
  });

  return (
    <Switch fallback={fallback}>
      {routes.map((route) => {
        const { keys, pattern } = parse(route.path);

        return (
          <Match when={pattern.exec(urlPath())}>
            {(matches) => {
              const search = location.search.slice(1);
              const params: Record<string, string | null> = {};
              let index = 0;

              while (index < keys.length) {
                params[keys[index]] = matches[++index] || null;
              }

              // FIXME: Lazy loaded components do not trigger <Suspense>
              return (
                <route.component
                  params={params}
                  query={search ? decode(search) : {}}
                />
              );
            }}
          </Match>
        );
      })}
    </Switch>
  );
};

interface NavLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Also set as active when matches deeper path rather than just on exact path.
   *
   * For example, if href="/path" the following locations would count as active:
   * `/path`, `/path/`, or `/path/subpath/subsubpath`, but not `/path2`.
   * Otherwise only an exact match counts as active e.g., `/path`.
   */
  deepMatch?: boolean;
  // required
  href: string;
}

/**
 * An anchor tag link that gets an `aria-current` attribute when the current
 * location path matches its `href`.
 *
 * Note: When you only need a regular link without active detection, use a
 * regular `<a ...>` HTMLAnchorElement. The router will still react to clicks.
 */
export const NavLink: Component<NavLinkProps> = ({ deepMatch, ...props }) => (
  // @ts-expect-error - FIXME: aria-current should also accept undefined|null
  <a
    aria-current={
      (deepMatch
        ? new RegExp(`^${props.href}(?:\\/.*)?$`).test(urlPath())
        : props.href === urlPath()) || undefined
    }
    {...props}
  />
);
