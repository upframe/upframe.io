const MAX_IMG_SIZE = 5e6

export default async function (
  select: DOMRect,
  img: HTMLImageElement
): Promise<string> {
  const imgRect = img.getBoundingClientRect()
  const { naturalWidth, naturalHeight } = img
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  return await new Promise(resolve => {
    const step = (scale = 1) => {
      canvas.width = (select.width / imgRect.width) * naturalWidth * scale
      canvas.height = (select.height / imgRect.height) * naturalHeight * scale

      const tmpImg = new Image()
      tmpImg.onload = () => {
        ctx.drawImage(
          tmpImg,
          0,
          0,
          naturalWidth,
          naturalHeight,
          -((select.left - imgRect.left) / imgRect.width) *
            naturalWidth *
            scale,
          -(
            ((select.top - imgRect.top) / imgRect.height) *
            naturalHeight *
            scale
          ),
          naturalWidth * scale,
          naturalHeight * scale
        )
        let data = canvas.toDataURL()
        const size = new Blob([data]).size

        if (size > MAX_IMG_SIZE) {
          step(scale * (1 / Math.sqrt(size / MAX_IMG_SIZE)) * 0.99)
        } else resolve(data)
      }
      tmpImg.src = img.src
    }
    step()
  })
}
