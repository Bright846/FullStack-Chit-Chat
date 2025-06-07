import React from "react";
import { User, Lock, Mail } from "lucide-react";

const icons = [User, null, Lock, null, Mail, null, User, null, Lock];

const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, i) => {
                        const Icon = icons[i];
                        return (
                            <div
                                key={i}
                                className={`aspect-square rounded-2xl flex items-center justify-center
                                    ${i % 2 === 0 ? "bg-primary/10" : "bg-secondary/10"}
                                    ${i % 3 === 0 ? "animate-pulse" : ""}
                                `}
                            >
                                {Icon && <Icon className="text-primary size-5" />}
                            </div>
                        );
                    })}
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;
