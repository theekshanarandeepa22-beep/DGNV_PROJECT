type ConfirmModalProps = {
  title: string;
  message: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({
  title,
  message,
  confirmText = "Confirm",
  onCancel,
  onConfirm,
}: ConfirmModalProps) => (
  <div className="modal-backdrop-custom">
    <div className="glass-card confirm-modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
