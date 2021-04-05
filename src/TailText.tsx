import React, { MouseEventHandler, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import memoize from "lodash.memoize";
import addToObserver from "./observer";
import {
  fulltextClassName,
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
};

const selectFulltext: MouseEventHandler<HTMLDivElement> = (event) => {
  if (typeof window === "undefined") return;
  window.getSelection()?.selectAllChildren(event.currentTarget);
};

const getTail = memoize((fulltext: number | string, tailLength: number) => {
  const str = fulltext.toString();
  if (tailLength > str.length) {
    console.warn("tailLength не может быть больше длины исходной строки!");
  }
  return str.substring(str.length - tailLength);
});

const StyledTailText = styled(TailText)`
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    color: red;
  }

  &:focus-within {
    color: blue;
  }

  &:active {
    color: purple;
  }

  &.${wrapperTailedClassName}::after {
    content: "${(props) => getTail(props.children, props.tailLength)}";
  }
`;

type FulltextProps = {
  tailWidth?: number;
  className?: string;
  children: string | number;
};

const Fulltext = (props: FulltextProps) => {
  return <div {...props}>{props.children}</div>;
};

const StyledFulltext = styled(Fulltext)`
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

  const className = useMemo(
    () => [wrapperClassName, props.className].join(" "),
    [props.className]
  );

  return (
    <div
      className={className}
      title={props.title}
      ref={wrapperRef}
      onDoubleClick={selectFulltext}
    >
      <InvisibleTail className={tailClassName}>{tail}</InvisibleTail>
      <StyledFulltext className={fulltextClassName}>
        {props.children}
      </StyledFulltext>
    </div>
  );
}

export default StyledTailText;
