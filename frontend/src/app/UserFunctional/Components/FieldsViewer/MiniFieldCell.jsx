import React from "react";

import UnknownMiniCell from "./MiniCells/UnknownMiniCell"
import WonMiniCell from "./MiniCells/WonMiniCell";
import UnwonMiniCells from "./MiniCells/UnwonMiniCells"
import MissedMiniCell from "./MiniCells/MissedMiniCell"

function MiniFieldCell(props) {

  const status = props.status;
  if (status === "Untouched") { return <UnknownMiniCell {...props} /> }
  else if (status === "Unwon") { return <UnwonMiniCells {...props} /> }
  else if (status === "Won") { return <WonMiniCell {...props} /> }
  else if (status === "Missed") { return <MissedMiniCell {...props} /> }

  return <div>ERROR</div>;
};

export default MiniFieldCell;
