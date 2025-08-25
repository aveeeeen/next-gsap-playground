"use client";

import { CSSProperties, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { utils } from "../../utils/utils";

gsap.registerPlugin(useGSAP);

export const SimpleClick = () => {
  const container = useRef(null);
  const { contextSafe } = useGSAP({ scope: container });

  const defaultWidth = "100px";

  const onMouseEnter = contextSafe(({ target }) => {
    gsap.to(target, {
      width: "240px",
    });
  });

  const onMouseLeave = contextSafe(({ target }) => {
    gsap.to(target, {
      width: defaultWidth,
    });
  });

  const buttonStyle: CSSProperties = {
    width: defaultWidth,
    height: "100px",
    borderRadius: "20px",
    background: "#017bff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  };

  return (
    <div ref={container}>
      <div
        style={buttonStyle}
        onMouseOver={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {" "}
        This Expands
      </div>
    </div>
  );
};

type BitMapShapesProps = {
  w: number,
  h: number,
  bit?: number,
}

export const BitMapShapes = ({w, h, bit}: BitMapShapesProps) => {
  const outerRectRef = useRef<HTMLDivElement>(null);
  const innerRectRef = useRef<HTMLDivElement>(null);
  const outerRectContext = useGSAP({scope: outerRectRef});

  const positionMatrix = [
    { x: 1, y: 0 },
    { x: 1, y: 1},
    { x: 0, y: 1},
    { x: 0, y: 0},
    { x: -1, y: 0},
    { x: -1, y: -1},
    { x: 0, y: -1},
  ];

  const sizes = [0.5, 0.25, 1, 2, 1.5];

  const ratios = [
    {w: 1, h: 1},
    {w: 1, h: 2},
    {w: 2, h: 1}
  ]

  const initialPosition = positionMatrix[3];
  const initialSize = 0.5;

  const styles: { [key: string]: CSSProperties } = {
    outerRect: {
      width: `${w}px`,
      height: `${h}px`,
      overflow: 'visible'
    },

    innerRect: {
      position: 'relative',
      width: `${w * initialSize}px`,
      height: `${h * initialSize}px`,
      top: `${initialPosition.y * h * initialSize}px`,
      left: `${initialPosition.x * w * initialSize}px`,
      transformOrigin: 'top left',
      borderRadius: '0%',
      background: '#fff'
    }
  };

  const onMouseEnter = outerRectContext.contextSafe(() => {
    const pos = utils().choose(positionMatrix);
    const size = utils().choose(sizes);
    const ratio = utils().choose(ratios);
    gsap.fromTo(innerRectRef.current, 
      {
        top: `${pos.y * h * initialSize}px`,
        left: `${pos.x * w * initialSize}px`,
        width: `${w * size * ratio.w}px`,
        height: `${h * size * ratio.h}px`,
      },
      {
        width: `${w * initialSize}px`,
        height: `${h * initialSize}px`,
        top: `${initialPosition.y * h * initialSize}px`,
        left: `${initialPosition.x * w * initialSize}px`,
        ease: 'power2.inOut',
      }
    );
  });

  return (
    <div style={styles.outerRect} ref={outerRectRef} onMouseOver={() => {bit ? onMouseEnter() : null}}>
      {
        bit === 1 
        ? <div style={styles.innerRect} ref={innerRectRef}></div>
        : null
      }
    </div>
  );
};

type RandomShapesProps = {
  w: number,
  h: number,
}

export const RandomShapes = ({w, h}: RandomShapesProps) => {
  const outerRectRef = useRef<HTMLDivElement>(null);
  const innerRectRef = useRef<HTMLDivElement>(null);
  const outerRectContext = useGSAP({scope: outerRectRef});

  const positionMatrix = [
    { x: 1, y: 0 },
    { x: 1, y: 1},
    { x: 0, y: 1},
    { x: 0, y: 0}
  ];

  const sizes = [0.5, 0.25, 2, 1.5, 2.5, 3 , 4];

  const choose = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const initialPosition = choose(positionMatrix);
  const initialSize = choose(sizes);

  const styles: { [key: string]: CSSProperties } = {
    outerRect: {
      width: `${w}px`,
      height: `${h}px`,
      overflow: 'hidden'
    },

    innerRect: {
      position: 'relative',
      width: `${w * initialSize}px`,
      height: `${h * initialSize}px`,
      top: `${initialPosition.y * h * initialSize}px`,
      left: `${initialPosition.x * w * initialSize}px`,
      transformOrigin: 'top left',
      borderRadius: '0%',
      background: '#fff'
    }
  };

  const onMouseEnter = outerRectContext.contextSafe(() => {
    const pos = choose(positionMatrix);
    const size = choose(sizes);
    gsap.to(innerRectRef.current, 
      {
        width: `${w * size}px`,
        height: `${h * size}px`,
        left: `${pos.x * w * size}px`,
        top: `${pos.y * h * size}px`
      },
    );
  });

  return (
    <div style={styles.outerRect} ref={outerRectRef} onMouseOver={onMouseEnter}>
      <div style={styles.innerRect} ref={innerRectRef}></div>
    </div>
  );
};

type ShapeContainer = {
  w: number,
  h: number,
  subdiv: number, 
  bitmap?: number[],
}

export const ShapesContainer = ({w, h, subdiv, bitmap}: ShapeContainer) => {
  const wSubdiv = subdiv;
  const columnWidth = w / wSubdiv;
  const hSubdiv = bitmap ? bitmap.length / wSubdiv : h / columnWidth;
  console.log('hSubdiv', hSubdiv);
  const rowHeight = h / hSubdiv;
  const containerStyle:CSSProperties = {
    width: `${w}px`,
    height: `${h}px`,
    display: 'grid',
    gridTemplateColumns: `repeat(${wSubdiv}, ${columnWidth}px)`,
    background: '#017bff',
    overflow: 'clip'
  }

  return (
    <div style={containerStyle}>
      {
        bitmap ? 
        bitmap.map((bit, index) => (
          <BitMapShapes key={index} w={columnWidth} h={rowHeight} bit={bit}></BitMapShapes>
        )) :
        Array.from({length: wSubdiv * hSubdiv}, (_, index) => (
          <RandomShapes key={index} w={columnWidth} h={rowHeight}></RandomShapes>
        ))
      }
    </div>
  )
}
