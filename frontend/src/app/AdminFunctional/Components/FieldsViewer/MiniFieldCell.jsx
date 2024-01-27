import React from "react";

import EmptyMiniCell from "./MiniCells/Editable/EmptyMiniCell";
import PrizeMiniCell from "./MiniCells/Editable/PrizeMiniCell";
import ForbiddenMiniCell from "./MiniCells/Editable/ForbiddenMiniCell"

import MissedMiniCell from "./MiniCells/Uneditable/MissedMiniCell";
import UntouchedMiniCell from "./MiniCells/Uneditable/UntouchedMiniCell";
import UnwonMiniCell from "./MiniCells/Uneditable/UnwonMiniCell";
import WonMiniCell from "./MiniCells/Uneditable/WonMiniCell";


function MiniFieldCell(props) {

  const status = props.status;

  if (status === "Empty") { return <EmptyMiniCell {...props} /> }
  else if (status === "Prize") { return <PrizeMiniCell {...props} /> }
  else if (status === "Forbidden") { return <ForbiddenMiniCell {...props} /> }

  if (status === "Missed") { return <MissedMiniCell {...props} /> }
  else if (status === "Untouched") { return <UntouchedMiniCell {...props} /> }
  else if (status === "Unwon") { return <UnwonMiniCell {...props} /> }
  else if (status === "Won") { return <WonMiniCell {...props} /> }

  return <div>ERROR</div>;
};

export default MiniFieldCell;
