import { decode } from 'qss';
import regexparam from 'regexparam';
import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  useTransition,
} from 'solid-js';
import { Match, Switch } from 'solid-js/web';

const [location, setLocation] = createSignal(window.location.pathname);
const [, transition] = useTransition();

export function routeTo(url: string, replace?: boolean): void {
  window.history[`${replace ? 'replace' : 'push'}State` as const]({}, '', url);
  transition(() => setLocation(/[^?#]*/.exec(url)![0]));
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

  const link = (event.target as HTMLElement).closest('a');
  const href = link && link.getAttribute('href');

  if (
    !href
    || link!.target
    || link!.host !== window.location.host
    || href[0] === '#'
  ) {
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
}

export const Router: Component<RouterProps> = ({ fallback, routes }) => {
  const handleHistoryState = () => transition(() => setLocation(window.location.pathname));

  window.addEventListener('popstate', handleHistoryState);
  window.addEventListener('replacestate', handleHistoryState);
  window.addEventListener('pushstate', handleHistoryState);
  window.addEventListener('click', handleClick);

  onCleanup(() => {
    window.removeEventListener('popstate', handleHistoryState);
    window.removeEventListener('replacestate', handleHistoryState);
    window.removeEventListener('pushstate', handleHistoryState);
    window.removeEventListener('click', handleClick);
  });

  return (
    <Switch fallback={fallback}>
      {routes.map((route) => {
        const { keys, pattern } = regexparam(route.path);

        return (
          <Match when={pattern.exec(location())}>
            {(matches) => {
              const search = window.location.search.slice(1);
              const params: Record<string, string | null> = {};
              let i = 0;

              while (i < keys.length) {
                params[keys[i]] = matches[++i] || null;
              }

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
   * Also set as active when matches deeper path rather than an exact path.
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
  <a
    aria-current={
      (deepMatch
        ? new RegExp(`^${props.href}(?:\\/.*)?$`).test(location())
        : props.href === location()) || undefined
    }
    {...props}
  />
);
