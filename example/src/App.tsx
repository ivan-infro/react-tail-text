import React, { useState } from "react";
import "./App.css";
import { TailText } from "../../";
import { BigTable } from "./BigTable";
import { WrappedTailText } from "./WrappedTailText";
import { Interactive } from "./Interactive";

const arr = Array.from(Array(2000).keys());

function App() {
  const [boom, makeBoom] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [width, setWidth] = useState<string | number>(400);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)}>
        Показать/скрыть компонент
      </button>
      <button onClick={() => setWidth(width === 400 ? "100%" : 400)}>
        Изменить ширину 400px/100%
      </button>
      <div className="transition-width" style={{ width }}>
        {isVisible && (
          <div style={{ width: "50%" }}>
            <WrappedTailText tailLength={5}>
              very very very very very very long string with whitespaces
            </WrappedTailText>
            <WrappedTailText tailLength={5}>
              шо на счет русских символов?
            </WrappedTailText>
            <WrappedTailText tailLength={6}>
              🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔
            </WrappedTailText>
          </div>
        )}
      </div>
      <hr />
      <div>
        <TailText tailLength={1}>
          А этот текст не подсвечивается при выделении (поведение по умолчанию)
        </TailText>
      </div>
      <hr />
      <div>
        Изменение пропсов должны обрабатываться штатно:
        <Interactive />
      </div>
      <hr />
      <button onClick={() => makeBoom(1)}>
        Стресс-тест Таблица (2000 строк, 2 столбца с компонентом)
      </button>
      <button onClick={() => makeBoom(2)}>Стресс-тест 2000 div</button>
      <table style={{ width: "100%", tableLayout: "fixed" }}>
        <tr>
          <td style={{ width: "33%" }}>
            {" "}
            <WrappedTailText tailLength={5}>
              very very very very very very long string with whitespaces
            </WrappedTailText>
          </td>
          <td style={{ width: "33%" }}>
            {" "}
            <WrappedTailText tailLength={5}>
              very very very very very very long string with whitespaces
            </WrappedTailText>
          </td>
          <td style={{ width: "33%" }}>third column</td>
        </tr>
      </table>
      {boom === 1 && <BigTable />}
      {boom === 2 && (
        <div style={{ width: "30%" }}>
          {arr.map((_, index) => (
            <div key={index}>
              <WrappedTailText tailLength={3}>
                Long text with whitespace
              </WrappedTailText>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
