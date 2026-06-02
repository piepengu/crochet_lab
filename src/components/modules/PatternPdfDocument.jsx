import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1A1A1A',
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cell: {
    width: 36,
    height: 36,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  rowLine: {
    fontSize: 10,
    fontFamily: 'Courier',
    marginBottom: 4,
    paddingLeft: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    marginRight: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#999',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    paddingBottom: 4,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 9,
  },
  colLabel: { width: 40 },
  colSquares: { width: 60 },
  colGrams: { width: 70 },
  colPercent: { width: 50 },
  footer: {
    marginTop: 24,
    fontSize: 8,
    color: '#888',
  },
  invalidBanner: {
    backgroundColor: '#FEE',
    padding: 8,
    marginBottom: 12,
    fontSize: 9,
    color: '#C0392B',
  },
})

export default function PatternPdfDocument({ exportData, isValid }) {
  const {
    grid,
    gridSize,
    rows,
    yarnEstimates,
    labelEntries,
    totalGrams,
    generatedAt,
  } = exportData

  const cellSize = gridSize <= 4 ? 36 : 28

  return (
    <Document title={`Granny Pattern ${gridSize}×${gridSize}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Granny Square Pattern</Text>
        <Text style={styles.subtitle}>
          The Algorithmic Loop · {gridSize}×{gridSize} · Generated {generatedAt}
        </Text>

        {!isValid && (
          <View style={styles.invalidBanner}>
            <Text>
              Warning: This pattern has adjacent same-color squares. Fix conflicts before
              crocheting.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Color key</Text>
        {labelEntries.map(({ color, label }) => (
          <View key={label} style={styles.legendRow}>
            <View style={[styles.legendSwatch, { backgroundColor: color }]} />
            <Text>
              {label} — {color.toUpperCase()}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Pattern grid</Text>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((color, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color || '#eee',
                  },
                ]}
              />
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Row instructions</Text>
        {rows.map(({ rowNumber, instruction }) => (
          <Text key={rowNumber} style={styles.rowLine}>
            Row {rowNumber}: [{instruction}]
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Estimated yarn usage</Text>
        <Text style={{ fontSize: 9, marginBottom: 8, color: '#666' }}>
          Approximate planning estimate (~8 g per square). Actual usage varies by hook, yarn
          weight, and tension.
        </Text>
        <View style={styles.tableHeader}>
          <Text style={styles.colLabel}>Color</Text>
          <Text style={styles.colSquares}>Squares</Text>
          <Text style={styles.colGrams}>Est. (g)</Text>
          <Text style={styles.colPercent}>%</Text>
        </View>
        {yarnEstimates.map(({ label, squares, grams, percent }) => (
          <View key={label} style={styles.tableRow}>
            <Text style={styles.colLabel}>{label}</Text>
            <Text style={styles.colSquares}>{squares}</Text>
            <Text style={styles.colGrams}>{grams}</Text>
            <Text style={styles.colPercent}>{percent}%</Text>
          </View>
        ))}
        <View style={[styles.tableRow, { marginTop: 6, fontFamily: 'Helvetica-Bold' }]}>
          <Text style={styles.colLabel}>Total</Text>
          <Text style={styles.colSquares}>{gridSize * gridSize}</Text>
          <Text style={styles.colGrams}>{totalGrams}</Text>
          <Text style={styles.colPercent}>100%</Text>
        </View>

        <Text style={styles.footer}>
          Generated by The Algorithmic Loop — graph coloring ensures no adjacent squares share
          the same color.
        </Text>
      </Page>
    </Document>
  )
}
