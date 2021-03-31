import React, { useState } from "react";
import "./App.css";
import { TailText } from "react-tail-text";

const arr = Array.from(Array(1000).keys());

function App() {
  const [boom, makeBoom] = useState(0);
  return (
    <>
      <div style={{ width: "50%" }}>
        <TailText tailLength={5}>
          very very very very very very long string with whitespaces
        </TailText>
      </div>

      <button onClick={() => makeBoom(1)}>Стресс-тест 1</button>
      <button onClick={() => makeBoom(2)}>Стресс-тест 2</button>

      <table style={{ width: "100%", tableLayout: "fixed" }}>
        <tr>
          <td style={{ width: "33%" }}>
            {" "}
            <TailText tailLength={5}>
              very very very very very very long string with whitespaces
            </TailText>
          </td>
          <td style={{ width: "33%" }}>
            {" "}
            <TailText tailLength={5}>
              very very very very very very long string with whitespaces
            </TailText>
          </td>
          <td style={{ width: "33%" }}>third column</td>
        </tr>
        {boom === 1 &&
          arr.map((_, index) => (
            <tr key={index}>
              <td style={{ width: "33%" }}>
                {" "}
                <TailText tailLength={5}>
                  very very very very very very long string with whitespaces
                </TailText>
              </td>
              <td style={{ width: "33%" }}>
                {" "}
                <TailText tailLength={5}>
                  very very very very very very long string with whitespaces
                </TailText>
              </td>
              <td style={{ width: "33%" }}>third column</td>
            </tr>
          ))}
      </table>
      {boom === 2 && (
        <div style={{ width: "30%" }}>
          {arr.map(() => (
            <div>
              <TailText tailLength={3}>Long text with whitespace</TailText>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
