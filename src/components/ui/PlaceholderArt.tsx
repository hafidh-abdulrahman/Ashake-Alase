import type { Product } from '@/types'

/**
 * Designed stand-ins for food photography. Purely illustrative, flat and brand-toned,
 * so an empty image slot never looks broken. Replaced automatically once a real photo loads.
 */
type Variant = Product['placeholder']

const bgs: Record<Variant, string> = {
  plate: '#f4dc8f',
  grill: '#26365c',
  tray: '#f2bfae',
  box: '#dcb673',
}

const Grain = ({ pts, fill }: { pts: Array<[number, number, number]>; fill: string }) => (
  <>
    {pts.map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r * 1.8} ry={r} transform={`rotate(${(i * 47) % 180} ${x} ${y})`} fill={fill} />
    ))}
  </>
)

const riceA: Array<[number, number, number]> = [[150,205,4],[172,192,4],[195,214,4],[140,238,4],[168,232,4],[190,250,4],[152,265,4],[178,272,4],[128,215,4],[205,236,4],[120,252,4],[160,215,3]]
const riceB: Array<[number, number, number]> = [[158,222,3],[182,204,3],[135,228,3],[176,252,3],[200,226,3],[146,258,3],[168,186,3],[188,268,3]]

function Plate() {
  return (
    <>
      <circle cx="206" cy="262" r="156" fill="#000" opacity="0.08" />
      <circle cx="200" cy="250" r="156" fill="#fffdf3" />
      <circle cx="200" cy="250" r="128" fill="none" stroke="#eadfb9" strokeWidth="3" />
      <circle cx="168" cy="236" r="70" fill="#d4472a" />
      <Grain pts={riceA} fill="#e9703f" />
      <Grain pts={riceB} fill="#a93219" />
      <g transform="rotate(-24 262 200)">
        <ellipse cx="262" cy="200" rx="46" ry="30" fill="#8f5226" />
        <ellipse cx="256" cy="194" rx="34" ry="19" fill="#b8763a" />
        <ellipse cx="248" cy="188" rx="12" ry="5" fill="#d59a58" opacity="0.7" />
      </g>
      <g transform="rotate(18 268 262)">
        <ellipse cx="268" cy="262" rx="36" ry="24" fill="#8f5226" />
        <ellipse cx="264" cy="257" rx="26" ry="15" fill="#b8763a" />
      </g>
      {[[214, 322], [244, 314], [274, 318], [300, 300]].map(([x, y], i) => (
        <g key={i} transform={`rotate(${-20 + i * 14} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="20" ry="11" fill="#e9a93a" />
          <ellipse cx={x} cy={y} rx="20" ry="11" fill="none" stroke="#7a4a12" strokeWidth="3" strokeDasharray="14 60" strokeDashoffset="-6" />
        </g>
      ))}
      <ellipse cx="128" cy="304" rx="16" ry="8" fill="#5b7f3a" transform="rotate(-30 128 304)" />
      <ellipse cx="146" cy="316" rx="12" ry="6" fill="#6d9646" transform="rotate(20 146 316)" />
    </>
  )
}

function Grill() {
  return (
    <>
      <g transform="rotate(-8 200 260)">
        <rect x="52" y="120" width="300" height="290" rx="26" fill="#000" opacity="0.18" transform="translate(6 10)" />
        <rect x="52" y="120" width="300" height="290" rx="26" fill="#b98247" />
        {[160, 210, 260, 310, 360].map((y) => (
          <line key={y} x1="64" x2="340" y1={y} y2={y + 2} stroke="#a06c37" strokeWidth="2" opacity="0.6" />
        ))}
        {[176, 256, 336].map((y, row) => (
          <g key={y}>
            <line x1="40" x2="366" y1={y} y2={y} stroke="#ecd7ab" strokeWidth="5" strokeLinecap="round" />
            {[0, 1, 2, 3, 4].map((i) => {
              const x = 84 + i * 56
              const fill = ['#8c3d22', '#3f6b34', '#c4402a', '#7a3319', '#e0a13a'][(i + row) % 5]
              return (
                <g key={i}>
                  <rect x={x} y={y - 19} width="44" height="38" rx="12" fill={fill} />
                  <rect x={x + 8} y={y - 12} width="14" height="6" rx="3" fill="#fff" opacity="0.18" />
                </g>
              )
            })}
          </g>
        ))}
        <circle cx="318" cy="378" r="24" fill="#f1e6c3" />
        <circle cx="318" cy="378" r="16" fill="#c4402a" />
      </g>
    </>
  )
}

function Tray() {
  return (
    <>
      <rect x="44" y="110" width="320" height="290" rx="34" fill="#000" opacity="0.1" transform="translate(6 10)" />
      <rect x="44" y="110" width="320" height="290" rx="34" fill="#dfe4ec" />
      <rect x="62" y="128" width="284" height="254" rx="24" fill="#c3cad6" />
      <rect x="72" y="138" width="264" height="234" rx="18" fill="#f8f2df" />
      {[[130, 200], [172, 178], [176, 226], [132, 246], [216, 202], [90, 214], [214, 250]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="24" fill="#d8963a" />
          <circle cx={x - 6} cy={y - 7} r="7" fill="#efb968" opacity="0.8" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`rotate(-22 ${290} ${190 + i * 44})`}>
          <rect x="252" y={176 + i * 44} width="72" height="26" rx="13" fill="#b9722a" />
          <rect x="258" y={181 + i * 44} width="40" height="7" rx="3.5" fill="#dca05a" opacity="0.7" />
        </g>
      ))}
      <rect x="94" y="300" width="96" height="48" rx="24" fill="#c4402a" />
      <rect x="208" y="300" width="96" height="48" rx="24" fill="#5b7f3a" />
    </>
  )
}

function Box() {
  return (
    <>
      <rect x="50" y="120" width="300" height="280" rx="30" fill="#000" opacity="0.12" transform="translate(6 10)" />
      <rect x="50" y="120" width="300" height="280" rx="30" fill="#c58a4c" />
      <rect x="66" y="136" width="268" height="248" rx="20" fill="#e4bf86" />
      <path d="M200 136v248M66 258h268" stroke="#c58a4c" strokeWidth="6" opacity="0" />
      <rect x="80" y="150" width="150" height="220" rx="16" fill="#d4472a" />
      <Grain pts={[[110,190,4],[140,178,4],[170,200,4],[196,180,4],[120,230,4],[152,240,4],[188,236,4],[108,280,4],[142,290,4],[176,276,4],[204,300,4],[128,330,4],[162,336,4]]} fill="#ee7a48" />
      <Grain pts={[[124,204,3],[158,214,3],[184,196,3],[136,262,3],[170,260,3],[120,308,3],[190,322,3]]} fill="#a93219" />
      <g transform="rotate(-14 282 210)">
        <ellipse cx="282" cy="210" rx="44" ry="34" fill="#8f5226" />
        <ellipse cx="276" cy="203" rx="32" ry="22" fill="#b8763a" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`rotate(${-8 + i * 8} 282 ${290 + i * 26})`}>
          <ellipse cx="282" cy={290 + i * 26} rx="40" ry="11" fill="#e9a93a" />
        </g>
      ))}
    </>
  )
}

export function PlaceholderArt({ variant, label = true }: { variant: Variant; label?: boolean }) {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
      <rect width="400" height="500" fill={bgs[variant]} />
      {variant === 'plate' && <Plate />}
      {variant === 'grill' && <Grill />}
      {variant === 'tray' && <Tray />}
      {variant === 'box' && <Box />}
      {label && (
        <text x="200" y="452" textAnchor="middle" fontSize="13" fontFamily="system-ui, sans-serif" fill={variant === 'grill' ? '#fff' : '#1d2947'} opacity="0.55">
          Photo placeholder
        </text>
      )}
    </svg>
  )
}
