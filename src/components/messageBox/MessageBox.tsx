import React, {useState} from "react";
import { Modal, Button, ModalBody, ModalDialog, ModalHeader, ModalTitle, ModalFooter } from "react-bootstrap";

interface ResolverType {
    resolve?:  (value: boolean | PromiseLike<boolean>) => void
}

const useMessageBox = (): [(messageText: string) => Promise<boolean>, () => void] => {

    const [isOpen, setIsOpen] = useState(false);
    const [resolver, setResolver] = useState({} as ResolverType);
    const [message, setMessage] = useState("");

    const showMessage = async (messageText: string) : Promise<boolean> => {
        setMessage(messageText);
        setIsOpen(true);
        const promise = new Promise<boolean>(res => {
            setResolver({ resolve: res});
        });
        return promise;
    }

    const onClick = async (status: boolean) => {
        setIsOpen(false);
        if(resolver.resolve) {
            resolver.resolve(status);
        }
    }

    const MessageBox = () => {
        return (
        <Modal show={isOpen}>
            <ModalDialog>
                <ModalHeader>
                    <ModalTitle>Confirm?</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => onClick(false)}>Cancel</Button>
                    <Button onClick={() => onClick(true)}>OK</Button>
                </ModalFooter>
            </ModalDialog>
        </Modal>
        )
    }

    return [showMessage, MessageBox];
}

export default useMessageBox;
