import { staticRequest } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout";
import { useTina } from "tinacms/dist/edit-state";
import { Fragment } from "react";
const query = `{
  getPageDocument(relativePath: "home.mdx"){id
  	data{
      blocks{
       __typename
        ... on PageBlocksHero{
          heading
          subheading
          description
        }
        ... on PageBlocksProjects{
          heading,
          subheading,
          items{
            image
            name
            description
            href
          }
        }
      }
    }
  }
}`;

export default function Home(props) {
  const { data } = useTina({
    query,
    variables: {},
    data: props.data,
  });

  return (
    <Layout>
      {data && data.getPageDocument.data.blocks
        ? data.getPageDocument.data.blocks.map(function (block, i) {
            switch (block.__typename) {
              case "PageBlocksHero":
                return (
                  <Fragment key={i + block.__typename}>
                    <div>{block.heading}</div>
                    <div>{block.subheading}</div>
                    <div>{block.description}</div>
                  </Fragment>
                );
              case "PageBlocksProjects":
                return (
                  <Fragment key={i + block.__typename}>
                    <div>{block.heading}</div>
                    <div>{block.subheading}</div>
                    {block.items?.map((item) => {
                      return (
                        <Fragment key={item.name}>
                          <div>{item.image}</div>
                          <div>{item.name}</div>
                          <div>{item.description}</div>
                          <div>{item.href}</div>
                        </Fragment>
                      );
                    })}
                  </Fragment>
                );
            }
          })
        : null}
    </Layout>
  );
}

export const getStaticProps = async () => {
  const variables = {};
  let data = {};
  try {
    data = await staticRequest({
      query,
      variables,
    });
  } catch {
    // swallow errors related to document creation
  }

  return {
    props: {
      data,
    },
  };
};
