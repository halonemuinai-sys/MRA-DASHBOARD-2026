import { TYPE, LAYOUT } from '../design/tokens'

/** Standard section wrapper — fixes M4: consistent section headers */
export default function Section({ title, sub, action, children, className = '' }) {
  return (
    <div className={`${LAYOUT.sectionGap} ${className}`}>
      {(title || action) && (
        <div className="flex items-end justify-between mb-3">
          <div>
            {title && <h2 className={TYPE.label}>{title}</h2>}
            {sub   && <p  className={`${TYPE.caption} mt-0.5`}>{sub}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
