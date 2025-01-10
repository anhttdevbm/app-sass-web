"use client";

import { Button } from "components/shared";
import ModalAddBudget from "components/sn-project-detail/Budget/Actions/ModalAddBudget";
import { NS_PROJECT } from "constant/index";
import useToggle from "hooks/useToggle";
import AddSquareIcon from "icons/AddSquareIcon";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { TBudgetListQueries } from "store/project/budget/action";
import PlusIcon from "../../../../icons/PlusIcon";

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
          height: 40,
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
        onAddSnackbar={function (message: string, severity?: "error" | "success" | "info" | "warning", expiredIn?: number): void {
          throw new Error("Function not implemented.");
        }}
        onGetBudget={function (queries?: TBudgetListQueries): Promise<void> {
          throw new Error("Function not implemented.");
        }}
        selectedBudget={{
          id: undefined,
          project_id: "",
          name: "",
          start_date: "",
          end_date: "",
          owner: "",
          client: ""
        }} />
    </>
  );
};

export default memo(AddBudget);
