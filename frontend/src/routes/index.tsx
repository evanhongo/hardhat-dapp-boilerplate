import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Loader } from "@evanhongo/react-custom-component";

const AsyncCodeOfConduct = lazy(() => import("@/components/CodeOfConduct"));
const CodeOfConduct = () => (
  <Suspense
    fallback={
      <Loader
        type="spinning"
        style={{
          width: "50%",
          height: "50%",
          margin: "auto",
        }}
      />
    }
  >
    <AsyncCodeOfConduct />
  </Suspense>
);

const AsyncAbout = lazy(() => import("@/components/About"));
const About = () => (
  <Suspense
    fallback={
      <Loader
        type="spinning"
        style={{
          width: "50%",
          height: "50%",
          margin: "auto",
        }}
      />
    }
  >
    <AsyncAbout />
  </Suspense>
);

export const routeRules: RouteObject[] = [
  {
    path: "/",
    element: <CodeOfConduct />,
    children: [
      // {
      //   path: "/",
      //   element:
      // },
      // {
      //   path: "",
      //   element:
      // }
    ],
  },
  { path: "about", element: <About /> },
];
