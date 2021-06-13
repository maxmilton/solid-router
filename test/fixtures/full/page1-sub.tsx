import type { RouteComponent } from '../../../src';

const Page1Sub: RouteComponent = ({ params }) => (
  <div>
    Nested subPath1 {params.subPath1} subPath2 {params.subPath2}
  </div>
);

export default Page1Sub;
