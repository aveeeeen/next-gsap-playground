"use client";

import { CSSProperties, useState } from "react";
import { TagSelector } from "../../../ui/components/TagSelector";
import {
  Product,
  ProductDetail,
  products as productList,
  productDetails as productDetailList,
} from "../../../mockDB";
import { VerticalYearSelector } from "../../../ui/components/VerticalYearSelector";
import { Card } from "../../../ui/atoms/components/Card";
import { Drawer } from "../../../ui/components/Drawer";

export const LayoutGrid = () => {
  const products: Product[] = productList;
  const productDetails: ProductDetail[] = productDetailList;
  const productYears = Array.from(new Set(products.map((p) => p.year))).sort();
  const productTags = Array.from(new Set(products.flatMap((p) => p.tags)));

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(undefined);
  };

  const getProductDetails = (productId: number) => {
    return productDetails.filter((detail) => detail.productId === productId);
  };

  const styles: { [key: string]: CSSProperties } = {
    bodyInner: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      flexBasis: "50%",
      borderTop: "2px solid black",
      borderBottom: "2px solid black",
    },
    innerLeft: {
      display: "flex",
      flexDirection: "column",
      borderRight: "2px solid black",
    },
    innerRight: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    innerContent: {
      width: "100%",
      height: "fit-content",
      overflow: "clip",
      borderBottom: "2px solid black",
    },
  };

  return (
    <>
      <div style={styles.bodyInner}>
        <div style={styles.innerLeft}>
          <div style={styles.innerContent}>
            <TagSelector
              tags={productTags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
            ></TagSelector>
          </div>
          <div style={styles.innerContent}>
            <VerticalYearSelector years={productYears}></VerticalYearSelector>
          </div>
        </div>

        <div style={styles.innerRight}>
          {products
            .filter((product) => {
              const productTags = product.tags;
              if (selectedTags.length === 0) return true;
              return selectedTags.every((tag) => productTags.includes(tag));
            })
            .map((product) => (
              <Card
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
              />
            ))}
        </div>

        <Drawer
          isOpen={isDrawerOpen}
          product={selectedProduct}
          productDetails={
            selectedProduct ? getProductDetails(selectedProduct.id) : []
          }
          onClose={handleCloseDrawer}
        />
      </div>
    </>
  );
};
