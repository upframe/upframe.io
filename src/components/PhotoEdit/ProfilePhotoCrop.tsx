import React, { useRef, useState, MutableRefObject } from 'react'
import * as S from './styles'
import PhotoCrop from './PhotoCrop'
import { Title, Button, Modal, Spinner } from '..'
import resize from './resize'

interface Props {
  photo: string
  name: string
  onCancel(): void
  onSave(data: string): void
  ratio?: number
}

export default function ProfilePhotoCrop({
  photo,
  name,
  onCancel,
  onSave,
  ratio = 1,
}: Props) {
  const previewRef = useRef() as MutableRefObject<HTMLImageElement>
  const [loading, setLoading] = useState(false)

  function crop() {
    const select = document.querySelector(`.${S.Selection.styledComponentId}`)
    const img = document.querySelector<HTMLImageElement>(
      `.${S.Img.styledComponentId}`
    )
    if (!select) throw new Error("couldn't find selection")
    if (!img) throw new Error("couldn't find image")
    setLoading(true)
    resize(select.getBoundingClientRect(), img).then(data => {
      setLoading(false)
      onSave(data)
    })
  }

  if (loading)
    return (
      <Modal title="Uploading your photo…">
        <Spinner />
      </Modal>
    )
  return (
    <Modal
      title="Crop your photo"
      actions={[
        <Button onClick={onCancel} key="cancel">
          Cancel
        </Button>,
        <Button filled onClick={crop} key="save">
          Save
        </Button>,
      ]}
      cstSize
    >
      <PhotoCrop {...{ photo, ratio, previewRef }} />
      <Title size={4}>Preview</Title>
      <S.Preview>
        <S.PreviewImgWrap>
          <img ref={previewRef} alt="preview" src={photo} />
        </S.PreviewImgWrap>
        <S.Name>{name}</S.Name>
      </S.Preview>
    </Modal>
  )
}
