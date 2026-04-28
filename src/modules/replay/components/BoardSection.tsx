import { useState, useEffect } from 'react'
import { ChessBoard, getSqSize } from './ChessBoard'
import { RankLabels, FileLabels } from './BoardLabels'
import { TransportControls } from './TransportControls'

export function BoardSection() {
  const [sqSize, setSqSize] = useState(getSqSize)

  useEffect(() => {
    const onResize = () => setSqSize(getSqSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const totalWidth = sqSize * 8 + 26

  return (
    <div id="board-section" className="flex flex-col items-start flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <RankLabels sqSize={sqSize} />
        <ChessBoard />
      </div>
      <FileLabels sqSize={sqSize} />
      <TransportControls width={totalWidth} />
    </div>
  )
}
