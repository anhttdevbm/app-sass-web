import Quill from "quill";
import "quill-mention/dist/quill.mention.css"; // Import CSS for the mention module

// Define the mention module configuration
const mentionModuleConfig = {
  mention: {
    allowedChars: /^[A-Za-z\s]*$/,
    source: async (
      searchTerm: string,
      renderList: (items, searchTerm: string) => void,
    ) => {
      // Replace with actual user fetching logic
      const users = [
        { id: 1, value: "John Doe" },
        { id: 2, value: "Jane Smith" },
      ].filter((user) =>
        user.value.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      renderList(users, searchTerm);
    },
    renderItem: (item) => `<div>${item?.value}</div>`,
  },
};

const getMentionModule = async () => {
  const MentionModule = (await import("quill-mention")).default;
  return MentionModule;
};

export { mentionModuleConfig, getMentionModule };
