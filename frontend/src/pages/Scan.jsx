import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BillDropzone from '@/components/scanner/BillDropzone'
import ScanningOverlay from '@/components/scanner/ScanningOverlay'
import ScanResults from '@/components/scanner/ScanResults'
import ScanError from '@/components/scanner/ScanError'
import Button from '@/components/ui/Button'
import { useScanBill } from '@/hooks/useScanBill'
import { useInventory } from '@/context/InventoryContext'
import { ScanLine } from 'lucide-react'

export default function Scan() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const { status, error, result, run, reset } = useScanBill()
  const { addScannedItems } = useInventory()
  const [committed, setCommitted] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (status === 'success' && result && !committed) {
      addScannedItems(result.items)
      setCommitted(true)
    }
  }, [status, result, committed, addScannedItems])

  const handleFileSelected = useCallback(
    (f) => {
      setFile(f)
      reset()
      setCommitted(false)
    },
    [reset]
  )

  const handleClear = useCallback(() => {
    setFile(null)
    reset()
    setCommitted(false)
  }, [reset])

  const handleScanAnother = useCallback(() => {
    setFile(null)
    reset()
    setCommitted(false)
  }, [reset])

  const isBusy = status === 'uploading' || status === 'reading'

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 sm:py-20">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-100 text-olive-800 px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-4">
          <ScanLine size={12} strokeWidth={2.5} />
          Bill scanner
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-ink text-balance">
          Snap it. Pantrio reads it.
        </h1>
        <p className="mt-3 text-ink-faint text-base sm:text-lg max-w-lg mx-auto text-balance">
          Drop in a photo of your grocery receipt — real OCR turns it into a living pantry, instantly.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' && result ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScanResults items={result.items} onScanAnother={handleScanAnother} />
          </motion.div>
        ) : status === 'error' ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
            {preview && <img src={preview} alt="" className="hidden" />}
            <ScanError error={error} onRetry={handleScanAnother} />
          </motion.div>
        ) : isBusy ? (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScanningOverlay preview={preview} status={status} />
          </motion.div>
        ) : (
          <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
            <BillDropzone onFileSelected={handleFileSelected} preview={preview} onClear={handleClear} />
            {file && (
              <Button variant="rust" size="lg" icon={ScanLine} onClick={() => run(file)}>
                Read this bill
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
