/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint, client } from "api";
import { IconButton } from "components/shared";
import useToggle from "hooks/useToggle";
import PencilIcon from "icons/PencilIcon";
import { useParams } from "next/navigation";
import { memo, useMemo } from "react";
import { CompanyData } from "store/company/actions";
import { useMyCompany } from "store/company/selectors";
import { useCompany } from "store/manager/selectors";
import { getDataFromKeys } from "utils/index";
import Form from "./Form";

const EditCompany = () => {
  const { item: detailItem } = useCompany();
  const { item: myItem, onUpdateMyCompany, onGetCompany } = useMyCompany();
  const { id: paramId } = useParams();

  const item = useMemo(() => {
    if (paramId) {
      return detailItem ?? {};
    }
    return myItem ?? {};
  }, [detailItem, paramId, myItem]);

  const id = useMemo(
    () => paramId ?? myItem?.id,
    [myItem?.id, paramId],
  ) as string;

  const { onUpdateCompany } = useCompany();

  const [isShow, onShow, onHide] = useToggle();

  const onUpdate = async (data: CompanyData) => {
    if (!id) return;

    let dataOnlyUpdated = { ...data };


    dataOnlyUpdated = Object.entries(dataOnlyUpdated).reduce(
      (out, [key, value]) => {
        if (item[key] !== value) {
          out[key] = value;
        }
        return out;
      },
      {},
    ) as any;

    const payload = { ...dataOnlyUpdated } as any

    if (typeof data["avatar"] === "object") {
      const logoUrl = await client.uploadFile(Endpoint.UPLOAD, data["avatar"]);
      payload.avatar = [logoUrl];
    } else {
      delete payload["avatar"];
    }

    if (paramId) {
      const data = await onUpdateCompany(id, payload);      
      return data
    }
    const result = await onUpdateMyCompany(payload);
    return result
  };

  if (!item || paramId) return null;

  const dataFromKeys = getDataFromKeys(item, [
    "name",
    "address",
    "phone",
    "tax_code",
    "created_by",
    "avatar"
  ])

  const initialValues = { ...dataFromKeys, avatar: (dataFromKeys as any).avatar } as CompanyData  
  return (
    <>
      <IconButton
        onClick={onShow}
        sx={{ bgcolor: "grey.50", p: 0.5, borderRadius: 1 }}
      >
        <PencilIcon sx={{ fontSize: 24 }} />
      </IconButton>

      {isShow && (
        <Form
          open
          onClose={onHide}
          initialValues={
            initialValues
          }
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default memo(EditCompany);
