import React, { useState, useEffect, useRef } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, Loader2, Smartphone, Globe, GraduationCap, Stethoscope, BookOpen, ShieldCheck, RefreshCw, MessageSquareCode, Phone, Check, AlertTriangle, X } from 'lucide-react';
import { APP_NAME } from '../constants';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string; role: string; avatar?: string }) => void;
}

type Role = 'Student' | 'Educator' | 'Doctor';
type AuthMethod = 'email' | 'mobile';

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [showOtpToast, setShowOtpToast] = useState(false);

  // Security State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Generate new captcha on mount
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // WebOTP API: Listen for incoming SMS (Browser Support)
  useEffect(() => {
    if (otpSent && 'credentials' in navigator) {
      (navigator.credentials as any).get({
        otp: { transport: ['sms'] },
        signal: new AbortController().signal
      }).then((otp: any) => {
        if (otp && otp.code) setOtpInput(otp.code);
      }).catch((err: any) => console.log('WebOTP not triggered', err));
    }
  }, [otpSent]);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput('');
  };

  const validatePassword = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Special char
    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({...formData, password: val});
    setPasswordStrength(validatePassword(val));
  };

  const handleSendOTP = () => {
    if (formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Simulate Network Request to SMS Gateway
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setTimer(30); // 30 seconds cooldown
      
      // GENERATE DYNAMIC OTP
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      
      // SIMULATE REAL-TIME DELIVERY (Toast Notification)
      setShowOtpToast(true);
      setTimeout(() => setShowOtpToast(false), 5000); // Hide after 5s
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    
    // 1. Open a realistic popup window
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Use a dummy Google URL that looks real but is safe
    const popup = window.open(
      'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin', 
      'Google Sign In', 
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // 2. Simulate Authentication Process
    let checkTimer = setInterval(() => {
       if (popup?.closed) {
          clearInterval(checkTimer);
          if (isLoading) setIsLoading(false); // User closed without finishing
       }
    }, 500);

    setTimeout(() => {
      if (popup) popup.close();
      clearInterval(checkTimer);
      setIsLoading(false);

      // Determine if user exists or create new one
      const storedUsers = localStorage.getItem('neet_ai_users');
      const users = storedUsers ? JSON.parse(storedUsers) : {};
      const googleEmail = "student@gmail.com"; 

      if (!users[googleEmail]) {
         const newUser = {
           name: "Google Student",
           email: googleEmail,
           role: "Student",
           password: "",
           avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
         };
         users[googleEmail] = newUser;
         localStorage.setItem('neet_ai_users', JSON.stringify(users));
      }

      onLogin({
        name: users[googleEmail].name,
        email: users[googleEmail].email,
        role: users[googleEmail].role,
        avatar: users[googleEmail].avatar
      });
    }, 2500); // 2.5s simulated delay
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const storedUsers = localStorage.getItem('neet_ai_users');
    const users = storedUsers ? JSON.parse(storedUsers) : {};

    // --- MOBILE OTP FLOW ---
    if (authMethod === 'mobile') {
      if (otpInput !== generatedOtp) {
        setError('Incorrect OTP. Please check your message.');
        setIsLoading(false);
        return;
      }

      const userId = `mobile_${formData.mobile}`;
      
      if (isLogin) {
        if (!users[userId]) {
          setError('Mobile number not registered. Please Sign Up.');
          setIsLoading(false);
          return;
        }
        onLogin(users[userId]);
      } else {
        // Signup
        if (users[userId]) {
          setError('Mobile number already exists. Please Sign In.');
          setIsLoading(false);
          return;
        }
        if (!formData.name) {
          setError('Please enter your name.');
          setIsLoading(false);
          return;
        }
        
        const newUser = {
          name: formData.name,
          email: `${formData.mobile}@mobile.neet.ai`,
          role: selectedRole,
          mobile: formData.mobile
        };
        users[userId] = newUser;
        localStorage.setItem('neet_ai_users', JSON.stringify(users));
        onLogin(newUser);
      }
      return;
    }

    // --- EMAIL PASSWORD FLOW ---

    // 1. Basic Field Validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // 2. Strong Password Check (Only on Signup)
    if (!isLogin && passwordStrength < 3) {
      setError('Password is too weak. Include uppercase, numbers & special chars.');
      setIsLoading(false);
      return;
    }

    // 3. CAPTCHA Verification
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('Incorrect CAPTCHA code. Please verify you are human.');
      setIsLoading(false);
      refreshCaptcha();
      return;
    }

    // Simulate Network Delay
    setTimeout(() => {
      if (isLogin) {
        const user = users[formData.email];
        
        if (!user) {
          setError('Account not available. Please Sign Up first.');
          setIsLoading(false);
          return;
        }

        if (user.password !== formData.password) {
          setError('Invalid credentials. Please try again.');
          setIsLoading(false);
          return;
        }

        onLogin({
          name: user.name,
          email: user.email,
          role: user.role
        });

      } else {
        if (users[formData.email]) {
          setError('Account already exists. Please Sign In.');
          setIsLoading(false);
          return;
        }

        const newUser = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole
        };

        users[formData.email] = newUser;
        localStorage.setItem('neet_ai_users', JSON.stringify(users));

        onLogin({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      
      {/* REAL-TIME OTP TOAST NOTIFICATION */}
      {showOtpToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
           <div className="bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 min-w-[320px]">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                 <MessageSquareCode className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Messages • Now</h4>
                 <p className="font-mono text-lg font-bold text-white tracking-widest mt-0.5">
                    {generatedOtp} is your OTP for NEET.ai
                 </p>
              </div>
              <button onClick={() => setShowOtpToast(false)} className="text-slate-400 hover:text-white">
                 <X className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}

      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 opacity-90"></div>
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Master NEET with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Intelligent AI
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Join thousands of future doctors using AI-powered mock tests, instant doubt solving, and personalized daily schedules.
          </p>
        </div>

        <div className="relative z-10">
           <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/10">
             <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="w-5 h-5 text-emerald-400" />
               <h3 className="font-semibold">Developer's Commitment</h3>
             </div>
             <p className="text-sm text-slate-300 italic">
               "Built with passion and resilience. Dedicated to every aspirant chasing their dream against all odds."
             </p>
           </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-slate-500">
              {isLogin ? 'Enter your details to access the portal.' : 'Start your medical journey today.'}
            </p>
          </div>

          {/* Method Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => { setAuthMethod('email'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                authMethod === 'email' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => { setAuthMethod('mobile'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                authMethod === 'mobile' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection (Only for Signup) */}
            {!isLogin && (
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-slate-700 block">Select Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Student', icon: GraduationCap, label: 'Student' },
                    { id: 'Educator', icon: BookOpen, label: 'Educator' },
                    { id: 'Doctor', icon: Stethoscope, label: 'Doctor' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id as Role)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        selectedRole === role.id
                          ? 'bg-slate-800 border-slate-900 text-white ring-2 ring-emerald-500'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <role.icon className="w-5 h-5 mb-2" />
                      <span className="text-xs font-semibold">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Common Name Field for Signup (Both Methods) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Dr. Future Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* === EMAIL METHOD === */}
            {authMethod === 'email' && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {!isLogin && (
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwordStrength >= level 
                              ? (passwordStrength > 2 ? 'bg-emerald-500' : 'bg-yellow-500') 
                              : 'bg-slate-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  )}
                  {!isLogin && (
                    <p className="text-xs text-slate-500 mt-1">
                      Must contain 8+ chars, uppercase, number & symbol.
                    </p>
                  )}
                </div>

                {/* Human Verification (CAPTCHA) - Only for Email */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Human Verification</label>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-32 bg-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden select-none border border-slate-300">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                        <span className="text-xl font-mono font-bold tracking-widest text-slate-600 italic" style={{textShadow: '2px 2px 2px rgba(0,0,0,0.1)'}}>
                          {captchaCode}
                        </span>
                        <button 
                          type="button" 
                          onClick={refreshCaptcha}
                          className="absolute right-1 top-1 p-1 hover:bg-slate-300 rounded-full text-slate-500"
                          title="Refresh Code"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                    </div>
                    <input
                        type="text"
                        required
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all uppercase"
                        placeholder="ENTER CODE"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                      />
                  </div>
                </div>
              </>
            )}

            {/* === MOBILE METHOD === */}
            {authMethod === 'mobile' && (
              <>
                 <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="absolute inset-y-0 left-10 pl-2 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm font-semibold">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      className="block w-full pl-20 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all tracking-widest"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, mobile: val});
                      }}
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {otpSent && (
                   <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium text-slate-700">One Time Password (OTP)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageSquareCode className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all tracking-[0.5em] text-center font-bold text-lg"
                        placeholder="••••"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        autoComplete="one-time-code" // Hints browser for WebOTP
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                       <span className="text-slate-500 flex items-center gap-1">
                          OTP sent to +91 {formData.mobile}
                          <Check className="w-3 h-3 text-emerald-500" />
                       </span>
                       {timer > 0 ? (
                         <span className="text-slate-400">Resend in {timer}s</span>
                       ) : (
                         <button type="button" onClick={handleSendOTP} className="text-emerald-600 font-semibold hover:text-emerald-500">Resend OTP</button>
                       )}
                    </div>
                  </div>
                )}
                
                {/* Simulated Recaptcha Container */}
                <div id="recaptcha-container" className="hidden"></div>
              </>
            )}

            {error && (
               <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2 border border-red-200">
                 <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                 {error}
               </div>
            )}

            {authMethod === 'mobile' && !otpSent ? (
               <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading || formData.mobile.length < 10}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 font-semibold shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 font-semibold shadow-lg shadow-slate-900/20 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {authMethod === 'mobile' ? 'Verify & Proceed' : (isLogin ? 'Secure Sign In' : 'Create Account')} <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
               type="button"
               onClick={handleGoogleLogin}
               disabled={isLoading}
               className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium disabled:opacity-50"
             >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4 mr-2 text-blue-500" />} 
                <span className="ml-2">Google</span>
             </button>
             <button 
               type="button"
               disabled={isLoading}
               className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium disabled:opacity-50"
             >
                <Smartphone className="w-4 h-4 mr-2 text-slate-800" /> Apple
             </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{' '}
            <button
              onClick={() => {
                 setIsLogin(!isLogin);
                 setError('');
                 setOtpSent(false);
                 setFormData({ name: '', email: '', password: '', mobile: '' });
                 setCaptchaInput('');
                 if(authMethod === 'email') refreshCaptcha();
              }}
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              {isLogin ? 'Sign up for free' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};