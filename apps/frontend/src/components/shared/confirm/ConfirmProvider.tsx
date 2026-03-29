"use client";

import { useEffect, useState } from "react";
import { Modal as AntModal, Typography } from "antd";
import type { ReactNode } from "react";
import {
  registerConfirmHandler,
  unregisterConfirmHandler,
  setDefaultConfirmTexts,
  ConfirmOptions,
} from "./confirmService";
import { useTranslations } from "next-intl";

type Pending = {
  visible: boolean;
  opts?: ConfirmOptions;
  resolve?: (value: boolean) => void;
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const tCommon = useTranslations("common");
  const [pending, setPending] = useState<Pending>({ visible: false });

  useEffect(() => {
    // set localized defaults
    setDefaultConfirmTexts({
      deleteTitle: tCommon("delete") ?? "Delete",
      deleteContent: tCommon("confirm") ?? "Confirm",
      deleteOk: tCommon("yes") ?? "Yes",
      deleteCancel: tCommon("no") ?? "No",
      updateTitle: tCommon("edit") ?? "Edit",
      updateContent: tCommon("confirm") ?? "Confirm",
      updateOk: tCommon("yes") ?? "Yes",
      updateCancel: tCommon("no") ?? "No",
    });

    const handler = async (opts: ConfirmOptions) => {
      return new Promise<boolean>((resolve) => {
        setPending({ visible: true, opts, resolve });
      });
    };

    registerConfirmHandler(handler);
    return () => unregisterConfirmHandler();
  }, [tCommon]);

  const close = (value: boolean) => {
    if (pending.resolve) pending.resolve(value);
    setPending({ visible: false });
  };

  return (
    <>
      {children}
      <AntModal
        open={pending.visible}
        title={pending.opts?.title}
        onOk={() => close(true)}
        onCancel={() => close(false)}
        okText={pending.opts?.okText}
        cancelText={pending.opts?.cancelText}
        okButtonProps={pending.opts?.okDanger ? { danger: true } : undefined}
        width={pending.opts?.width}
      >
        <Typography.Text>{pending.opts?.content}</Typography.Text>
      </AntModal>
    </>
  );
}
