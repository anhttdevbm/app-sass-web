"use client";

import { memo } from "react";
import PlusIcon from "../../../../icons/PlusIcon";
import { Button } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import useToggle from "hooks/useToggle";
import ModalAddBudget from "components/sn-project-detail/Budget/Actions/ModalAddBudget";
import AddSquareIcon from "icons/AddSquareIcon";

const AddBudget = ({ projectId }: { projectId?: string }) => {
  const projectT = useTranslations(NS_PROJECT);
  const [isOpenModalAddBudget, showOpenModalAddBudget, hideModalAddBudget] =
    useToggle();

  return (
    <>
      <Button
        onClick={showOpenModalAddBudget}
        startIcon={
          <>
            <AddSquareIcon
              sx={{
                display: { xs: "block", md: "none" },
                width: 24,
                height: 24,
              }}
            />
            <PlusIcon
              sx={{
                display: { xs: "none", md: "block" },
                mr: 1,
                width: 18,
                height: 18,
              }}
            />
          </>
        }
        size="extraSmall"
        variant="primary"
        id="add_new_id"
        sx={{
          boxShadow: "none",

          fontWeight: "700",
          background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
          "&:hover": {
            background:
              "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)!important",
          },
          borderRadius: "100px",
          height: 48,
          width: 129,
          "p,svg": { fontWeight: "700" },
          svg: {
            border: "1px solid white",
            borderRadius: "50px",
            color: "#2AF598",
            background: "white",
          },
        }}
      >
        {projectT("budget.action.addBudget")}
      </Button>
      <ModalAddBudget
        open={isOpenModalAddBudget}
        onClose={hideModalAddBudget}
        projectId={projectId}
      />
    </>
  );
};

export default memo(AddBudget);
