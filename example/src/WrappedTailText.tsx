import React from "react";
import { TailText } from "../../";

export const WrappedTailText = (
  props: React.ComponentProps<typeof TailText>
) => <TailText {...props} highlightOnSelection />;
