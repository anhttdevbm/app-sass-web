"use client";


import React, { memo, useEffect, useRef, useState } from 'react';
import { convertToRaw, Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Box, Button, FormControl, InputLabel, MenuItem, Stack, Select } from '@mui/material';
import UndoIcon from 'icons/undoIcon';
import RedoIcon from 'icons/RedoIcon';
import RedoIconTicket from 'icons/RedoIconTicket';
import UppercaseIcon from 'icons/UppercaseIcon';
import ItalicIcon from 'icons/ItalicIcon';
import UnderLineIcon from 'icons/UnderLineIcon';
import AttachmentsIcon from 'icons/AttachmentsIcon';
import ListFormatText from 'components/sn-docs/news/page-body/components/ToolBarDraftEditor/components/ListFormatText';
import FileUpload from '../module/create-ticket/upload/FileUpload';


const EditorGroup = (props: any) => {
    const { setFormSendReply, formSendReply } = props || null
    const [openAttachment, setOpenAttachment] = useState(false)
    const inputRef = useRef<any>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current?.focus();
        }
    }, [])
    // Khởi tạo trạng thái của editor
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    // console.log("check edit", editorState)

    // Hàm xử lý khi nội dung editor thay đổi
    const onChange = (newState: EditorState) => {
        setEditorState(newState);
        setFormSendReply((prev) => ({ ...prev, content : getPlainTextContent(newState) }))
    };

    const getPlainTextContent = (newState : EditorState) => {
        const contentState = newState.getCurrentContent();
        return contentState.getPlainText();
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
    };

    // Hàm redo
    const handleRedo = () => {
        onChange(EditorState.redo(editorState));
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

    const handleClickListFormat = (e: React.MouseEvent<HTMLButtonElement>, typeClick: { method: string; style: string }) => {
        const { method, style } = typeClick;

        if (method === 'block') {
            onChange(RichUtils.toggleBlockType(editorState, style));
        }
    };

    return (
        <>
            <Box sx={{ borderTop: '1px solid #EDEFF1', paddingTop: '18px', minHeight: '200px' }}>
                <Editor
                    editorState={editorState}
                    onChange={onChange}
                    placeholder=""
                    // blockStyleFn={blockStyleFn}
                    customStyleMap={customStyleMap}
                    ref={inputRef}

                />
                {openAttachment &&
                    <>
                        <FileUpload
                            files={formSendReply.files}
                            setFiles={(files) =>
                                setFormSendReply((prev) => ({ ...prev, files }))
                            }
                        />

                    </>

                }
            </Box>


            <Box sx={
                {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderBottom: '1px solid #EDEFF1',
                    padding: "18px 0"
                }
            }>

                <Button onClick={() => handleUndo()} sx={{ padding: 0, minWidth: 30, minHeight: 40 }}>
                    <UndoIcon />

                </Button>

                <Button onClick={() => handleRedo()} sx={{ padding: 0, minWidth: 30, minHeight: 40 }}>
                    <RedoIconTicket />

                </Button>

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
                <Button onClick={() => handleUppercase()} sx={{ padding: 0, minWidth: 30, minHeight: 40 }}>
                    <UppercaseIcon />

                </Button>
                <Button onClick={() => handleItalic()} sx={{ padding: 0, minWidth: 30, minHeight: 40 }}>
                    <ItalicIcon />

                </Button>
                <Button onClick={() => handleUnderline()} sx={{ padding: 0, minWidth: 30, minHeight: 40 }}>
                    <UnderLineIcon />

                </Button>

                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.583008 12.5846V14.418H13.4163V12.5846H0.583008ZM4.70801 8.73464H9.29134L10.1163 10.7513H12.0413L7.68717 0.667969H6.31217L1.95801 10.7513H3.88301L4.70801 8.73464ZM6.99967 2.48297L8.71384 7.08464H5.28551L6.99967 2.48297Z" fill="black" fill-opacity="0.54" />
                </svg>



                <ListFormatText customStyle={{ border: 'none', backgroundColor: "#fff" }} handleClickListFormat={handleClickListFormat} />


                <Button onClick={() => setOpenAttachment(prev => !prev)} sx={{ padding: 0, minWidth: 30, minHeight: 40 }}>
                    <AttachmentsIcon />
                </Button>
            </Box>

        </>

    );
};

export default memo(EditorGroup);