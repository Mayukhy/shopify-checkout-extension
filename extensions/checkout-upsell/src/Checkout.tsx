import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.cart-line-list.render-after", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension, query } = useApi();
  const instructions = useInstructions();

  const variantIdArr = [
    "gid://shopify/ProductVariant/40954715537443",
    "gid://shopify/ProductVariant/40954713899043",
    "gid://shopify/ProductVariant/40954714259491",
  ];
  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getProductVariantsData();
  }, []);

  //graphql query to get the product data of the variant ids
  const getProductVariantsData = async() => {
    const variants = [];
    for (let i = 0; i < variantIdArr.length; i++) {
      const result = await query(`{
          node(id: "${variantIdArr[i]}") {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                featuredImage {
                  url
                }
              }
            }
          }
        }`
      );
      variants.push(result);
    }
    setProductVariants(variants);
  };


  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="checkout-upsell" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack>
      {
        productVariants.map(variant => (
          <ProductCard
          type="radio"
          key={variant.data.node.id}
          node={variant.data.node}
          productVariants={productVariants}
          loading={loading}
          setLoading={setLoading}
          />
        ))
      }
    </BlockStack>
  );
}