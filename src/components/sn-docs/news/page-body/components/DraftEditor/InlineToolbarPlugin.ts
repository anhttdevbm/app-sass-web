import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";

export const inlineToolbarPlugin = createInlineToolbarPlugin({
  theme: {
    toolbarStyles: {
      toolbar: "inline-toolbar",
    },
    buttonStyles: {},
  },
});

export const { InlineToolbar } = inlineToolbarPlugin;
