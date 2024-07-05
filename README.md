## Structure

    ├── public
        ├── images   # Lưu trữ các ảnh, sử dụng tiền tố ic-xx cho icon và img-xx cho ảnh
        ├── material
            ├── breakpoints   # Config media queries tương ứng với các tỉ lệ màn hình
            ├── typography    # Config variant dựa theo design
        ├── styles/index.css  # Global css
    ├── src
        ├── api
            ├── client        # Config axios instance, methods.
            ├── endpoints     # Config endpoint cho các API
            ├── formErrorCode # Các error code muốn hiển thị trên form thay vì thông báo dạng snackbar
        ├── app[locale]      # Tham khảo docs NextJS 13
            ├── (auth)         # Định nghĩa route page cho các page không cần auth
            ├── (root)        # Định nghĩa route page cho các page cần auth
        ├── components
            ├── shared        # Các button, input, text,... common của web app
            ├── Filters/Table/Editor,... Các common layout của web app
            ├── sn-xx          # Code các components cho màn hình xx, import vào các page trong app/...
        ├── constant
            ├── enum         # Common enum
            ├── paths        # Config biến cho các đường dẫn trên thanh nhập địa chỉ trình duyệt, config path có thể truy cập theo permission
            ├── types       # Common type, interface
        ├── dictionaries
        ├── hooks          # Common hooks
        ├── icons          # Tạo các icon từ design dạng component
        ├── layouts        # Các layouts của web app
        ├── store          # Redux toolkit store
        ├── utils
            ├── colorSchemes    # Config colors cho web app theo dark/light mode, ok là đang sử dụng, k được sửa.
            ├── index      # Các func common cho web app
            ├── storage    # Custom localStorage, sessionStorage
    ├── next.config        # Config env...

## Getting Started

First, run the development server:

```bash
yarn prepare
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
