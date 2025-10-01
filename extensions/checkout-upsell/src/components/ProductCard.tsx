import {
  InlineLayout,
  Pressable,
  Text,
  Image,
  BlockStack,
  useCartLines,
  useApplyCartLinesChange,
  Checkbox,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useEffect, useState } from "react";

/**
 * Represents a product variant node with essential product information
 */
interface ProductVariantNode {
  id: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  product: {
    id: string;
    title: string;
    featuredImage: {
      url: string;
    };
  };
}

/**
 * Represents a product variant data structure from GraphQL response
 */
interface ProductVariantData {
  data: {
    node: ProductVariantNode;
  };
}

/**
 * Props for the ProductCard component
 */
interface ProductCardProps {
  /** The product variant node containing product information */
  node: ProductVariantNode;
  /** Selection type - 'radio' for single selection, 'checkbox' for multiple selection */
  type?: 'radio' | 'checkbox';
  /** Array of all product variants for managing radio button behavior */
  productVariants?: ProductVariantData[];
  /** Loading state indicator */
  loading?: boolean;
  /** Function to update loading state */
  setLoading?: (loading: boolean) => void;
}

/**
 * ProductCard component for displaying and managing product variants in checkout
 * Supports both radio (single selection) and checkbox (multiple selection) modes
 * 
 * @param props - Component props
 * @param props.node - Product variant data
 * @param props.type - Selection type ('radio' or 'checkbox')
 * @param props.productVariants - All available product variants
 * @param props.loading - Loading state
 * @param props.setLoading - Function to update loading state
 */
export default function ProductCard({
  node,
  type,
  productVariants,
  loading,
  setLoading,
}: ProductCardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();
  
  /** Find if current product is already in cart */
  const currentCartLine = cartLines.find((line) => line.merchandise.id === node.id);

  /**
   * Get products currently in cart from the provided productVariants
   * Used for radio button behavior to remove other selections
   */
  const cartProductsFromVariants = productVariants
    ?.map((variant) =>
      cartLines.find((line) => line.merchandise.id === variant.data.node.id)
    )
    .filter(Boolean) || [];

  /**
   * Initialize checkbox state based on cart contents
   */
  useEffect(() => {
    setIsChecked(!!currentCartLine);
  }, [currentCartLine]);

  /**
   * Remove other selected products for radio button behavior
   */
  const removeOtherCartItems = useCallback(async () => {
    if (type !== 'radio' || !cartProductsFromVariants.length) return;
    
    const removePromises = cartProductsFromVariants.map((product) =>
      applyCartLinesChange({
        type: "removeCartLine",
        id: product.id,
        quantity: 1,
      })
    );
    
    await Promise.all(removePromises);
  }, [type, cartProductsFromVariants, applyCartLinesChange]);

  /**
   * Add product to cart
   */
  const addToCart = useCallback(async () => {
    await applyCartLinesChange({
      type: "addCartLine",
      merchandiseId: node.id,
      quantity: 1,
    });
  }, [applyCartLinesChange, node.id]);

  /**
   * Remove product from cart
   */
  const removeFromCart = useCallback(async () => {
    if (!currentCartLine) return;
    
    await applyCartLinesChange({
      type: "removeCartLine",
      id: currentCartLine.id,
      quantity: 1,
    });
  }, [applyCartLinesChange, currentCartLine]);

  /**
   * Handle product selection/deselection
   * Manages cart operations based on selection type and current state
   */
  const handlePress = useCallback(async () => {
    if (loading) return;

    const willBeChecked = !isChecked;
    setIsChecked(willBeChecked);

    try {
      setLoading?.(true);

      if (willBeChecked) {
        // Adding to cart
        await removeOtherCartItems();
        await addToCart();
      } else {
        // Removing from cart
        await removeFromCart();
      }
    } catch (error) {
      // Revert state on error
      setIsChecked(!willBeChecked);
      console.error('Cart operation failed:', error);
    } finally {
      setLoading?.(false);
    }
  }, [isChecked, loading, setLoading, removeOtherCartItems, addToCart, removeFromCart]);

  return (
    <Pressable
      disabled={loading}
      onPress={handlePress}
      background={isChecked ? "base" : "subdued"}
      border="base"
      borderWidth={isChecked ? "medium" : "base"}
      cornerRadius="base"
      padding="base"
      accessibilityRole="button"
      accessibilityLabel={`${isChecked ? 'Remove' : 'Add'} ${node.product.title} ${type === 'radio' ? 'selection' : 'to cart'}`}
    >
      <InlineLayout
        blockAlignment="center"
        columns={[80, "fill", 40]}
        spacing="base"
      >
        <Image
          borderRadius="base"
          border="base"
          borderWidth="base"
          source={node.product.featuredImage.url}
          accessibilityDescription={`${node.product.title} product image`}
        />
        <BlockStack spacing="tight">
          <Text emphasis={isChecked ? "bold" : undefined}>
            {node.product.title}
          </Text>
          <Text appearance="subdued">
            {`${node.price.amount} ${node.price.currencyCode}`}
          </Text>
        </BlockStack>
        <Checkbox 
          checked={isChecked}
          accessibilityLabel={`${type === 'radio' ? 'Select' : 'Add to cart'}: ${node.product.title}`}
        />
      </InlineLayout>
    </Pressable>
  );
}
