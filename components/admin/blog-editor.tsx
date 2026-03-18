"use client"

import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
]

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function BlogEditor({ value, onChange, placeholder, className }: BlogEditorProps) {
  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "İçeriğinizi yazın..."}
        className="blog-editor"
      />
      <style jsx global>{`
        .blog-editor .ql-container {
          min-height: 300px;
          font-size: 1rem;
        }
        .blog-editor .ql-editor {
          min-height: 300px;
        }
        .blog-editor .ql-toolbar {
          border-radius: 0.75rem 0.75rem 0 0;
          background: var(--muted);
        }
        .blog-editor .ql-container {
          border-radius: 0 0 0.75rem 0.75rem;
        }
        .blog-editor .ql-editor.ql-blank::before {
          color: var(--muted-foreground);
          font-style: normal;
        }
      `}</style>
    </div>
  )
}
