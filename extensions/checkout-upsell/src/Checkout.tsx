import {
  reactExtension,
  Banner,
  BlockStack,
  useApi,
  useInstructions,
  useTranslate,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";

// 1. Choose an extension target
export default reactExtension(
  "purchase.checkout.cart-line-list.render-after",
  () => <Extension />
);

function Extension() {
  const translate = useTranslate();
  const { extension, query } = useApi();
  const instructions = useInstructions();
  const { product_variant_1, product_variant_2, product_variant_3 } =
    useSettings();

  const variantIdArr = useMemo(() => {
    return [product_variant_1, product_variant_2, product_variant_3].filter(
      Boolean
    ) as string[]; // Filter out undefined values
  }, [product_variant_1, product_variant_2, product_variant_3]);

  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (variantIdArr.length > 0) {
      getProductVariantsData();
    }
  }, []);

  //graphql query to get the product data of the variant ids
  const getProductVariantsData = async () => {
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
        }`);
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
      {productVariants.length > 0 &&
        productVariants.map((variant) => (
          <ProductCard
            type="radio"
            key={variant.data.node.id}
            node={variant.data.node}
            productVariants={productVariants}
            loading={loading}
            setLoading={setLoading}
          />
        ))}
    </BlockStack>
  );
}
