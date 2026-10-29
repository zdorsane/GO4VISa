"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

const ERRORS: Record<string, string> = {
  missing: "Saisissez votre e-mail et votre mot de passe.",
  invalid: "E-mail ou mot de passe incorrect.",
  throttled: "Trop de tentatives. Réessayez dans 15 minutes.",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4" noValidate>
      <label className="block">
        <span className="text-sm font-medium text-midnight">E-mail</span>
        <input name="email" type="email" autoComplete="username" required className="admin-input mt-1" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-midnight">Mot de passe</span>
        <input name="password" type="password" autoComplete="current-password" required className="admin-input mt-1" />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERRORS[state.error] ?? ERRORS.invalid}
        </p>
      )}
      <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
