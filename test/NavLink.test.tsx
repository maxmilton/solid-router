/** @jest-environment jsdom */

import { cleanup, render } from 'solid-testing-library';
import { NavLink } from '../src';

afterEach(cleanup);

test('renders without props', () => {
  expect.assertions(1);
  // @ts-expect-error - Missing props are intentional
  const rendered = render(() => <NavLink />);
  expect(rendered.container.innerHTML).toMatchInlineSnapshot('"<a></a>"');
});

test('renders correctly with required props', () => {
  expect.assertions(1);
  const rendered = render(() => <NavLink href="">x</NavLink>);
  expect(rendered.container.innerHTML).toMatchInlineSnapshot('"<a href=\\"\\">x</a>"');
});

test.todo('renders "aria-current" attribute when location matches');
test.todo('does not render "aria-current" attribute when location does not match');
test.todo('renders "aria-current" attribute only on matching links');
test.todo('renders "aria-current" attribute when location deep matches');
test.todo('does not render "aria-current" attribute when location does not deep match');
test.todo('renders "aria-current" attribute after changing to a matching location');
test.todo('adds props as attributes on <a> element');
test.todo('does not add deepMatch prop as attribute on <a> element');
