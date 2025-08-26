"use client";

import { useEffect, useRef } from "react";
import { utils } from "../../utils/utils";

type HorizontalLineInput = {
  y: number;
  ctx: CanvasRenderingContext2D;
}

type OuterRectInput = {
  x: number;
  y: number;
  w: number;
  h: number;
  ctx: CanvasRenderingContext2D;
};

interface OuterRect {
  draw(): void;
  collidesPoint(inputX: number, inputY: number): boolean;
  collidesLine(x1: number, y1: number, x2: number, y2: number): boolean;
  getNextAnimationState(): AnimationState;
  animate(duration: number): void;
  animationState: AnimationConfig;
}

type AnimationConfig = {
  duration: number;
  startTime: number | null;
  fromState: AnimationState | null;
  toState: AnimationState | null;
  isAnimating: boolean;
};

type Pos = {
  x: number;
  y: number;
};

type Ratio = {
  w: number;
  h: number;
};

type AnimationState = {
  pos: Pos;
  size: number;
  ratio: Ratio;
};

export const RandomShapeCanvas = ({ w, h, subdivs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<Pos>({ x: -1, y: -1 });

  let outerRects: OuterRect[] = [];
  let line = null;

  const getMousePos = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const horizontalLine = ({y, ctx}: HorizontalLineInput) => {
    let currentState = {
      y: y
    }

    const draw = () => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, currentState.y);
      ctx.lineTo(w, currentState.y);
      ctx.strokeStyle = "#ffffff"
      ctx.stroke();
      ctx.restore();
    }

    const updateCurrentState = () => {
      if (currentState.y > h) currentState.y = 0;
      currentState.y += 2;
    }

    return {
      draw,
      updateCurrentState,
      currentState
    }
  }

  const outerRect = ({ x, y, w, h, ctx }: OuterRectInput): OuterRect => {
    const positionMatrix: Pos[] = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ];

    const sizes: number[] = [0.5, 0.25, 1];

    const ratios: Ratio[] = [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 1 },
    ];

    const getNextAnimationState = () => {
      const pos = utils().choose(positionMatrix);
      const size = utils().choose(sizes);
      const ratio = utils().choose(ratios);
      return {
        pos,
        size,
        ratio,
      };
    };

    let animationState: AnimationConfig = {
      duration: 250,
      startTime: null,
      fromState: null,
      toState: null,
      isAnimating: false,
    };

    // let currentState: AnimationState = {
    //   pos: { x:0, y:0 },
    //   size: 1,
    //   ratio: { w: 1, h: 1},
    // };

    let currentState: AnimationState = getNextAnimationState();

    const lerp = (start: number, end: number, t: number) => {
      return start * (1 - t) + end * t;
    };

    const lerpPos = (start: Pos, end: Pos, t: number): Pos => {
      return {
        x: lerp(start.x, end.x, t),
        y: lerp(start.y, end.y, t),
      };
    };

    const animate = (duration: number) => {
      animationState.duration = duration;
      animationState.fromState = currentState;
      animationState.toState = getNextAnimationState();
      animationState.startTime = performance.now();
      animationState.isAnimating = true;
    };

    const draw = () => {
      let stateToRender = currentState;

      if (animationState.isAnimating && animationState.fromState && animationState.toState) {
        const elapsed = performance.now() - animationState.startTime;
        const progress = Math.min(elapsed / animationState.duration, 1);

        stateToRender = {
          pos: lerpPos(
            animationState.fromState.pos,
            animationState.toState.pos,
            progress
          ),
          size: lerp(
            animationState.fromState.size,
            animationState.toState.size,
            progress
          ),
          ratio: {
            w: lerp(
              animationState.fromState.ratio.w,
              animationState.toState.ratio.w,
              progress
            ),
            h: lerp(
              animationState.fromState.ratio.h,
              animationState.toState.ratio.h,
              progress
            ),
          },
        };

        if (progress === 1) {
          animationState.isAnimating = false;
          currentState = animationState.toState;
        }
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      // ctx.clip();

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        x + stateToRender.pos.x * w * 0.5,
        y + stateToRender.pos.y * h * 0.5,
        w * stateToRender.size * stateToRender.ratio.w,
        h * stateToRender.size * stateToRender.ratio.h
      );

      ctx.restore();
    };

    const collidesPoint = (inputX: number, inputY: number): boolean => {
      if (inputX > x && inputX < x + w && inputY > y && inputY < y + h) {
        return true;
      }
      return false;
    };

    // Helper to check if a point is on line segment
    const onSegment = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => {
      return qx <= Math.max(px, rx) && qx >= Math.min(px, rx) &&
            qy <= Math.max(py, ry) && qy >= Math.min(py, ry);
    };

    // Helper to get orientation of three points
    const getOrientation = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => {
      const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
      if (val === 0) return 0;    // collinear
      return (val > 0) ? 1 : 2;   // clockwise or counterclockwise
    };

    // Line segment intersection check
    const doLinesIntersect = (x1: number, y1: number, x2: number, y2: number, 
                            x3: number, y3: number, x4: number, y4: number): boolean => {
      const o1 = getOrientation(x1, y1, x2, y2, x3, y3);
      const o2 = getOrientation(x1, y1, x2, y2, x4, y4);
      const o3 = getOrientation(x3, y3, x4, y4, x1, y1);
      const o4 = getOrientation(x3, y3, x4, y4, x2, y2);

      if (o1 !== o2 && o3 !== o4) return true;

      if (o1 === 0 && onSegment(x1, y1, x3, y3, x2, y2)) return true;
      if (o2 === 0 && onSegment(x1, y1, x4, y4, x2, y2)) return true;
      if (o3 === 0 && onSegment(x3, y3, x1, y1, x4, y4)) return true;
      if (o4 === 0 && onSegment(x3, y3, x2, y2, x4, y4)) return true;

      return false;
    };

    const collidesLine = (x1: number, y1: number, x2: number, y2: number): boolean => {
      // Check intersection with all four sides of the rectangle
      const topLine = doLinesIntersect(x1, y1, x2, y2, x, y, x + w, y);
      const rightLine = doLinesIntersect(x1, y1, x2, y2, x + w, y, x + w, y + h);
      const bottomLine = doLinesIntersect(x1, y1, x2, y2, x, y + h, x + w, y + h);
      const leftLine = doLinesIntersect(x1, y1, x2, y2, x, y, x, y + h);

      return topLine || rightLine || bottomLine || leftLine;
    };

    return {
      draw,
      collidesPoint,
      collidesLine,
      getNextAnimationState,
      animate,
      animationState
    };
  };

  const setupCanvas = () => {
    const canvas: HTMLCanvasElement = canvasRef.current;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#017bff";
    ctx.fillRect(0, 0, w, h);

    line = horizontalLine({y: 0, ctx: ctx});
  };

  const setupOuterRects = () => {
    const cols = subdivs;
    const colWidth = w / cols;
    const rows = h / colWidth;
    const rowHeight = h / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const relativeX = col * colWidth;
        const relativeY = row * rowHeight;
        const index = col + cols * row;
        if (index % 7 === 0 || index % 11 === 0 || index % 17 === 0 || index % 19 === 0){
          const outerRect_ = outerRect({
            x: relativeX,
            y: relativeY,
            w: colWidth,
            h: rowHeight,
            ctx: canvasRef.current.getContext("2d"),
          });
          outerRects.push(outerRect_);
        }
      }
    }
  };

  const drawCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#017bff";
    ctx.fillRect(0, 0, w, h);
    outerRects.forEach((outerRect_) => {
      outerRect_.draw();
      // if(outerRect_.collidesLine(0, line.currentState.y, w, line.currentState.y) && !outerRect_.animationState.isAnimating){
      //   outerRect_.animate();
      // }
    });
    // line.draw();
    // line.updateCurrentState();
    requestAnimationFrame(drawCanvas);
  };

  useEffect(() => {
    setupCanvas();
    setupOuterRects();
    drawCanvas();

    setInterval(() => {
      const indexes = [];
      for(let i = 0; i < outerRects.length / 4; i++){
        indexes.push(outerRects.indexOf(utils().choose(outerRects)));
      }
      for(let i = 0; i < outerRects.length / 4; i++){
        outerRects[indexes[i]].animate(1000);
      }
    }, 5000);

    const handleMouseMove = (event: MouseEvent) => {
      mousePosRef.current = getMousePos(event);
      outerRects.forEach((outerRect_) => {
        if (outerRect_.collidesPoint(mousePosRef.current.x, mousePosRef.current.y) && !outerRect_.animationState.isAnimating) {
          outerRect_.animate(250);
        }
      });
    };
    canvasRef.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvasRef.current.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};
