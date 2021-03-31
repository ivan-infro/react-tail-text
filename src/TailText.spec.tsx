import React from "react";
import renderer from "react-test-renderer";
import TailText from "./TailText";

test("it is alive", () => {
  const tree = renderer
    .create(<TailText tailLength={3}>it is alive</TailText>)
    .toJSON();

  expect(tree).toMatchSnapshot();

  const secondTree = renderer
  .create(<TailText tailLength={1}>да будет свет</TailText>)
  .toJSON();

expect(secondTree).toMatchSnapshot();
});

test("Текст подскази при наведении добавлен в атрибут title", () => {
  const tree = renderer
    .create(
      <TailText tailLength={3} title="А вот и сама подсказка">
        Подсказка при наведении добавлена к wrapper элементу в тег title
      </TailText>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

test("Выводится предупреждение о некорректном параметре teilLength", () => {
  const spy = jest.spyOn(console, "warn").mockImplementation();
  const tree = renderer
    .create(<TailText tailLength={100500}>Краткость - сестра таланта</TailText>)
    .toJSON();

  expect(tree).toMatchSnapshot();
  expect(spy).toHaveBeenCalledTimes(2);
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
      </TailText>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

test("children - это не только ценный актив, но и три - четыре... Ну, и другие числа", () => {
  const tree = renderer.create(<TailText tailLength={1}>34</TailText>).toJSON();

  expect(tree).toMatchSnapshot();
});
