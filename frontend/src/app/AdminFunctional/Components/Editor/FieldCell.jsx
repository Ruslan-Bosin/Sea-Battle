import React from "react";

import EmptyCell from "./Cells/Editable/EmptyCell";
import PrizeCell from "./Cells/Editable/PrizeCell";
import ForbiddenCell from "./Cells/Editable/ForbiddenCell";

import MissedCell from "./Cells/Uneditable/MissedCell";
import UntouchedCell from "./Cells/Uneditable/UntouchedCell";
import UnwonCell from "./Cells/Uneditable/UnwonCell";
import WonCell from "./Cells/Uneditable/WonCell";

function FieldCell(props) {

  const status = props.status;

  if (status === "Empty") { return <EmptyCell {...props} /> }
  else if (status === "Prize") { return <PrizeCell {...props} /> }
  else if (status === "Forbidden") { return <ForbiddenCell {...props} /> }

  if (status === "Missed") { return <MissedCell {...props} /> }
  else if (status === "Untouched") { return <UntouchedCell {...props} /> }
  else if (status === "Unwon") { return <UnwonCell {...props} /> }
  else if (status === "Won") { return <WonCell {...props} /> }

  return <div>ERROR</div>;
};

export default FieldCell;
