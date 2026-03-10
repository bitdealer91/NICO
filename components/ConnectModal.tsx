"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";

type ConnectModalProps = {
  open: boolean;
  onClose: () => void;
};

type Errors = {
  email?: string;
  telegram?: string;
  message?: string;
  form?: string;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConnectModalInner({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    return !submitting && !success;
  }, [submitting, success]);

  function validate(): Errors {
    const next: Errors = {};
    const hasContact = email.trim().length > 0 || telegram.trim().length > 0;
    if (!hasContact) next.form = "Add at least one contact method (email or Telegram).";
    if (!message.trim()) next.message = "Message is required.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (telegram.trim() && !/^@?[\w\d_]{3,32}$/.test(telegram.trim())) next.telegram = "Enter a valid @username.";
    return next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const delay = 800 + Math.floor(Math.random() * 400);
    await new Promise((r) => setTimeout(r, delay));
    setSubmitting(false);
    setSuccess(true);
  }

  const overlayMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const panelMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 14, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: 10, filter: "blur(10px)" },
      };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <motion.div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        {...overlayMotion}
        transition={{ duration: 0.18 }}
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6">
          <DialogPanel className="w-full max-w-[640px]">
            <motion.div
              {...panelMotion}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-[28px] border border-white/12 bg-white/[0.06] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <DialogTitle className="text-xl font-semibold tracking-tight text-white">Let’s connect</DialogTitle>
                  <div className="mt-1 text-sm text-white/65">Tell us what you’re building — we’ll respond fast.</div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/80 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                >
                  Close
                </button>
              </div>

              <div className="mt-6">
                {success ? (
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <div className="flex items-center gap-3 text-[var(--gold)]">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[rgba(226,178,90,0.16)]">
                        <CheckIcon />
                      </div>
                      <div className="text-base font-semibold text-white">Thanks! We’ll get back to you.</div>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-white/65">
                      We’ll reach out via the contact method you provided.
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(226,178,90,0.22)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    {errors.form && (
                      <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/75">
                        {errors.form}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <div className="text-xs tracking-[0.22em] uppercase text-white/60">Email</div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        />
                        {errors.email && <div className="mt-2 text-xs text-white/65">{errors.email}</div>}
                      </label>

                      <label className="block">
                        <div className="text-xs tracking-[0.22em] uppercase text-white/60">Telegram</div>
                        <input
                          type="text"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          placeholder="@username"
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        />
                        {errors.telegram && <div className="mt-2 text-xs text-white/65">{errors.telegram}</div>}
                      </label>
                    </div>

                    <label className="block">
                      <div className="text-xs tracking-[0.22em] uppercase text-white/60">What’s the ask?</div>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Briefly describe what you need help with…"
                        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white placeholder:text-white/35 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                      />
                      {errors.message && <div className="mt-2 text-xs text-white/65">{errors.message}</div>}
                    </label>

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="text-xs text-white/45">Required: message + (email or Telegram)</div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(226,178,90,0.22)] hover:brightness-105 disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {submitting ? "Sending…" : "Send"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export function ConnectModal({ open, onClose }: ConnectModalProps) {
  return (
    <AnimatePresence>
      {open ? <ConnectModalInner key="connect" onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

