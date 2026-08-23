import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, ImagePlus, X, Receipt } from 'lucide-react'

export default function BillDropzone({ onFileSelected, preview, onClear, disabled }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0]
      if (file) onFileSelected(file)
    },
    [onFileSelected]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles, disabled]
  )

  if (preview) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-paper shadow-lift"
        >
          <img src={preview} alt="Bill preview" className="w-full h-80 object-cover" />
          {!disabled && (
            <button
              onClick={onClear}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-cream-soft backdrop-blur hover:bg-ink transition-colors"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`group relative mx-auto flex w-full max-w-md cursor-pointer flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed px-8 py-14 text-center transition-all duration-300 ${
        isDragging
          ? 'border-olive-600 bg-olive-100/60 scale-[1.01]'
          : 'border-ink/15 bg-paper hover:border-olive-500 hover:bg-cream-soft'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <motion.div
        animate={{ y: isDragging ? -4 : 0, rotate: isDragging ? -3 : 0 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-olive-100 text-olive-700 group-hover:bg-olive-700 group-hover:text-cream-soft transition-colors duration-300"
      >
        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div key="drop" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <ImagePlus size={30} strokeWidth={1.8} />
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <Receipt size={30} strokeWidth={1.8} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div>
        <p className="font-display text-xl text-ink">
          {isDragging ? 'Drop it right here' : 'Drag your bill in'}
        </p>
        <p className="mt-1 text-sm text-ink-faint">or click to browse a photo of your receipt</p>
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark px-3 py-1.5 text-xs font-medium text-ink-soft">
        <UploadCloud size={13} />
        JPG, PNG or WEBP
      </span>
    </div>
  )
}
