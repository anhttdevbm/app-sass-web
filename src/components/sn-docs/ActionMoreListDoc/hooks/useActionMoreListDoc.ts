import { useState } from "react";

const useActionMoreListDoc = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const handleRenameDoc = () => {
        setAnchorEl(null);
      };
    
      const handleMoveDoc = () => {
        setAnchorEl(null);
      };
    
      const handleDuplicateDoc = () => {
        setAnchorEl(null);
      };
    
      const handleDeleteDoc = () => {
        setAnchorEl(null);
      };

      return {
        anchorEl,
        open,
        handleClick,
        handleClose,
        handleRenameDoc,
        handleMoveDoc,
        handleDuplicateDoc,
        handleDeleteDoc
      }
}

export default useActionMoreListDoc;