import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AppContext from "../../context/AppContext";
import { FaWallet } from "react-icons/fa";

const TOPUP = () => {
  const { topUpWallet, isLoggedIn, fetchWallet, wallet } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch wallet on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchWallet();
    }
  }, [isLoggedIn]);

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);

    setLoading(true);
    try {
      await topUpWallet(amount);
      await fetchWallet(); // 👉 Refresh wallet balance
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-md p-6 rounded bg-base-200 shadow">
        {isLoggedIn && (
          <>
            {/* Wallet Balance Display */}
            <div className="flex items-center justify-between mb-6 p-4 bg-base-300 rounded">
              <div className="flex items-center gap-2">
                <FaWallet className="text-2xl" />
                <span className="text-lg font-semibold">
                  Current Balance:
                </span>
              </div>
              <span className="text-xl font-bold">
                ₹{wallet?.balance ?? 0}
              </span>
            </div>

            {/* Top-Up Form */}
            <h2 className="text-xl font-semibold mb-2">Top-Up Wallet</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <input
                type="number"
                step="1"
                placeholder="Enter amount (₹1 - ₹5000)"
                className="input input-bordered"
                disabled={loading}
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 1,
                    message: "Minimum top-up amount is ₹1",
                  },
                  max: {
                    value: 5000,
                    message: "Maximum top-up amount is ₹5000",
                  },
                  validate: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num)) {
                      return "Please enter a valid number";
                    }
                    if (!Number.isInteger(num)) {
                      return "Amount must be a whole number (no decimals)";
                    }
                    return true;
                  },
                })}
              />

              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Top Up"}
              </button>
            </form>
          </>
        )}

        {!isLoggedIn && (
          <p className="text-center text-lg font-semibold">
            Please sign in to top up your wallet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TOPUP;
