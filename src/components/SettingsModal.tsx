import React, { useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onInstall,
  isMuted,
  onToggleMute,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="pwa-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={onClose}
    >
      <div className="pwa-modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2 id="settings-modal-title" className="pwa-modal-title">
            الإعدادات والمعلومات
          </h2>
          <button
            type="button"
            className="settings-close-btn"
            onClick={onClose}
            aria-label="إغلاق نافذة الإعدادات"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-modal-body">
          {/* قسم الصوت */}
          <section className="settings-section" aria-labelledby="sound-section-title">
            <h3 id="sound-section-title" className="settings-section-title">
              التفضيلات
            </h3>
            <button
              type="button"
              className="settings-toggle-row"
              onClick={onToggleMute}
              aria-pressed={!isMuted}
            >
              <span className="settings-toggle-label">
                {isMuted ? (
                  <svg className="settings-toggle-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="22" y1="9" x2="16" y2="15" />
                    <line x1="16" y1="9" x2="22" y2="15" />
                  </svg>
                ) : (
                  <svg className="settings-toggle-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
                <span>صوت النقر عند التسبيح</span>
              </span>
              <span className={`settings-toggle-state ${isMuted ? 'is-muted' : ''}`}>
                {isMuted ? 'مكتوم' : 'مفعّل'}
              </span>
            </button>
          </section>

          <hr className="settings-divider" />

          {/* قسم تثبيت التطبيق */}
          <section className="settings-section" aria-labelledby="install-section-title">
            <h3 id="install-section-title" className="settings-section-title">
              تثبيت التطبيق
            </h3>

            {isInstallable && !isInstalled && (
              <button
                type="button"
                className="settings-install-cta"
                onClick={async () => {
                  const ok = await onInstall();
                  if (ok) onClose();
                }}
              >
                <svg className="settings-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>تثبيت التطبيق الآن</span>
              </button>
            )}

            {isInstalled && (
              <p className="settings-installed-note">
                التطبيق مثبّت بالفعل على جهازك ويعمل دون إنترنت.
              </p>
            )}

            <div className="install-guide-list">
              <div className="install-guide-item">
                <span className="install-guide-os">آيفون (سفاري Safari)</span>
                <p className="install-guide-text">
                  افتح الرابط في متصفح <strong>Safari</strong>، اضغط زر <strong>المشاركة</strong> (مربع بسهم للأعلى) في الشريط السفلي، ثم اختر <strong>«إضافة إلى الصفحة الرئيسية»</strong> واضغط <strong>إضافة</strong>.
                </p>
              </div>
              <div className="install-guide-item">
                <span className="install-guide-os">أندرويد (كروم Chrome)</span>
                <p className="install-guide-text">
                  اضغط زر التثبيت المباشر عند ظهوره، أو افتح قائمة المتصفح (<strong>⋮</strong>) في الأعلى واختر <strong>«تثبيت التطبيق»</strong> أو <strong>«الإضافة إلى الشاشة الرئيسية»</strong>.
                </p>
              </div>
            </div>
          </section>

          <hr className="settings-divider" />

          {/* قسم التواصل مع المطوّر */}
          <section className="settings-section" aria-labelledby="contact-section-title">
            <h3 id="contact-section-title" className="settings-section-title">
              التواصل مع المطوّر
            </h3>
            <p className="settings-section-desc">
              للملاحظات والاقتراحات والاستفسارات أو طلب تطبيقك الخاص.
            </p>
            <a
              href="https://t.me/salehapp"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-link"
            >
              <span className="telegram-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </span>
              <span className="telegram-link-meta">
                <span className="telegram-link-label">تيليجرام</span>
                <span className="telegram-link-handle" dir="ltr">@salehapp</span>
              </span>
              <svg className="telegram-external-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </section>

          <hr className="settings-divider" />

          {/* قسم إخلاء المسؤولية */}
          <section className="settings-section" aria-labelledby="disclaimer-section-title">
            <h3 id="disclaimer-section-title" className="settings-section-title">
              إخلاء المسؤولية
            </h3>
            <p className="disclaimer-text">
              تطبيق «مسبحة الاستغفار الذكية» أداة مساعدة مجانية مخصّصة للتذكير بالاستغفار ومتابعة الأوراد اليومية. تُحفظ جميع الإحصائيات والعدادات وتفضيلات المظهر محلياً على جهازك فقط عبر ذاكرة المتصفح، ولا يتم جمع أو إرسال أي بيانات شخصية إلى خوادم خارجية. الآيات القرآنية المعروضة مستمدة من المصحف الشريف، وفي حال ملاحظة أي خطأ غير مقصود يُرجى إبلاغنا عبر تيليجرام لتصحيحه فوراً.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
