// import { FontFamily as BaseFontFamily } from '@tiptap/extension-font-family';
// import { Editor } from '@tiptap/core';
// const FontFamily = BaseFontFamily.extend({
//     addCommands() {
//         return {
//           setAllFontFamily: (fontFamily: string) => (editor: Editor) => {
//             const { doc, tr } = editor.state;
//             const mark = editor.schema.marks.fontFamily.create({ fontFamily });
      
//             doc.descendants((node, pos) => {
//               if (node.isText) {
//                 tr.addMark(pos, pos + node.nodeSize, mark);
//               }
//             });
      
//             editor.view.dispatch(tr);
//           },
//         };
//       },
// });

// export default FontFamily;