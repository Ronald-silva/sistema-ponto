import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center py-16">
          {/* Modal */}
          <Dialog.Panel className="w-[360px] rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-zinc-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-medium text-zinc-900">
                  {title}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-4">
              {children}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
