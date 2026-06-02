import { pdf } from '@react-pdf/renderer'
import PatternPdfDocument from '../components/modules/PatternPdfDocument'
import { buildPatternExportData } from './patternExport'

/**
 * Generate and download a PDF pattern file
 */
export async function downloadPatternPdf(grid, colors, gridSize, isValid) {
  const exportData = buildPatternExportData(grid, colors, gridSize)
  const doc = <PatternPdfDocument exportData={exportData} isValid={isValid} />
  const blob = await pdf(doc).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `granny-pattern-${gridSize}x${gridSize}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
