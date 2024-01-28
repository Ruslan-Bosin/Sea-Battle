import React from "react";

import UnknownCell from "./Cells/UnknownCell";
import UnwonCell from "./Cells/UnwonCell"
import MissedCell from "./Cells/MissedCell"
import WonCell from "./Cells/WonCell";

function FieldCell(props) {

  const status = props.status;

  if (status === "Unknown") { return <UnknownCell {...props} /> }
  else if (status === "Unwon") { return <UnwonCell {...props} /> }
  else if (status === "Won") { return <WonCell {...props} /> }
  else if (status === "Missed") { return <MissedCell {...props} /> }

  return <div>ERROR</div>;
};

export default FieldCell;
