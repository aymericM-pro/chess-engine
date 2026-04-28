interface Props {
  sqSize: number
}

export function RankLabels({ sqSize }: Props) {
  return (
    <div className="flex flex-col flex-shrink-0" style={{ height: sqSize * 8 }}>
      {[8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
        <span
          key={r}
          className="flex items-center justify-center text-white/60 font-serif font-semibold"
          style={{ width: 20, height: sqSize, fontSize: '0.75rem' }}
        >
          {r}
        </span>
      ))}
    </div>
  )
}

export function FileLabels({ sqSize }: Props) {
  return (
    <div className="flex" style={{ marginLeft: 26 }}>
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((f) => (
        <span
          key={f}
          className="text-center text-white/60 font-serif font-semibold pt-[5px]"
          style={{ width: sqSize, fontSize: '0.75rem' }}
        >
          {f}
        </span>
      ))}
    </div>
  )
}
