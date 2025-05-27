'use client';

import React from "react";
import { Fingerprint, KeyRound, User } from "lucide-react";
import PersonalInformationsForm from "./personal-informations.form";
import UpdateIdentifierForm from "./update-identifier.form";
import AvatarForm from "./avatar.form";

export default function ProfileColorPicker() {
    return (
        <div className="tabs tabs-lift">
            <label className="tab flex inline-flex gap-2">
                <input type="radio" name="setting_tab" defaultChecked />
                <User className="w-4 h-4" />
                Informations personelles
            </label>
            <div className="tab-content bg-base-100 border-base-300">
                <div className="max-w-2xl mx-auto">
                    <AvatarForm />
                    <PersonalInformationsForm />
                </div>
            </div>
            <label className="tab flex inline-flex gap-2">
                <input type="radio" name="setting_tab" />
                <Fingerprint className="w-4 h-4" />
                Identification
            </label>
            <div className="tab-content bg-base-100 border-base-300">
                <div className="max-w-2xl mx-auto">
                    <UpdateIdentifierForm />
                </div>
            </div>
            <label className="tab flex inline-flex gap-2">
                <input type="radio" name="setting_tab" />
                <KeyRound className="w-4 h-4" />
                Mot de passe
            </label>
            <div className="tab-content bg-base-100 border-base-300">
                <div className="max-w-2xl mx-auto"></div>
            </div>
        </div>
    );
}