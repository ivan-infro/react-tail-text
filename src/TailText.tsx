import React, { MouseEventHandler, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import memoize from "lodash.memoize";
import cn from "classnames";

import addToObserver, { updateCurrentState } from "./observer";
import {
  fulltextClassName,
  fulltextSelectListenerClassName,
  tailClassName,
  wrapperClassName,
  wrapperTailedClassName,
} from "./constants";
import { InvisibleTail } from "./InvisibleTail";

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

  /**
   * Выделяет строку целиком, если выделена ее часть
   */
  highlightOnSelection?: boolean;
};

const selectFulltext: MouseEventHandler<HTMLDivElement> = (event) => {
  if (typeof window === "undefined") return;
  window.getSelection()?.selectAllChildren(event.currentTarget);
};

const getTail = memoize(
  (fulltext: number | string, tailLength: number) => {
    const str = fulltext.toString();
    if (tailLength > str.length) {
      console.warn("tailLength не может быть больше длины исходной строки!");
    }
    return str.substring(str.length - tailLength);
  },
  (fulltext, tailLength) => `${tailLength}_${fulltext}`
);

const StyledTailText = styled(TailText)`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;

  &.${wrapperTailedClassName}::after {
    content: "${(props) => getTail(props.children, props.tailLength)}";
  }
`;

const Fulltext = styled.div`
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  vertical-align: top;

  &.react-tail-text__fulltext_selected {
    background: yellow;
  }
`;

function TailText(props: TailTextPros) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const tail = getTail(props.children, props.tailLength);

  useEffect(() => {
    if (!wrapperRef.current) {
      console.warn("wrapperRef.current is null!");
      return;
    }
    return addToObserver(wrapperRef.current);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!wrapperRef.current) {
        console.warn("wrapperRef.current is null!");
        return;
      }

      updateCurrentState(wrapperRef.current);
    }, 0);
  }, [props.children, props.className, props.tailLength]);

  const className = useMemo(
    () => [wrapperClassName, props.className].join(" "),
    [props.className]
  );

  return (
    <>
      <div
        className={className}
        title={props.title}
        ref={wrapperRef}
        onDoubleClick={selectFulltext}
      >
        <InvisibleTail className={tailClassName}>{tail}</InvisibleTail>
        <Fulltext
          className={cn(fulltextClassName, {
            [fulltextSelectListenerClassName]: props.highlightOnSelection,
          })}
        >
          {props.children}
        </Fulltext>
      </div>
    </>
  );
}

export default StyledTailText;
