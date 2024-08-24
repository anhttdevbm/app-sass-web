import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateDocMutation, useGetDocDetailQuery } from "store/docs/api";
import { uuid } from "utils/index";

const useLeftSlideDoc = () => {
  const { id } = useParams();
  const [createDoc, { data: docsData, error }] = useCreateDocMutation();
  const { data: document, isLoading } = useGetDocDetailQuery(id as string);
  const [data, setData] = useState({});

  const addChildToData = (parent, child) => {
    const newData = { ...data };
    const addChildToParent = async (parentNode) => {
      const modifiedParentNode = {
        ...parentNode,
        child: parentNode.child || [],
      };

      if (modifiedParentNode.id === parent) {
        modifiedParentNode.child = Array.isArray(modifiedParentNode.child)
          ? [...modifiedParentNode.child, child]
          : [child];
        const result = await createDoc(child);
      } else {
        modifiedParentNode.child.forEach((child) => {
          addChildToParent(child);
        });
      }
    };
    addChildToParent(newData);
    setData(newData);
  };

 // Hàm xử lý khi nhấn nút "Thêm mục con"
  const handleAddChild = (parent, project_id) => {
    const id = uuid();
    const newChild = {
      id: id,
      project_id: project_id,
      root_directory: parent,
      name: "New Document",
      description: "",
    };

    addChildToData(parent, newChild);
  };

  useEffect(() => {
    setData(document);
  }, [document]);

  return { handleAddChild, document, data };
};

export default useLeftSlideDoc;
