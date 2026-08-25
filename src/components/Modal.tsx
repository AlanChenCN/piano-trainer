import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'

type PopoverPlacement = 'top' | 'bottom'
type PopoverSize = 'compact' | 'wide'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
  placement: PopoverPlacement
  size?: PopoverSize
  headerActions?: ReactNode
  children: ReactNode
}

function Modal({
  isOpen,
  title,
  onClose,
  anchorRef,
  placement,
  size = 'compact',
  headerActions,
  children,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  })

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    function updatePosition() {
      const anchor = anchorRef.current
      const dialog = dialogRef.current

      if (!anchor || !dialog) {
        return
      }

      const anchorRect = anchor.getBoundingClientRect()
      const viewportMargin = 16
      const gap = 8
      const dialogWidth = dialog.offsetWidth
      const dialogHeight = dialog.offsetHeight
      const preferredTop =
        placement === 'top'
          ? anchorRect.top - dialogHeight - gap
          : anchorRect.bottom + gap
      const canPlaceBelow =
        anchorRect.bottom + gap + dialogHeight <=
        window.innerHeight - viewportMargin
      const canPlaceAbove =
        anchorRect.top - gap - dialogHeight >= viewportMargin
      const shouldPlaceAbove =
        placement === 'top'
          ? !canPlaceAbove && canPlaceBelow
          : !canPlaceBelow && canPlaceAbove
      const preferredPosition = shouldPlaceAbove
        ? anchorRect.top - dialogHeight - gap
        : preferredTop
      const top = Math.min(
        Math.max(preferredPosition, viewportMargin),
        window.innerHeight - dialogHeight - viewportMargin,
      )
      const centeredLeft = anchorRect.left + (anchorRect.width - dialogWidth) / 2
      const left = Math.min(
        Math.max(centeredLeft, viewportMargin),
        window.innerWidth - dialogWidth - viewportMargin,
      )

      setPopoverStyle({
        left,
        top,
        visibility: 'visible',
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchorRef, isOpen, placement])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        dialogRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return
      }

      onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [anchorRef, isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="popover-layer">
      <div
        className={`popover-dialog popover-dialog--${size}`}
        ref={dialogRef}
        style={popoverStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={event => event.stopPropagation()}
      >
        <div className="popover-header">
          <h2 id={titleId}>{title}</h2>
          <div className="popover-header-actions">
            {headerActions}
            <button
              className="app-button app-button--compact popover-close-button"
              type="button"
              aria-label={`Close ${title}`}
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div className="popover-content">{children}</div>
      </div>
    </div>
  )
}

export type { PopoverPlacement }
export type { PopoverSize }
export default Modal
