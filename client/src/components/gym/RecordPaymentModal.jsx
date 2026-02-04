import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Save, CreditCard, IndianRupee } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../../config";

export default function RecordPaymentModal({ isOpen, onClose, member }) {
    const [formData, setFormData] = useState({
        amount: "",
        planId: "",
        method: "Cash",
        durationDays: 30
    });

    const queryClient = useQueryClient();

    // Fetch Plans
    const { data: plans = [] } = useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/plans`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) return []; // Fail silently or handle
            return res.json();
        },
        enabled: isOpen // Only fetch when open
    });

    const mutation = useMutation({
        mutationFn: async (paymentData) => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...paymentData,
                    memberId: member._id
                }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to record payment');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['members']); // Update member status
            queryClient.invalidateQueries(['dashboardStats']); // Update revenue
            onClose();
            setFormData({ amount: "", planId: "", method: "Cash", durationDays: 30 });
            alert("Payment Recorded Successfully!");
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    if (!isOpen || !member) return null;

    const handlePlanChange = (e) => {
        const planId = e.target.value;
        const selectedPlan = plans.find(p => p._id === planId);
        if (selectedPlan) {
            setFormData({
                ...formData,
                planId,
                amount: selectedPlan.price,
                durationDays: selectedPlan.duration
            });
        } else {
            setFormData({ ...formData, planId: "" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl w-full max-w-md shadow-2xl border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5] dark:border-[#333333]">
                    <div>
                        <h2 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">
                            Record Payment
                        </h2>
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                            For {member.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors"
                    >
                        <X size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">

                    {/* Plan Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                            Select Plan (Optional)
                        </label>
                        <select
                            value={formData.planId}
                            onChange={handlePlanChange}
                            className="w-full px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none"
                        >
                            <option value="">Custom Amount / No Plan</option>
                            {plans.map(plan => (
                                <option key={plan._id} value={plan._id}>
                                    {plan.name} - ₹{plan.price} ({plan.duration} days)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                                Duration (Days)
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.durationDays}
                                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1 font-inter">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Cash', 'Online', 'Card'].map(method => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, method })}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg border ${formData.method === method
                                        ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]'
                                        : 'border-[#E5E5E5] dark:border-[#333333] text-[#374151] dark:text-[#D1D5DB]'
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
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
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                        >
                            <CreditCard size={16} />
                            {mutation.isPending ? 'Processing...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
