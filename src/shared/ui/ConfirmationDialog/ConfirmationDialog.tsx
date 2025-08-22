import { useUiStore } from '../../../stores/uiStore';
import { Button } from '../Button';
import './ConfirmationDialog.css';

export function ConfirmationDialog() {
    const { confirmationState, hideConfirmation } = useUiStore();
    const { isOpen, title, message, onConfirm } = confirmationState;

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        onConfirm();
        hideConfirmation();
    };

    return (
        <div className="dialog-overlay" onClick={hideConfirmation}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="dialog-title">{title}</h3>
                <p className="dialog-message">{message}</p>
                <div className="dialog-actions">
                    <Button className="cancel-button" onClick={hideConfirmation}>
                        取消
                    </Button>
                    <Button className="confirm-button" onClick={handleConfirm}>
                        确认
                    </Button>
                </div>
            </div>
        </div>
    );
}