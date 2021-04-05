import React from "react";
import renderer from "react-test-renderer";

import "jest-styled-components";
import "./__mocks__/intersectionObserver";

import { InvisibleTail } from "./InvisibleTail";
import TailText from "./TailText";

function createNodeMock() {
  return {};
}

test("it is alive", () => {
  const text = "it is alive";
  const tree = renderer.create(<TailText tailLength={3}>{text}</TailText>, {
    createNodeMock,
  });

  const treeJson = tree.toJSON();

  expect(treeJson).toMatchSnapshot();

  const secondTree = renderer
    .create(<TailText tailLength={1}>да будет свет</TailText>, {
      createNodeMock,
    })
    .toJSON();

  expect(secondTree).toMatchSnapshot();
});

test("Первый потомок wrapper - хвост текста", () => {
  const r = renderer.create(
    <TailText className="test-child" tailLength={2}>
      asdf
    </TailText>,
    { createNodeMock }
  );

  const div = r.root.findByType("div");

  expect(
    typeof div.children[0] !== "string" && div.children[0].props.children
  ).toBe("df");
});

test("Последний потомок wrapper - полная строка", () => {
  const r = renderer.create(
    <TailText className="test-child" tailLength={2}>
      asdf
    </TailText>,
    {
      createNodeMock,
    }
  );

  const div = r.root.findByType("div");
  const lastChild = div.children[div.children.length - 1];

  expect(typeof lastChild !== "string" && lastChild.props.children).toBe(
    "asdf"
  );
});

test("Текст подскази при наведении добавлен в атрибут title", () => {
  const tree = renderer
    .create(
      <TailText tailLength={3} title="А вот и сама подсказка">
        Подсказка при наведении добавлена к wrapper элементу в тег title
      </TailText>,
      {
        createNodeMock,
      }
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

test("Выводится предупреждение о некорректном параметре teilLength", () => {
  const spy = jest.spyOn(console, "warn").mockImplementation();
  const tree = renderer
    .create(
      <TailText tailLength={100500}>Краткость - сестра таланта</TailText>,
      {
        createNodeMock,
      }
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(
    "tailLength не может быть больше длины исходной строки!"
  );
  spy.mockRestore();
});

test("Кастомный className добавляется к элементу", () => {
  const tree = renderer
    .create(
      <TailText tailLength={3} className="hello">
        Модифицировать вшитые классы пока нельзя
      </TailText>,
      {
        createNodeMock,
      }
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

test("children - это не только ценный актив, но и три - четыре... Ну, и другие числа", () => {
  const tree = renderer
    .create(<TailText tailLength={1}>34</TailText>, {
      createNodeMock,
    })
    .toJSON();

  expect(tree).toMatchSnapshot();
});
