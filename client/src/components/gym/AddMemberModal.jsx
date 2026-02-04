import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../../config";

export default function AddMemberModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        notes: "",
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newMember) => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMember),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to add member');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['members']);
            onClose();
            setFormData({ name: "", phone: "", notes: "" });
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    if (!isOpen) {
        console.log("Modal not open, returning null");
        return null;
    }

    console.log("Modal IS open, rendering portal...");

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const modalContent = (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{
                zIndex: 99999,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white dark:bg-[#1E1E1E] rounded-xl w-full max-w-md shadow-2xl border border-[#E5E5E5] dark:border-[#333333] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5] dark:border-[#333333]">
                    <h2 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">
                        Add New Member
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors"
                    >
                        <X size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Rahul Verma"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                            placeholder="e.g. +91 98765 43210"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all resize-none h-24"
                            placeholder="Health conditions, goals, etc."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB] bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={16} />
                            {mutation.isPending ? 'Saving...' : 'Save Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return document.body ? createPortal(modalContent, document.body) : modalContent;
}
