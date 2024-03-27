// // components/AvatarEditor.js
// import { useState } from "react";
// import AvatarEditor from "react-avatar-editor";

// const AvatarEditorComponent = () => {
//   const [image, setImage] = useState(null);
//   const [editor, setEditor] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader?.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     if (editor) {
//       const canvas = editor?.getImageScaledToCanvas();
//       const dataURL = canvas.toDataURL();
//       // Làm gì đó với dataURL, ví dụ như lưu vào state hoặc gửi lên server
//       console.log(dataURL);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleImageChange} />
//       {image && (
//         <AvatarEditor
//           ref={(editorInstance) => setEditor(editorInstance)}
//           image={image}
//           width={200}
//           height={200}
//           border={50}
//           borderRadius={100}
//           color={[255, 255, 255, 0.6]}
//           scale={1.2}
//         />
//       )}
//       <button onClick={handleSave}>Save</button>
//     </div>
//   );
// };

// export default AvatarEditorComponent;
