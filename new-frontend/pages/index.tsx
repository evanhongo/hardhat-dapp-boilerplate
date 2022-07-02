import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import HtmlTitle from "@/components/HtmlTitle";
import { useAppSelector } from "@/hooks";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

const Main: NextPage = () => {
  const wallet = useAppSelector(state => state.ether.wallet);
  const router = useRouter();
  
  useEffect(() => {
    if (wallet?.address) 
      router.push("/dashboard");
  }, [wallet]);
  
  return (
    <>
      <HtmlTitle />
      <Header />
      <Link href="/about">About</Link>
    </>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ req }) => {
//       try {

//         store.dispatch(setProfile(res.data));
//         return {
//           redirect: {
//             permanent: false,
//             destination: "/ma-total"
//           },
//           props: {}
//         };
//       } catch (err) {
//         console.error(err);
//         return {
//           props: {}
//         };
//       }
//     }
// );

export default Main;
