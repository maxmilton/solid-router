export {};
// // FIXME: JSDOM doesn't support navigation making testing a router rather difficult

// import { cleanup, render } from 'solid-testing-library';
// import { Router, routeTo } from '../src';

// const abcRoutes = [
//   { path: '/a', component: () => <>a</> },
//   { path: '/b', component: () => <>b</> },
//   { path: '/c', component: () => <>c</> },
// ];

// afterEach(cleanup);

// test('throws without required props', () => {
//   expect.assertions(1);
//   expect(() => {
//     // @ts-expect-error - Missing prop is intentional
//     render(<Router />);
//   }).toThrow();
// });

// test('renders correctly with required props', () => {
//   expect.assertions(1);
//   const routes = [{ path: '/', component: () => <p>x</p> }];
//   const rendered = render(<Router routes={routes} />);
//   expect(rendered.container.innerHTML).toMatchInlineSnapshot('"<p>x</p>"');
// });

// test('renders matching route', () => {
//   expect.assertions(1);
//   // FIXME: Set URL via jest or manually rather than relying on an internal function
//   routeTo('/c');
//   const rendered = render(<Router routes={abcRoutes} />);
//   expect(rendered.container.textContent).toStrictEqual('c');
// });

// test('renders component fallback when no matching path', () => {
//   expect.assertions(1);
//   const rendered = render(<Router routes={[]} fallback={<p>f</p>} />);
//   expect(rendered.container.innerHTML).toMatchInlineSnapshot('"<p>f</p>"');
// });

// test('calls function fallback when no matching path', () => {
//   expect.assertions(1);
//   const mock = jest.fn();
//   render(<Router routes={[]} fallback={mock} />);
//   expect(mock).toHaveBeenCalledTimes(1);
// });

// test('renders nothing when no matching path and no fallback', () => {
//   expect.assertions(2);
//   const rendered = render(<Router routes={[]} />);
//   expect(rendered.container.innerHTML).toStrictEqual('');
//   expect(rendered.container.childNodes.length).toStrictEqual(0);
// });

// test.todo('changes rendered route after location pushstate event');
// test.todo('changes rendered route after location replacestate event');
// test.todo('changes rendered route after location popstate event');
// test.todo('changes rendered route after link click');
// test.todo('handles route path with parameter');
// test.todo('handles route path with optional parameter');
// test.todo('handles route path with wildcard');
// test.todo('handles location with URL search query');
// test.todo('handles location with hash');
// test.todo('handles route path and location with all the things');
// test.todo('passes correct params to route component props');
// test.todo('passes correct query to route component props');
// test.todo('adds event listeners on mount');
// test.todo('removes event listeners on unmount');

// test.todo('handles click on <a>');
// test.todo('handles click inside <a>');
// test.todo('does not handle click with ctrl key');
// test.todo('does not handle click with meta key');
// test.todo('does not handle click with alt key');
// test.todo('does not handle click with shift key');
// test.todo(
//   'does not handle click when mouse button pressed is not the main button',
// );
// test.todo('does not handle click when default already prevented');
// test.todo('does not handle click when not on or inside a <a>');
// test.todo('does not handle click when <a> has target attribute');
// test.todo('does not handle click when href is missing');
// test.todo('does not handle click when href is empty');
// test.todo('does not handle click when href is to another host');
// test.todo('does not handle click when href is to a hash');
