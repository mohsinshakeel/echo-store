"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Container } from "@/components/common";
import { signupFormSchema, SignupFormData } from "@/lib/validations";
import { useAuth } from "@/lib/auth-context";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Droplets,
  User,
  CheckCircle,
} from "lucide-react";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signup, error, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
  });

  // Clear form on mount to prevent any browser autofill
  useEffect(() => {
    reset({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    });
  }, [reset]);

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      const success = await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (success) {
        setSignupSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center p-4">
        <Container maxWidth="form" className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Account Created Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Welcome to EcoBottle! Redirecting you to your dashboard...
              </p>
              <motion.div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <div className="bg-green-500 h-2 rounded-full" />
              </motion.div>
            </Card>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-40"
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-emerald-200 rounded-full opacity-25"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <Container maxWidth="form" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-8">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Droplets className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Join EcoBottle
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create your account and start your eco-friendly journey
              </p>
            </motion.div>

            {/* Signup Form */}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400 w-5 h-5" />
                  <div className="relative flex-1">
                    <input
                      {...register("firstName")}
                      placeholder="First name"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className={`
                        w-full px-4 py-3 border rounded-lg transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        ${
                          errors.firstName?.message
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        }
                        dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      `}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-gray-400 w-5 h-5" />
                  <div className="relative flex-1">
                    <input
                      {...register("lastName")}
                      placeholder="Last name"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className={`
                        w-full px-4 py-3 border rounded-lg transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        ${
                          errors.lastName?.message
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        }
                        dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      `}
                    />
                  </div>
                </div>
              </div>
              {/* Error messages for name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {errors.firstName?.message && (
                  <motion.p
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.firstName.message}
                  </motion.p>
                )}
                {errors.lastName?.message && (
                  <motion.p
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.lastName.message}
                  </motion.p>
                )}
              </div>

              {/* Username Field */}
              <div className="flex items-center gap-3">
                <User className="text-gray-400 w-5 h-5" />
                <div className="relative flex-1">
                  <input
                    {...register("username")}
                    placeholder="Choose a username"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`
                      w-full px-4 py-3 border rounded-lg transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      ${
                        errors.username?.message
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }
                      dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                  />
                </div>
              </div>
              {errors.username?.message && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.username.message}
                </motion.p>
              )}

              {/* Email Field */}
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400 w-5 h-5" />
                <div className="relative flex-1">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`
                      w-full px-4 py-3 border rounded-lg transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      ${
                        errors.email?.message
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }
                      dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                  />
                </div>
              </div>
              {errors.email?.message && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.email.message}
                </motion.p>
              )}

              {/* Password Field */}
              <div className="flex items-center gap-3">
                <Lock className="text-gray-400 w-5 h-5" />
                <div className="relative flex-1">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`
                      w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      ${
                        errors.password?.message
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }
                      dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password?.message && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.password.message}
                </motion.p>
              )}

              {/* Confirm Password Field */}
              <div className="flex items-center gap-3">
                <Lock className="text-gray-400 w-5 h-5" />
                <div className="relative flex-1">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`
                      w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      ${
                        errors.confirmPassword?.message
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }
                      dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword?.message && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}

              {/* Terms and Marketing */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    {...register("agreeToTerms")}
                    type="checkbox"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-green-600 dark:text-green-400 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-green-600 dark:text-green-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </motion.form>

            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default SignupPage;
