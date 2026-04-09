'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import PhoneStep from '@/components/auth/PhoneStep';
import OtpStep from '@/components/auth/OtpStep';
import ProfileStep from '@/components/auth/ProfileStep';

export default function LoginPage() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'profile'
  const [mobile, setMobile] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/exam');
    }
  }, [router]);

  return (
    <div className="auth-screen">
      <div className="auth-shell">
        {/* Left Panel */}
        <div className="auth-brand-panel">
          {/* Logo */}
          <div className="flex items-center gap-4 pl-2">
            <div className="w-16 h-16">
              <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 24.5L38.5 5L63 22.5L33.5 42L9 24.5Z" fill="white" />
                <path d="M19 32.5V46.5C19 54 25.5 60 33 60H42.5C50 60 56.5 54 56.5 46.5V30.5L33.5 46L19 32.5Z" fill="white" />
                <path d="M47.5 35.2L58.2 27.8L61.8 42.4" stroke="#263D50" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M31.5 41L48.2 29.8" stroke="#263D50" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="auth-brand-title">NexLearn</h1>
              <p className="auth-brand-subtitle">futuristic learning</p>
            </div>
          </div>

          {/* Illustration */}
          <div className="auth-hero-illustration">
            <svg viewBox="0 0 390 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-hero-svg">
              <rect x="78" y="54" width="42" height="48" rx="2" fill="#22324A" />
              <rect x="78" y="54" width="42" height="8" fill="#A89EC7" />
              <path d="M98.5 62.5C93.8056 62.5 90 66.3056 90 71C90 75.6944 93.8056 79.5 98.5 79.5V62.5Z" fill="#FF7A3E" />
              <path d="M99 79.5C103.694 79.5 107.5 75.6944 107.5 71H99V79.5Z" fill="#FF7A3E" />
              <rect x="157" y="94" width="57" height="14" rx="2" fill="#E2D8F1" />
              <rect x="157" y="108" width="57" height="56" rx="2" fill="#F9F2FF" />
              <path d="M185 117C198.5 119 205 129 208 145" stroke="#304665" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M186 117C172 123 165.5 138 164 151" stroke="#304665" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M170 121.5L185 117.5L201 120.5" stroke="#304665" strokeWidth="2" strokeLinecap="round" />
              <rect x="318" y="94" width="58" height="14" rx="2" fill="#E2D8F1" />
              <rect x="318" y="108" width="58" height="56" rx="2" fill="#F9F2FF" />
              <circle cx="347" cy="127" r="10" fill="#FFB027" />
              <path d="M325 160L344 141L357 150L371 136L376 160H325Z" fill="#FFB027" />
              <ellipse cx="121" cy="174" rx="24" ry="25" fill="#E34A27" />
              <path d="M114 156C123 148 133 151 136 160C139 169 133 173 126 176C119 179 113 176 111 170C109 164 111 159 114 156Z" fill="#1D2C6B" />
              <path d="M107 186C112 174 129 172 139 182L150 241H96L107 186Z" fill="#FFB027" />
              <rect x="139" y="177" width="42" height="54" rx="3" fill="#10213A" />
              <rect x="143" y="181" width="34" height="46" rx="2" fill="#15274C" />
              <path d="M147 250L162 206L198 233L177 248L147 250Z" fill="#1B77F3" />
              <path d="M171 247L198 233L218 252L184 264L171 247Z" fill="#153E8C" />
              <path d="M103 242H185L174 271H103V242Z" fill="#FF7A3E" />
              <path d="M98 254H178" stroke="#F2E3CA" strokeWidth="4" />
              <path d="M88 267H187" stroke="#FFB027" strokeWidth="8" />
              <path d="M95 275H170" stroke="#0AB27D" strokeWidth="6" />
              <rect x="216" y="78" width="76" height="103" rx="28" fill="#1A86F2" />
              <path d="M234 187L255 159L278 191L248 235L234 187Z" fill="#1A86F2" />
              <path d="M243 73C255 62 273 65 281 77C289 89 286 102 279 112C272 122 256 126 246 119C236 112 233 103 232 94C231 85 234 78 243 73Z" fill="#FFC4A8" />
              <path d="M238 80C240 61 266 52 282 63C295 71 292 88 283 93C276 97 273 84 265 81C257 78 257 94 250 92C243 90 236 92 238 80Z" fill="#13245E" />
              <path d="M250 127L221 159L207 120L250 127Z" fill="#FFC4A8" />
              <path d="M282 136L312 163L305 196L282 170V136Z" fill="#FFC4A8" />
              <path d="M246 147L210 103" stroke="#1A86F2" strokeWidth="18" strokeLinecap="round" />
              <path d="M276 148L313 182" stroke="#1A86F2" strokeWidth="18" strokeLinecap="round" />
              <path d="M241 187L276 187" stroke="#0F5CC0" strokeWidth="3" />
              <path d="M241 196L276 196" stroke="#0F5CC0" strokeWidth="3" />
              <path d="M241 205L276 205" stroke="#0F5CC0" strokeWidth="3" />
              <path d="M245 223L229 261" stroke="#183C78" strokeWidth="9" strokeLinecap="round" />
              <path d="M269 223L286 261" stroke="#183C78" strokeWidth="9" strokeLinecap="round" />
              <path d="M226 260L242 260" stroke="#FFB027" strokeWidth="5" strokeLinecap="round" />
              <path d="M282 260L298 260" stroke="#FFB027" strokeWidth="5" strokeLinecap="round" />
              <path d="M315 239H375L366 270H315V239Z" fill="#FF7A3E" />
              <path d="M309 252H382" stroke="#F2E3CA" strokeWidth="4" />
              <path d="M304 268H386" stroke="#FFB027" strokeWidth="8" />
              <path d="M332 274H369" stroke="#DADFE4" strokeWidth="6" />
              <circle cx="340" cy="188" r="28" fill="#1A86F2" />
              <path d="M325 188C330 194 333 204 333 216" stroke="#0AB27D" strokeWidth="5" strokeLinecap="round" />
              <path d="M340 160C350 172 353 188 349 216" stroke="#0AB27D" strokeWidth="5" strokeLinecap="round" />
              <path d="M319 178C330 179 351 176 360 168" stroke="#0AB27D" strokeWidth="4" strokeLinecap="round" />
              <path d="M314 198C326 196 354 199 364 208" stroke="#0AB27D" strokeWidth="4" strokeLinecap="round" />
              <path d="M350 161C363 167 370 181 371 196C372 211 365 224 356 231" stroke="#22324A" strokeWidth="4" strokeLinecap="round" />
              <rect x="260" y="145" width="28" height="7" rx="3.5" fill="white" />
              <rect x="293" y="80" width="43" height="27" rx="13.5" fill="white" />
              <circle cx="307" cy="93.5" r="3" fill="#22324A" />
              <circle cx="316.5" cy="93.5" r="3" fill="#22324A" />
              <circle cx="326" cy="93.5" r="3" fill="#22324A" />
              <path d="M331 104L324 111" stroke="white" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
          {step === 'phone' && (
            <PhoneStep onNext={(mob) => { setMobile(mob); setStep('otp'); }} />
          )}
          {step === 'otp' && (
            <OtpStep
              mobile={mobile}
              onBack={() => setStep('phone')}
              onNeedsProfile={() => setStep('profile')}
            />
          )}
          {step === 'profile' && (
            <ProfileStep mobile={mobile} />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
