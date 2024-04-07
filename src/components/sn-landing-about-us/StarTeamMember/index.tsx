import ItemList from "./ItemList"
import Actions from "./Actions"
import { memo, useMemo, useEffect, useRef, useState } from "react";

const StarTeamMember = () => {
    return (
        <>
            <Actions />
            <ItemList />
        </>
    )
}

export default memo(StarTeamMember)