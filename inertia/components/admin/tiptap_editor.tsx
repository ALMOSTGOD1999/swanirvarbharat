import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Dropcursor from '@tiptap/extension-dropcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Blockquote from '@tiptap/extension-blockquote'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

interface TiptapEditorProps {
  name: string
  defaultValue?: string
}

export function TiptapEditor({ name, defaultValue }: TiptapEditorProps) {
  const [html, setHtml] = useState(defaultValue ?? '')

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const linkUrlRef = useRef('')

  // Image dialog state
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  const editor = useEditor({
    content: defaultValue ?? '',
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'nofollow noopener noreferrer',
        },
      }),
      Image,
      CodeBlock,
      Dropcursor,
      HardBreak,
      Blockquote,
    ],
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && defaultValue !== undefined) {
      const currentHtml = editor.getHTML()
      if (currentHtml !== defaultValue) {
        editor.commands.setContent(defaultValue)
      }
    }
  }, [editor, defaultValue])

  const setLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    linkUrlRef.current = previousUrl ?? ''
    setLinkUrl(previousUrl ?? '')
    setLinkDialogOpen(true)
  }

  const confirmLink = () => {
    if (!editor) return
    const url = linkUrl.trim()
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setLinkDialogOpen(false)
    setLinkUrl('')
  }

  const addImage = () => {
    if (!editor) return
    setImageUrl('')
    setImageAlt('')
    setImageDialogOpen(true)
  }

  const confirmImage = () => {
    if (!editor) return
    const url = imageUrl.trim()
    if (!url) return
    editor.chain().focus().setImage({ src: url, alt: imageAlt }).run()
    setImageDialogOpen(false)
    setImageUrl('')
    setImageAlt('')
  }

  const toolbarButtons = [
    {
      icon: <Bold className="size-4" />,
      label: 'Bold',
      action: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive('bold'),
    },
    {
      icon: <Italic className="size-4" />,
      label: 'Italic',
      action: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive('italic'),
    },
    {
      icon: <Strikethrough className="size-4" />,
      label: 'Strikethrough',
      action: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive('strike'),
    },
    {
      icon: <Heading1 className="size-4" />,
      label: 'Heading 1',
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor?.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      label: 'Heading 2',
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor?.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      label: 'Heading 3',
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor?.isActive('heading', { level: 3 }),
    },
    {
      icon: <List className="size-4" />,
      label: 'Bullet List',
      action: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="size-4" />,
      label: 'Ordered List',
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive('orderedList'),
    },
    {
      icon: <Quote className="size-4" />,
      label: 'Blockquote',
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      active: editor?.isActive('blockquote'),
    },
    {
      icon: <Code className="size-4" />,
      label: 'Code',
      action: () => editor?.chain().focus().toggleCode().run(),
      active: editor?.isActive('code'),
    },
    {
      icon: <Minus className="size-4" />,
      label: 'Horizontal Rule',
      action: () => editor?.chain().focus().setHorizontalRule().run(),
      active: false,
    },
    {
      icon: <LinkIcon className="size-4" />,
      label: 'Link',
      action: setLink,
      active: editor?.isActive('link'),
    },
    {
      icon: <ImageIcon className="size-4" />,
      label: 'Image',
      action: addImage,
      active: false,
    },
    {
      icon: <Undo className="size-4" />,
      label: 'Undo',
      action: () => editor?.chain().focus().undo().run(),
      active: false,
    },
    {
      icon: <Redo className="size-4" />,
      label: 'Redo',
      action: () => editor?.chain().focus().redo().run(),
      active: false,
    },
  ]

  return (
    <div className="border border-input rounded-lg overflow-hidden">
      <div className="border-b border-input bg-muted/50 p-1 flex flex-wrap gap-0.5">
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.label}
            variant="ghost"
            size="icon-sm"
            onClick={btn.action}
            disabled={!editor}
            className={btn.active ? 'bg-accent text-accent-foreground' : ''}
            aria-label={btn.label}
            title={btn.label}
          >
            {btn.icon}
          </Button>
        ))}
      </div>
      <div className="prose prose-sm max-w-none p-4">
        <EditorContent editor={editor} className="tiptap focus:outline-none" />
      </div>
      <input type="hidden" name={name} value={html} />
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap :focus {
          outline: none;
        }
      `}</style>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-4">
            <Field name="linkUrl">
              <FieldLabel htmlFor="linkUrl">URL</FieldLabel>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    confirmLink()
                  }
                }}
                autoFocus
                aria-label="Link URL"
              />
            </Field>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} />
            <Button onClick={confirmLink}>Insert</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-4 flex flex-col gap-4">
            <Field name="imageUrl">
              <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                autoFocus
                aria-label="Image URL"
              />
            </Field>
            <Field name="imageAlt">
              <FieldLabel htmlFor="imageAlt">Alt Text</FieldLabel>
              <Input
                id="imageAlt"
                type="text"
                placeholder="Describe the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    confirmImage()
                  }
                }}
                aria-label="Image alt text"
              />
            </Field>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} />
            <Button onClick={confirmImage}>Insert</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
