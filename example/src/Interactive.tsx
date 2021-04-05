import React, { useState } from "react";
import { TailText } from "../../lib";

export function Interactive() {
  const [text, setText] = useState("Попробуйте на этом тексте с оченьдлиннымсловомвконце");
  const [tailLength, setTaillength] = useState(2);

  return (
    <div style={{ maxWidth: '20%' }}>
      <input
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
      />
      <input
        type="number"
        value={tailLength}
        onChange={(event) => setTaillength(+event.currentTarget.value)}
      />

      <TailText tailLength={tailLength}>{text}</TailText>
    </div>
  );
}
