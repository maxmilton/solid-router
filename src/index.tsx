import { decode } from 'qss';
import { parse } from 'regexparam';
import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  splitProps,
  startTransition,
} from 'solid-js';
import { Match, Switch } from 'solid-js/web';

const [urlPath, setUrlPath] = createSignal(window.location.pathname);

export function routeTo(url: string, replace?: boolean): Promise<void> {
  window.history[`${replace ? 'replace' : 'push'}State` as const]({}, '', url);
  return startTransition(() => setUrlPath(/[^#?]*/.exec(url)![0]));
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
  /** Optional callback function that is called after the route has changed. */
  onRouted?: () => void;
}

export const Router: Component<RouterProps> = (props) => {
  const handleHistoryState = () => {
    startTransition(() => setUrlPath(window.location.pathname))
      .then(props.onRouted)
      .catch((error) => {
        throw error;
      });
  };

  const handleClick = (event: MouseEvent): void => {
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

    if (
      !href
      || link.target
      || link.host !== window.location.host
      || href[0] === '#'
    ) {
      return;
    }

    event.preventDefault();
    routeTo(href, false)
      .then(props.onRouted)
      .catch((error) => {
        throw error;
      });
  };

  window.addEventListener('popstate', handleHistoryState);
  window.addEventListener('click', handleClick);

  onCleanup(() => {
    window.removeEventListener('popstate', handleHistoryState);
    window.removeEventListener('click', handleClick);
  });

  return (
    <Switch fallback={props.fallback}>
      {props.routes.map((route) => {
        const { keys, pattern } = parse(route.path);

        return (
          <Match when={pattern.exec(urlPath())}>
            {(matches) => {
              const search = window.location.search.slice(1);
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
  /**
   * The hyperlink's URL.
   * @required
   */
  href: string;
}

/**
 * An anchor tag link that gets an `aria-current` attribute when the current
 * location path matches its `href`.
 *
 * Note: When you only need a regular link without active detection, use a
 * regular `<a ...>` HTMLAnchorElement. The router will still react to clicks.
 */
export const NavLink: Component<NavLinkProps> = (props) => {
  const [, rest] = splitProps(props, ['deepMatch']);

  return (
    // @ts-expect-error - FIXME: aria-current should also accept undefined|null
    <a
      {...rest}
      aria-current={
        (props.deepMatch
          ? new RegExp(`^${props.href}(?:\\/.*)?$`).test(urlPath())
          : props.href === urlPath()) || undefined
      }
    />
  );
};
