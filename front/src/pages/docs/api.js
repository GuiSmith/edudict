import { readFile } from "node:fs/promises";
import { join } from "node:path";

import dynamic from "next/dynamic";
import Head from "next/head";

const ApiReferenceReact = dynamic(
  () =>
    import("@scalar/api-reference-react").then(
      (module) => module.ApiReferenceReact
    ),
  {
    ssr: false,
  }
);

export default function ApiDocsPage({ openapi }) {
  return (
    <>
      <Head>
        <title>Stocky API Docs</title>
      </Head>

      <ApiReferenceReact
        configuration={{
          content: openapi,
        }}
      />
    </>
  );
}

export async function getStaticProps() {
  const openapiPath = join(process.cwd(), "docs", "api", "openapi.yml");
  const openapi = await readFile(openapiPath, "utf8");

  return {
    props: {
      openapi,
    },
  };
}
