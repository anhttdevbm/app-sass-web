"use client";

import { memo } from "react";
import PlusIcon from "../../../../icons/PlusIcon";
import { Button } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import useToggle from "hooks/useToggle";
import ModalAddBudget from "components/sn-project-detail/Budget/Actions/ModalAddBudget";

const AddBudget = ({ projectId }: { projectId?: string }) => {
  const projectT = useTranslations(NS_PROJECT);
  const [isOpenModalAddBudget, showOpenModalAddBudget, hideModalAddBudget] =
    useToggle();

  return (
    <>
      <Button
        onClick={showOpenModalAddBudget}
        startIcon={<PlusIcon />}
        size="extraSmall"
        variant="primary"
        id="add_new_id"
        sx={{ height: { xs: 24, lg: 32 } }}
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
