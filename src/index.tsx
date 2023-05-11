import {
  useEffect,
  type CSSProperties,
  type ReactNode,
  useState,
  useRef,
} from "react";

interface ScreenScaleProps {
  children?: ReactNode;
  autoScale?: boolean;
  fullScreen?: boolean;
  width: number | string;
  height: number | string;
  delay?: number;
  bkStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  classname?: string;
}

function debounce(fn: () => void, delay = 1000, immediate = false) {
  let timer: number | null = null;
  function debounceImpl(...args: any[]) {
    if (immediate) {
      fn.apply(null, args as any);
      immediate = false;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(null, args as any);
      clearTimeout(timer!);
    }, delay);
  }

  return debounceImpl;
}
const styles: Record<"bkStyle" | "contentStyle", CSSProperties> = {
  bkStyle: {
    overflow: "hidden",
    backgroundSize: `100% 100%`,
    backgroundColor: `#000`, //黑色
    width: `100vw`,
    height: `100vh`,
  },
  contentStyle: {
    transitionProperty: `all`,
    transitionTimingFunction: `cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDuration: `500ms`,
    position: `relative`,
    overflow: `hidden`,
    zIndex: 2,
    transformOrigin: `left top`,
  },
};
const ScreenScale: React.FC<ScreenScaleProps> = (props) => {
  const {
    delay,
    contentStyle,
    bkStyle,
    classname,
    width,
    height,
    fullScreen = false,
    autoScale = true,
  } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    width,
    height,
    originalHeight: 0,
    originalWidth: 0,
  });
  function initSize() {
    setSize({
      ...size,
      originalWidth: window.screen.width,
      originalHeight: window.screen.height,
    });
  }
  function updateSize() {
    contentRef.current!.style.width = `${size.width}px`;
    contentRef.current!.style.height = `${size.height}px`;
  }

  function handleAutoScale(scale: number) {
    if (!autoScale) return;
    const domWidth = contentRef.current!.clientWidth;
    const domHeight = contentRef.current!.clientHeight;
    const currentWidth = document.body.clientWidth;
    const currentHeight = document.body.clientHeight;
    contentRef.current!.style.transform = `scale(${scale},${scale})`;
    let mx = Math.max((currentWidth - domWidth * scale) / 2, 0);
    let my = Math.max((currentHeight - domHeight * scale) / 2, 0);
    contentRef.current!.style.margin = `${my}px ${mx}px`;
  }
  function updateScale() {
    // 获取真实视口尺寸
    const currentWidth = document.body.clientWidth;
    const currentHeight = document.body.clientHeight;
    // 获取大屏最终的宽高
    const realWidth = size.width || size.originalWidth;
    const realHeight = size.height || size.originalHeight;
    // 计算缩放比例
    const widthScale = currentWidth / +realWidth;
    const heightScale = currentHeight / +realHeight;
    // 若要铺满全屏，则按照各自比例缩放
    if (fullScreen) {
      contentRef.current!.style.transform = `scale(${widthScale},${heightScale})`;
      return false;
    }
    // 按照宽高最小比例进行缩放
    const scale = Math.min(widthScale, heightScale);
    handleAutoScale(scale);
  }
  const onResize = debounce(async () => {
    if (!contentRef.current) return;
    initSize();
    updateSize();
    updateScale();
  }, delay);
  function init() {
    document.body.style.overflow = "hidden";
    initSize();
    updateSize();
    updateScale();
    window.addEventListener("resize", onResize);
  }
  useEffect(() => {
    init();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ ...bkStyle, ...styles.bkStyle }} className={classname}>
      <div ref={contentRef} style={{ ...contentStyle, ...styles.contentStyle }}>
        {props.children}
      </div>
    </div>
  );
};

export default ScreenScale;
