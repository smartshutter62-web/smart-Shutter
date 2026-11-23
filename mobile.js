/* Mobile install and backup helpers. No changes to pricing or calculations. */
(() => {
  const META = K + '_mobile_meta_v1', RECOVERY = K + '_recovery_v1';
  let meta = {}, installPrompt = null, standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  try { meta = JSON.parse(localStorage.getItem(META) || '{}'); } catch (_) {}
  const setMeta = () => { try { localStorage.setItem(META, JSON.stringify(meta)); } catch (_) {} };
  const safeDate = ts => ts ? new Date(ts).toLocaleString('ar-EG') : 'لم يتم التأكيد بعد';
  const originalSave = save;
  // One previous saved state, at most once a day. This is NOT an external backup.
  save = () => {
    try {
      const old = localStorage.getItem(K);
      let previous = null;
      try { previous = JSON.parse(localStorage.getItem(RECOVERY) || 'null'); } catch (_) {}
      if (old && (!previous || Date.now() - previous.at > 86400000)) {
        localStorage.setItem(RECOVERY, JSON.stringify({at: Date.now(), data: old}));
      }
    } catch (_) { /* Never block the original save if recovery storage is full. */ }
    originalSave();
  };
  const originalDraw = draw;
  draw = () => {
    originalDraw();
    if (V || Wn || Q) return;
    const main = document.querySelector('main');
    if (!main) return;
    const due = S.quotes.length > 0 && (!meta.externalConfirmed || Date.now() - meta.externalConfirmed > 7 * 86400000);
    const card = document.createElement('section'); card.className = 'card mobile-tools';
    card.innerHTML = '<h3>Smart Shutter على موبايلك</h3>' +
      (standalone ? '<p class="m">التطبيق مفتوح من الشاشة الرئيسية.</p>' : '<button type="button" id="install-app">تثبيت على الموبايل</button><p class="m">بدون متجر تطبيقات. افتح الرابط في Chrome على أندرويد أو Safari على آيفون.</p>') +
      (due ? '<p class="backup-warning">محتاج نسخة خارج الجهاز. حفظ المتصفح وحده مش نسخة احتياطية.</p><button type="button" class="s" id="backup-reminder">فتح النسخ الاحتياطي</button>' : '');
    if (tab === 'q' || tab === 'b') main.prepend(card);
    card.querySelector('#install-app')?.addEventListener('click', async () => {
      if (installPrompt) {
        await installPrompt.prompt(); const choice = await installPrompt.userChoice;
        installPrompt = null;
        if (choice.outcome === 'accepted') toast('اتبع خطوات التثبيت على جهازك.');
      } else document.querySelector('#install-help').showModal();
    });
    card.querySelector('#backup-reminder')?.addEventListener('click', () => A.tab('b'));
    if (tab === 'b') {
      const extra = document.createElement('section'); extra.className = 'card mobile-tools';
      extra.innerHTML = '<h3>اطمّن على النسخة</h3><p class="m">آخر مرة أكدت حفظ نسخة خارج الجهاز: ' + safeDate(meta.externalConfirmed) + '</p><p class="m">بعد إنشاء النسخة، اتأكد إن ملف JSON موجود في التنزيلات، وانسخه إلى Drive أو مكان آمن. بعدها اضغط الزر.</p><button type="button" class="s" id="confirm-backup">الملف محفوظ خارج المتصفح</button><p class="m">التأكيد تذكير فقط، البرنامج مش بيقدر يتأكد من مكان الملف.</p><hr><h3>نقطة رجوع محلية</h3><p class="m">بيحتفظ بنسخة سابقة من البيانات المحفوظة، مرة في اليوم عند التعديل. دي على نفس الجهاز، وهتضيع لو بيانات المتصفح اتمسحت.</p><button type="button" class="s" id="download-recovery">تنزيل نقطة الرجوع</button>';
      main.append(extra);
      extra.querySelector('#confirm-backup').onclick = () => {
        if (!confirm('هل تأكدت إن ملف النسخة موجود وآمن خارج بيانات المتصفح؟')) return;
        meta.externalConfirmed = Date.now(); setMeta(); draw();
      };
      extra.querySelector('#download-recovery').onclick = async () => {
        try {
          const item = JSON.parse(localStorage.getItem(RECOVERY) || 'null');
          if (!item || !item.data) return toast('لا توجد نقطة رجوع بعد. ستُنشأ عند حفظ تعديل على بيانات موجودة.', 1);
          if (!await A.dl('shutter_recovery_' + new Date(item.at).toISOString().slice(0,10) + '.json', item.data)) toast('تعذر تنزيل نقطة الرجوع.', 1);
        } catch (_) { toast('تعذر قراءة نقطة الرجوع المحلية.', 1); }
      };
    }
  };
  const dialog = document.createElement('dialog'); dialog.id = 'install-help'; dialog.dir = 'rtl';
  dialog.innerHTML = '<h3>تثبيت Smart Shutter</h3><p><b>أندرويد:</b> افتح الرابط في Chrome، ثم قائمة ⋮، ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p><p><b>آيفون:</b> افتح الرابط في Safari، ثم «مشاركة»، ثم «إضافة إلى الشاشة الرئيسية».</p><p class="m">لو فاتحه جوه واتساب، اختار فتح في المتصفح الأول. افتحه مرة بالإنترنت قبل استخدامه بدون إنترنت. عروضك وأسعارك بتفضل في نفس المتصفح، اعمل نسخة قبل تغيير الجهاز أو المتصفح.</p><button type="button" id="close-install">تمام</button>';
  document.body.append(dialog); dialog.querySelector('button').onclick = () => dialog.close();
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
  addEventListener('appinstalled', () => { standalone = true; installPrompt = null; draw(); });
  draw();
})();
