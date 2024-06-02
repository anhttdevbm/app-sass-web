"use client"

import { Stack } from "@mui/material";
import { SearchInput } from "components/sn-ai-agent/components";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { Sidebar, SidebarPromptCategory } from "./components/Sidebar";
import { ListTemplates } from "./components/ListTemplates";
import { useEffect, useState } from "react";
import { usePromptTemplate } from "store/promptTemplate/selectors";
import { FooterDetailAgent } from "components/sn-ai-agent-detail/components/FooterDetailAgent";

export const PromptTemplates = () => {
  const t = useTranslations(NS_AI_AGENT);
  const theme = useTheme();
  const {promptTemplates, onGetPromptTemplates, isFetchingPromptTemplates} = usePromptTemplate();

  const [categories, setCategories] = useState<SidebarPromptCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleSearchTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const handleUpdate = () => {
    console.log("Update");
  }

  useEffect(() => {
    if (!Object.keys(promptTemplates).length && !isFetchingPromptTemplates) {
      onGetPromptTemplates();
    }
  }, [isFetchingPromptTemplates]);

  useEffect(() => {
    const categories = Object.keys(promptTemplates).map(category => ({
      name: category,
      quantity: promptTemplates[category].total,
    }));
    setCategories(categories);
    setSelectedCategory(categories[0]?.name || null);
  }, [promptTemplates]);

  const selectedTemplates = selectedCategory ? promptTemplates[selectedCategory].data : [];

  return (
   <>
     <Stack direction={"column"} height={"100%"}>
       <Stack padding={"16px 32px"} borderBottom={"1px solid #ECECF3"}>
         <SearchInput
           theme={theme}
           placeholder={t("promptTemplates.searchTemplate")}
           onChange={handleSearchTemplate}
           value={search}
         />
       </Stack>
       <Stack padding={"24px 32px"} direction={"row"}>
         <Sidebar listCategories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
         <ListTemplates listTemplates={selectedTemplates} />
       </Stack>
     </Stack>
     <FooterDetailAgent onUpdate={handleUpdate} />
   </>
  );
};
