import React, { useEffect, useState } from 'react';

interface PWAInstallButtonProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onInstall: () => Promise<boolean>;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  isInstallable,
  isInstalled,
  isIOS,
  isAndroid,
  onInstall,
}) => {
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return localStorage.getItem('istighfar-ios-hint-dismissed') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!showIOSGuide && !showAndroidGuide) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIOSGuide(false);
        setShowAndroidGuide(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showIOSGuide, showAndroidGuide]);

  if (isInstalled) {
    return null;
  }

  const dismissHint = () => {
    setHintDismissed(true);
    try {
      localStorage.setItem('istighfar-ios-hint-dismissed', '1');
    } catch {
      // ignore
    }
  };

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={onInstall}
        className="install-btn"
        aria-label="تثبيت التطبيق على الجهاز"
      >
        <svg className="install-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        {!hintDismissed ? (
          <div className="ios-hint" role="note">
            <button
              type="button"
              className="ios-hint-body"
              onClick={() => setShowIOSGuide(true)}
            >
              <svg className="install-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>للتثبيت على آيفون: اضغط مشاركة ثم «إضافة إلى الصفحة الرئيسية»</span>
            </button>
            <button
              type="button"
              className="ios-hint-close"
              onClick={dismissHint}
              aria-label="إخفاء التلميح"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="install-btn"
          >
            <svg className="install-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>تثبيت على آيفون</span>
          </button>
        )}

        {showIOSGuide && (
          <div
            className="pwa-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={() => setShowIOSGuide(false)}
          >
            <div className="pwa-modal" onClick={(e) => e.stopPropagation()}>
              <h3 id="ios-install-title" className="pwa-modal-title">
                تثبيت المسبحة على آيفون
              </h3>
              <ol className="pwa-modal-steps">
                <li>
                  افتح الصفحة في متصفح <strong>Safari</strong> واضغط على زر{' '}
                  <strong>المشاركة</strong> (مربع بسهم للأعلى) في الشريط السفلي.
                </li>
                <li>
                  مرّر القائمة للأسفل واختر{' '}
                  <strong>إضافة إلى الصفحة الرئيسية</strong> (Add to Home Screen).
                </li>
                <li>
                  اضغط <strong>إضافة</strong> في الأعلى ليعمل التطبيق بدون إنترنت وبملء الشاشة.
                </li>
              </ol>
              <button
                type="button"
                className="pwa-modal-close"
                onClick={() => setShowIOSGuide(false)}
              >
                حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (isAndroid) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowAndroidGuide(true)}
          className="install-btn"
        >
          <svg className="install-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>تثبيت التطبيق</span>
        </button>

        {showAndroidGuide && (
          <div
            className="pwa-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="android-install-title"
            onClick={() => setShowAndroidGuide(false)}
          >
            <div className="pwa-modal" onClick={(e) => e.stopPropagation()}>
              <h3 id="android-install-title" className="pwa-modal-title">
                تثبيت المسبحة على أندرويد
              </h3>
              <ol className="pwa-modal-steps">
                <li>
                  افتح الرابط في متصفح <strong>Chrome</strong>.
                </li>
                <li>
                  اضغط على قائمة المتصفح (النقاط الثلاث ⋮) في الزاوية العلوية.
                </li>
                <li>
                  اختر <strong>تثبيت التطبيق</strong> أو{' '}
                  <strong>الإضافة إلى الشاشة الرئيسية</strong>.
                </li>
              </ol>
              <button
                type="button"
                className="pwa-modal-close"
                onClick={() => setShowAndroidGuide(false)}
              >
                حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
