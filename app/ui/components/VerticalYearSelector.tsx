"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// --- Propsの型定義 ---
interface VerticalYearSelectorProps {
  years: (string | number)[];
  initialYear?: string | number;
}

// --- スタイル定義 ---
const styles: { [key: string]: React.CSSProperties } = {
  selectorContainer: {
    position: "relative",
    width: "300px", // 固定幅
    height: "300px", // 固定高
    borderRadius: "50%",
    translate: "-60% 0%",
    overflow: "hidden",
    background: "radial-gradient(#017bff 20%, transparent 70%)",
    // 変更点: flexboxによる中央揃えは不要になるため削除
  },
  selectorItem: {
    position: "absolute",
    top: "50%",
    // 変更点: leftの基準を50%から具体的なピクセル値に変更
    left: "60%",
    padding: "10px 0", // 上下の余白のみに
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
    userSelect: "none",
    opacity: 0,
    // transform-originを左に設定すると、スケール変更が左基点になる
    transformOrigin: "left center",
  },
};

// --- アニメーションプロパティ計算関数 ---
const getAnimationProperties = (offset: number) => {
  let scale = 0;
  let opacity = 0;
  // 変更点: xPercentを0に。これによりtranslate(-50%, -50%)の中央揃え調整がなくなる
  const xPercent = 0;
  let yPercent = -50;
  let y = 0;

  if (Math.abs(offset) <= 2) {
    scale = 1 - Math.abs(offset) * 0.3;
    opacity = 1 - Math.abs(offset) * 0.3;
    y = offset * -40; // 高さが変わったのでyの移動量を微調整
  }

  return { scale, opacity, y, xPercent, yPercent };
};

// --- コンポーネント本体 ---
const VerticalYearSelector: React.FC<VerticalYearSelectorProps> = ({
  years,
  initialYear,
}) => {
  // ... (useStateやuseRef、各種ハンドラは変更なし) ...
  const findInitialIndex = () => {
    if (initialYear) {
      const index = years.indexOf(initialYear);
      return index !== -1 ? index : Math.floor(years.length / 2);
    }
    return Math.floor(years.length / 2);
  };

  const [selectedIndex, setSelectedIndex] = useState<number>(findInitialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(() => {
      const items = gsap.utils.toArray(".selector-item");

      items.forEach((item, index) => {
        const offset = index - selectedIndex;
        const props = getAnimationProperties(offset);

        gsap.to(item as HTMLElement, {
          ...props,
          duration: 0.5,
          ease: "power2.out",
          zIndex: 50 - Math.abs(offset),
        });
      });
  },{ scope: containerRef, dependencies: [selectedIndex] });

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleHoverItem = contextSafe(
    (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
      if (index === selectedIndex) return;
      const offset = index - selectedIndex;
      const { scale } = getAnimationProperties(offset);

      gsap.to(e.currentTarget, {
        scale: scale + 0.1,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  );

  const handleHoverExitItem = contextSafe(
    (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
      if (index === selectedIndex) return;
      const offset = index - selectedIndex;
      const { scale } = getAnimationProperties(offset);

      gsap.to(e.currentTarget, {
        scale: scale,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  );

  const handleHoverContainer = contextSafe(() => {
    gsap.to(containerRef.current, {
      scale: 1.5,
      duration: 0.5,
      ease: 'power2.out'
    })
  })

  const hadleHoverExitContainer = contextSafe(() => {
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  })

  return (
    <div  
      style={styles.selectorContainer}
      ref={containerRef}
      onMouseEnter={handleHoverContainer}
      onMouseLeave={hadleHoverExitContainer}
    >
      {years.map((year, index) => (
        // アイテムをspanに変更
        <span
          key={year}
          className="selector-item"
          style={styles.selectorItem}
          onClick={() => handleSelect(index)}
          onMouseEnter={(e) => handleHoverItem(e, index)}
          onMouseLeave={(e) => handleHoverExitItem(e, index)}
        >
          {year}
        </span>
      ))}
      <span className="selector-item" style={styles.selectorItem}>
        ...
      </span>
    </div>
  );
};

export default VerticalYearSelector;
