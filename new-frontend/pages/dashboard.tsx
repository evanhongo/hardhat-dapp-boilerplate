import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
// const Header = dynamic(() => import("@/components/Header"), { ssr: false });

const CodeOfConduct: NextPage = () => (
  <>
    <Head>
      <title>Create Next App</title>
    </Head>
    <Header />
    <Link href="/about">About Go</Link>
  </>
);

export default CodeOfConduct;
