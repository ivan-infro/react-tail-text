import React, { memo, useEffect, useCallback, useRef, useMemo } from "react";
import addToObserver from "./observer";
import { fulltextStyle, startStyle, tailStyle, wrapperStyle } from "./styles";

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

const fulltextClassName = "react-tail-text__fulltext";
const startClassName = "react-tail-text__start";
const tailClassName = "react-tail-text__tail";

const TailText = (props: TailTextPros) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectFulltext = useCallback(() => {
    if (!wrapperRef.current || typeof window === "undefined") return;
    window.getSelection()?.selectAllChildren(wrapperRef.current);
  }, [wrapperRef.current]);

  const [start, tail] = useMemo(() => {
    const fulltextString = props.children.toString();

    if (props.tailLength > fulltextString.length) {
      console.warn("tailLength не может быть больше длины исходной строки!");
    }

    return [
      fulltextString.substr(0, fulltextString.length - props.tailLength),

      fulltextString.substr(
        fulltextString.length - props.tailLength,
        props.tailLength
      ),
    ];
  }, [props.tailLength, props.children]);

  useEffect(() => {
    if (!wrapperRef.current) {
      console.warn("wrapperRef is null");
      return;
    }

    const fulltextElement = wrapperRef.current.querySelector<HTMLDivElement>(
      `.${fulltextClassName}`
    );

    const startElement = wrapperRef.current.querySelector<HTMLDivElement>(
      `.${startClassName}`
    );

    const tailElement = wrapperRef.current.querySelector<HTMLDivElement>(
      `.${tailClassName}`
    );
    if (!fulltextElement || !tailElement || !startElement) {
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
      tailWidth,
      startElement
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
      onDoubleClick={selectFulltext}
    >
      <div className={fulltextClassName} style={fulltextStyle}>
        {props.children}
      </div>
      <div className={startClassName} style={startStyle}>
        {start}
      </div>
      <div className={tailClassName} style={tailStyle}>
        {tail}
      </div>
    </div>
  );
};

export default memo(TailText);
