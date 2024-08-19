"use client";


import React, { memo, useState } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Box, Button, FormControl, InputLabel, MenuItem, Stack, Select } from '@mui/material';
import UndoIcon from 'icons/undoIcon';
import RedoIcon from 'icons/RedoIcon';
import RedoIconTicket from 'icons/RedoIconTicket';
import UppercaseIcon from 'icons/UppercaseIcon';
import ItalicIcon from 'icons/ItalicIcon';
import UnderLineIcon from 'icons/UnderLineIcon';


const EditorGroup = () => {
    // Khởi tạo trạng thái của editor
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    console.log("check edit", editorState)

    // Hàm xử lý khi nội dung editor thay đổi
    const onChange = (newState: EditorState) => {
        setEditorState(newState);
    };

    // Hàm căn chỉnh lề
    const handleAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
        let blockType = 'left-aligned-block'; // Mặc định là lề trái

        switch (alignment) {
            case 'center':
                blockType = 'center-aligned-block';
                break;
            case 'right':
                blockType = 'right-aligned-block';
                break;
            case 'justify':
                blockType = 'justify-aligned-block';
                break;
            default:
                blockType = 'left-aligned-block';
        }

        onChange(RichUtils.toggleBlockType(editorState, blockType));
    };

    // Hàm chuyển đổi chữ thành in hoa
    const handleUppercase = () => {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        // Lấy văn bản được chọn
        const selectedText = currentContent.getBlockForKey(selection.getStartKey())
            .getText().slice(selection.getStartOffset(), selection.getEndOffset());

        // Chuyển đổi thành chữ in hoa
        const uppercasedText = selectedText.toUpperCase();

        // Giữ lại các inline styles hiện có
        const contentState = Modifier.replaceText(
            currentContent,
            selection,
            uppercasedText,
            editorState.getCurrentInlineStyle()
        );

        onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    };

    // Hàm để áp dụng in nghiêng
    const handleItalic = () => {
        onChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    };

    // Hàm để áp dụng gạch chân
    const handleUnderline = () => {
        onChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    };

    // Hàm undo
    const handleUndo = () => {
        onChange(EditorState.undo(editorState));
        console.log("check")
    };

    // Hàm redo
    const handleRedo = () => {
        onChange(EditorState.redo(editorState));
    };

    // Hàm blockStyleFn dùng để áp dụng các class CSS tương ứng cho block
    const blockStyleFn = (contentBlock) => {
        const type = contentBlock.getType();
        const styles = {
            leftAligned: { textAlign: 'left' },
            centerAligned: { textAlign: 'center' },
            rightAligned: { textAlign: 'right' },
            justifyAligned: { textAlign: 'justify' },
        };

        if (type === 'left-aligned-block') {
            return styles.leftAligned;
        }
        if (type === 'center-aligned-block') {
            return styles.centerAligned;
        }
        if (type === 'right-aligned-block') {
            return styles.rightAligned;
        }
        if (type === 'justify-aligned-block') {
            return styles.justifyAligned;
        }
        return null;
    };


    // Hàm để áp dụng kiểu phông chữ
    const handleFontChange = (font) => {
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();

        const newContentState = Modifier.applyInlineStyle(
            contentState,
            selection,
            fontStyles[font]
        );

        onChange(EditorState.push(editorState, newContentState, 'change-inline-style'));
    };

    const fontStyles = {
        Arial: 'FONT_ARIAL',
        'Courier New': 'FONT_COURIER_NEW',
        Georgia: 'FONT_GEORGIA',
        Tahoma: 'FONT_TAHOMA',
        'Times New Roman': 'FONT_TIMES_NEW_ROMAN',
        Verdana: 'FONT_VERDANA',
    };

    const customStyleMap = {
        'FONT_ARIAL': { fontFamily: 'Arial, sans-serif' },
        'FONT_COURIER_NEW': { fontFamily: '"Courier New", Courier, monospace' },
        'FONT_GEORGIA': { fontFamily: 'Georgia, serif' },
        'FONT_TAHOMA': { fontFamily: 'Tahoma, sans-serif' },
        'FONT_TIMES_NEW_ROMAN': { fontFamily: '"Times New Roman", Times, serif' },
        'FONT_VERDANA': { fontFamily: 'Verdana, sans-serif' },
    };



    return (
        <>
            <Box sx={{ borderTop: '1px solid #EDEFF1', paddingTop: '18px', minHeight: '200px' }}>
                <Editor
                    editorState={editorState}
                    onChange={onChange}
                    placeholder="Body Text..."
                    // blockStyleFn={blockStyleFn}
                    customStyleMap={customStyleMap}
                />
            </Box>


            <Box sx={
                {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderBottom: '1px solid #EDEFF1',
                    padding  :"18px 0"
                }
            }>

                <UndoIcon onClick={() => handleUndo()} />
                <RedoIconTicket onClick={() => handleRedo()} />
                <select
                    style={{ width: 90, borderTop: "none", borderBottom: "none", fontWeight: 700, borderColor: "#EDEFF1" }}
                    onChange={(e) => handleFontChange(e.target.value)}
                >
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>
                <select style={{ width: 50, borderTop: "none", borderBottom: "none", borderLeft: "none", fontWeight: 700, borderColor: "#EDEFF1" }}>
                    <option value="Arial">TT</option>
                </select>
                <UppercaseIcon onClick={() => handleUppercase()} />
                <ItalicIcon onClick={() => handleItalic()} />
                <UnderLineIcon onClick={() => handleUnderline()} />
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.583008 12.5846V14.418H13.4163V12.5846H0.583008ZM4.70801 8.73464H9.29134L10.1163 10.7513H12.0413L7.68717 0.667969H6.31217L1.95801 10.7513H3.88301L4.70801 8.73464ZM6.99967 2.48297L8.71384 7.08464H5.28551L6.99967 2.48297Z" fill="black" fill-opacity="0.54" />
                </svg>

                <Button sx={{ padding: "0 5px 0 0" }} onClick={() => handleAlignment('left')}>Căn trái</Button>
                <Button sx={{ padding: "0 5px 0 0" }} onClick={() => handleAlignment('center')}>Căn giữa</Button>
                <Button sx={{ padding: "0 5px 0 0" }} onClick={() => handleAlignment('right')}>Căn phải</Button>

            </Box>

        </>

    );
};

export default memo(EditorGroup);