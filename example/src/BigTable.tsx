import React from "react";
import { TailText } from "../../";

const arr = Array.from(Array(2000).keys());

export function BigTable() {
  const trs = arr.map((_, index) => (
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
  ));

  return (
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
      {trs}
    </table>
  );
}
