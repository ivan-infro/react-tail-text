import React, { memo, useEffect, useRef, useMemo } from "react";
import addToObserver from "./observer";

type TailTextPros = {
  /**
   * Текст, который необходимо вписать по ширине
   */
  children: string | number;

  /**
   * Количество символов в конце строки, видимых всегда
   *
   * Должно быть не больше длины строки props.children
   */
  tailLength: number;

  /**
   * Подсказка, отображающася при наведении
   */
  title?: string;

  /**
   * Дополнительный className для элемента-обертки
   */
  className?: string;
};

const wrapperStyle: React.CSSProperties = {
  width: "100%",
  whiteSpace: "nowrap",
};

const fulltextStyle: React.CSSProperties = {
  display: "inline-block",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const tailStyle: React.CSSProperties = {
  display: "inline-block",
  width: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const fulltextClassName = "react-tail-text__fulltext";
const tailClassName = "react-tail-text__tail";

const TailText = (props: TailTextPros) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const tail = useMemo(() => {
    const fulltextString = props.children.toString();

    if (props.tailLength > fulltextString.length) {
      console.warn("tailLength не может быть больше длины исходной строки!");
    }

    return fulltextString.substr(
      fulltextString.length - props.tailLength,
      props.tailLength
    );
  }, [props.tailLength, props.children]);

  useEffect(() => {
    if (!wrapperRef.current) {
      console.warn("wrapperRef is null");
      return;
    }

    const fulltextElement = wrapperRef.current.querySelector<HTMLDivElement>(
      `.${fulltextClassName}`
    );
    const tailElement = wrapperRef.current.querySelector<HTMLDivElement>(
      `.${tailClassName}`
    );
    if (!fulltextElement || !tailElement) {
      console.error("fulltextElement или tailElement не найдены");
      return;
    }
    const fulltextWidth = fulltextElement.scrollWidth;
    const tailWidth = tailElement.scrollWidth;

    return addToObserver(
      wrapperRef.current,
      fulltextElement,
      fulltextWidth,
      tailElement,
      tailWidth
    );
  }, [props.tailLength, props.children, props.className, wrapperRef.current]);

  const className = useMemo(
    () => "react-tail-text " + (props.className || ""),
    [props.className]
  );

  return (
    <div
      title={props.title}
      ref={wrapperRef}
      className={className}
      style={wrapperStyle}
    >
      <div className={fulltextClassName} style={fulltextStyle}>
        {props.children}
      </div>
      <div className={tailClassName} style={tailStyle}>
        {tail}
      </div>
    </div>
  );
};

export default memo(TailText);
