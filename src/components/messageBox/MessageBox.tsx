import React, {ReactNode, useState} from "react";
import { Modal, Button, ModalBody, ModalDialog, ModalHeader, ModalTitle, ModalFooter } from "react-bootstrap";

import MessageBoxType from "./types/messageBoxType";
import MessageBoxResult from "./types/messageBoxResult";

import './MessageBox.css';

interface ResolverType {
    resolve?:  (value: MessageBoxResult | PromiseLike<MessageBoxResult>) => void
}

const useMessageBox = (): [(messageText: string, titleText: string, messageBoxType: MessageBoxType) => Promise<MessageBoxResult>, () => ReactNode] => {

    const [isOpen, setIsOpen] = useState(false);
    const [resolver, setResolver] = useState({} as ResolverType);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [messageBoxType, setMessageBoxType] = useState(MessageBoxType.OKCancel);
    const [acceptButtonText, setAcceptButtonText] = useState("OK");
    const [dismissButtonText, setDismissButtonText] = useState("Cancel");

    const setButtonText = (type: MessageBoxType) => {
        switch(type) {
            case MessageBoxType.OK:
                setAcceptButtonText("OK");
                setDismissButtonText("");
                break;
            case MessageBoxType.OKCancel:
                setAcceptButtonText("OK");
                setDismissButtonText("Cancel");
                break;
            case MessageBoxType.YesNo:
                setAcceptButtonText("Yes");
                setDismissButtonText("No");
                break;
            default:
                setAcceptButtonText("OK");
                setDismissButtonText("Cancel");
                break;
        }
    }

    const showMessage = async (messageText: string, titleText: string, messageBoxType: MessageBoxType) : Promise<MessageBoxResult> => {
        setMessage(messageText);
        setTitle(titleText);
        setMessageBoxType(messageBoxType);
        setButtonText(messageBoxType);
        setIsOpen(true);
        const promise = new Promise<MessageBoxResult>(res => {
            setResolver({ resolve: res});
        });
        return promise;
    }

    const onClick = async (isAccepted: boolean) => {
        setIsOpen(false);
        let resultType = MessageBoxResult.Cancel;
        if(isAccepted) {
            resultType = (messageBoxType === MessageBoxType.OKCancel || messageBoxType === MessageBoxType.OK) ? MessageBoxResult.OK : MessageBoxResult.Yes;
        } else {
            resultType = messageBoxType === MessageBoxType.OKCancel ? MessageBoxResult.Cancel : MessageBoxResult.No;
        }         
        if(resolver.resolve) {
            resolver.resolve(resultType);
        }
    }

    const MessageBox = () => {
        return (
        <Modal show={isOpen} className="message-box">
            <ModalDialog>
                <ModalHeader>
                    <ModalTitle className="fs-5">{title}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p className="message">{message}</p>
                </ModalBody>
                <ModalFooter>
                    {
                        dismissButtonText.length > 0 &&
                        <Button variant="secondary" onClick={() => onClick(false)}>{dismissButtonText}</Button>
                    }
                    <Button variant="primary" onClick={() => onClick(true)}>{acceptButtonText}</Button>
                </ModalFooter>
            </ModalDialog>
        </Modal>
        )
    }

    return [showMessage, MessageBox];
}

export default useMessageBox;
