import { BlogDictionary } from "dictionaries/types/BlogDictionary";

export const BlogLang: BlogDictionary = {
    blogs: {
        head: {
            title: "Blogs"
        }
    },
    blogCategory: {
        head: {
            title: "Blog Category List"
        },
        key: "category blog",
        confirmRemove: {
            content: "Are you sure to remove this category ? ",
            title: "Confirm remove category",
        },
        notification: {
            success: "{label} category successfully"
        },
        title: "Category Blog Manager",
    },
    blogCategoryList: {
        id: "Id",
        name: "Category Name",
        slug: "Slug",
        detail: "Detail"
    },
    blogCategoryForm: {
        name: "CategoryName",
        slug: "Slug",
        detail: "Detail"
    }
    ,
    title: "Blogs",
    blogList: {
        head: {
            title: "Blog List",
        },
        title: "Title",
        content: "Content",
        category: "Category",
        tag: "Tag",
        statusBlog: "Status",
        slug: "Slug",
        created_time : "Create Time",
        relatedBlogs : "Related Blogs",
        short_description : "Description",
        notification: {
            success: "Update status {label} successfully"
        },
    },
    published: "Published",
    draft: "Draft",
    hide : "Hide",
    actions: {
        createBlog: " Create new",
        search: "Search",
        status: "Status",
        delete:{
            title : "Confirm delete blog ",
            confirm : "Are you sure to remove blog ?",
            remove : "Remove",
        },
        draft:"Draft",
        published : "Published",
        hide : "Hide",
        update:{
            title:"Are you sure to update?",
            content:"Update blog to {label}"
        },
        updateBlog:"Update blog",
    },
    blogForm: {
        key: "blog",
        title: "Title",
        content: "Content",
        slug: "Slug",
        background: "Background",
        category: "Category blog",
        tag: "Tag",
        published: "Published",
        attachments: "Attachments",
        short_description : "Description",
        notification: {
            success: "{label} blog successfully!"
        },
    },
    status: {
        published: "Published",
        draft: "Draft",
        hide : "Hide"
    },
    comment:{
        writeComment: "Write comment ...",
        sendComment:"Send comment"
    },
    error:{
        anErrorTryAgain : "An error occurred, please try again !"
    },
    PUBLISHED : "published",
    DRAFT : "draft",
    HIDE : "hide",    
}

