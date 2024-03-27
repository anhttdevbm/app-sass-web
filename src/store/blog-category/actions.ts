import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, BLOG_API_URL,  } from "constant/index";
import { BaseQueries } from "constant/types";
import { CategoryBlogData } from "./reducer";

// Request Api 
export type CategoryBlogDataListQueries = BaseQueries & {
    id?: string;
    name?: string;
    slug?: string;
    detail?: string;
    created_time?: Date;
}

export type GetBlogCategoryListQueries = BaseQueries & {
    searchKey?: string;
};

// createAsyncThunk có 2 tham số(string:callback)
// string : slice name / action name
// callback : xử lý bất đồng bộ
// export const getAllBlogCategory = createAsyncThunk("blog-category/getAllBlogCategory",
//     async (searchKey: string | undefined) => {
//         try {
//             // Sử dụng fetch để gọi API và truyền tham số searchKey vào URL
//             const response = await fetch(`${Endpoint.CATEGORY_BLOG}?searchKey=${searchKey}`);

//             if (!response.ok) {
//                 // Xử lý lỗi nếu có lỗi trong phản hồi từ API
//                 throw new Error(`Error fetching data: ${response.status}`);
//             }

//             // Chuyển đổi phản hồi thành JSON
//             const data = await response.json();

//             // Gọi hàm refactorRawItemListResponse để xử lý dữ liệu (nếu cần)
//             const finalPayload = refactorRawItemListResponse(data);

//             // Trả về kết quả cho hành động
//             return finalPayload;
//         } catch (error) {
//             throw error;
//         }
//     });


export const getAllBlogCategory = createAsyncThunk("blog-category/getAllBlogCategory",
    async ({ ...queries }: GetBlogCategoryListQueries) => {
        try {
            // Sử dụng fetch để gọi API và truyền tham số searchKey vào URL
            const response = await client.get(Endpoint.CATEGORY_BLOG, queries, { baseURL: BLOG_API_URL });
            if (response?.status === HttpStatusCode.OK) {
                return response.data;
            }
            // const res = await fetch("http://103.196.145.232:6816/api/v1" + Endpoint.CATEGORY_BLOG).then((data) => data.json());
            // return res;
        } catch (error) {
            throw error;
        }
    }
);

export const postBlogCategory = createAsyncThunk("blog-category/postBlogCategory",
    async (category: CategoryBlogData) => {
        try {
            const response = await client.post(Endpoint.CATEGORY_BLOG, category, { baseURL: BLOG_API_URL });

            if (response?.status === HttpStatusCode.CREATED) {
                return response.data;
            }
            throw AN_ERROR_TRY_AGAIN;
        } catch (error) {
            throw error;
        }
    }
);

export const updateBlogCategory = createAsyncThunk("blog-category/updateBlogCategory",

    async ({ id, category }: { id: string, category: CategoryBlogData }) => {
        try {
            const response = await client.put(Endpoint.CATEGORY_BLOG + "/" + id,
                category,
                {
                    baseURL: BLOG_API_URL,
                });
            if (response?.status === HttpStatusCode.CREATED) {
                // console.log(response);
                // console.log(response.data?.id ? response.data : response.data?.body);
                return response.data?.id ? response.data : response.data?.body;
            }
            throw AN_ERROR_TRY_AGAIN;
        } catch (error) {
            throw error;
        }

    });

export const deleteCategoryBlogs = createAsyncThunk(
    "blog-category/deleteCategoryBlogs",
    async (ids: string) => {
        try {
            const response = await client.delete(
                Endpoint.CATEGORY_BLOG + "/" + ids,
                {
                    baseURL: BLOG_API_URL,
                },
            );

            if (response?.status === HttpStatusCode.OK) {
                return ids;
            }
            throw AN_ERROR_TRY_AGAIN;
        } catch (error) {
            throw error;
        }
    },
);
