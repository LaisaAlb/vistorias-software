export function ConfirmDialog({
    open,
    title,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmVariant = 'primary',
    loading = false,
    onConfirm,
    onClose,
}: Props) {
    if (!open) return null

    const confirmClasses =
        confirmVariant === 'danger'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 text-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="w-full max-w-sm bg-white rounded-xl border shadow-lg p-5">
                <h2 id="confirm-title" className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>

                <div className="mt-5 flex justify-end gap-2 justify-center">
                    <button
                        type="button"
                        className="border rounded-lg px-4 py-2 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={`${confirmClasses} text-white rounded-lg px-4 py-2 disabled:opacity-60`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Aguarde...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}