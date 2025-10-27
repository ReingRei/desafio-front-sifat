import React, { Fragment, type ReactNode } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "max-w-sm" | "max-w-md" | "max-w-lg" | "max-w-xl" | "max-w-2xl";
  overlayClose?: boolean;
}

const ModalBase: React.FC<ModalBaseProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-sm",
  overlayClose = true,
}) => {
  const dialogOnCloseHandler = overlayClose ? onClose : () => {};

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={dialogOnCloseHandler}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-25"
          leave="ease-in duration-100"
          leaveFrom="opacity-25"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black opacity-25"
            aria-hidden="true"
          />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto max-w-screen max-h-screen">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
            {" "}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-25 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-25 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={` w-full transform overflow-hidden rounded-lg bg-white p-6 text-left 
                    align-middle shadow-xl transition-all ${maxWidth} sm:my-8`}
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalBase;
