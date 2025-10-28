import html2canvas from 'html2canvas'

export async function exportChartAsImage(
  elementId: string,
  filename: string = 'chart'
): Promise<void> {
  const element = document.getElementById(elementId)
  
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    })

    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) return

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`
      link.href = url
      link.click()

      // Cleanup
      URL.revokeObjectURL(url)
    })
  } catch (error) {
    console.error('Error exporting chart:', error)
  }
}

export async function exportChartAsJPG(
  elementId: string,
  filename: string = 'chart'
): Promise<void> {
  const element = document.getElementById(elementId)
  
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
    })

    // Convert to JPEG
    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.jpg`
      link.href = url
      link.click()

      URL.revokeObjectURL(url)
    }, 'image/jpeg', 0.95)
  } catch (error) {
    console.error('Error exporting chart:', error)
  }
}
