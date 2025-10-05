import {
  reactExtension,
  Banner,
  BlockStack,
  useApi,
  useInstructions,
  useTranslate,
  useSettings,
  Icon,
  InlineStack,
  Pressable,
  Text,
  useCartLines
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
  const { product_variant_1, product_variant_2, product_variant_3, product_count } =
    useSettings();

  const variantIdArr = useMemo(() => {
    return [product_variant_1, product_variant_2, product_variant_3].filter(
      Boolean
    ) as string[]; // Filter out undefined values
  }, [product_variant_1, product_variant_2, product_variant_3]);

  const cartLines = useCartLines();
  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

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
    setCurrentVariant(variants[0]?.data.node.id);
  };

  const handlePrev = () => {
    if (!currentVariant || isTransitioning) return;
    const currentIndex = productVariants.findIndex((variant) => variant.data.node.id === currentVariant);
    if (currentIndex > 0) {
      setIsTransitioning(true);
      // Brief delay for smooth transition
      setTimeout(() => {
        setCurrentVariant(productVariants[currentIndex - 1].data.node.id);
        setTimeout(() => setIsTransitioning(false), 150);
      }, 100);
    }
  };
  
  const handleNext = () => {
    if (!currentVariant || isTransitioning) return;
    const currentIndex = productVariants.findIndex((variant) => variant.data.node.id === currentVariant);
    if (currentIndex < productVariants.length - 1) {
      setIsTransitioning(true);
      // Brief delay for smooth transition
      setTimeout(() => {
        setCurrentVariant(productVariants[currentIndex + 1].data.node.id);
        setTimeout(() => setIsTransitioning(false), 150);
      }, 100);
    }
  };

  const handleDotClick = (variantId: string) => {
    if (variantId === currentVariant || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVariant(variantId);
      setTimeout(() => setIsTransitioning(false), 150);
    }, 100);
  };

  /**
   * Get products currently in cart from the provided productVariants
   * Used for radio button behavior to remove other selections
   */
  const cartProductsFromVariants = productVariants
    ?.map((variant) =>
      cartLines.find((line) => line.merchandise.id === variant.data.node.id)
    )
    .filter(Boolean) || [];
    
  /** Variants not currently in cart */
  const notInCartVariants = productVariants.filter(variant =>
    !cartLines.some(line => line.merchandise.id === variant.data.node.id)
  );

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
      <Text size="large">
        {translate("youMightAlsoLike")}
      </Text>
      {productVariants.length > 0 &&
        productVariants.map((variant) => (
          <ProductCard
            productCount={`${product_count || "1"}`}
            cartProductsFromVariants={cartProductsFromVariants}
            notInCartVariants={notInCartVariants}
            key={variant.data.node.id}
            node={variant.data.node}
            productVariants={productVariants}
            currentVariant={currentVariant}
            setCurrentVariant={setCurrentVariant}
            loading={loading}
            setLoading={setLoading}
            isTransitioning={isTransitioning}
          />
        ))}

      {/* Carousel Navigation */}
      { productVariants.length > 1 &&
      <BlockStack spacing="base">
        {/* Navigation Arrows */}
        <InlineStack
          spacing="base"
          inlineAlignment="start"
        >
          <Pressable
            disabled={currentVariant === productVariants[0]?.data.node.id}
            onPress={handlePrev}
            background="subdued"
            padding="tight"
            cornerRadius="base"
          >
            <Icon source="arrowLeft" />
          </Pressable>
          
          {/* Carousel Dots */}
          <InlineStack
          padding={"tight"}
          spacing="tight" inlineAlignment="center">
            {productVariants.map((variant, index) => {
              const isActive = currentVariant === variant.data.node.id;
              return (
                <Pressable
                  key={variant.data.node.id}
                  onPress={() => handleDotClick(variant.data.node.id)}
                  disabled={isTransitioning}
                  background={isActive ? "transparent" : "subdued"}
                  border="base"
                  borderWidth={isActive ? "medium" : "base"}
                  cornerRadius="fullyRounded"
                  padding="extraTight"
                  minInlineSize={isActive ? 15 : 12}
                  minBlockSize={isActive ? 15 : 12}
                  accessibilityLabel={`Go to product ${index + 1}: ${variant.data.node.product.title}`}
                >
                  {/* Empty pressable acts as dot */}
                </Pressable>
              );
            })}
          </InlineStack>

          <Pressable
            disabled={currentVariant === productVariants[productVariants.length - 1]?.data.node.id}
            onPress={handleNext}
            background="subdued"
            padding="tight"
            cornerRadius="base"
          >
            <Icon source="arrowRight" />
          </Pressable>
        </InlineStack>
      </BlockStack>
      }
    </BlockStack>
  );
}
